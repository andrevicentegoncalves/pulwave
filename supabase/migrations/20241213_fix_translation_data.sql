-- Fix translations page data issues
-- 1. Ensure supported_locales has active records
-- 2. Ensure get_database_enums RPC function exists and returns proper format

-- ========= STEP 1: Fix supported_locales =========
-- First, check if table exists and has data
DO $$
BEGIN
    -- Insert default locales if none exist
    IF NOT EXISTS (SELECT 1 FROM supported_locales WHERE is_active = true) THEN
        INSERT INTO supported_locales (locale, name, native_name, is_active, display_order) VALUES
            ('en-US', 'English (US)', 'English', true, 1),
            ('en-GB', 'English (UK)', 'English', true, 2),
            ('pt-PT', 'Portuguese (Portugal)', 'Português', true, 3),
            ('pt-BR', 'Portuguese (Brazil)', 'Português', true, 4),
            ('es-ES', 'Spanish (Spain)', 'Español', true, 5),
            ('fr-FR', 'French (France)', 'Français', true, 6),
            ('de-DE', 'German (Germany)', 'Deutsch', true, 7)
        ON CONFLICT (locale) DO UPDATE SET is_active = true;
        
        RAISE NOTICE 'Inserted default supported locales';
    ELSE
        RAISE NOTICE 'Supported locales already exist';
    END IF;
END $$;

-- ========= STEP 2: Create/Update get_database_enums RPC function =========
-- This function returns all enum types and their values from pg_enum
CREATE OR REPLACE FUNCTION get_database_enums()
RETURNS TABLE(enum_name text, enum_value text) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.typname::text as enum_name,
        e.enumlabel::text as enum_value
    FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = 'public'
    ORDER BY t.typname, e.enumsortorder;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION get_database_enums() TO authenticated;

-- ========= STEP 3: Verify TRANSLATABLE_COLUMNS has all tables =========
-- Update to include addresses if missing
UPDATE system_settings 
SET setting_value = '{
  "profiles": ["user_type", "license_state", "bio", "about_me", "professional_title", "company_name"],
  "subscription_plans": ["plan_name", "description", "features"],
  "countries": ["name", "official_name"],
  "addresses": ["address_label", "street_address", "city", "postal_code"]
}'
WHERE setting_key = 'TRANSLATABLE_COLUMNS';

-- ========= Verification Queries =========
-- Run these to verify fixes
SELECT 'Supported Locales' as check_type, COUNT(*) as count FROM supported_locales WHERE is_active = true;
SELECT 'Database Enums' as check_type, COUNT(*) as count FROM get_database_enums();
SELECT setting_key, setting_value FROM system_settings WHERE setting_key IN ('TRANSLATABLE_TABLES', 'TRANSLATABLE_COLUMNS');
