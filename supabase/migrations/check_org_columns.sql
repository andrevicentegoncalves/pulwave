-- ============================================================================
-- MIGRATION 005a: Fix organization_members to use profile_id
-- ============================================================================
-- Description: Standardizes organization_members to use profile_id (referencing
-- profiles.id) instead of user_id (referencing auth.users.id)
-- 
-- This ensures consistency across all tables and decouples from auth provider.
--
-- RUN THIS BEFORE migrations 006-012
-- ============================================================================

BEGIN;

-- ============================================================================
-- STEP 1: Pre-flight check - show current state
-- ============================================================================

SELECT 'Current organization_members structure:' AS status;

SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'organization_members'
ORDER BY ordinal_position;

-- Show current data
SELECT 
    'Current organization_members records' AS metric,
    COUNT(*) AS count
FROM organization_members;

-- ============================================================================
-- STEP 2: Add profile_id column (nullable initially)
-- ============================================================================

ALTER TABLE organization_members 
    ADD COLUMN IF NOT EXISTS profile_id UUID;

-- ============================================================================
-- STEP 3: Populate profile_id from user_id via profiles.auth_user_id
-- ============================================================================

DO $$
DECLARE
    v_has_user_id BOOLEAN;
BEGIN
    -- Check if user_id column exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'organization_members' 
        AND column_name = 'user_id'
    ) INTO v_has_user_id;
    
    IF v_has_user_id THEN
        -- Migrate data from user_id to profile_id
        UPDATE organization_members om
        SET profile_id = p.id
        FROM profiles p
        WHERE p.auth_user_id = om.user_id
        AND om.profile_id IS NULL;
        
        RAISE NOTICE 'Migrated user_id to profile_id for organization_members';
    ELSE
        RAISE NOTICE 'user_id column does not exist - skipping migration step';
    END IF;
END $$;

-- Check for any orphaned records (user_id with no matching profile)
DO $$
DECLARE
    v_orphan_count INTEGER;
    v_has_user_id BOOLEAN;
BEGIN
    -- Check if user_id column exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'organization_members' 
        AND column_name = 'user_id'
    ) INTO v_has_user_id;
    
    IF v_has_user_id THEN
        SELECT COUNT(*) INTO v_orphan_count
        FROM organization_members om
        WHERE om.profile_id IS NULL
        AND om.user_id IS NOT NULL;
        
        IF v_orphan_count > 0 THEN
            RAISE WARNING 'Found % organization_members records with user_id but no matching profile', v_orphan_count;
            RAISE NOTICE 'These will need manual review - listing them:';
        END IF;
    END IF;
END $$;

-- Show orphaned records if any (only if user_id exists)
DO $$
DECLARE
    v_has_user_id BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'organization_members' 
        AND column_name = 'user_id'
    ) INTO v_has_user_id;
    
    IF v_has_user_id THEN
        -- This will show results if there are orphaned records
        PERFORM om.id, om.organization_id, om.user_id, om.role
        FROM organization_members om
        WHERE om.profile_id IS NULL
        AND om.user_id IS NOT NULL;
    END IF;
END $$;

-- ============================================================================
-- STEP 4: Add FK constraint to profiles
-- ============================================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'organization_members_profile_id_fkey'
    ) THEN
        ALTER TABLE organization_members
            ADD CONSTRAINT organization_members_profile_id_fkey
            FOREIGN KEY (profile_id) REFERENCES profiles(id);
    END IF;
END $$;

-- ============================================================================
-- STEP 5: Create index on profile_id
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_organization_members_profile_id 
    ON organization_members(profile_id);

-- ============================================================================
-- STEP 6: Update unique constraint to use profile_id
-- ============================================================================

-- Drop old unique constraint
ALTER TABLE organization_members 
    DROP CONSTRAINT IF EXISTS organization_members_organization_id_user_id_key;

-- Create new unique constraint with profile_id
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'organization_members_organization_id_profile_id_key'
    ) THEN
        ALTER TABLE organization_members
            ADD CONSTRAINT organization_members_organization_id_profile_id_key 
            UNIQUE (organization_id, profile_id);
    END IF;
END $$;

-- ============================================================================
-- STEP 7: Make profile_id NOT NULL (after data migration)
-- ============================================================================

-- Only if all records have profile_id
DO $$
DECLARE
    v_null_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_null_count
    FROM organization_members
    WHERE profile_id IS NULL;
    
    IF v_null_count = 0 THEN
        ALTER TABLE organization_members ALTER COLUMN profile_id SET NOT NULL;
        RAISE NOTICE 'Set profile_id to NOT NULL';
    ELSE
        RAISE WARNING 'Cannot set profile_id to NOT NULL - % records have NULL values', v_null_count;
    END IF;
END $$;

COMMIT;

-- ============================================================================
-- STEP 8: Update RLS policies to use profile_id
-- ============================================================================

BEGIN;

-- Drop existing policies
DROP POLICY IF EXISTS "Manage organization members" ON organization_members;
DROP POLICY IF EXISTS "View organization members" ON organization_members;

-- Create new policies using profile_id
CREATE POLICY "Manage organization members"
    ON organization_members
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM organization_members om2
            JOIN profiles p ON p.id = om2.profile_id
            WHERE om2.organization_id = organization_members.organization_id
            AND p.auth_user_id = auth.uid()
            AND om2.role IN ('owner', 'admin')
            AND om2.is_active = TRUE
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM organization_members om2
            JOIN profiles p ON p.id = om2.profile_id
            WHERE om2.organization_id = organization_members.organization_id
            AND p.auth_user_id = auth.uid()
            AND om2.role IN ('owner', 'admin')
            AND om2.is_active = TRUE
        )
    );

CREATE POLICY "View organization members"
    ON organization_members
    FOR SELECT
    TO authenticated
    USING (
        -- Can view if you're a member of the same org
        EXISTS (
            SELECT 1 FROM organization_members om2
            JOIN profiles p ON p.id = om2.profile_id
            WHERE om2.organization_id = organization_members.organization_id
            AND p.auth_user_id = auth.uid()
            AND om2.is_active = TRUE
        )
        OR
        -- Or viewing your own membership
        profile_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid())
    );

COMMIT;

-- ============================================================================
-- STEP 9: Update helper functions to use profile_id
-- ============================================================================

BEGIN;

-- Helper: Check if user is org member (by profile_id)
CREATE OR REPLACE FUNCTION is_org_member(org_id UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 
        FROM organization_members om
        JOIN profiles p ON p.id = om.profile_id
        WHERE om.organization_id = org_id
        AND p.auth_user_id = auth.uid()
        AND om.is_active = TRUE
    );
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Helper: Check if user is org admin (by profile_id)
CREATE OR REPLACE FUNCTION is_org_admin(org_id UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 
        FROM organization_members om
        JOIN profiles p ON p.id = om.profile_id
        WHERE om.organization_id = org_id
        AND p.auth_user_id = auth.uid()
        AND om.role IN ('owner', 'admin')
        AND om.is_active = TRUE
    );
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Helper: Get user's role in an organization
CREATE OR REPLACE FUNCTION get_my_org_role(org_id UUID)
RETURNS TEXT AS $$
    SELECT om.role::TEXT
    FROM organization_members om
    JOIN profiles p ON p.id = om.profile_id
    WHERE om.organization_id = org_id
    AND p.auth_user_id = auth.uid()
    AND om.is_active = TRUE
    LIMIT 1;
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Helper: Get current user's profile_id
CREATE OR REPLACE FUNCTION get_current_profile_id()
RETURNS UUID AS $$
    SELECT id FROM profiles WHERE auth_user_id = auth.uid() LIMIT 1;
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Helper: Get profile's organization_id (for use in other migrations)
DROP FUNCTION IF EXISTS get_profile_org_id(uuid);
CREATE OR REPLACE FUNCTION get_profile_org_id(p_profile_id UUID)
RETURNS UUID AS $$
DECLARE
    v_org_id UUID;
BEGIN
    -- Now we can directly use profile_id!
    SELECT om.organization_id INTO v_org_id
    FROM organization_members om
    WHERE om.profile_id = p_profile_id
    AND om.is_active = TRUE
    ORDER BY 
        om.created_at ASC
    LIMIT 1;
    
    -- Fallback: get any active organization
    IF v_org_id IS NULL THEN
        SELECT id INTO v_org_id
        FROM organizations
        WHERE is_active = TRUE
        LIMIT 1;
    END IF;
    
    RETURN v_org_id;
END;
$$ LANGUAGE plpgsql STABLE;

-- Helper: Get all organizations for a profile
DROP FUNCTION IF EXISTS get_profile_organizations(uuid);
CREATE OR REPLACE FUNCTION get_profile_organizations(p_profile_id UUID)
RETURNS TABLE (
    organization_id UUID,
    organization_name TEXT,
    role org_member_role,
    is_primary BOOLEAN,
    is_personal_org BOOLEAN
) AS $$
    SELECT 
        o.id,
        o.name,
        om.role,
        FALSE,
        FALSE
    FROM organization_members om
    JOIN organizations o ON o.id = om.organization_id
    WHERE om.profile_id = p_profile_id
    AND om.is_active = TRUE
    AND o.is_active = TRUE
    ORDER BY o.name;
$$ LANGUAGE SQL STABLE;

COMMIT;

-- ============================================================================
-- STEP 10: Drop old user_id column (OPTIONAL - run after verification)
-- ============================================================================

/*
-- WARNING: Cannot run this yet!
-- The user_id column is referenced by many RLS policies on other tables.
-- You must update ALL dependent policies to use profile_id before dropping this column.
-- See the error log for a full list of dependent policies.

BEGIN;

-- Drop old index
DROP INDEX IF EXISTS organization_members_organization_id_user_id_key;

-- Drop old FK constraint (if exists)
ALTER TABLE organization_members 
    DROP CONSTRAINT IF EXISTS organization_members_user_id_fkey;

-- Drop old column
ALTER TABLE organization_members DROP COLUMN IF EXISTS user_id;

COMMIT;

SELECT '✅ user_id column removed from organization_members' AS status;
*/

-- ============================================================================
-- Verification
-- ============================================================================

SELECT '=== Migration 005a Complete ===' AS status;

-- Show updated structure (Logical Order)
SELECT 
    column_name,
    data_type,
    is_nullable,
    ordinal_position
FROM information_schema.columns
WHERE table_name = 'organization_members'
ORDER BY 
    CASE 
        WHEN column_name = 'id' THEN 1
        WHEN column_name = 'organization_id' THEN 2
        WHEN column_name = 'profile_id' THEN 3
        WHEN column_name = 'user_id' THEN 4
        WHEN column_name = 'role' THEN 5
        WHEN column_name = 'is_active' THEN 6
        WHEN column_name LIKE '%created%' THEN 90
        WHEN column_name LIKE '%updated%' THEN 91
        ELSE 50
    END;

-- Check data migration
DO $$
DECLARE
    v_has_user_id BOOLEAN;
BEGIN
    -- Check if user_id column still exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'organization_members' 
        AND column_name = 'user_id'
    ) INTO v_has_user_id;
    
    IF v_has_user_id THEN
        -- Show both columns if user_id still exists
        RAISE NOTICE 'Data migration status:';
        PERFORM COUNT(*) FILTER (WHERE profile_id IS NOT NULL) FROM organization_members;
        PERFORM COUNT(*) FILTER (WHERE user_id IS NOT NULL) FROM organization_members;
    ELSE
        -- Only show profile_id if user_id was dropped
        RAISE NOTICE 'user_id column has been dropped';
    END IF;
END $$;

SELECT 
    'Records with profile_id' AS metric,
    COUNT(*) FILTER (WHERE profile_id IS NOT NULL) AS with_profile_id,
    COUNT(*) AS total
FROM organization_members;

-- Show sample data
SELECT 
    om.id,
    om.organization_id,
    om.profile_id,
    om.role,
    om.is_active,
    om.created_at,
    om.updated_at
FROM organization_members om
LIMIT 5;

SELECT '✅ organization_members now uses profile_id!' AS next_step;
SELECT 'Run the DROP COLUMN block after verifying all is correct' AS note;
