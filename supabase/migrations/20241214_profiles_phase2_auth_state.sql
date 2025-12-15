-- ============================================================================
-- Migration: Profiles Phase 2 - Auth State Separation
-- Date: 2024-12-14
-- Description: Create profile_auth_state table and move auth-related columns
--              to reduce profiles from ~31 to ~23 columns
-- ============================================================================

BEGIN;

-- ============================================================================
-- PHASE 1: CREATE profile_auth_state TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS profile_auth_state (
    profile_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- 2FA
    two_factor_enabled BOOLEAN DEFAULT false,
    two_factor_verified_at TIMESTAMPTZ,
    
    -- Password
    password_reset_required BOOLEAN DEFAULT false,
    password_changed_at TIMESTAMPTZ,
    
    -- WebAuthn/Passkeys
    webauthn_enabled BOOLEAN DEFAULT false,
    webauthn_registered_at TIMESTAMPTZ,
    
    -- SSO
    sso_provider TEXT,
    sso_provider_id TEXT,
    
    -- Suspension
    is_suspended BOOLEAN DEFAULT false,
    suspended_at TIMESTAMPTZ,
    suspended_by UUID REFERENCES auth.users(id),
    suspension_reason TEXT,
    
    -- Deletion Workflow
    deletion_requested BOOLEAN DEFAULT false,
    deletion_requested_at TIMESTAMPTZ,
    deletion_scheduled_for DATE,
    
    -- Audit
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PHASE 2: MIGRATE EXISTING DATA
-- ============================================================================

INSERT INTO profile_auth_state (
    profile_id,
    two_factor_enabled,
    two_factor_verified_at,
    password_reset_required,
    password_changed_at,
    is_suspended,
    deletion_requested,
    deletion_requested_at,
    deletion_scheduled_for
)
SELECT 
    id,
    COALESCE(two_factor_enabled, false),
    two_factor_verified_at,
    COALESCE(password_reset_required, false),
    password_changed_at,
    COALESCE(is_suspended, false),
    COALESCE(deletion_requested, false),
    deletion_requested_at,
    deletion_scheduled_for
FROM profiles
ON CONFLICT (profile_id) DO NOTHING;

-- ============================================================================
-- PHASE 3: CREATE INDEXES
-- ============================================================================

CREATE INDEX idx_profile_auth_state_2fa ON profile_auth_state(two_factor_enabled) WHERE two_factor_enabled = true;
CREATE INDEX idx_profile_auth_state_suspended ON profile_auth_state(is_suspended) WHERE is_suspended = true;
CREATE INDEX idx_profile_auth_state_deletion ON profile_auth_state(deletion_scheduled_for) WHERE deletion_requested = true;

-- ============================================================================
-- PHASE 4: ENABLE RLS
-- ============================================================================

ALTER TABLE profile_auth_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own auth state" ON profile_auth_state
    FOR SELECT USING (profile_id IN (
        SELECT id FROM profiles WHERE auth_user_id = auth.uid()
    ));

CREATE POLICY "Users can update own auth state" ON profile_auth_state
    FOR UPDATE USING (profile_id IN (
        SELECT id FROM profiles WHERE auth_user_id = auth.uid()
    ));

-- ============================================================================
-- PHASE 5: DROP MIGRATED COLUMNS FROM PROFILES (OPTIONAL - RUN SEPARATELY)
-- ============================================================================

-- Uncomment these after verifying data migration:
ALTER TABLE profiles DROP COLUMN IF EXISTS two_factor_enabled;
ALTER TABLE profiles DROP COLUMN IF EXISTS two_factor_verified_at;
ALTER TABLE profiles DROP COLUMN IF EXISTS password_reset_required;
ALTER TABLE profiles DROP COLUMN IF EXISTS password_changed_at;
ALTER TABLE profiles DROP COLUMN IF EXISTS is_suspended;
ALTER TABLE profiles DROP COLUMN IF EXISTS deletion_requested;
ALTER TABLE profiles DROP COLUMN IF EXISTS deletion_requested_at;
ALTER TABLE profiles DROP COLUMN IF EXISTS deletion_scheduled_for;

COMMIT;
