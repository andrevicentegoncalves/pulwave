-- ============================================================================
-- Migration: Create Role-Permissions Junction Table
-- Date: 2024-12-14
-- Description: Links app_role and org_member_role to permissions for RBAC
-- ============================================================================

BEGIN;

-- ============================================================================
-- CREATE role_permissions TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Role Reference
    role_type VARCHAR(20) NOT NULL,  -- 'app' or 'org'
    role_value VARCHAR(50) NOT NULL, -- 'admin', 'owner', 'member', etc.
    
    -- Permission Reference
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    
    -- Metadata
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    granted_by UUID REFERENCES profiles(id),
    
    -- Unique constraint
    UNIQUE(role_type, role_value, permission_id)
);

-- ============================================================================
-- SEED DEFAULT PERMISSIONS
-- ============================================================================

-- Super Admin gets all permissions
INSERT INTO role_permissions (role_type, role_value, permission_id)
SELECT 'app', 'super_admin', id FROM permissions WHERE is_active = true
ON CONFLICT DO NOTHING;

-- Admin gets most permissions (except manage_roles)
INSERT INTO role_permissions (role_type, role_value, permission_id)
SELECT 'app', 'admin', id FROM permissions 
WHERE is_active = true AND permission_name NOT IN ('manage_roles')
ON CONFLICT DO NOTHING;

-- Org Owner gets org-level permissions
INSERT INTO role_permissions (role_type, role_value, permission_id)
SELECT 'org', 'owner', id FROM permissions 
WHERE is_active = true AND permission_category IN ('Users', 'Settings')
ON CONFLICT DO NOTHING;

-- Org Admin
INSERT INTO role_permissions (role_type, role_value, permission_id)
SELECT 'org', 'admin', id FROM permissions 
WHERE is_active = true AND permission_name IN ('view_users', 'edit_users', 'view_settings')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_role_permissions_role ON role_permissions(role_type, role_value);
CREATE INDEX idx_role_permissions_permission ON role_permissions(permission_id);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

-- Anyone can read role permissions (public config)
CREATE POLICY "Role permissions are readable" ON role_permissions
    FOR SELECT USING (true);

-- Only super_admin can modify
CREATE POLICY "Only super_admin can modify role permissions" ON role_permissions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE auth_user_id = auth.uid() 
            AND app_role = 'super_admin'
        )
    );

COMMIT;
