-- ============================================================================
-- MIGRATION 005e: Reorganize organization_members columns
-- ============================================================================
-- Description: Recreates organization_members table with columns in logical order
-- (IDs first, then data columns, then audit columns at the end)
-- ============================================================================

BEGIN;

-- Step 1: Rename existing table
ALTER TABLE organization_members RENAME TO organization_members_old;

-- Step 2: Create new table with proper column order
CREATE TABLE organization_members (
    -- Primary identifiers
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    profile_id UUID NOT NULL REFERENCES profiles(id),
    
    -- Data columns
    role org_member_role NOT NULL DEFAULT 'viewer',
    is_active BOOLEAN DEFAULT true,
    joined_at TIMESTAMPTZ DEFAULT now(),
    
    -- Audit columns
    created_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID REFERENCES auth.users(id),
    updated_at TIMESTAMPTZ DEFAULT now(),
    updated_by UUID REFERENCES auth.users(id)
);

-- Step 3: Copy data from old table
INSERT INTO organization_members (
    id,
    organization_id,
    profile_id,
    role,
    is_active,
    joined_at,
    created_at,
    created_by,
    updated_at,
    updated_by
)
SELECT 
    id,
    organization_id,
    profile_id,
    role,
    is_active,
    joined_at,
    created_at,
    created_by,
    updated_at,
    updated_by
FROM organization_members_old;

-- Step 4: Recreate constraints and indexes
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

CREATE INDEX IF NOT EXISTS idx_organization_members_profile_id 
    ON organization_members(profile_id);

CREATE INDEX IF NOT EXISTS idx_organization_members_organization_id 
    ON organization_members(organization_id);

-- Step 5: Recreate RLS policies
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;

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
        EXISTS (
            SELECT 1 FROM organization_members om2
            JOIN profiles p ON p.id = om2.profile_id
            WHERE om2.organization_id = organization_members.organization_id
            AND p.auth_user_id = auth.uid()
            AND om2.is_active = TRUE
        )
        OR
        profile_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid())
    );

-- Step 6: Drop old table (CASCADE will drop the policies that got attached to it)
DROP TABLE organization_members_old CASCADE;

COMMIT;

-- Verification
SELECT 
    column_name,
    data_type,
    is_nullable,
    ordinal_position
FROM information_schema.columns
WHERE table_name = 'organization_members'
ORDER BY ordinal_position;

SELECT '✅ organization_members table reorganized successfully' AS status;
