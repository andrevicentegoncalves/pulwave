-- =============================================================================
-- MIGRATION: Fix Schema Translation RLS and English Locales
-- =============================================================================

-- 1. Add RLS policy for app admins to manage schema_translations with NULL organization_id
DROP POLICY IF EXISTS "Admins manage global schema translations" ON schema_translations;
CREATE POLICY "Admins manage global schema translations"
    ON schema_translations FOR ALL TO authenticated
    USING (
        organization_id IS NULL AND 
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.app_role IN ('super_admin', 'admin')
        )
    )
    WITH CHECK (
        organization_id IS NULL AND 
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.app_role IN ('super_admin', 'admin')
        )
    );

-- 2. Same for enum_translations
DROP POLICY IF EXISTS "Admins manage global enum translations" ON enum_translations;
CREATE POLICY "Admins manage global enum translations"
    ON enum_translations FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.app_role IN ('super_admin', 'admin')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.app_role IN ('super_admin', 'admin')
        )
    );

-- 3. Fix get_english_locales to query locales table instead of supported_locales
CREATE OR REPLACE FUNCTION get_english_locales()
RETURNS TEXT[] AS $$
BEGIN
    RETURN ARRAY(
        SELECT code 
        FROM locales 
        WHERE code LIKE 'en-%' 
          AND is_active = TRUE
        ORDER BY code
    );
END;
$$ LANGUAGE plpgsql STABLE;

-- 4. Verify the locales exist
SELECT code, name FROM locales WHERE code LIKE 'en-%' AND is_active = TRUE ORDER BY code;
