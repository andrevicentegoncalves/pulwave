-- ============================================================================
-- CLEANUP SCRIPT - Run this to reset before trying migration again
-- WARNING: This will drop all new tables created by the migration!
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'CLEANING UP PARTIAL MIGRATION...';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    
    -- Drop all new tables if they exist
    DROP TABLE IF EXISTS user_suspensions CASCADE;
    DROP TABLE IF EXISTS user_onboarding CASCADE;
    DROP TABLE IF EXISTS user_security_log CASCADE;
    DROP TABLE IF EXISTS compliance_consents CASCADE;
    DROP TABLE IF EXISTS verification_records CASCADE;
    DROP TABLE IF EXISTS social_profiles CASCADE;
    DROP TABLE IF EXISTS professional_profiles CASCADE;
    DROP TABLE IF EXISTS user_preferences CASCADE;
    DROP TABLE IF EXISTS contacts CASCADE;
    
    RAISE NOTICE '✓ Dropped all new tables (if they existed)';
    
    -- If profiles table was already modified, restore from backup
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles_backup_pre_normalization') THEN
        -- Check if current profiles is the simplified version
        DECLARE
            col_count INTEGER;
        BEGIN
            SELECT COUNT(*) INTO col_count
            FROM information_schema.columns 
            WHERE table_name = 'profiles';
            
            IF col_count < 30 THEN
                -- Looks like profiles was already simplified, restore from backup
                DROP TABLE IF EXISTS profiles CASCADE;
                
                ALTER TABLE profiles_backup_pre_normalization RENAME TO profiles;
                
                RAISE NOTICE '✓ Restored profiles from backup';
            ELSE
                -- Profiles still has all columns, just drop backup
                DROP TABLE IF EXISTS profiles_backup_pre_normalization;
                RAISE NOTICE '✓ Profiles unchanged, dropped backup';
            END IF;
        END;
    ELSE
        RAISE NOTICE '  No backup found, profiles table unchanged';
    END IF;
    
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ CLEANUP COMPLETE!';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE 'Database is now in clean state.';
    RAISE NOTICE 'You can run the migration from scratch.';
END $$;
