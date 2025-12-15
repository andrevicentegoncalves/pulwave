-- ============================================================================
-- PulWave Profiles System - Rollback Script
-- ============================================================================
-- Version: 3.0.0
-- Date: December 14, 2025
-- 
-- USE THIS SCRIPT IF MIGRATION FAILS OR NEEDS TO BE REVERTED
-- REQUIRES: backup_profiles_v3 schema from profiles_backup_v3.sql
-- ============================================================================

-- ============================================================================
-- SAFETY CHECK
-- ============================================================================

DO $$
BEGIN
    -- Verify backup exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.schemata 
        WHERE schema_name = 'backup_profiles_v3'
    ) THEN
        RAISE EXCEPTION 'Backup schema backup_profiles_v3 not found! Cannot rollback.';
    END IF;
    
    -- Verify backup tables exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'backup_profiles_v3' 
        AND table_name = 'profiles'
    ) THEN
        RAISE EXCEPTION 'Backup table backup_profiles_v3.profiles not found!';
    END IF;
    
    RAISE NOTICE 'Backup schema verified. Proceeding with rollback...';
END $$;

BEGIN;

-- ============================================================================
-- PHASE 1: LOG ROLLBACK START
-- ============================================================================

INSERT INTO _migration_log (migration_name, version, status, details)
VALUES (
    'profiles_system_redesign_v3_ROLLBACK', 
    '3.0.0',
    'running',
    '{"action": "rollback", "reason": "manual_trigger"}'::JSONB
);

-- ============================================================================
-- PHASE 2: REMOVE NEW COLUMNS FROM PROFILES
-- ============================================================================

DO $$ BEGIN RAISE NOTICE 'Phase 2: Removing new columns from profiles...'; END $$;

-- Drop new columns (reverse of what migration added)
ALTER TABLE profiles DROP COLUMN IF EXISTS phone_verified CASCADE;
ALTER TABLE profiles DROP COLUMN IF EXISTS phone_verified_at CASCADE;
ALTER TABLE profiles DROP COLUMN IF EXISTS webauthn_enabled CASCADE;
ALTER TABLE profiles DROP COLUMN IF EXISTS webauthn_registered_at CASCADE;
ALTER TABLE profiles DROP COLUMN IF EXISTS sso_provider CASCADE;
ALTER TABLE profiles DROP COLUMN IF EXISTS sso_provider_id CASCADE;
ALTER TABLE profiles DROP COLUMN IF EXISTS has_billing_access CASCADE;
ALTER TABLE profiles DROP COLUMN IF EXISTS stripe_customer_id CASCADE;
ALTER TABLE profiles DROP COLUMN IF EXISTS utm_source CASCADE;
ALTER TABLE profiles DROP COLUMN IF EXISTS utm_medium CASCADE;
ALTER TABLE profiles DROP COLUMN IF EXISTS utm_campaign CASCADE;
ALTER TABLE profiles DROP COLUMN IF EXISTS referral_code CASCADE;
ALTER TABLE profiles DROP COLUMN IF EXISTS referred_by CASCADE;
ALTER TABLE profiles DROP COLUMN IF EXISTS profile_completeness_score CASCADE;
ALTER TABLE profiles DROP COLUMN IF EXISTS country_of_residence CASCADE;
ALTER TABLE profiles DROP COLUMN IF EXISTS tax_identification_type CASCADE;

DO $$ BEGIN RAISE NOTICE 'New columns removed from profiles'; END $$;

-- ============================================================================
-- PHASE 3: RESTORE PROFILE DATA
-- ============================================================================

DO $$ BEGIN RAISE NOTICE 'Phase 3: Restoring profile data from backup...'; END $$;

-- Restore phone and emergency contact columns if they were dropped
DO $$
BEGIN
    -- Re-add columns if they don't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'phone_code'
    ) THEN
        ALTER TABLE profiles ADD COLUMN phone_code TEXT;
        ALTER TABLE profiles ADD COLUMN phone_number TEXT;
        ALTER TABLE profiles ADD COLUMN phone_secondary_code TEXT;
        ALTER TABLE profiles ADD COLUMN phone_secondary_number TEXT;
        ALTER TABLE profiles ADD COLUMN emergency_contact_name TEXT;
        ALTER TABLE profiles ADD COLUMN emergency_contact_phone TEXT;
        ALTER TABLE profiles ADD COLUMN emergency_contact_relationship TEXT;
    END IF;
    
    -- Re-add preference columns if they don't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'timezone'
    ) THEN
        ALTER TABLE profiles ADD COLUMN timezone TEXT DEFAULT 'UTC';
        ALTER TABLE profiles ADD COLUMN date_format TEXT DEFAULT 'YYYY-MM-DD';
        ALTER TABLE profiles ADD COLUMN time_format TEXT DEFAULT '24h';
        ALTER TABLE profiles ADD COLUMN preferred_locale TEXT DEFAULT 'en-US';
        ALTER TABLE profiles ADD COLUMN dashboard_layout JSONB DEFAULT '{}'::JSONB;
    END IF;
END $$;

-- Restore data from backup
UPDATE profiles p
SET 
    phone_code = bp.phone_code,
    phone_number = bp.phone_number,
    phone_secondary_code = bp.phone_secondary_code,
    phone_secondary_number = bp.phone_secondary_number,
    emergency_contact_name = bp.emergency_contact_name,
    emergency_contact_phone = bp.emergency_contact_phone,
    emergency_contact_relationship = bp.emergency_contact_relationship,
    timezone = bp.timezone,
    date_format = bp.date_format,
    time_format = bp.time_format,
    preferred_locale = bp.preferred_locale,
    dashboard_layout = bp.dashboard_layout
FROM backup_profiles_v3.profiles bp
WHERE p.id = bp.id;

DO $$ BEGIN RAISE NOTICE 'Profile data restored from backup'; END $$;

-- ============================================================================
-- PHASE 4: RESTORE CONTACTS (Remove migrated entries)
-- ============================================================================

DO $$ BEGIN RAISE NOTICE 'Phase 4: Cleaning up migrated contacts...'; END $$;

-- Delete contacts that were created by migration
DELETE FROM contacts 
WHERE created_at > (
    SELECT captured_at 
    FROM backup_profiles_v3._migration_state 
    WHERE metric_name = 'profiles_total'
    LIMIT 1
)
AND contact_type IN ('phone-primary', 'phone-secondary', 'phone-emergency');

-- Restore original contacts state
-- Note: This is conservative - only removes migration-created entries

DO $$ BEGIN RAISE NOTICE 'Migrated contacts cleaned up'; END $$;

-- ============================================================================
-- PHASE 5: RESTORE USER_PREFERENCES
-- ============================================================================

DO $$ BEGIN RAISE NOTICE 'Phase 5: Restoring user_preferences...'; END $$;

-- Remove columns added by migration
ALTER TABLE user_preferences DROP COLUMN IF EXISTS ui_layout CASCADE;
ALTER TABLE user_preferences DROP COLUMN IF EXISTS data_processing_consent CASCADE;
ALTER TABLE user_preferences DROP COLUMN IF EXISTS marketing_consent CASCADE;
ALTER TABLE user_preferences DROP COLUMN IF EXISTS analytics_consent CASCADE;
ALTER TABLE user_preferences DROP COLUMN IF EXISTS activity_status_visible CASCADE;

DO $$ BEGIN RAISE NOTICE 'user_preferences restored'; END $$;

-- ============================================================================
-- PHASE 6: RESTORE FK CONSTRAINTS
-- ============================================================================

DO $$ BEGIN RAISE NOTICE 'Phase 6: Reverting FK constraints...'; END $$;

-- Remove NOT NULL from auth_user_id if it was added
ALTER TABLE profiles ALTER COLUMN auth_user_id DROP NOT NULL;

-- Remove FK to auth.users if it was added
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_auth_user_id_fkey;

DO $$ BEGIN RAISE NOTICE 'FK constraints reverted'; END $$;

-- ============================================================================
-- PHASE 7: RESTORE INDEXES
-- ============================================================================

DO $$ BEGIN RAISE NOTICE 'Phase 7: Removing migration indexes...'; END $$;

DROP INDEX IF EXISTS idx_profiles_referred_by;
DROP INDEX IF EXISTS idx_profiles_sso_provider;
DROP INDEX IF EXISTS idx_profiles_stripe_customer;
DROP INDEX IF EXISTS idx_profiles_completeness;

DO $$ BEGIN RAISE NOTICE 'Migration indexes removed'; END $$;

-- ============================================================================
-- PHASE 8: RESTORE TRIGGER
-- ============================================================================

DO $$ BEGIN RAISE NOTICE 'Phase 8: Removing completeness trigger...'; END $$;

DROP TRIGGER IF EXISTS trg_calculate_completeness ON profiles;
DROP FUNCTION IF EXISTS calculate_profile_completeness();

DO $$ BEGIN RAISE NOTICE 'Completeness trigger removed'; END $$;

-- ============================================================================
-- PHASE 9: RESTORE VIEW
-- ============================================================================

DO $$ BEGIN RAISE NOTICE 'Phase 9: Restoring original view...'; END $$;

DROP VIEW IF EXISTS v_profiles_organized CASCADE;

-- Recreate original view structure
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
    p.phone_number,
    p.phone_code,
    p.emergency_contact_name,
    p.emergency_contact_phone,
    p.timezone,
    p.date_format,
    p.time_format,
    p.preferred_locale,
    p.dashboard_layout,
    p.last_activity_at,
    p.login_count,
    p.last_active_organization_id,
    p.created_at,
    p.updated_at
FROM profiles p
WHERE p.is_deleted = false OR p.is_deleted IS NULL;

DO $$ BEGIN RAISE NOTICE 'Original view restored'; END $$;

-- ============================================================================
-- PHASE 10: REMOVE DEPRECATION NOTICE FROM profile_preferences
-- ============================================================================

COMMENT ON TABLE profile_preferences IS 
'User preferences per organization. Contains theme, locale, notification settings.';

-- ============================================================================
-- PHASE 11: LOG ROLLBACK COMPLETION
-- ============================================================================

UPDATE _migration_log 
SET 
    completed_at = NOW(),
    status = 'completed',
    details = details || '{"action": "rollback_completed"}'::JSONB
WHERE migration_name = 'profiles_system_redesign_v3_ROLLBACK'
AND status = 'running';

DO $$
BEGIN
    RAISE NOTICE '============================================';
    RAISE NOTICE 'ROLLBACK COMPLETE';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Database restored to pre-migration state';
    RAISE NOTICE 'Verify application functionality';
END $$;

COMMIT;

-- ============================================================================
-- POST-ROLLBACK VERIFICATION
-- ============================================================================

/*
-- Run these to verify rollback success

-- 1. Check phone columns restored
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN ('phone_number', 'phone_code', 'emergency_contact_phone');

-- 2. Check new columns removed
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN ('phone_verified', 'webauthn_enabled', 'sso_provider');
-- Should return 0 rows

-- 3. Compare row counts to backup
SELECT 
    'profiles' as table_name,
    (SELECT COUNT(*) FROM profiles) as current_count,
    (SELECT COUNT(*) FROM backup_profiles_v3.profiles) as backup_count

UNION ALL

SELECT 
    'contacts',
    (SELECT COUNT(*) FROM contacts),
    (SELECT COUNT(*) FROM backup_profiles_v3.contacts);

-- 4. Verify auth_user_id is nullable again
SELECT is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name = 'auth_user_id';
-- Should return 'YES'
*/

-- ============================================================================
-- OPTIONAL: Full restore from backup (DANGER)
-- ============================================================================

/*
-- DANGER: This will completely replace current data with backup!
-- Only use if the above rollback is insufficient.

TRUNCATE profiles CASCADE;
INSERT INTO profiles SELECT * FROM backup_profiles_v3.profiles;

TRUNCATE user_preferences CASCADE;
INSERT INTO user_preferences SELECT * FROM backup_profiles_v3.user_preferences;

TRUNCATE profile_preferences CASCADE;
INSERT INTO profile_preferences SELECT * FROM backup_profiles_v3.profile_preferences;

TRUNCATE contacts CASCADE;
INSERT INTO contacts SELECT * FROM backup_profiles_v3.contacts;
*/