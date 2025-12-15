-- Add User Translatable Tables Configuration
-- This config defines which tables/columns users (non-admin) can translate in Content Translations

INSERT INTO system_settings (setting_key, setting_value, category, value_type, description)
VALUES (
    'USER_TRANSLATABLE_TABLES',
    '{"profiles": ["bio", "headline"]}',
    'translations',
    'json',
    'JSON config defining which table.columns users can translate (for content translations). Format: {"table_name": ["col1", "col2"]}'
)
ON CONFLICT (setting_key) DO UPDATE SET
    setting_value = EXCLUDED.setting_value,
    description = EXCLUDED.description,
    updated_at = NOW();

-- Also add USER_TRANSLATABLE_COLUMNS for consistency (mirrors TRANSLATABLE_COLUMNS structure)
INSERT INTO system_settings (setting_key, setting_value, category, value_type, description)
VALUES (
    'USER_TRANSLATABLE_COLUMNS',
    '{"profiles": ["bio", "headline"]}',
    'translations',
    'json',
    'JSON config defining columns per table that users can translate. Format: {"table_name": ["col1", "col2"]}'
)
ON CONFLICT (setting_key) DO UPDATE SET
    setting_value = EXCLUDED.setting_value,
    description = EXCLUDED.description,
    updated_at = NOW();
