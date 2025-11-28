-- ============================================================================
-- Verification before dropping user_id column
-- ============================================================================
-- Run this to verify everything is ready before dropping user_id
-- ============================================================================

SELECT '=== PRE-DROP VERIFICATION ===' AS status;

-- 1. Check if user_id column exists
SELECT 
    'user_id column exists' AS check_name,
    EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'organization_members' 
        AND column_name = 'user_id'
    ) AS result;

-- 2. Check all records have profile_id
SELECT 
    'All records have profile_id' AS check_name,
    COUNT(*) = COUNT(*) FILTER (WHERE profile_id IS NOT NULL) AS result,
    COUNT(*) AS total_records,
    COUNT(*) FILTER (WHERE profile_id IS NOT NULL) AS with_profile_id,
    COUNT(*) FILTER (WHERE profile_id IS NULL) AS missing_profile_id
FROM organization_members;

-- 3. Check for orphaned user_id records (if column exists)
DO $$
DECLARE
    v_has_user_id BOOLEAN;
    v_orphan_count INTEGER := 0;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'organization_members' 
        AND column_name = 'user_id'
    ) INTO v_has_user_id;
    
    IF v_has_user_id THEN
        SELECT COUNT(*) INTO v_orphan_count
        FROM organization_members
        WHERE user_id IS NOT NULL 
        AND profile_id IS NULL;
        
        IF v_orphan_count > 0 THEN
            RAISE WARNING 'Found % records with user_id but no profile_id - DO NOT DROP YET!', v_orphan_count;
        ELSE
            RAISE NOTICE 'All user_id records have been migrated to profile_id ✓';
        END IF;
    ELSE
        RAISE NOTICE 'user_id column already dropped';
    END IF;
END $$;

-- 4. Check profile_id constraint exists
SELECT 
    'profile_id FK constraint exists' AS check_name,
    EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'organization_members_profile_id_fkey'
    ) AS result;

-- 5. Check profile_id unique constraint exists
SELECT 
    'profile_id unique constraint exists' AS check_name,
    EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'organization_members_organization_id_profile_id_key'
    ) AS result;

-- 6. Sample data check
SELECT 
    'Sample organization_members' AS info,
    om.id,
    om.organization_id,
    om.profile_id,
    p.email AS profile_email,
    om.role,
    om.is_active
FROM organization_members om
LEFT JOIN profiles p ON p.id = om.profile_id
LIMIT 5;

SELECT '=== VERIFICATION COMPLETE ===' AS status;
SELECT 'If all checks pass, you can safely run drop_old_userid.sql' AS next_step;
