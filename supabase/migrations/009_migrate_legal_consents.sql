-- ============================================================================
-- MIGRATION 009: Migrate Legal Consents from profiles to compliance_consents
-- ============================================================================
-- Description: Moves terms_accepted_*, privacy_accepted_* from profiles to 
-- compliance_consents table for proper audit trail
--
-- PREREQUISITE: Run 005a_fix_org_members_profile_id.sql first
-- ============================================================================

BEGIN;

-- ============================================================================
-- STEP 1: Add consent_type enum if needed
-- ============================================================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'consent_type') THEN
        CREATE TYPE consent_type AS ENUM (
            'terms-of-service', 'privacy-policy', 'marketing-emails',
            'data-processing', 'cookie-policy', 'third-party-sharing',
            'age-verification', 'hipaa', 'gdpr', 'ccpa', 'other'
        );
    ELSE
        BEGIN ALTER TYPE consent_type ADD VALUE IF NOT EXISTS 'terms-of-service'; EXCEPTION WHEN duplicate_object THEN NULL; END;
        BEGIN ALTER TYPE consent_type ADD VALUE IF NOT EXISTS 'privacy-policy'; EXCEPTION WHEN duplicate_object THEN NULL; END;
    END IF;
END $$;

-- ============================================================================
-- STEP 2: Add columns to compliance_consents and make ip_address nullable
-- ============================================================================

ALTER TABLE compliance_consents ADD COLUMN IF NOT EXISTS consent_type consent_type;
ALTER TABLE compliance_consents ADD COLUMN IF NOT EXISTS consent_version TEXT;
ALTER TABLE compliance_consents ADD COLUMN IF NOT EXISTS consented BOOLEAN DEFAULT FALSE;
ALTER TABLE compliance_consents ADD COLUMN IF NOT EXISTS consent_date TIMESTAMPTZ;
ALTER TABLE compliance_consents ADD COLUMN IF NOT EXISTS withdrawn BOOLEAN DEFAULT FALSE;
ALTER TABLE compliance_consents ADD COLUMN IF NOT EXISTS withdrawn_date TIMESTAMPTZ;
ALTER TABLE compliance_consents ADD COLUMN IF NOT EXISTS user_agent TEXT;

-- Make ip_address nullable if it exists with NOT NULL constraint
DO $$
BEGIN
    -- First add the column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'compliance_consents' AND column_name = 'ip_address'
    ) THEN
        ALTER TABLE compliance_consents ADD COLUMN ip_address INET;
    ELSE
        -- If it exists, make sure it's nullable
        ALTER TABLE compliance_consents ALTER COLUMN ip_address DROP NOT NULL;
    END IF;
END $$;

COMMENT ON COLUMN compliance_consents.ip_address IS 'IP address when consent was given (nullable for historical data)';

-- ============================================================================
-- STEP 3: Migrate Terms of Service Consents
-- ============================================================================

INSERT INTO compliance_consents (
    profile_id, organization_id, consent_type, consent_version,
    consented, consent_date, withdrawn, ip_address, user_agent,
    created_at, updated_at, is_active
)
SELECT 
    p.id,
    get_profile_org_id(p.id),
    'terms-of-service'::consent_type,
    p.terms_accepted_version,
    TRUE,
    COALESCE(p.terms_accepted_at, p.created_at, NOW()),
    FALSE,
    NULL,  -- Historical data doesn't have IP address
    NULL,  -- Historical data doesn't have user agent
    COALESCE(p.terms_accepted_at, p.created_at, NOW()),
    NOW(), 
    TRUE
FROM profiles p
WHERE (p.terms_accepted_at IS NOT NULL OR p.terms_accepted_version IS NOT NULL)
AND NOT EXISTS (
    SELECT 1 FROM compliance_consents cc 
    WHERE cc.profile_id = p.id AND cc.consent_type = 'terms-of-service'
);

-- ============================================================================
-- STEP 4: Migrate Privacy Policy Consents
-- ============================================================================

INSERT INTO compliance_consents (
    profile_id, organization_id, consent_type, consent_version,
    consented, consent_date, withdrawn, ip_address, user_agent,
    created_at, updated_at, is_active
)
SELECT 
    p.id,
    get_profile_org_id(p.id),
    'privacy-policy'::consent_type,
    p.privacy_accepted_version,
    TRUE,
    COALESCE(p.privacy_accepted_at, p.created_at, NOW()),
    FALSE,
    NULL,  -- Historical data doesn't have IP address
    NULL,  -- Historical data doesn't have user agent
    COALESCE(p.privacy_accepted_at, p.created_at, NOW()),
    NOW(), 
    TRUE
FROM profiles p
WHERE (p.privacy_accepted_at IS NOT NULL OR p.privacy_accepted_version IS NOT NULL)
AND NOT EXISTS (
    SELECT 1 FROM compliance_consents cc 
    WHERE cc.profile_id = p.id AND cc.consent_type = 'privacy-policy'
);

COMMIT;

-- ============================================================================
-- STEP 5: Helper functions
-- ============================================================================

BEGIN;

CREATE OR REPLACE FUNCTION has_active_consent(
    p_profile_id UUID, 
    p_consent_type consent_type
)
RETURNS BOOLEAN 
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM compliance_consents
        WHERE profile_id = p_profile_id 
        AND consent_type = p_consent_type
        AND consented = TRUE 
        AND withdrawn = FALSE 
        AND is_active = TRUE
    );
$$ LANGUAGE SQL STABLE;

COMMENT ON FUNCTION has_active_consent IS 'Check if a profile has an active consent for a specific type';

CREATE OR REPLACE FUNCTION record_consent(
    p_profile_id UUID, 
    p_organization_id UUID, 
    p_consent_type consent_type,
    p_version TEXT, 
    p_ip INET DEFAULT NULL, 
    p_ua TEXT DEFAULT NULL
) 
RETURNS UUID 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE 
    v_id UUID;
BEGIN
    INSERT INTO compliance_consents (
        profile_id, organization_id, consent_type, consent_version,
        consented, consent_date, ip_address, user_agent,
        created_at, updated_at, is_active
    ) VALUES (
        p_profile_id, p_organization_id, p_consent_type, p_version,
        TRUE, NOW(), p_ip, p_ua, NOW(), NOW(), TRUE
    ) RETURNING id INTO v_id;
    
    RETURN v_id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION record_consent IS 'Record a new consent with optional IP and user agent tracking';

CREATE OR REPLACE FUNCTION withdraw_consent(
    p_profile_id UUID, 
    p_consent_type consent_type
)
RETURNS BOOLEAN 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE compliance_consents
    SET withdrawn = TRUE, 
        withdrawn_date = NOW(), 
        updated_at = NOW()
    WHERE profile_id = p_profile_id 
    AND consent_type = p_consent_type 
    AND withdrawn = FALSE;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION withdraw_consent IS 'Withdraw all active consents of a specific type for a profile';

COMMIT;

-- ============================================================================
-- STEP 6: Indexes
-- ============================================================================

BEGIN;

CREATE INDEX IF NOT EXISTS idx_compliance_consents_type 
    ON compliance_consents(consent_type);
    
CREATE INDEX IF NOT EXISTS idx_compliance_consents_profile_type 
    ON compliance_consents(profile_id, consent_type);
    
CREATE INDEX IF NOT EXISTS idx_compliance_consents_active 
    ON compliance_consents(profile_id, consent_type, consented, withdrawn) 
    WHERE is_active = TRUE;

COMMIT;

-- ============================================================================
-- Verification
-- ============================================================================

SELECT 'Migration 009 verification:' AS status;

SELECT 
    consent_type, 
    COUNT(*) AS total_consents,
    COUNT(*) FILTER (WHERE consented = TRUE AND withdrawn = FALSE) AS active_consents,
    COUNT(*) FILTER (WHERE withdrawn = TRUE) AS withdrawn_consents
FROM compliance_consents 
WHERE consent_type IS NOT NULL
GROUP BY consent_type
ORDER BY consent_type;

-- ============================================================================
-- Drop columns (OPTIONAL - run separately after verification)
-- ============================================================================

/*
BEGIN;

ALTER TABLE profiles DROP COLUMN IF EXISTS terms_accepted_version;
ALTER TABLE profiles DROP COLUMN IF EXISTS terms_accepted_at;
ALTER TABLE profiles DROP COLUMN IF EXISTS privacy_accepted_version;
ALTER TABLE profiles DROP COLUMN IF EXISTS privacy_accepted_at;

COMMIT;
*/

SELECT '✅ Legal consents migrated to compliance_consents!' AS next_step;
