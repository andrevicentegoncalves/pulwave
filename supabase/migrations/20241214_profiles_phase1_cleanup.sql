-- ============================================================================
-- Migration: Profiles Phase 1 - Remove Legacy Columns
-- Date: 2024-12-14
-- Description: Remove 13 deprecated columns that have been migrated to other
--              tables (contacts, user_preferences) or are duplicates
-- ============================================================================

BEGIN;

-- ============================================================================
-- PHASE 1: REMOVE CONTACT FIELDS (Now in contacts table)
-- ============================================================================

ALTER TABLE profiles DROP COLUMN IF EXISTS phone_code;
ALTER TABLE profiles DROP COLUMN IF EXISTS phone_number;
ALTER TABLE profiles DROP COLUMN IF EXISTS phone_secondary_code;
ALTER TABLE profiles DROP COLUMN IF EXISTS phone_secondary_number;
ALTER TABLE profiles DROP COLUMN IF EXISTS emergency_contact_name;
ALTER TABLE profiles DROP COLUMN IF EXISTS emergency_contact_phone;
ALTER TABLE profiles DROP COLUMN IF EXISTS emergency_contact_relationship;

-- ============================================================================
-- PHASE 2: REMOVE PREFERENCE FIELDS (Now in user_preferences table)
-- ============================================================================

ALTER TABLE profiles DROP COLUMN IF EXISTS preferred_locale;
ALTER TABLE profiles DROP COLUMN IF EXISTS timezone;
ALTER TABLE profiles DROP COLUMN IF EXISTS date_format;
ALTER TABLE profiles DROP COLUMN IF EXISTS time_format;

-- ============================================================================
-- PHASE 3: REMOVE DEPRECATED FIELDS
-- ============================================================================

-- user_type: Now in professional_profiles
ALTER TABLE profiles DROP COLUMN IF EXISTS user_type;

-- email_verified: Use auth.users.email_confirmed_at instead
ALTER TABLE profiles DROP COLUMN IF EXISTS email_verified;

-- ============================================================================
-- PHASE 4: ADD TRANSLATIONS IF MISSING
-- ============================================================================

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'translations'
    ) THEN
        ALTER TABLE profiles ADD COLUMN translations JSONB DEFAULT '{}'::JSONB;
    END IF;
END $$;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Check columns removed:
-- SELECT column_name FROM information_schema.columns 
-- WHERE table_name = 'profiles' 
--   AND column_name IN (
--     'phone_code', 'phone_number', 'phone_secondary_code', 'phone_secondary_number',
--     'emergency_contact_name', 'emergency_contact_phone', 'emergency_contact_relationship',
--     'preferred_locale', 'timezone', 'date_format', 'time_format',
--     'user_type', 'email_verified'
--   );
-- Should return 0 rows

-- Count remaining columns:
-- SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'profiles';
-- Should be ~31

COMMIT;
