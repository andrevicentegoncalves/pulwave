-- ============================================================================
-- Migration: Profile Merge & Multi-Wallet Support
-- Date: 2024-12-15
-- Description: 
--   1. Add profile_merge_requests table for dual-confirmation merges
--   2. Update profile_auth_state to support multiple wallets
-- ============================================================================

-- ============================================================================
-- PROFILE MERGE REQUESTS TABLE
-- ============================================================================
-- Tracks merge requests between profiles with dual confirmation

CREATE TABLE IF NOT EXISTS public.profile_merge_requests (
    -- Primary key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Merge parties
    source_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    target_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Request type: how the merge was triggered
    request_type VARCHAR(50) NOT NULL DEFAULT 'manual'
        CHECK (request_type IN ('manual', 'email_conflict', 'wallet_conflict')),
    
    -- Status workflow: pending -> source_confirmed -> target_confirmed -> completed
    -- Or: pending -> rejected / expired
    status VARCHAR(50) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'source_confirmed', 'target_confirmed', 'completed', 'rejected', 'expired', 'cancelled')),
    
    -- Confirmation timestamps
    source_confirmed_at TIMESTAMPTZ,
    target_confirmed_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
    
    -- Rejection/cancellation details
    rejection_reason TEXT,
    rejected_by UUID REFERENCES public.profiles(id),
    
    -- Merge metadata - what will be/was merged
    merge_preview JSONB DEFAULT '{}', -- Preview of what will be merged
    merge_result JSONB DEFAULT '{}',  -- Result after merge (for audit)
    
    -- Conflict email/wallet that triggered the merge (if applicable)
    conflict_identifier VARCHAR(255), -- e.g., email address or wallet address
    conflict_type VARCHAR(50), -- 'email' or 'wallet'
    
    -- Standard audit columns
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES public.profiles(id),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID REFERENCES public.profiles(id)
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_merge_requests_source 
    ON public.profile_merge_requests(source_profile_id);
CREATE INDEX IF NOT EXISTS idx_merge_requests_target 
    ON public.profile_merge_requests(target_profile_id);
CREATE INDEX IF NOT EXISTS idx_merge_requests_status 
    ON public.profile_merge_requests(status);
CREATE INDEX IF NOT EXISTS idx_merge_requests_expires 
    ON public.profile_merge_requests(expires_at) WHERE status = 'pending';

-- Prevent duplicate pending requests between same profiles
CREATE UNIQUE INDEX IF NOT EXISTS idx_merge_requests_unique_pending 
    ON public.profile_merge_requests(source_profile_id, target_profile_id) 
    WHERE status IN ('pending', 'source_confirmed', 'target_confirmed');

-- Enable RLS
ALTER TABLE public.profile_merge_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only see merge requests involving their profile
CREATE POLICY "Users can view their own merge requests" 
    ON public.profile_merge_requests FOR SELECT 
    USING (
        source_profile_id = auth.uid() OR 
        target_profile_id = auth.uid()
    );

CREATE POLICY "Users can create merge requests from their profile" 
    ON public.profile_merge_requests FOR INSERT 
    WITH CHECK (source_profile_id = auth.uid());

CREATE POLICY "Users can update merge requests they're part of" 
    ON public.profile_merge_requests FOR UPDATE 
    USING (
        source_profile_id = auth.uid() OR 
        target_profile_id = auth.uid()
    );

-- ============================================================================
-- LINKED WALLETS SUPPORT
-- ============================================================================
-- Extend profile_auth_state to support multiple wallets per user

-- Add linked_wallets column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profile_auth_state' 
        AND column_name = 'linked_wallets'
    ) THEN
        ALTER TABLE public.profile_auth_state 
        ADD COLUMN linked_wallets JSONB DEFAULT '[]';
        
        COMMENT ON COLUMN public.profile_auth_state.linked_wallets IS 
            'Array of linked wallet objects: [{address, chain, provider, connected_at, is_primary}]';
    END IF;
END $$;

-- Function to add a wallet to linked_wallets array
CREATE OR REPLACE FUNCTION public.add_linked_wallet(
    p_profile_id UUID,
    p_wallet_address VARCHAR(255),
    p_chain VARCHAR(50) DEFAULT 'ethereum',
    p_provider VARCHAR(50) DEFAULT 'metamask',
    p_is_primary BOOLEAN DEFAULT FALSE
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_wallet JSONB;
    v_existing_wallets JSONB;
BEGIN
    -- Create wallet object
    v_wallet := jsonb_build_object(
        'address', LOWER(p_wallet_address),
        'chain', p_chain,
        'provider', p_provider,
        'connected_at', NOW(),
        'is_primary', p_is_primary
    );
    
    -- Get existing wallets
    SELECT COALESCE(linked_wallets, '[]'::jsonb) INTO v_existing_wallets
    FROM public.profile_auth_state
    WHERE profile_id = p_profile_id;
    
    -- Check if wallet already exists
    IF v_existing_wallets @> jsonb_build_array(jsonb_build_object('address', LOWER(p_wallet_address))) THEN
        RAISE EXCEPTION 'Wallet already linked to this profile';
    END IF;
    
    -- If setting as primary, unset other primaries
    IF p_is_primary THEN
        UPDATE public.profile_auth_state
        SET linked_wallets = (
            SELECT jsonb_agg(
                CASE 
                    WHEN (elem->>'is_primary')::boolean THEN elem || '{"is_primary": false}'::jsonb
                    ELSE elem
                END
            )
            FROM jsonb_array_elements(linked_wallets) elem
        )
        WHERE profile_id = p_profile_id;
    END IF;
    
    -- Add wallet to array
    UPDATE public.profile_auth_state
    SET linked_wallets = COALESCE(linked_wallets, '[]'::jsonb) || jsonb_build_array(v_wallet),
        updated_at = NOW()
    WHERE profile_id = p_profile_id;
    
    RETURN v_wallet;
END;
$$;

-- Function to check if wallet is already linked to any profile
CREATE OR REPLACE FUNCTION public.check_wallet_exists(
    p_wallet_address VARCHAR(255)
)
RETURNS TABLE(profile_id UUID, profile_email VARCHAR(255))
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT pas.profile_id, p.email
    FROM public.profile_auth_state pas
    JOIN public.profiles p ON p.id = pas.profile_id
    WHERE pas.linked_wallets @> jsonb_build_array(
        jsonb_build_object('address', LOWER(p_wallet_address))
    )
    OR LOWER(pas.wallet_address) = LOWER(p_wallet_address);
END;
$$;

-- ============================================================================
-- MERGE EXECUTION FUNCTION
-- ============================================================================
-- Executes the actual merge when both parties have confirmed

CREATE OR REPLACE FUNCTION public.execute_profile_merge(
    p_merge_request_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_request RECORD;
    v_source RECORD;
    v_target RECORD;
    v_result JSONB := '{}';
BEGIN
    -- Get merge request
    SELECT * INTO v_request
    FROM public.profile_merge_requests
    WHERE id = p_merge_request_id
    AND status = 'target_confirmed';
    
    IF v_request IS NULL THEN
        RAISE EXCEPTION 'Invalid merge request or not fully confirmed';
    END IF;
    
    -- Get source and target profiles
    SELECT * INTO v_source FROM public.profiles WHERE id = v_request.source_profile_id;
    SELECT * INTO v_target FROM public.profiles WHERE id = v_request.target_profile_id;
    
    -- Determine winner (older profile)
    IF v_source.created_at < v_target.created_at THEN
        -- Source is older, merge target into source
        v_result := jsonb_build_object('winner', 'source', 'merged_into', v_source.id);
        
        -- Transfer auth methods (wallets)
        UPDATE public.profile_auth_state
        SET linked_wallets = (
            SELECT COALESCE(
                (SELECT linked_wallets FROM public.profile_auth_state WHERE profile_id = v_source.id),
                '[]'::jsonb
            ) || COALESCE(
                (SELECT linked_wallets FROM public.profile_auth_state WHERE profile_id = v_target.id),
                '[]'::jsonb
            )
        )
        WHERE profile_id = v_source.id;
        
        -- Transfer organization memberships
        UPDATE public.organization_members
        SET profile_id = v_source.id
        WHERE profile_id = v_target.id
        AND NOT EXISTS (
            SELECT 1 FROM public.organization_members 
            WHERE profile_id = v_source.id 
            AND organization_id = public.organization_members.organization_id
        );
        
        -- Soft delete source profile (the newer one being absorbed)
        UPDATE public.profiles
        SET is_active = false,
            deleted_at = NOW(),
            updated_at = NOW()
        WHERE id = v_target.id;
        
    ELSE
        -- Target is older, merge source into target
        v_result := jsonb_build_object('winner', 'target', 'merged_into', v_target.id);
        
        -- Transfer auth methods (wallets)
        UPDATE public.profile_auth_state
        SET linked_wallets = (
            SELECT COALESCE(
                (SELECT linked_wallets FROM public.profile_auth_state WHERE profile_id = v_target.id),
                '[]'::jsonb
            ) || COALESCE(
                (SELECT linked_wallets FROM public.profile_auth_state WHERE profile_id = v_source.id),
                '[]'::jsonb
            )
        )
        WHERE profile_id = v_target.id;
        
        -- Transfer organization memberships
        UPDATE public.organization_members
        SET profile_id = v_target.id
        WHERE profile_id = v_source.id
        AND NOT EXISTS (
            SELECT 1 FROM public.organization_members 
            WHERE profile_id = v_target.id 
            AND organization_id = public.organization_members.organization_id
        );
        
        -- Soft delete source profile
        UPDATE public.profiles
        SET is_active = false,
            deleted_at = NOW(),
            updated_at = NOW()
        WHERE id = v_source.id;
    END IF;
    
    -- Mark merge as completed
    UPDATE public.profile_merge_requests
    SET status = 'completed',
        completed_at = NOW(),
        merge_result = v_result,
        updated_at = NOW()
    WHERE id = p_merge_request_id;
    
    RETURN v_result;
END;
$$;

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON TABLE public.profile_merge_requests IS 
    'Tracks profile merge requests with dual confirmation workflow';
COMMENT ON FUNCTION public.add_linked_wallet IS 
    'Adds a wallet to a profile''s linked_wallets array';
COMMENT ON FUNCTION public.check_wallet_exists IS 
    'Checks if a wallet address is already linked to any profile';
COMMENT ON FUNCTION public.execute_profile_merge IS 
    'Executes a confirmed profile merge, transferring data to the older profile';
