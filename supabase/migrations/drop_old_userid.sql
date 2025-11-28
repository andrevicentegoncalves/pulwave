-- ============================================================================
-- MIGRATION 005c: Drop old user_id column
-- ============================================================================
-- Description: Drops the user_id column from organization_members now that
-- all policies have been updated to use profile_id.
-- ============================================================================

BEGIN;

-- 1. Drop the unique constraint/index on (organization_id, user_id)
DROP INDEX IF EXISTS organization_members_organization_id_user_id_key;

-- 2. Drop the foreign key constraint to auth.users
ALTER TABLE organization_members 
    DROP CONSTRAINT IF EXISTS organization_members_user_id_fkey;

-- 3. Drop the user_id column
ALTER TABLE organization_members 
    DROP COLUMN IF EXISTS user_id;

COMMIT;

-- Verification
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'organization_members'
ORDER BY ordinal_position;

SELECT '✅ user_id column successfully removed' AS status;
