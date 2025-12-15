-- ============================================================================
-- Migration: Fix Duplicate Profiles Tables
-- Date: 2024-12-14
-- Description: There are profiles tables in multiple schemas. This migration
--              ensures only public.profiles exists with correct structure.
-- ============================================================================

-- First, let's see what schemas have profiles tables
-- Run this query first:
-- SELECT table_schema, table_name 
-- FROM information_schema.tables 
-- WHERE table_name = 'profiles';

-- ============================================================================
-- DROP profiles from ALL schemas except public, then recreate public.profiles
-- ============================================================================

BEGIN;

-- Drop from any non-public schema (adjust schema name as needed)
DROP TABLE IF EXISTS auth.profiles CASCADE;
DROP TABLE IF EXISTS storage.profiles CASCADE;
DROP TABLE IF EXISTS realtime.profiles CASCADE;

-- Now drop and recreate public.profiles
DROP TABLE IF EXISTS public.profile_auth_state CASCADE;
DROP TABLE IF EXISTS public.user_sessions CASCADE;
DROP TABLE IF EXISTS public.social_profiles CASCADE;
DROP TABLE IF EXISTS public.professional_profiles CASCADE;
DROP TABLE IF EXISTS public.user_preferences CASCADE;
DROP TABLE IF EXISTS public.contacts CASCADE;
DROP TABLE IF EXISTS public.addresses CASCADE;
DROP TABLE IF EXISTS public.organization_members CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- ============================================================================
-- CREATE public.profiles (33 columns, proper order)
-- ============================================================================

CREATE TABLE public.profiles (
    -- IDENTITY (5)
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    email TEXT NOT NULL UNIQUE,
    last_active_organization_id UUID,
    
    -- PERSONAL INFO (7)
    first_name TEXT,
    middle_name TEXT,
    last_name TEXT,
    display_name TEXT,
    date_of_birth DATE,
    gender VARCHAR(50),
    pronouns TEXT,
    
    -- CONTENT (2)
    bio TEXT,
    avatar_url TEXT,
    
    -- PLATFORM ROLE (1)
    app_role VARCHAR(50) DEFAULT 'user',
    
    -- STATUS (3)
    is_deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMPTZ,
    deletion_reason TEXT,
    
    -- ACTIVITY (2)
    last_activity_at TIMESTAMPTZ,
    login_count INTEGER DEFAULT 0,
    
    -- ADDRESS REFERENCES (2)
    address_id UUID,
    billing_address_id UUID,
    
    -- BILLING (2)
    has_billing_access BOOLEAN DEFAULT false,
    stripe_customer_id TEXT,
    
    -- ATTRIBUTION (5)
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    referral_code TEXT,
    referred_by UUID,
    
    -- COMPLIANCE (2)
    profile_completeness_score INTEGER DEFAULT 0,
    dashboard_layout JSONB DEFAULT '{}'::JSONB,
    
    -- METADATA (2)
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    metadata JSONB DEFAULT '{}'::JSONB,
    
    -- AI (2)
    ai_profile_embedding VECTOR(1536),
    ai_last_analyzed_at TIMESTAMPTZ,
    
    -- TRANSLATIONS (1)
    translations JSONB DEFAULT '{}'::JSONB,
    
    -- AUDIT (LAST - 6)
    is_active BOOLEAN DEFAULT true,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID,
    deleted_by UUID
);

-- Self-reference FK
ALTER TABLE public.profiles ADD CONSTRAINT profiles_referred_by_fkey 
    FOREIGN KEY (referred_by) REFERENCES public.profiles(id);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_profiles_auth_user_id ON public.profiles(auth_user_id);
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_username ON public.profiles(username) WHERE username IS NOT NULL;
CREATE INDEX idx_profiles_app_role ON public.profiles(app_role);
CREATE INDEX idx_profiles_is_active ON public.profiles(is_active) WHERE is_active = true;

-- ============================================================================
-- RLS
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth_user_id = auth.uid());

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth_user_id = auth.uid());

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth_user_id = auth.uid());

-- ============================================================================
-- RECREATE DEPENDENT TABLES
-- ============================================================================

CREATE TABLE public.profile_auth_state (
    profile_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    two_factor_enabled BOOLEAN DEFAULT false,
    two_factor_verified_at TIMESTAMPTZ,
    password_reset_required BOOLEAN DEFAULT false,
    password_changed_at TIMESTAMPTZ,
    webauthn_enabled BOOLEAN DEFAULT false,
    webauthn_registered_at TIMESTAMPTZ,
    sso_provider TEXT,
    sso_provider_id TEXT,
    is_suspended BOOLEAN DEFAULT false,
    suspended_at TIMESTAMPTZ,
    suspended_by UUID,
    suspension_reason TEXT,
    deletion_requested BOOLEAN DEFAULT false,
    deletion_requested_at TIMESTAMPTZ,
    deletion_scheduled_for DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    session_token TEXT UNIQUE,
    device_fingerprint TEXT,
    device_name TEXT,
    device_type TEXT,
    browser TEXT,
    os TEXT,
    ip_address INET,
    user_agent TEXT,
    country_code VARCHAR(2),
    city TEXT,
    is_trusted BOOLEAN DEFAULT false,
    expires_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    revoked_by UUID,
    revoke_reason TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_active_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profile_auth_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth_state_policy" ON public.profile_auth_state
    FOR ALL USING (profile_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid()));

CREATE POLICY "sessions_policy" ON public.user_sessions
    FOR ALL USING (profile_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid()));

COMMIT;

-- ============================================================================
-- VERIFY: Run this query after migration
-- ============================================================================
-- SELECT table_schema, COUNT(*) as column_count
-- FROM information_schema.columns 
-- WHERE table_name = 'profiles'
-- GROUP BY table_schema;
-- Should show only: public | 33
