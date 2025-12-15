-- ============================================================================
-- Migration: Create User Sessions Table
-- Date: 2024-12-14
-- Description: Track user sessions and devices for security features
--              (sign out all devices, concurrent session limits, etc.)
-- ============================================================================

BEGIN;

-- ============================================================================
-- CREATE user_sessions TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Session Info
    session_token TEXT UNIQUE,
    
    -- Device Info
    device_fingerprint TEXT,
    device_name TEXT,
    device_type TEXT,  -- 'desktop', 'mobile', 'tablet'
    browser TEXT,
    os TEXT,
    
    -- Network Info
    ip_address INET,
    user_agent TEXT,
    
    -- Location (optional)
    country_code VARCHAR(2),
    city TEXT,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_trusted BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_active_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    revoked_by UUID REFERENCES profiles(id),
    revoke_reason TEXT
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_user_sessions_profile ON user_sessions(profile_id);
CREATE INDEX idx_user_sessions_active ON user_sessions(profile_id, is_active) WHERE is_active = true;
CREATE INDEX idx_user_sessions_last_active ON user_sessions(last_active_at);
CREATE INDEX idx_user_sessions_expires ON user_sessions(expires_at) WHERE expires_at IS NOT NULL;

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Users can view their own sessions
CREATE POLICY "Users can view own sessions" ON user_sessions
    FOR SELECT USING (profile_id IN (
        SELECT id FROM profiles WHERE auth_user_id = auth.uid()
    ));

-- Users can revoke (update) their own sessions
CREATE POLICY "Users can revoke own sessions" ON user_sessions
    FOR UPDATE USING (profile_id IN (
        SELECT id FROM profiles WHERE auth_user_id = auth.uid()
    ));

-- System can insert sessions (via service role)
CREATE POLICY "System can create sessions" ON user_sessions
    FOR INSERT WITH CHECK (true);

-- ============================================================================
-- TRIGGER: Auto-update last_active_at
-- ============================================================================

CREATE OR REPLACE FUNCTION update_session_last_active()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_active_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_user_sessions_last_active
    BEFORE UPDATE ON user_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_session_last_active();

COMMIT;
