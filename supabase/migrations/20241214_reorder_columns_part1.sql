-- ============================================================================
-- Migration: Clean Table Recreate with Proper Column Order
-- Date: 2024-12-14
-- Description:
--   Truncates dummy data and recreates all 7 settings tables with:
--   1. Proper column ordering (audit columns LAST)
--   2. All FKs with ON DELETE CASCADE where appropriate
--   3. Full 8-column audit trail
--   4. Proper RLS policies and triggers
--
-- SAFE TO RUN: Only dummy data will be deleted
-- ============================================================================

BEGIN;

-- ============================================================================
-- PHASE 1: DISABLE TRIGGERS AND TRUNCATE
-- ============================================================================

-- Disable FK checks temporarily
SET session_replication_role = 'replica';

-- Truncate in dependency order (children first)
TRUNCATE TABLE social_profiles CASCADE;
TRUNCATE TABLE professional_profiles CASCADE;
TRUNCATE TABLE organization_members CASCADE;
TRUNCATE TABLE contacts CASCADE;
TRUNCATE TABLE addresses CASCADE;
TRUNCATE TABLE user_preferences CASCADE;
-- Note: profiles not truncated - linked to auth.users

-- Re-enable FK checks
SET session_replication_role = 'origin';


-- ============================================================================
-- PHASE 2: DROP AND RECREATE EXTENSION TABLES
-- ============================================================================

-- ----- SOCIAL_PROFILES -----
DROP TABLE IF EXISTS social_profiles CASCADE;

CREATE TABLE social_profiles (
    -- Identity
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Social media links
    linkedin_url VARCHAR(500),
    twitter_url VARCHAR(500),
    facebook_url VARCHAR(500),
    instagram_url VARCHAR(500),
    youtube_url VARCHAR(500),
    tiktok_url VARCHAR(500),
    github_url VARCHAR(500),
    website_url VARCHAR(500),
    other_social_urls JSONB DEFAULT '[]'::JSONB,
    
    -- Translations
    translations JSONB DEFAULT '{}'::JSONB,
    
    -- Audit trail (ALWAYS LAST)
    is_active BOOLEAN DEFAULT true,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id),
    deleted_at TIMESTAMPTZ,
    deleted_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_social_profiles_profile ON social_profiles(profile_id);
CREATE INDEX idx_social_profiles_is_active ON social_profiles(is_active) WHERE is_active = true;


-- ----- PROFESSIONAL_PROFILES -----
DROP TABLE IF EXISTS professional_profiles CASCADE;

CREATE TABLE professional_profiles (
    -- Identity
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Professional data
    user_type VARCHAR(50),
    job_title VARCHAR(200),
    company_name VARCHAR(200),
    department VARCHAR(200),
    industry VARCHAR(100),
    years_of_experience INTEGER,
    skills JSONB DEFAULT '[]'::JSONB,
    certifications JSONB DEFAULT '[]'::JSONB,
    education JSONB DEFAULT '[]'::JSONB,
    bio TEXT,
    
    -- Business identifiers
    tax_id VARCHAR(50),
    business_registration_number VARCHAR(100),
    license_number VARCHAR(100),
    license_state VARCHAR(50),
    license_expiry DATE,
    
    -- Work contact
    work_email VARCHAR(255),
    work_phone VARCHAR(30),
    
    -- New columns
    portfolio_urls JSONB DEFAULT '[]'::JSONB,
    availability_status VARCHAR(50) DEFAULT 'available',
    
    -- Translations
    translations JSONB DEFAULT '{}'::JSONB,
    
    -- Audit trail (ALWAYS LAST)
    is_active BOOLEAN DEFAULT true,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id),
    deleted_at TIMESTAMPTZ,
    deleted_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_professional_profiles_profile ON professional_profiles(profile_id);
CREATE INDEX idx_professional_profiles_is_active ON professional_profiles(is_active) WHERE is_active = true;


-- ----- ORGANIZATION_MEMBERS -----
DROP TABLE IF EXISTS organization_members CASCADE;

CREATE TABLE organization_members (
    -- Identity
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Membership data
    role VARCHAR(50) DEFAULT 'member',
    title TEXT,
    department TEXT,
    is_personal_org BOOLEAN DEFAULT false,
    invited_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    invited_at TIMESTAMPTZ,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Suspension
    suspended_at TIMESTAMPTZ,
    suspended_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    
    -- Translations
    translations JSONB DEFAULT '{}'::JSONB,
    
    -- Audit trail (ALWAYS LAST)
    is_active BOOLEAN DEFAULT true,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id),
    deleted_at TIMESTAMPTZ,
    deleted_by UUID REFERENCES auth.users(id),
    
    UNIQUE(organization_id, profile_id)
);

CREATE INDEX idx_org_members_org ON organization_members(organization_id);
CREATE INDEX idx_org_members_profile ON organization_members(profile_id);
CREATE INDEX idx_org_members_is_active ON organization_members(is_active) WHERE is_active = true;


-- ----- CONTACTS -----
DROP TABLE IF EXISTS contacts CASCADE;

CREATE TABLE contacts (
    -- Identity
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Contact data
    contact_type VARCHAR(50) NOT NULL,
    contact_label TEXT,
    contact_name TEXT,
    relationship VARCHAR(50),
    email VARCHAR(255),
    email_verified BOOLEAN DEFAULT false,
    phone VARCHAR(30),
    phone_country_code VARCHAR(10),
    phone_verified BOOLEAN DEFAULT false,
    notes TEXT,
    
    -- Flags
    is_primary BOOLEAN DEFAULT false,
    
    -- New columns
    communication_preference VARCHAR(50),
    
    -- Translations
    translations JSONB DEFAULT '{}'::JSONB,
    
    -- Audit trail (ALWAYS LAST)
    is_active BOOLEAN DEFAULT true,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id),
    deleted_at TIMESTAMPTZ,
    deleted_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_contacts_profile ON contacts(profile_id);
CREATE INDEX idx_contacts_type ON contacts(contact_type);
CREATE INDEX idx_contacts_is_active ON contacts(is_active) WHERE is_active = true;


-- ----- ADDRESSES -----
DROP TABLE IF EXISTS addresses CASCADE;

CREATE TABLE addresses (
    -- Identity
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Address data
    address_type VARCHAR(50) NOT NULL DEFAULT 'home',
    label TEXT,
    line1 TEXT NOT NULL,
    line2 TEXT,
    line3 TEXT,
    city TEXT NOT NULL,
    state_province TEXT,
    postal_code TEXT,
    country_code VARCHAR(3) NOT NULL,
    
    -- Administrative divisions (FKs to be added if tables exist)
    region_division_id UUID,
    municipality_division_id UUID,
    parish_division_id UUID,
    
    -- Geolocation
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    formatted_address TEXT,
    timezone TEXT,
    
    -- Flags
    is_primary BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    verified_at TIMESTAMPTZ,
    
    -- Translations
    translations JSONB DEFAULT '{}'::JSONB,
    
    -- Audit trail (ALWAYS LAST)
    is_active BOOLEAN DEFAULT true,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id),
    deleted_at TIMESTAMPTZ,
    deleted_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_addresses_profile ON addresses(profile_id);
CREATE INDEX idx_addresses_type ON addresses(address_type);
CREATE INDEX idx_addresses_country ON addresses(country_code);
CREATE INDEX idx_addresses_is_active ON addresses(is_active) WHERE is_active = true;


-- ----- USER_PREFERENCES -----
DROP TABLE IF EXISTS user_preferences CASCADE;

CREATE TABLE user_preferences (
    -- Identity
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Localization
    timezone TEXT DEFAULT 'UTC',
    locale VARCHAR(10) DEFAULT 'en-US',
    date_format TEXT DEFAULT 'YYYY-MM-DD',
    time_format TEXT DEFAULT '24h',
    preferred_currency VARCHAR(3) DEFAULT 'USD',
    
    -- Contact preferences
    preferred_contact_method VARCHAR(20) DEFAULT 'email',
    do_not_disturb_enabled BOOLEAN DEFAULT false,
    
    -- UI preferences
    theme VARCHAR(20) DEFAULT 'auto',
    font_size VARCHAR(10) DEFAULT 'medium',
    sidebar_collapsed BOOLEAN DEFAULT false,
    dashboard_widgets JSONB DEFAULT '[]'::JSONB,
    ui_layout JSONB DEFAULT '{"style": "pulwave"}'::JSONB,
    accessibility_settings JSONB DEFAULT '{}'::JSONB,
    
    -- Notifications
    notifications_enabled BOOLEAN DEFAULT true,
    email_notifications BOOLEAN DEFAULT true,
    sms_notifications BOOLEAN DEFAULT false,
    push_notifications BOOLEAN DEFAULT true,
    marketing_emails BOOLEAN DEFAULT false,
    
    -- Privacy
    profile_visibility VARCHAR(20) DEFAULT 'organization',
    show_email BOOLEAN DEFAULT false,
    show_phone BOOLEAN DEFAULT false,
    activity_status_visible BOOLEAN DEFAULT true,
    
    -- Consent
    data_processing_consent BOOLEAN DEFAULT false,
    marketing_consent BOOLEAN DEFAULT false,
    analytics_consent BOOLEAN DEFAULT true,
    
    -- New columns
    ai_content_preferences JSONB DEFAULT '{}'::JSONB,
    
    -- Translations
    translations JSONB DEFAULT '{}'::JSONB,
    
    -- Audit trail (ALWAYS LAST)
    is_active BOOLEAN DEFAULT true,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id),
    deleted_at TIMESTAMPTZ,
    deleted_by UUID REFERENCES auth.users(id),
    
    UNIQUE(profile_id, organization_id)
);

CREATE INDEX idx_user_prefs_profile ON user_preferences(profile_id);
CREATE INDEX idx_user_prefs_org ON user_preferences(organization_id);
CREATE INDEX idx_user_prefs_is_active ON user_preferences(is_active) WHERE is_active = true;


-- ============================================================================
-- PHASE 3: RLS POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE social_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Social profiles policies
CREATE POLICY "Users can manage own social profiles" ON social_profiles
    FOR ALL TO authenticated
    USING (profile_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()))
    WITH CHECK (profile_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()));

-- Professional profiles policies
CREATE POLICY "Users can manage own professional profiles" ON professional_profiles
    FOR ALL TO authenticated
    USING (profile_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()))
    WITH CHECK (profile_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()));

-- Organization members policies
CREATE POLICY "Users can view own memberships" ON organization_members
    FOR SELECT TO authenticated
    USING (profile_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()));

CREATE POLICY "Org admins can manage members" ON organization_members
    FOR ALL TO authenticated
    USING (
        organization_id IN (
            SELECT om.organization_id FROM organization_members om
            JOIN profiles p ON om.profile_id = p.id
            WHERE p.auth_user_id = auth.uid() 
            AND om.role IN ('owner', 'admin')
        )
    );

-- Contacts policies
CREATE POLICY "Users can manage own contacts" ON contacts
    FOR ALL TO authenticated
    USING (profile_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()))
    WITH CHECK (profile_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()));

-- Addresses policies
CREATE POLICY "Users can manage own addresses" ON addresses
    FOR ALL TO authenticated
    USING (profile_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()))
    WITH CHECK (profile_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()));

-- User preferences policies
CREATE POLICY "Users can manage own preferences" ON user_preferences
    FOR ALL TO authenticated
    USING (profile_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()))
    WITH CHECK (profile_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()));


-- ============================================================================
-- PHASE 4: TRIGGERS
-- ============================================================================

-- Apply updated_at and version triggers to all tables
DO $$
DECLARE
    t TEXT;
BEGIN
    FOREACH t IN ARRAY ARRAY['social_profiles', 'professional_profiles', 'organization_members', 
                              'contacts', 'addresses', 'user_preferences']
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS update_%s_updated_at ON %s', t, t);
        EXECUTE format('CREATE TRIGGER update_%s_updated_at BEFORE UPDATE ON %s 
                        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()', t, t);
        
        EXECUTE format('DROP TRIGGER IF EXISTS increment_%s_version ON %s', t, t);
        EXECUTE format('CREATE TRIGGER increment_%s_version BEFORE UPDATE ON %s 
                        FOR EACH ROW EXECUTE FUNCTION increment_version_column()', t, t);
    END LOOP;
END $$;


COMMIT;

-- ============================================================================
-- VERIFICATION
-- ============================================================================
SELECT 
    table_name,
    MIN(ordinal_position) FILTER (WHERE column_name IN ('is_active', 'version', 'created_at', 'created_by', 
                                                         'updated_at', 'updated_by', 'deleted_at', 'deleted_by')) AS first_audit_pos,
    MAX(ordinal_position) AS total_cols,
    CASE 
        WHEN MAX(ordinal_position) = MIN(ordinal_position) FILTER (WHERE column_name IN ('is_active', 'version', 'created_at', 'created_by', 
                                                                                          'updated_at', 'updated_by', 'deleted_at', 'deleted_by')) + 7
        THEN '✅ PERFECT ORDER'
        ELSE '⚠️ CHECK ORDER'
    END AS status
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name IN ('social_profiles', 'professional_profiles', 'organization_members', 
                   'contacts', 'addresses', 'user_preferences')
GROUP BY table_name
ORDER BY table_name;
