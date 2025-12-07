-- ============================================================================
-- Migration: Master Data & UI Translations Enhancement
-- Description: Adds missing columns to ui_translations and creates master_data_types
-- ============================================================================

-- ============================================================================
-- 1. ADD MISSING COLUMNS TO UI_TRANSLATIONS
-- ============================================================================
ALTER TABLE ui_translations 
    ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'common',
    ADD COLUMN IF NOT EXISTS source_type VARCHAR(20) DEFAULT 'ui',
    ADD COLUMN IF NOT EXISTS source_table VARCHAR(100),
    ADD COLUMN IF NOT EXISTS source_column VARCHAR(100);

-- Add constraint for source_type if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'ui_translations_source_type_check'
    ) THEN
        ALTER TABLE ui_translations 
            ADD CONSTRAINT ui_translations_source_type_check 
            CHECK (source_type IN ('ui', 'database'));
    END IF;
END $$;

-- Index for category
CREATE INDEX IF NOT EXISTS idx_ui_translations_category ON ui_translations(category);

-- Ensure unique constraint for upsert
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'unique_translation_key_locale'
    ) THEN
        ALTER TABLE ui_translations
        ADD CONSTRAINT unique_translation_key_locale UNIQUE (translation_key, locale_code);
    END IF;
END $$;

-- ============================================================================
-- 2. MASTER DATA TYPES TABLE
-- For managing lookup/reference data (categories, tags, enums stored in DB)
-- ============================================================================
CREATE TABLE IF NOT EXISTS master_data_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type_key VARCHAR(100) NOT NULL UNIQUE,
    type_name VARCHAR(200) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    source_table VARCHAR(100),
    value_column VARCHAR(100) DEFAULT 'name',
    display_order INTEGER DEFAULT 0,
    is_system BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default master data types
INSERT INTO master_data_types (type_key, type_name, description, icon, source_table, is_system, display_order) VALUES
    ('translation_categories', 'Translation Categories', 'Categories for UI translations', 'tag', NULL, true, 1),
    ('translatable_tables', 'Translatable Tables', 'Database tables that support translation', 'database', NULL, true, 2),
    ('user_roles', 'User Roles', 'Application user roles', 'users', 'profiles', true, 3),
    ('countries', 'Countries', 'Country list', 'globe', 'countries', true, 4),
    ('currencies', 'Currencies', 'Currency codes', 'dollar-sign', NULL, false, 5),
    ('timezones', 'Timezones', 'Timezone list', 'clock', 'timezones', true, 6)
ON CONFLICT (type_key) DO NOTHING;

-- ============================================================================
-- 3. MASTER DATA VALUES TABLE
-- Generic key-value store for lookup values
-- ============================================================================
CREATE TABLE IF NOT EXISTS master_data_values (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type_key VARCHAR(100) NOT NULL REFERENCES master_data_types(type_key) ON DELETE CASCADE,
    value_key VARCHAR(100) NOT NULL,
    value_label VARCHAR(200) NOT NULL,
    value_data JSONB DEFAULT '{}',
    display_order INTEGER DEFAULT 0,
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(type_key, value_key)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_master_data_values_type ON master_data_values(type_key);
CREATE INDEX IF NOT EXISTS idx_master_data_values_active ON master_data_values(is_active) WHERE is_active = true;

-- Seed translation categories
INSERT INTO master_data_values (type_key, value_key, value_label, display_order) VALUES
    ('translation_categories', 'common', 'Common', 1),
    ('translation_categories', 'auth', 'Authentication', 2),
    ('translation_categories', 'navigation', 'Navigation', 3),
    ('translation_categories', 'forms', 'Forms', 4),
    ('translation_categories', 'errors', 'Errors', 5),
    ('translation_categories', 'settings', 'Settings', 6),
    ('translation_categories', 'admin', 'Admin', 7)
ON CONFLICT (type_key, value_key) DO NOTHING;

-- Seed translatable tables
INSERT INTO master_data_values (type_key, value_key, value_label, display_order) VALUES
    ('translatable_tables', 'profiles', 'User Profiles', 1),
    ('translatable_tables', 'subscription_plans', 'Subscription Plans', 2),
    ('translatable_tables', 'countries', 'Countries', 3),
    ('translatable_tables', 'administrative_divisions', 'Regions/States', 4),
    ('translatable_tables', 'localities', 'Cities/Towns', 5)
ON CONFLICT (type_key, value_key) DO NOTHING;

-- ============================================================================
-- 4. RLS POLICIES
-- ============================================================================
ALTER TABLE master_data_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE master_data_values ENABLE ROW LEVEL SECURITY;

-- Admin access
DROP POLICY IF EXISTS "Admin full access on master_data_types" ON master_data_types;
CREATE POLICY "Admin full access on master_data_types" ON master_data_types
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.app_role IN ('super_admin', 'admin')
        )
    );

DROP POLICY IF EXISTS "Admin full access on master_data_values" ON master_data_values;
CREATE POLICY "Admin full access on master_data_values" ON master_data_values
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.app_role IN ('super_admin', 'admin')
        )
    );

-- Read access for all authenticated users
DROP POLICY IF EXISTS "Read master_data_types" ON master_data_types;
CREATE POLICY "Read master_data_types" ON master_data_types
    FOR SELECT TO authenticated
    USING (is_active = true);

DROP POLICY IF EXISTS "Read master_data_values" ON master_data_values;
CREATE POLICY "Read master_data_values" ON master_data_values
    FOR SELECT TO authenticated
    USING (is_active = true);

-- UI Translations Policies
ALTER TABLE ui_translations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin full access on ui_translations" ON ui_translations;
CREATE POLICY "Admin full access on ui_translations" ON ui_translations
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.app_role IN ('super_admin', 'admin')
        )
    );

DROP POLICY IF EXISTS "Read ui_translations" ON ui_translations;
CREATE POLICY "Read ui_translations" ON ui_translations
    FOR SELECT TO authenticated
    USING (true); -- Start with public read for translations, or restrict if needed

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON TABLE master_data_types IS 'Defines types of lookup/reference data';
COMMENT ON TABLE master_data_values IS 'Stores values for each master data type';
-- ============================================================================
-- 5. SYSTEM SETTINGS TABLE (RECREATED)
-- Recreating to ensure all columns exist and correct structure
-- ============================================================================
DROP TABLE IF EXISTS system_settings;

CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID, -- Optional: for multi-tenant support if needed
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value JSONB,
    category VARCHAR(50) DEFAULT 'general',
    value_type VARCHAR(20) DEFAULT 'string', -- string, number, boolean, json
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Index for faster lookups
CREATE INDEX idx_system_settings_key ON system_settings(setting_key);
CREATE INDEX idx_system_settings_category ON system_settings(category);

-- RLS
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access on system_settings" ON system_settings
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.app_role IN ('super_admin', 'admin')
        )
    );

CREATE POLICY "Read system_settings" ON system_settings
    FOR SELECT TO authenticated
    USING (is_active = true);

-- Seed initial settings
INSERT INTO system_settings (setting_key, setting_value, category, value_type, description) VALUES
    ('site_name', '"Pulwave Admin"', 'general', 'string', 'Name of the application'),
    ('maintenance_mode', 'false', 'general', 'boolean', 'Enable maintenance mode'),
    ('TRANSLATABLE_TABLES', '["profiles", "subscription_plans", "countries"]', 'localization', 'json', 'Tables that have translatable content'),
    ('TRANSLATABLE_COLUMNS', '{"profiles": ["user_type", "license_state"], "subscription_plans": ["name", "description"]}', 'localization', 'json', 'Columns configuration for translatable tables')
ON CONFLICT (setting_key) DO UPDATE SET
    setting_value = EXCLUDED.setting_value,
    category = EXCLUDED.category,
    value_type = EXCLUDED.value_type,
    description = EXCLUDED.description;
