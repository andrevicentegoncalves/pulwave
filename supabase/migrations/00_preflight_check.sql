-- ============================================================================
-- PROFILES NORMALIZATION - SAFE STEP-BY-STEP VERSION
-- Run this to check dependencies before the main migration
-- ============================================================================

-- ============================================================================
-- STEP 0: PRE-FLIGHT CHECKS
-- ============================================================================

DO $$
DECLARE
    missing_enums TEXT[] := ARRAY[]::TEXT[];
    missing_functions TEXT[] := ARRAY[]::TEXT[];
    profiles_exists BOOLEAN;
    backup_exists BOOLEAN;
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'PRE-FLIGHT CHECKS';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    
    -- Check for profiles table
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'profiles'
    ) INTO profiles_exists;
    
    IF profiles_exists THEN
        RAISE NOTICE '✓ profiles table exists';
    ELSE
        RAISE EXCEPTION '✗ profiles table does NOT exist! Cannot proceed with normalization.';
    END IF;
    
    -- Check for backup
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'profiles_backup_pre_normalization'
    ) INTO backup_exists;
    
    IF backup_exists THEN
        RAISE NOTICE '✓ profiles_backup_pre_normalization already exists';
    ELSE
        RAISE NOTICE '  profiles_backup_pre_normalization will be created';
    END IF;
    
    -- Check required enums
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_type') THEN
        missing_enums := array_append(missing_enums, 'user_type');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'contact_method') THEN
        missing_enums := array_append(missing_enums, 'contact_method');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'profile_visibility') THEN
        missing_enums := array_append(missing_enums, 'profile_visibility');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'theme_preference') THEN
        missing_enums := array_append(missing_enums, 'theme_preference');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'verification_type') THEN
        missing_enums := array_append(missing_enums, 'verification_type');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'verification_status') THEN
        missing_enums := array_append(missing_enums, 'verification_status');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'consent_type') THEN
        missing_enums := array_append(missing_enums, 'consent_type');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'suspension_reason') THEN
        missing_enums := array_append(missing_enums, 'suspension_reason');
    END IF;
    
    IF array_length(missing_enums, 1) > 0 THEN
        RAISE EXCEPTION '✗ Missing required ENUMs: %. Please create these enums first!', array_to_string(missing_enums, ', ');
    ELSE
        RAISE NOTICE '✓ All required ENUMs exist';
    END IF;
    
    -- Check for update_timestamp function
    IF NOT EXISTS (
        SELECT 1 FROM pg_proc 
        WHERE proname = 'update_timestamp'
    ) THEN
        RAISE EXCEPTION '✗ Missing update_timestamp() function. Please create it first!';
    ELSE
        RAISE NOTICE '✓ update_timestamp() function exists';
    END IF;
    
    -- Check for addresses table (referenced by FK)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'addresses'
    ) THEN
        RAISE WARNING '⚠ addresses table does NOT exist. FK constraints to addresses will fail!';
    ELSE
        RAISE NOTICE '✓ addresses table exists';
    END IF;
    
    -- Check for organizations table (referenced by FK)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'organizations'
    ) THEN
        RAISE WARNING '⚠ organizations table does NOT exist. FK constraints to organizations will fail!';
    ELSE
        RAISE NOTICE '✓ organizations table exists';
    END IF;
    
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ PRE-FLIGHT CHECKS PASSED!';
    RAISE NOTICE '========================================';
END $$;
