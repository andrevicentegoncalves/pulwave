-- ============================================================================
-- MIGRATION 012: Final Profiles Table Refactoring
-- ============================================================================
-- Description: Removes deprecated columns and reorganizes profiles table
-- 
-- PREREQUISITES: Run migrations 006-011 first!
-- This migration should be run LAST after verifying all data migrations
-- ============================================================================

-- ============================================================================
-- PRE-FLIGHT CHECKS
-- ============================================================================

DO $$
DECLARE
    v_social_count INTEGER;
    v_contact_count INTEGER;
    v_professional_count INTEGER;
    v_consent_count INTEGER;
    v_profiles_with_data INTEGER;
BEGIN
    -- Check social profiles migration
    SELECT COUNT(*) INTO v_social_count FROM social_profiles;
    
    -- Check contacts migration
    SELECT COUNT(*) INTO v_contact_count FROM contacts WHERE contact_type IS NOT NULL;
    
    -- Check professional profiles
    SELECT COUNT(*) INTO v_professional_count FROM professional_profiles;
    
    -- Check compliance consents
    SELECT COUNT(*) INTO v_consent_count FROM compliance_consents WHERE consent_type IS NOT NULL;
    
    -- Check profiles that had data
    SELECT COUNT(*) INTO v_profiles_with_data 
    FROM profiles 
    WHERE linkedin_url IS NOT NULL 
       OR twitter_url IS NOT NULL 
       OR phone IS NOT NULL 
       OR company_name IS NOT NULL
       OR terms_accepted_at IS NOT NULL;
    
    RAISE NOTICE '=== PRE-FLIGHT CHECK ===';
    RAISE NOTICE 'Social profiles: %', v_social_count;
    RAISE NOTICE 'Contacts with type: %', v_contact_count;
    RAISE NOTICE 'Professional profiles: %', v_professional_count;
    RAISE NOTICE 'Compliance consents: %', v_consent_count;
    RAISE NOTICE 'Profiles with data to migrate: %', v_profiles_with_data;
    
    -- Warning if data might be lost
    IF v_profiles_with_data > 0 AND (v_social_count = 0 OR v_contact_count = 0) THEN
        RAISE EXCEPTION 'Data migration may be incomplete! Run migrations 006-011 first.';
    END IF;
END $$;

-- ============================================================================
-- STEP 1: Create backup of profiles table (safety measure)
-- ============================================================================

DO $$
BEGIN
    -- Create backup table with timestamp
    CREATE TABLE IF NOT EXISTS profiles_backup_before_refactor AS 
    SELECT * FROM profiles;

    RAISE NOTICE 'Backup created: profiles_backup_before_refactor';
END $$;

-- ============================================================================
-- STEP 2: Drop deprecated columns - SOCIAL URLs
-- ============================================================================

BEGIN;

-- These columns are now in social_profiles table
ALTER TABLE profiles DROP COLUMN IF EXISTS linkedin_url;
ALTER TABLE profiles DROP COLUMN IF EXISTS twitter_url;
ALTER TABLE profiles DROP COLUMN IF EXISTS facebook_url;
ALTER TABLE profiles DROP COLUMN IF EXISTS instagram_url;
ALTER TABLE profiles DROP COLUMN IF EXISTS website;

DO $$ BEGIN RAISE NOTICE 'Dropped social URL columns'; END $$;

COMMIT;

-- ============================================================================
-- STEP 3: Drop deprecated columns - CONTACT INFO
-- ============================================================================

BEGIN;

-- These columns are now in contacts table
ALTER TABLE profiles DROP COLUMN IF EXISTS phone;
ALTER TABLE profiles DROP COLUMN IF EXISTS phone_secondary;
ALTER TABLE profiles DROP COLUMN IF EXISTS email_secondary;
ALTER TABLE profiles DROP COLUMN IF EXISTS preferred_contact_method;

DO $$ BEGIN RAISE NOTICE 'Dropped contact columns'; END $$;

COMMIT;

-- ============================================================================
-- STEP 4: Drop deprecated columns - COMPANY DATA
-- ============================================================================

BEGIN;

-- These columns are now in professional_profiles table
ALTER TABLE profiles DROP COLUMN IF EXISTS company_name;
ALTER TABLE profiles DROP COLUMN IF EXISTS vat_id;
-- Note: tax_id might be used for personal tax, keep if needed
-- ALTER TABLE profiles DROP COLUMN IF EXISTS tax_id;

DO $$ BEGIN RAISE NOTICE 'Dropped company columns'; END $$;

COMMIT;

-- ============================================================================
-- STEP 5: Drop deprecated columns - LEGAL CONSENTS
-- ============================================================================

BEGIN;

-- These columns are now in compliance_consents table
ALTER TABLE profiles DROP COLUMN IF EXISTS terms_accepted_version;
ALTER TABLE profiles DROP COLUMN IF EXISTS terms_accepted_at;
ALTER TABLE profiles DROP COLUMN IF EXISTS privacy_accepted_version;
ALTER TABLE profiles DROP COLUMN IF EXISTS privacy_accepted_at;

DO $$ BEGIN RAISE NOTICE 'Dropped legal consent columns'; END $$;

COMMIT;

-- ============================================================================
-- STEP 6: Drop deprecated columns - PREFERENCES (already in user_preferences)
-- ============================================================================

BEGIN;

-- These columns should be in user_preferences table
ALTER TABLE profiles DROP COLUMN IF EXISTS theme;
ALTER TABLE profiles DROP COLUMN IF EXISTS language;
ALTER TABLE profiles DROP COLUMN IF EXISTS timezone;
ALTER TABLE profiles DROP COLUMN IF EXISTS locale;
ALTER TABLE profiles DROP COLUMN IF EXISTS notification_preferences;
ALTER TABLE profiles DROP COLUMN IF EXISTS email_notifications;
ALTER TABLE profiles DROP COLUMN IF EXISTS sms_notifications;
ALTER TABLE profiles DROP COLUMN IF EXISTS push_notifications;
ALTER TABLE profiles DROP COLUMN IF EXISTS notifications_enabled;
ALTER TABLE profiles DROP COLUMN IF EXISTS marketing_emails;
ALTER TABLE profiles DROP COLUMN IF EXISTS data_processing_consent;
ALTER TABLE profiles DROP COLUMN IF EXISTS marketing_consent;

DO $$ BEGIN RAISE NOTICE 'Dropped preference columns'; END $$;

COMMIT;

-- ============================================================================
-- STEP 7: Drop other deprecated/duplicate columns
-- ============================================================================

BEGIN;

-- Drop old 'role' column if it exists (replaced by app_role)
ALTER TABLE profiles DROP COLUMN IF EXISTS role;

-- Drop job_title and department (now in professional_profiles)
ALTER TABLE profiles DROP COLUMN IF EXISTS job_title;
ALTER TABLE profiles DROP COLUMN IF EXISTS department;

-- Drop version column if not needed
-- ALTER TABLE profiles DROP COLUMN IF EXISTS version;

DO $$ BEGIN RAISE NOTICE 'Dropped misc deprecated columns'; END $$;

COMMIT;

-- ============================================================================
-- STEP 8: Ensure required columns exist with proper types
-- ============================================================================

BEGIN;

-- Ensure app_role uses enum
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'app_role'
        AND data_type = 'text'
    ) THEN
        -- Convert text to enum if needed
        ALTER TABLE profiles 
            ALTER COLUMN app_role TYPE app_role 
            USING app_role::app_role;
        RAISE NOTICE 'Converted app_role to enum type';
    END IF;
END $$;

-- Ensure user_type uses enum
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'user_type'
        AND data_type = 'text'
    ) THEN
        ALTER TABLE profiles 
            ALTER COLUMN user_type TYPE user_type 
            USING user_type::user_type;
        RAISE NOTICE 'Converted user_type to enum type';
    END IF;
END $$;

-- Set defaults
ALTER TABLE profiles ALTER COLUMN app_role SET DEFAULT 'user'::app_role;
ALTER TABLE profiles ALTER COLUMN user_type SET DEFAULT 'homeowner'::user_type;

-- Add onboarding_completed if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

COMMIT;

-- ============================================================================
-- STEP 9: Reorganize columns (create new table with proper order)
-- ============================================================================
-- Note: PostgreSQL doesn't support column reordering directly
-- This step creates a view with the preferred column order

BEGIN;

CREATE OR REPLACE VIEW v_profiles_organized AS
SELECT
    -- PRIMARY KEY
    id,
    
    -- IDENTITY
    auth_user_id,
    username,
    email,
    email_verified,
    
    -- PERSONAL INFO
    first_name,
    middle_name,
    last_name,
    display_name,
    date_of_birth,
    gender,
    pronouns,
    bio,
    avatar_url,
    cover_image_url,
    
    -- FOREIGN KEYS TO RELATED TABLES
    address_id,
    primary_address_id,
    billing_address_id,
    preferences_id,
    professional_profile_id,
    
    -- SYSTEM FLAGS
    app_role,
    user_type,
    onboarding_completed,
    
    -- STATUS FLAGS
    is_active,
    is_suspended,
    is_deleted,
    deleted_at,
    deletion_reason,
    deletion_requested,
    deletion_requested_at,
    deletion_scheduled_for,
    
    -- SECURITY
    two_factor_enabled,
    two_factor_verified_at,
    password_reset_required,
    password_changed_at,
    phone_verified,
    
    -- ACTIVITY
    last_activity_at,
    login_count,
    
    -- METADATA
    tags,
    metadata,
    version,
    
    -- AUDIT FIELDS (always at end)
    created_at,
    created_by,
    updated_at,
    updated_by
FROM profiles;

COMMENT ON VIEW v_profiles_organized IS 
    'View of profiles table with columns in logical order';

COMMIT;

-- ============================================================================
-- STEP 10: Update indexes after column changes
-- ============================================================================

BEGIN;

-- Recreate any indexes that might have been affected
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_auth_user_id ON profiles(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_app_role ON profiles(app_role);
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON profiles(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_profiles_address_id ON profiles(address_id);
CREATE INDEX IF NOT EXISTS idx_profiles_billing_address_id ON profiles(billing_address_id);

COMMIT;

-- ============================================================================
-- STEP 11: Create comprehensive profile view with all related data
-- ============================================================================

BEGIN;

CREATE OR REPLACE VIEW v_profile_complete AS
SELECT
    p.id,
    p.auth_user_id,
    p.username,
    p.email,
    p.first_name,
    p.middle_name,
    p.last_name,
    p.display_name,
    COALESCE(p.display_name, p.first_name || ' ' || p.last_name, p.email) AS full_name,
    p.date_of_birth,
    p.gender,
    p.pronouns,
    p.bio,
    p.avatar_url,
    p.app_role,
    p.user_type,
    p.onboarding_completed,
    p.is_active,
    p.created_at,
    p.updated_at,
    
    -- Primary address
    a.street_name AS address_street,
    a.city_name AS address_city,
    a.postal_code AS address_postal,
    
    -- Primary organization
    po.id AS primary_org_id,
    po.name AS primary_org_name,
    pom.role AS primary_org_role,
    
    -- Professional info
    pp.job_title,
    pp.company_name,
    pp.department,
    
    -- Preferences
    up.timezone,
    up.locale,
    up.theme,
    
    -- Social links (aggregated)
    (
        SELECT jsonb_agg(jsonb_build_object(
            'platform', sp.platform,
            'url', sp.profile_url,
            'username', sp.platform_username
        ) ORDER BY sp.display_order)
        FROM social_profiles sp
        WHERE sp.profile_id = p.id AND sp.is_active = TRUE
    ) AS social_links,
    
    -- Contact info (aggregated)
    (
        SELECT jsonb_agg(jsonb_build_object(
            'type', c.contact_type,
            'phone', c.phone,
            'email', c.email,
            'is_primary', c.is_primary
        ) ORDER BY c.display_order)
        FROM contacts c
        WHERE c.profile_id = p.id AND c.is_active = TRUE
    ) AS contacts,
    
    -- Organization memberships
    (
        SELECT jsonb_agg(jsonb_build_object(
            'org_id', om.organization_id,
            'org_name', o.name,
            'role', om.role,
            'is_primary', om.is_primary,
            'is_personal', om.is_personal_org
        ))
        FROM organization_members om
        JOIN organizations o ON o.id = om.organization_id
        WHERE om.profile_id = p.id AND om.is_active = TRUE
    ) AS organizations

FROM profiles p
LEFT JOIN addresses a ON a.id = COALESCE(p.primary_address_id, p.address_id)
LEFT JOIN organization_members pom ON pom.profile_id = p.id AND pom.is_primary = TRUE
LEFT JOIN organizations po ON po.id = pom.organization_id
LEFT JOIN professional_profiles pp ON pp.profile_id = p.id
LEFT JOIN user_preferences up ON up.profile_id = p.id;

COMMENT ON VIEW v_profile_complete IS 
    'Complete profile view with all related data aggregated';

COMMIT;

-- ============================================================================
-- Verification
-- ============================================================================

SELECT '=== MIGRATION 012 COMPLETE ===' AS status;

-- Show remaining columns
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- Count columns
SELECT 
    'profiles columns' AS metric,
    COUNT(*) AS count
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'profiles';

-- Show sample from complete view
SELECT 'Sample from v_profile_complete:' AS status;
SELECT id, full_name, email, primary_org_name, app_role 
FROM v_profile_complete 
LIMIT 5;

SELECT '✅ Profiles table refactoring complete!' AS next_step;
SELECT 'Backup available in profiles_backup_before_refactor table' AS note;
