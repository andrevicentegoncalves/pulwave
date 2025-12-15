-- ============================================================================
-- Migration: Add UI_LAYOUT Config, Full Audit Columns, and Table Reordering
-- Date: 2024-12-14
-- Description: 
--   1. Adds UI_LAYOUT default config to system_settings
--   2. Adds preferences category to setting_categories
--   3. Adds full audit trail columns to all settings tables:
--      - created_at, created_by, updated_at, updated_by
--      - deleted_at, deleted_by, is_active, version
--   4. Creates proper triggers for auto-update
-- ============================================================================

-- ============================================================================
-- 1. UI_LAYOUT DEFAULT CONFIG
-- ============================================================================
INSERT INTO system_settings (setting_key, setting_value, category, value_type, description)
VALUES (
    'UI_LAYOUT',
    '{"style": "pulwave"}'::JSONB,
    'appearance',
    'json',
    'Default UI layout style for new users'
)
ON CONFLICT (setting_key) DO UPDATE SET
    setting_value = EXCLUDED.setting_value,
    category = EXCLUDED.category,
    description = EXCLUDED.description;

-- ============================================================================
-- 2. ADD SETTING CATEGORIES
-- ============================================================================
INSERT INTO master_data_values (type_key, value_key, value_label, display_order) VALUES
    ('setting_categories', 'appearance', 'Appearance', 10),
    ('setting_categories', 'preferences', 'Preferences', 11)
ON CONFLICT (type_key, value_key) DO NOTHING;

-- ============================================================================
-- 3. ADD FULL AUDIT TRAIL COLUMNS TO ALL SETTINGS TABLES
-- Standard audit columns: created_at, created_by, updated_at, updated_by,
--                         deleted_at, deleted_by, is_active, version
-- ============================================================================

-- ----- PROFILES -----
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;

-- ----- USER_PREFERENCES -----
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id);
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id);
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;

-- ----- CONTACTS -----
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id);
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id);
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;

-- ----- ADDRESSES -----
ALTER TABLE addresses ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE addresses ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);
ALTER TABLE addresses ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE addresses ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id);
ALTER TABLE addresses ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE addresses ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id);
ALTER TABLE addresses ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE addresses ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;

-- ----- ORGANIZATION_MEMBERS -----
ALTER TABLE organization_members ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE organization_members ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);
ALTER TABLE organization_members ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE organization_members ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id);
ALTER TABLE organization_members ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE organization_members ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id);
ALTER TABLE organization_members ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE organization_members ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;

-- ----- PROFESSIONAL_PROFILES -----
ALTER TABLE professional_profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE professional_profiles ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);
ALTER TABLE professional_profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE professional_profiles ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id);
ALTER TABLE professional_profiles ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE professional_profiles ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id);
ALTER TABLE professional_profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE professional_profiles ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;

-- ----- SOCIAL_PROFILES -----
ALTER TABLE social_profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE social_profiles ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);
ALTER TABLE social_profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE social_profiles ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id);
ALTER TABLE social_profiles ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE social_profiles ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id);
ALTER TABLE social_profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE social_profiles ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;

-- ============================================================================
-- 4. UPDATED_AT AND VERSION TRIGGERS
-- ============================================================================

-- Auto-update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Auto-increment version
CREATE OR REPLACE FUNCTION increment_version_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.version = COALESCE(OLD.version, 0) + 1;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables
DO $$
DECLARE
    t TEXT;
BEGIN
    FOREACH t IN ARRAY ARRAY['profiles', 'user_preferences', 'contacts', 'addresses', 
                              'organization_members', 'professional_profiles', 'social_profiles']
    LOOP
        -- updated_at trigger
        EXECUTE format('DROP TRIGGER IF EXISTS update_%s_updated_at ON %s', t, t);
        EXECUTE format('CREATE TRIGGER update_%s_updated_at BEFORE UPDATE ON %s 
                        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()', t, t);
        
        -- version trigger
        EXECUTE format('DROP TRIGGER IF EXISTS increment_%s_version ON %s', t, t);
        EXECUTE format('CREATE TRIGGER increment_%s_version BEFORE UPDATE ON %s 
                        FOR EACH ROW EXECUTE FUNCTION increment_version_column()', t, t);
    END LOOP;
END $$;

-- ============================================================================
-- 5. INDEXES FOR SOFT DELETE QUERIES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON profiles(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_user_preferences_is_active ON user_preferences(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_contacts_is_active ON contacts(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_addresses_is_active ON addresses(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_organization_members_is_active ON organization_members(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_professional_profiles_is_active ON professional_profiles(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_social_profiles_is_active ON social_profiles(is_active) WHERE is_active = true;

-- ============================================================================
-- VERIFICATION: Check all audit columns are present
-- ============================================================================
SELECT 
    table_name,
    COUNT(*) FILTER (WHERE column_name IN ('created_at', 'created_by', 'updated_at', 'updated_by', 
                                            'deleted_at', 'deleted_by', 'is_active', 'version')) AS audit_column_count
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name IN ('profiles', 'user_preferences', 'contacts', 'addresses', 
                   'organization_members', 'professional_profiles', 'social_profiles')
GROUP BY table_name
ORDER BY table_name;

-- Expected output: 8 audit columns per table
