-- =============================================================================
-- MIGRATION: Fix ALL RLS Policies - Use get_current_profile_id() Helper
-- Date: 2024-12-15
-- Solution: Use helper function for auth-agnostic profile ID resolution
-- =============================================================================

-- Fix system_settings policies
DROP POLICY IF EXISTS "Admin full access on system_settings" ON system_settings;
CREATE POLICY "Admin full access on system_settings" ON system_settings
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = get_current_profile_id() 
            AND profiles.app_role IN ('super_admin', 'admin', 'dev')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = get_current_profile_id() 
            AND profiles.app_role IN ('super_admin', 'admin', 'dev')
        )
    );

-- Fix feature_flags policies
DROP POLICY IF EXISTS "Admin full access on feature_flags" ON feature_flags;
CREATE POLICY "Admin full access on feature_flags" ON feature_flags
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = get_current_profile_id() 
            AND profiles.app_role IN ('super_admin', 'admin', 'dev')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = get_current_profile_id() 
            AND profiles.app_role IN ('super_admin', 'admin', 'dev')
        )
    );

-- Fix master_data_types policies  
DROP POLICY IF EXISTS "Admin full access on master_data_types" ON master_data_types;
CREATE POLICY "Admin full access on master_data_types" ON master_data_types
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = get_current_profile_id() 
            AND profiles.app_role IN ('super_admin', 'admin', 'dev')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = get_current_profile_id() 
            AND profiles.app_role IN ('super_admin', 'admin', 'dev')
        )
    );

-- Fix master_data_values policies
DROP POLICY IF EXISTS "Admin full access on master_data_values" ON master_data_values;
CREATE POLICY "Admin full access on master_data_values" ON master_data_values
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = get_current_profile_id() 
            AND profiles.app_role IN ('super_admin', 'admin', 'dev')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = get_current_profile_id() 
            AND profiles.app_role IN ('super_admin', 'admin', 'dev')
        )
    );

-- Fix ui_translations policies
DROP POLICY IF EXISTS "Admin full access on ui_translations" ON ui_translations;
CREATE POLICY "Admin full access on ui_translations" ON ui_translations
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = get_current_profile_id() 
            AND profiles.app_role IN ('super_admin', 'admin', 'dev')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = get_current_profile_id() 
            AND profiles.app_role IN ('super_admin', 'admin', 'dev')
        )
    );

-- Fix schema_translations policies
DROP POLICY IF EXISTS "Admins manage global schema translations" ON schema_translations;
CREATE POLICY "Admins manage global schema translations" ON schema_translations
    FOR ALL TO authenticated
    USING (
        organization_id IS NULL AND 
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = get_current_profile_id() 
            AND profiles.app_role IN ('super_admin', 'admin', 'dev')
        )
    )
    WITH CHECK (
        organization_id IS NULL AND 
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = get_current_profile_id() 
            AND profiles.app_role IN ('super_admin', 'admin', 'dev')
        )
    );

-- Fix enum_translations policies
DROP POLICY IF EXISTS "Admins manage global enum translations" ON enum_translations;
CREATE POLICY "Admins manage global enum translations" ON enum_translations
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = get_current_profile_id() 
            AND profiles.app_role IN ('super_admin', 'admin', 'dev')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = get_current_profile_id() 
            AND profiles.app_role IN ('super_admin', 'admin', 'dev')
        )
    );

-- Fix master_data_translations policies
DROP POLICY IF EXISTS "Admin full access on master_data_translations" ON master_data_translations;
CREATE POLICY "Admin full access on master_data_translations" ON master_data_translations
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = get_current_profile_id() 
            AND profiles.app_role IN ('super_admin', 'admin', 'dev')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = get_current_profile_id() 
            AND profiles.app_role IN ('super_admin', 'admin', 'dev')
        )
    );

-- Fix translation_registry policies
DROP POLICY IF EXISTS "Admin full access on translation_registry" ON translation_registry;
CREATE POLICY "Admin full access on translation_registry" ON translation_registry
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = get_current_profile_id() 
            AND profiles.app_role IN ('super_admin', 'admin', 'dev')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = get_current_profile_id() 
            AND profiles.app_role IN ('super_admin', 'admin', 'dev')
        )
    );

-- Verify the fix
SELECT 'RLS policies updated to use get_current_profile_id() - auth agnostic!' as status;
