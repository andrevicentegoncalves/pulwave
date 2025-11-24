-- ============================================================================
-- STEP-BY-STEP DIAGNOSTIC - Find the exact error
-- Run this to see what's currently in your database
-- ============================================================================

-- 1. Check if profiles exists and what columns it has
DO $$
DECLARE
    col_count INTEGER;
    cols TEXT;
BEGIN
    SELECT COUNT(*), string_agg(column_name, ', ' ORDER BY ordinal_position)
    INTO col_count, cols
    FROM information_schema.columns 
    WHERE table_name = 'profiles';
    
    IF col_count > 0 THEN
        RAISE NOTICE 'profiles table has % columns:', col_count;
        RAISE NOTICE '%', cols;
    ELSE
        RAISE NOTICE 'profiles table does NOT exist';
    END IF;
END $$;

-- 2. Check if backup exists
DO $$
DECLARE
    backup_exists BOOLEAN;
    backup_cols TEXT;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'profiles_backup_pre_normalization'
    ) INTO backup_exists;
    
    IF backup_exists THEN
        SELECT string_agg(column_name, ', ' ORDER BY ordinal_position)
        INTO backup_cols
        FROM information_schema.columns 
        WHERE table_name = 'profiles_backup_pre_normalization';
        
        RAISE NOTICE 'backup table EXISTS with columns:';
        RAISE NOTICE '%', backup_cols;
    ELSE
        RAISE NOTICE 'backup table does NOT exist';
    END IF;
END $$;

-- 3. Check what new tables already exist
DO $$
DECLARE
    tables_found TEXT[];
BEGIN
    SELECT array_agg(table_name ORDER BY table_name)
    INTO tables_found
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN (
        'contacts',
        'professional_profiles',
        'social_profiles',
        'verification_records',
        'user_preferences',
        'compliance_consents',
        'user_security_log',
        'user_onboarding',
        'user_suspensions'
    );
    
    IF tables_found IS NOT NULL THEN
        RAISE NOTICE 'These new tables already exist: %', array_to_string(tables_found, ', ');
    ELSE
        RAISE NOTICE 'No new tables exist yet';
    END IF;
END $$;

-- 4. If user_preferences exists, check its structure
DO $$
DECLARE
    up_exists BOOLEAN;
    up_cols TEXT;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'user_preferences'
    ) INTO up_exists;
    
    IF up_exists THEN
        SELECT string_agg(column_name, ', ' ORDER BY ordinal_position)
        INTO up_cols
        FROM information_schema.columns 
        WHERE table_name = 'user_preferences';
        
        RAISE NOTICE 'user_preferences columns: %', up_cols;
    END IF;
END $$;
