-- ============================================================================
-- PulWave Profiles System Redesign - Migration Script v3
-- ============================================================================
-- Version: 3.0.0
-- Date: December 14, 2025
-- Author: Database Architecture Team
-- ============================================================================
-- 
-- PREREQUISITES:
-- 1. Full database backup completed
-- 2. Application in maintenance mode
-- 3. DBA review completed
--
-- EXECUTION ORDER:
-- 1. Run profiles_backup_v3.sql (creates backup schema)
-- 2. Run this migration in a transaction
-- 3. Run verification queries
-- 4. Update application code
-- 5. Run cleanup phase (after verification period)
--
-- ESTIMATED TIME: 15-30 minutes for medium-sized databases
-- ============================================================================

-- ============================================================================
-- MIGRATION TRACKING
-- ============================================================================

BEGIN;

-- Create migration log if not exists
CREATE TABLE IF NOT EXISTS _migration_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    migration_name TEXT NOT NULL,
    version TEXT NOT NULL,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    status TEXT DEFAULT 'running',
    details JSONB,
    rollback_sql TEXT
);

-- Log migration start
INSERT INTO _migration_log (migration_name, version, details)
VALUES (
    'profiles_system_redesign_v3', 
    '3.0.0',
    '{
        "phase": "started",
        "tables_affected": [
            "profiles", 
            "contacts", 
            "user_preferences", 
            "profile_preferences"
        ],
        "changes": [
            "auth_user_id NOT NULL",
            "phone migration to contacts",
            "emergency contact migration",
            "preferences consolidation",
            "new security fields",
            "new attribution fields"
        ]
    }'::JSONB
);

-- ============================================================================
-- PHASE 0: PRE-MIGRATION VALIDATION
-- ============================================================================

DO $$
DECLARE
    orphan_count INTEGER;
    dup_pref_count INTEGER;
BEGIN
    RAISE NOTICE 'Phase 0: Pre-migration validation starting...';
    
    -- Check for profiles without auth_user_id
    SELECT COUNT(*) INTO orphan_count 
    FROM profiles 
    WHERE auth_user_id IS NULL;
    
    IF orphan_count > 0 THEN
        RAISE WARNING 'Found % profiles with NULL auth_user_id', orphan_count;
        -- Create temporary table for manual review
        CREATE TEMP TABLE IF NOT EXISTS _orphaned_profiles AS
        SELECT id, email, username, created_at, is_active
        FROM profiles 
        WHERE auth_user_id IS NULL;
        
        RAISE NOTICE 'Orphaned profiles saved to _orphaned_profiles temp table';
    END IF;
    
    -- Check for duplicate preferences
    SELECT COUNT(*) INTO dup_pref_count
    FROM (
        SELECT profile_id, organization_id, COUNT(*)
        FROM user_preferences
        GROUP BY profile_id, organization_id
        HAVING COUNT(*) > 1
    ) dups;
    
    IF dup_pref_count > 0 THEN
        RAISE WARNING 'Found % duplicate preference entries', dup_pref_count;
    END IF;
    
    RAISE NOTICE 'Phase 0: Validation complete';
END $$;

-- ============================================================================
-- PHASE 1: ENUMS - Create missing types
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE 'Phase 1: Creating/verifying enums...';
    
    -- contact_type_enum (for extended contact types)
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'contact_type') THEN
        CREATE TYPE contact_type AS ENUM (
            'phone-primary',
            'phone-secondary',
            'phone-mobile',
            'phone-work',
            'phone-home',
            'phone-emergency',
            'email-primary',
            'email-secondary',
            'email-work',
            'email-personal',
            'fax',
            'whatsapp',
            'telegram',
            'other'
        );
        RAISE NOTICE 'Created contact_type enum';
    END IF;
    
    -- locale_type (if not using the existing user_locale)
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'locale_type') THEN
        CREATE TYPE locale_type AS ENUM (
            'en-US', 'en-GB', 'en-CA', 'en-AU',
            'es-ES', 'es-MX', 'es-AR',
            'fr-FR', 'fr-CA',
            'de-DE', 'de-AT', 'de-CH',
            'it-IT',
            'pt-BR', 'pt-PT',
            'zh-CN', 'zh-TW',
            'ja-JP',
            'ko-KR',
            'ar-SA',
            'hi-IN',
            'ru-RU',
            'nl-NL',
            'pl-PL',
            'tr-TR',
            'sv-SE',
            'da-DK',
            'fi-FI',
            'nb-NO'
        );
        RAISE NOTICE 'Created locale_type enum';
    END IF;
    
    RAISE NOTICE 'Phase 1: Enums complete';
END $$;

-- ============================================================================
-- PHASE 2: PROFILES TABLE - Add new columns
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE 'Phase 2: Adding new columns to profiles...';
    
    -- 2.1 Phone verification
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'phone_verified'
    ) THEN
        ALTER TABLE profiles ADD COLUMN phone_verified BOOLEAN DEFAULT false;
        ALTER TABLE profiles ADD COLUMN phone_verified_at TIMESTAMPTZ;
        RAISE NOTICE 'Added phone_verified columns';
    END IF;
    
    -- 2.2 WebAuthn/Passkey support
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'webauthn_enabled'
    ) THEN
        ALTER TABLE profiles ADD COLUMN webauthn_enabled BOOLEAN DEFAULT false;
        ALTER TABLE profiles ADD COLUMN webauthn_registered_at TIMESTAMPTZ;
        RAISE NOTICE 'Added webauthn columns';
    END IF;
    
    -- 2.3 SSO provider tracking
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'sso_provider'
    ) THEN
        ALTER TABLE profiles ADD COLUMN sso_provider TEXT;
        ALTER TABLE profiles ADD COLUMN sso_provider_id TEXT;
        RAISE NOTICE 'Added SSO columns';
    END IF;
    
    -- 2.4 Billing access
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'has_billing_access'
    ) THEN
        ALTER TABLE profiles ADD COLUMN has_billing_access BOOLEAN DEFAULT false;
        ALTER TABLE profiles ADD COLUMN stripe_customer_id TEXT;
        RAISE NOTICE 'Added billing columns';
    END IF;
    
    -- 2.5 Attribution fields
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'utm_source'
    ) THEN
        ALTER TABLE profiles ADD COLUMN utm_source TEXT;
        ALTER TABLE profiles ADD COLUMN utm_medium TEXT;
        ALTER TABLE profiles ADD COLUMN utm_campaign TEXT;
        ALTER TABLE profiles ADD COLUMN referral_code TEXT;
        ALTER TABLE profiles ADD COLUMN referred_by UUID REFERENCES profiles(id);
        RAISE NOTICE 'Added attribution columns';
    END IF;
    
    -- 2.6 Profile completeness
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'profile_completeness_score'
    ) THEN
        ALTER TABLE profiles ADD COLUMN profile_completeness_score INTEGER DEFAULT 0;
        RAISE NOTICE 'Added profile_completeness_score column';
    END IF;
    
    -- 2.7 Compliance fields
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'country_of_residence'
    ) THEN
        ALTER TABLE profiles ADD COLUMN country_of_residence TEXT;
        ALTER TABLE profiles ADD COLUMN tax_identification_type TEXT;
        RAISE NOTICE 'Added compliance columns';
    END IF;
    
    RAISE NOTICE 'Phase 2: New columns added to profiles';
END $$;

-- ============================================================================
-- PHASE 3: CONTACTS TABLE - Ensure structure supports phone migration
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE 'Phase 3: Updating contacts table structure...';
    
    -- Ensure contact_type column uses our enum or text
    -- (Already exists as TEXT in current schema, which is fine)
    
    -- Add phone_country_code if not exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'contacts' 
        AND column_name = 'phone_country_code'
    ) THEN
        ALTER TABLE contacts ADD COLUMN phone_country_code TEXT;
        RAISE NOTICE 'Added phone_country_code to contacts';
    END IF;
    
    RAISE NOTICE 'Phase 3: Contacts table ready';
END $$;

-- ============================================================================
-- PHASE 4: MIGRATE PHONE DATA TO CONTACTS
-- ============================================================================

DO $$
DECLARE
    migrated_count INTEGER := 0;
    profile_record RECORD;
BEGIN
    RAISE NOTICE 'Phase 4: Migrating phone data to contacts...';
    
    -- Migrate primary phone
    FOR profile_record IN 
        SELECT p.id as profile_id, 
               p.phone_code,
               p.phone_number,
               om.organization_id
        FROM profiles p
        JOIN organization_members om ON om.profile_id = p.id AND om.is_personal_org = true
        WHERE p.phone_number IS NOT NULL
        AND NOT EXISTS (
            SELECT 1 FROM contacts c 
            WHERE c.profile_id = p.id 
            AND c.contact_type = 'phone-primary'
        )
    LOOP
        INSERT INTO contacts (
            organization_id,
            profile_id,
            contact_type,
            phone,
            phone_country_code,
            is_primary,
            is_active,
            created_at
        ) VALUES (
            profile_record.organization_id,
            profile_record.profile_id,
            'phone-primary',
            profile_record.phone_number,
            profile_record.phone_code,
            true,
            true,
            NOW()
        );
        migrated_count := migrated_count + 1;
    END LOOP;
    
    RAISE NOTICE 'Migrated % primary phone records', migrated_count;
    
    -- Migrate secondary phone
    migrated_count := 0;
    FOR profile_record IN 
        SELECT p.id as profile_id, 
               p.phone_secondary_code,
               p.phone_secondary_number,
               om.organization_id
        FROM profiles p
        JOIN organization_members om ON om.profile_id = p.id AND om.is_personal_org = true
        WHERE p.phone_secondary_number IS NOT NULL
        AND NOT EXISTS (
            SELECT 1 FROM contacts c 
            WHERE c.profile_id = p.id 
            AND c.contact_type = 'phone-secondary'
        )
    LOOP
        INSERT INTO contacts (
            organization_id,
            profile_id,
            contact_type,
            phone,
            phone_country_code,
            is_primary,
            is_active,
            created_at
        ) VALUES (
            profile_record.organization_id,
            profile_record.profile_id,
            'phone-secondary',
            profile_record.phone_secondary_number,
            profile_record.phone_secondary_code,
            false,
            true,
            NOW()
        );
        migrated_count := migrated_count + 1;
    END LOOP;
    
    RAISE NOTICE 'Migrated % secondary phone records', migrated_count;
    
    RAISE NOTICE 'Phase 4: Phone migration complete';
END $$;

-- ============================================================================
-- PHASE 5: MIGRATE EMERGENCY CONTACTS
-- ============================================================================

DO $$
DECLARE
    migrated_count INTEGER := 0;
    profile_record RECORD;
BEGIN
    RAISE NOTICE 'Phase 5: Migrating emergency contacts...';
    
    FOR profile_record IN 
        SELECT p.id as profile_id, 
               p.emergency_contact_name,
               p.emergency_contact_phone,
               p.emergency_contact_relationship,
               om.organization_id
        FROM profiles p
        JOIN organization_members om ON om.profile_id = p.id AND om.is_personal_org = true
        WHERE p.emergency_contact_phone IS NOT NULL
        AND NOT EXISTS (
            SELECT 1 FROM contacts c 
            WHERE c.profile_id = p.id 
            AND c.contact_type = 'phone-emergency'
        )
    LOOP
        INSERT INTO contacts (
            organization_id,
            profile_id,
            contact_type,
            contact_name,
            phone,
            relationship,
            is_primary,
            is_active,
            created_at
        ) VALUES (
            profile_record.organization_id,
            profile_record.profile_id,
            'phone-emergency',
            profile_record.emergency_contact_name,
            profile_record.emergency_contact_phone,
            NULLIF(profile_record.emergency_contact_relationship, '')::emergency_relationship,
            true,
            true,
            NOW()
        );
        migrated_count := migrated_count + 1;
    END LOOP;
    
    RAISE NOTICE 'Migrated % emergency contact records', migrated_count;
    RAISE NOTICE 'Phase 5: Emergency contact migration complete';
END $$;

-- ============================================================================
-- PHASE 6: USER_PREFERENCES - Add missing columns
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE 'Phase 6: Updating user_preferences table...';
    
    -- Add ui_layout JSONB for flexible layout config
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_preferences' 
        AND column_name = 'ui_layout'
    ) THEN
        ALTER TABLE user_preferences ADD COLUMN ui_layout JSONB DEFAULT '{}'::JSONB;
        RAISE NOTICE 'Added ui_layout column';
    END IF;
    
    -- Add consent flags if not exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_preferences' 
        AND column_name = 'data_processing_consent'
    ) THEN
        ALTER TABLE user_preferences ADD COLUMN data_processing_consent BOOLEAN DEFAULT false;
        ALTER TABLE user_preferences ADD COLUMN marketing_consent BOOLEAN DEFAULT false;
        ALTER TABLE user_preferences ADD COLUMN analytics_consent BOOLEAN DEFAULT true;
        RAISE NOTICE 'Added consent columns';
    END IF;
    
    -- Add activity_status_visible
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_preferences' 
        AND column_name = 'activity_status_visible'
    ) THEN
        ALTER TABLE user_preferences ADD COLUMN activity_status_visible BOOLEAN DEFAULT true;
        RAISE NOTICE 'Added activity_status_visible column';
    END IF;
    
    RAISE NOTICE 'Phase 6: user_preferences updated';
END $$;

-- ============================================================================
-- PHASE 7: MIGRATE PREFERENCES FROM profile_preferences TO user_preferences
-- ============================================================================

DO $$
DECLARE
    migrated_count INTEGER := 0;
BEGIN
    RAISE NOTICE 'Phase 7: Consolidating preferences...';
    
    -- Merge from profile_preferences where user_preferences doesn't exist
    INSERT INTO user_preferences (
        profile_id,
        organization_id,
        theme,
        timezone,
        locale,
        profile_visibility,
        notifications_enabled,
        email_notifications,
        sms_notifications,
        push_notifications,
        marketing_emails,
        data_processing_consent,
        marketing_consent,
        is_active,
        created_at,
        created_by,
        updated_at,
        updated_by
    )
    SELECT 
        pp.profile_id,
        pp.organization_id,
        pp.theme::theme_preference,
        pp.timezone,
        pp.locale::user_locale,
        pp.profile_visibility::profile_visibility,
        pp.notifications_enabled,
        pp.email_notifications,
        pp.sms_notifications,
        pp.push_notifications,
        pp.marketing_emails,
        COALESCE(pp.data_processing_consent, false),
        COALESCE(pp.marketing_consent, false),
        pp.is_active,
        pp.created_at,
        pp.created_by,
        pp.updated_at,
        pp.updated_by
    FROM profile_preferences pp
    WHERE NOT EXISTS (
        SELECT 1 FROM user_preferences up 
        WHERE up.profile_id = pp.profile_id 
        AND up.organization_id = pp.organization_id
    );
    
    GET DIAGNOSTICS migrated_count = ROW_COUNT;
    RAISE NOTICE 'Migrated % preference records from profile_preferences', migrated_count;
    
    -- Migrate preferences from profiles table
    UPDATE user_preferences up
    SET 
        timezone = COALESCE(up.timezone, p.timezone),
        date_format = COALESCE(up.date_format, p.date_format),
        time_format = COALESCE(up.time_format, p.time_format),
        dashboard_widgets = COALESCE(up.dashboard_widgets, p.dashboard_layout),
        updated_at = NOW()
    FROM profiles p
    WHERE up.profile_id = p.id
    AND (
        (p.timezone IS NOT NULL AND up.timezone IS NULL) OR
        (p.date_format IS NOT NULL AND up.date_format IS NULL) OR
        (p.time_format IS NOT NULL AND up.time_format IS NULL) OR
        (p.dashboard_layout IS NOT NULL AND p.dashboard_layout != '{}'::JSONB AND up.dashboard_widgets IS NULL)
    );
    
    GET DIAGNOSTICS migrated_count = ROW_COUNT;
    RAISE NOTICE 'Updated % preference records from profiles table', migrated_count;
    
    RAISE NOTICE 'Phase 7: Preferences consolidation complete';
END $$;

-- ============================================================================
-- PHASE 8: ADD FK CONSTRAINT auth_user_id -> auth.users
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE 'Phase 8: Adding FK constraint for auth_user_id...';
    
    -- Check if FK already exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'profiles_auth_user_id_fkey' 
        AND table_name = 'profiles'
        AND table_schema = 'public'
    ) THEN
        -- First verify all auth_user_ids exist in auth.users
        IF NOT EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.auth_user_id IS NOT NULL
            AND NOT EXISTS (SELECT 1 FROM auth.users u WHERE u.id = p.auth_user_id)
        ) THEN
            -- Add FK constraint
            ALTER TABLE profiles
            ADD CONSTRAINT profiles_auth_user_id_fkey
            FOREIGN KEY (auth_user_id) 
            REFERENCES auth.users(id) 
            ON DELETE CASCADE;
            
            RAISE NOTICE 'Added FK constraint profiles_auth_user_id_fkey';
        ELSE
            RAISE WARNING 'Some auth_user_id values do not exist in auth.users - FK not added';
        END IF;
    ELSE
        RAISE NOTICE 'FK constraint already exists';
    END IF;
    
    RAISE NOTICE 'Phase 8: FK constraint complete';
END $$;

-- ============================================================================
-- PHASE 9: MAKE auth_user_id NOT NULL (if no orphans)
-- ============================================================================

DO $$
DECLARE
    orphan_count INTEGER;
BEGIN
    RAISE NOTICE 'Phase 9: Setting auth_user_id NOT NULL...';
    
    SELECT COUNT(*) INTO orphan_count 
    FROM profiles 
    WHERE auth_user_id IS NULL;
    
    IF orphan_count = 0 THEN
        ALTER TABLE profiles ALTER COLUMN auth_user_id SET NOT NULL;
        RAISE NOTICE 'Set auth_user_id to NOT NULL';
    ELSE
        RAISE WARNING 'Cannot set auth_user_id to NOT NULL - % orphaned profiles exist', orphan_count;
        RAISE NOTICE 'Review _orphaned_profiles temp table and handle manually';
    END IF;
    
    RAISE NOTICE 'Phase 9: auth_user_id constraint complete';
END $$;

-- ============================================================================
-- PHASE 10: CREATE/UPDATE PROFILE COMPLETENESS FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION calculate_profile_completeness()
RETURNS TRIGGER AS $$
DECLARE
    score INTEGER := 0;
BEGIN
    -- Basic info (40 points)
    IF NEW.first_name IS NOT NULL AND NEW.first_name != '' THEN 
        score := score + 10; 
    END IF;
    IF NEW.last_name IS NOT NULL AND NEW.last_name != '' THEN 
        score := score + 10; 
    END IF;
    IF NEW.avatar_url IS NOT NULL AND NEW.avatar_url != '' THEN 
        score := score + 10; 
    END IF;
    IF NEW.bio IS NOT NULL AND NEW.bio != '' THEN 
        score := score + 10; 
    END IF;
    
    -- Verification (30 points)
    IF NEW.email_verified = true THEN 
        score := score + 15; 
    END IF;
    IF NEW.phone_verified = true THEN 
        score := score + 15; 
    END IF;
    
    -- Security (20 points)
    IF NEW.two_factor_enabled = true THEN 
        score := score + 20; 
    END IF;
    
    -- Additional (10 points)
    IF NEW.date_of_birth IS NOT NULL THEN 
        score := score + 5; 
    END IF;
    IF EXISTS (
        SELECT 1 FROM addresses 
        WHERE profile_id = NEW.id 
        AND is_active = true
    ) THEN
        score := score + 5;
    END IF;
    
    NEW.profile_completeness_score := score;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if exists and recreate
DROP TRIGGER IF EXISTS trg_calculate_completeness ON profiles;
CREATE TRIGGER trg_calculate_completeness
    BEFORE INSERT OR UPDATE ON profiles
    FOR EACH ROW 
    EXECUTE FUNCTION calculate_profile_completeness();

DO $$ BEGIN RAISE NOTICE 'Phase 10: Profile completeness trigger created'; END $$;

-- ============================================================================
-- PHASE 11: CREATE INDEXES FOR NEW COLUMNS
-- ============================================================================

-- Index for referrals
CREATE INDEX IF NOT EXISTS idx_profiles_referred_by 
    ON profiles(referred_by) 
    WHERE referred_by IS NOT NULL;

-- Index for SSO
CREATE INDEX IF NOT EXISTS idx_profiles_sso_provider 
    ON profiles(sso_provider) 
    WHERE sso_provider IS NOT NULL;

-- Index for billing
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer 
    ON profiles(stripe_customer_id) 
    WHERE stripe_customer_id IS NOT NULL;

-- Index for completeness score (for analytics)
CREATE INDEX IF NOT EXISTS idx_profiles_completeness 
    ON profiles(profile_completeness_score);

DO $$ BEGIN RAISE NOTICE 'Phase 11: Indexes created'; END $$;

-- ============================================================================
-- PHASE 12: UPDATE VIEWS (if any reference old columns)
-- ============================================================================

-- Drop and recreate v_profiles_organized if it references old columns
DO $$
BEGIN
    RAISE NOTICE 'Phase 12: Updating views...';
    
    -- Check if view exists and drop it
    DROP VIEW IF EXISTS v_profiles_organized CASCADE;
    
    -- Recreate with new structure
    CREATE OR REPLACE VIEW v_profiles_organized AS
    SELECT 
        p.id,
        p.auth_user_id,
        p.username,
        p.email,
        p.email_verified,
        p.first_name,
        p.middle_name,
        p.last_name,
        p.display_name,
        COALESCE(p.display_name, 
                 CONCAT_WS(' ', p.first_name, p.last_name),
                 p.username,
                 p.email) as full_name,
        p.date_of_birth,
        p.gender,
        p.pronouns,
        p.bio,
        p.avatar_url,
        p.app_role,
        p.user_type,
        p.is_active,
        p.is_suspended,
        p.is_deleted,
        p.two_factor_enabled,
        p.phone_verified,
        p.webauthn_enabled,
        p.sso_provider,
        p.has_billing_access,
        p.profile_completeness_score,
        p.last_activity_at,
        p.login_count,
        p.last_active_organization_id,
        p.created_at,
        p.updated_at,
        -- Get primary phone from contacts
        (SELECT c.phone FROM contacts c 
         WHERE c.profile_id = p.id 
         AND c.contact_type = 'phone-primary' 
         AND c.is_active = true 
         LIMIT 1) as primary_phone,
        -- Get preferences
        up.timezone,
        up.locale,
        up.theme,
        up.date_format,
        up.time_format
    FROM profiles p
    LEFT JOIN user_preferences up ON up.profile_id = p.id
    WHERE p.is_deleted = false OR p.is_deleted IS NULL;
    
    RAISE NOTICE 'Recreated v_profiles_organized view';
    RAISE NOTICE 'Phase 12: Views updated';
END $$;

-- ============================================================================
-- PHASE 13: MARK profile_preferences FOR DEPRECATION
-- ============================================================================

COMMENT ON TABLE profile_preferences IS 
'DEPRECATED: This table is scheduled for removal. 
Use user_preferences instead. 
Migration date: December 14, 2025
Removal scheduled: After 30-day verification period';

DO $$ BEGIN RAISE NOTICE 'Phase 13: profile_preferences marked for deprecation'; END $$;

-- ============================================================================
-- PHASE 14: LOG MIGRATION COMPLETION
-- ============================================================================

UPDATE _migration_log 
SET 
    completed_at = NOW(),
    status = 'completed',
    details = details || '{"phase": "completed"}'::JSONB
WHERE migration_name = 'profiles_system_redesign_v3'
AND status = 'running';

DO $$
BEGIN
    RAISE NOTICE '============================================';
    RAISE NOTICE 'MIGRATION COMPLETE';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Run verification queries to confirm success';
    RAISE NOTICE 'See profiles_backup_v3.sql for rollback procedures';
END $$;

COMMIT;

-- ============================================================================
-- POST-MIGRATION VERIFICATION QUERIES
-- ============================================================================

-- Run these queries AFTER the migration to verify success

/*
-- 1. Check no NULL auth_user_id (should return 0)
SELECT COUNT(*) as orphaned_profiles 
FROM profiles 
WHERE auth_user_id IS NULL;

-- 2. Verify phone migration
SELECT 
    (SELECT COUNT(*) FROM profiles WHERE phone_number IS NOT NULL) as profiles_with_phone,
    (SELECT COUNT(*) FROM contacts WHERE contact_type LIKE 'phone%') as contact_phones;

-- 3. Verify emergency contact migration
SELECT 
    (SELECT COUNT(*) FROM profiles WHERE emergency_contact_phone IS NOT NULL) as profiles_with_emergency,
    (SELECT COUNT(*) FROM contacts WHERE contact_type = 'phone-emergency') as contact_emergency;

-- 4. Verify preferences consolidation
SELECT 
    (SELECT COUNT(*) FROM profile_preferences) as old_prefs,
    (SELECT COUNT(*) FROM user_preferences) as new_prefs;

-- 5. Check new columns exist
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
AND column_name IN (
    'phone_verified', 'webauthn_enabled', 'sso_provider',
    'has_billing_access', 'profile_completeness_score',
    'utm_source', 'utm_medium', 'utm_campaign'
);

-- 6. Verify FK constraint
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'profiles'
AND constraint_name = 'profiles_auth_user_id_fkey';

-- 7. Check completeness scores calculated
SELECT 
    profile_completeness_score,
    COUNT(*) as profile_count
FROM profiles
WHERE is_active = true
GROUP BY profile_completeness_score
ORDER BY profile_completeness_score;
*/

-- ============================================================================
-- CLEANUP PHASE (Run after 30-day verification period)
-- ============================================================================

/*
-- DANGER: Only run after confirming migration success and updating all app code

-- Remove deprecated columns from profiles
ALTER TABLE profiles DROP COLUMN IF EXISTS phone_code;
ALTER TABLE profiles DROP COLUMN IF EXISTS phone_number;
ALTER TABLE profiles DROP COLUMN IF EXISTS phone_secondary_code;
ALTER TABLE profiles DROP COLUMN IF EXISTS phone_secondary_number;
ALTER TABLE profiles DROP COLUMN IF EXISTS emergency_contact_name;
ALTER TABLE profiles DROP COLUMN IF EXISTS emergency_contact_phone;
ALTER TABLE profiles DROP COLUMN IF EXISTS emergency_contact_relationship;
ALTER TABLE profiles DROP COLUMN IF EXISTS timezone;
ALTER TABLE profiles DROP COLUMN IF EXISTS date_format;
ALTER TABLE profiles DROP COLUMN IF EXISTS time_format;
ALTER TABLE profiles DROP COLUMN IF EXISTS preferred_locale;
ALTER TABLE profiles DROP COLUMN IF EXISTS dashboard_layout;

-- Drop deprecated table
DROP TABLE IF EXISTS profile_preferences;

-- Drop backup schema (after extended verification)
DROP SCHEMA IF EXISTS backup_profiles_v3 CASCADE;
*/