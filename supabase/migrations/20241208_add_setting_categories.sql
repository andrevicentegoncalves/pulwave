-- ============================================================================
-- Migration: Add Setting Categories to Master Data
-- Description: Adds setting_categories type and values to master_data tables
--              Also fixes TRANSLATABLE_TABLES category from 'localization' to 'translations'
-- ============================================================================

-- 1. Add setting_categories type to master_data_types
INSERT INTO master_data_types (type_key, type_name, description, icon, source_table, is_system, display_order) VALUES
    ('setting_categories', 'Setting Categories', 'Categories for system configuration settings', 'settings', NULL, true, 8)
ON CONFLICT (type_key) DO NOTHING;

-- 2. Add setting category values to master_data_values
INSERT INTO master_data_values (type_key, value_key, value_label, display_order) VALUES
    ('setting_categories', 'general', 'General', 1),
    ('setting_categories', 'email', 'Email', 2),
    ('setting_categories', 'auth', 'Authentication', 3),
    ('setting_categories', 'storage', 'Storage', 4),
    ('setting_categories', 'payments', 'Payments', 5),
    ('setting_categories', 'features', 'Features', 6),
    ('setting_categories', 'translations', 'Translations', 7),
    ('setting_categories', 'localization', 'Localization', 8)
ON CONFLICT (type_key, value_key) DO NOTHING;

-- 3. Fix TRANSLATABLE_TABLES category from 'localization' to 'translations'
UPDATE system_settings 
SET category = 'translations' 
WHERE setting_key = 'TRANSLATABLE_TABLES' AND category = 'localization';

-- 4. Clean up duplicate USER_TRANSLATABLE records (keep USER_TRANSLATABLE_COLUMNS, delete USER_TRANSLATABLE_TABLES)
-- First verify they have the same value
DO $$
DECLARE
    cols_value JSONB;
    tables_value JSONB;
BEGIN
    SELECT setting_value INTO cols_value 
    FROM system_settings 
    WHERE setting_key = 'USER_TRANSLATABLE_COLUMNS' AND is_active = true;
    
    SELECT setting_value INTO tables_value 
    FROM system_settings 
    WHERE setting_key = 'USER_TRANSLATABLE_TABLES' AND is_active = true;
    
    -- Only delete if both exist and have same value
    IF cols_value IS NOT NULL AND tables_value IS NOT NULL AND cols_value = tables_value THEN
        DELETE FROM system_settings WHERE setting_key = 'USER_TRANSLATABLE_TABLES';
        RAISE NOTICE 'Deleted duplicate USER_TRANSLATABLE_TABLES record';
    ELSIF cols_value IS NOT NULL AND tables_value IS NOT NULL THEN
        RAISE NOTICE 'USER_TRANSLATABLE_TABLES and USER_TRANSLATABLE_COLUMNS have different values, not deleting';
    END IF;
END $$;

-- Log summary
DO $$
BEGIN
    RAISE NOTICE 'Migration complete: Added setting_categories to master_data, fixed TRANSLATABLE_TABLES category';
END $$;
