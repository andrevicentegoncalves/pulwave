-- =============================================================================
-- MIGRATION: Fix ui_translations RLS Policy
-- Date: 2024-12-15
-- Fix: Add WITH CHECK clause for insert/update operations
-- =============================================================================

-- Fix the admin policy to include WITH CHECK for inserts
DROP POLICY IF EXISTS "Admin full access on ui_translations" ON ui_translations;
CREATE POLICY "Admin full access on ui_translations" ON ui_translations
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.app_role IN ('super_admin', 'admin', 'dev')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.app_role IN ('super_admin', 'admin', 'dev')
        )
    );

-- Verify
SELECT policyname, cmd, roles::text
FROM pg_policies 
WHERE tablename = 'ui_translations';
