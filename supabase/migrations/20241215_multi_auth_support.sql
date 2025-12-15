-- ============================================================================
-- Migration: Multi-Auth Support
-- Date: 2024-12-15
-- Description: Add wallet columns and make email optional for anonymous users
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. ADD WALLET COLUMNS TO profile_auth_state
-- ============================================================================

ALTER TABLE profile_auth_state 
ADD COLUMN IF NOT EXISTS wallet_address TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS wallet_provider TEXT,
ADD COLUMN IF NOT EXISTS wallet_chain_id INTEGER,
ADD COLUMN IF NOT EXISTS wallet_connected_at TIMESTAMPTZ;

-- Index for wallet lookups
CREATE INDEX IF NOT EXISTS idx_profile_auth_state_wallet 
ON profile_auth_state(wallet_address) WHERE wallet_address IS NOT NULL;

-- ============================================================================
-- 2. MAKE EMAIL OPTIONAL (for wallet-only anonymous users)
-- ============================================================================

ALTER TABLE profiles ALTER COLUMN email DROP NOT NULL;

-- ============================================================================
-- 3. ADD AUTH METHOD TRACKING
-- ============================================================================

-- Track which auth methods user has enabled
ALTER TABLE profile_auth_state 
ADD COLUMN IF NOT EXISTS auth_methods TEXT[] DEFAULT ARRAY[]::TEXT[];
-- Possible values: 'email', 'passkey', 'wallet', 'phone', 'sso'

COMMIT;
