 -- ============================================================================
-- Migration: Recreate All Extension Tables
-- Date: 2024-12-15
-- Description: Recreate extension tables after profiles CASCADE drop
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. SOCIAL PROFILES
-- ============================================================================

CREATE TABLE IF NOT EXISTS social_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    organization_id UUID,
    linkedin_url VARCHAR(500),
    twitter_url VARCHAR(500),
    facebook_url VARCHAR(500),
    instagram_url VARCHAR(500),
    youtube_url VARCHAR(500),
    tiktok_url VARCHAR(500),
    github_url VARCHAR(500),
    website_url VARCHAR(500),
    other_social_urls JSONB DEFAULT '[]'::JSONB,
    verification_status VARCHAR(50) DEFAULT 'unverified',
    translations JSONB DEFAULT '{}'::JSONB,
    is_active BOOLEAN DEFAULT true,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID,
    deleted_at TIMESTAMPTZ,
    deleted_by UUID
);

CREATE INDEX idx_social_profiles_profile ON social_profiles(profile_id);
ALTER TABLE social_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own social profiles" ON social_profiles
    FOR ALL USING (profile_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()));

-- ============================================================================
-- 2. PROFESSIONAL PROFILES
-- ============================================================================

CREATE TABLE IF NOT EXISTS professional_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    organization_id UUID,
    user_type VARCHAR(50),
    professional_title VARCHAR(200),
    company_name VARCHAR(200),
    industry VARCHAR(100),
    years_of_experience INTEGER,
    tax_id VARCHAR(50),
    business_registration_number VARCHAR(100),
    license_number VARCHAR(100),
    license_state VARCHAR(50),
    license_expiry DATE,
    certifications JSONB DEFAULT '[]'::JSONB,
    portfolio_urls JSONB DEFAULT '[]'::JSONB,
    availability_status VARCHAR(50) DEFAULT 'available',
    hourly_rate NUMERIC(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    translations JSONB DEFAULT '{}'::JSONB,
    is_active BOOLEAN DEFAULT true,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID,
    deleted_at TIMESTAMPTZ,
    deleted_by UUID
);

CREATE INDEX idx_professional_profiles_profile ON professional_profiles(profile_id);
ALTER TABLE professional_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own professional profiles" ON professional_profiles
    FOR ALL USING (profile_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()));

-- ============================================================================
-- 3. CONTACTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    organization_id UUID,
    contact_type VARCHAR(50) NOT NULL,
    contact_value TEXT NOT NULL,
    country_code VARCHAR(5),
    is_primary BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    verified_at TIMESTAMPTZ,
    label VARCHAR(100),
    name TEXT,
    relationship VARCHAR(50),
    communication_preference VARCHAR(50) DEFAULT 'any',
    translations JSONB DEFAULT '{}'::JSONB,
    is_active BOOLEAN DEFAULT true,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID,
    deleted_at TIMESTAMPTZ,
    deleted_by UUID
);

CREATE INDEX idx_contacts_profile ON contacts(profile_id);
CREATE INDEX idx_contacts_type ON contacts(contact_type);
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own contacts" ON contacts
    FOR ALL USING (profile_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()));

-- ============================================================================
-- 4. ADDRESSES
-- ============================================================================

CREATE TABLE IF NOT EXISTS addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    organization_id UUID,
    address_type VARCHAR(50) DEFAULT 'home',
    street_line_1 TEXT,
    street_line_2 TEXT,
    city TEXT,
    state_province TEXT,
    postal_code VARCHAR(20),
    country_id UUID,
    country_code VARCHAR(3),
    administrative_division_id UUID,
    locality_id UUID,
    latitude NUMERIC(10,7),
    longitude NUMERIC(10,7),
    is_primary BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    translations JSONB DEFAULT '{}'::JSONB,
    is_active BOOLEAN DEFAULT true,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID,
    deleted_at TIMESTAMPTZ,
    deleted_by UUID
);

CREATE INDEX idx_addresses_profile ON addresses(profile_id);
CREATE INDEX idx_addresses_type ON addresses(address_type);
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own addresses" ON addresses
    FOR ALL USING (profile_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()));

-- ============================================================================
-- 5. USER PREFERENCES
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    organization_id UUID,
    locale VARCHAR(10) DEFAULT 'en-US',
    timezone VARCHAR(100) DEFAULT 'UTC',
    date_format VARCHAR(20) DEFAULT 'YYYY-MM-DD',
    time_format VARCHAR(10) DEFAULT '24h',
    currency VARCHAR(3) DEFAULT 'USD',
    theme VARCHAR(20) DEFAULT 'system',
    notifications_enabled BOOLEAN DEFAULT true,
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    sms_notifications BOOLEAN DEFAULT false,
    marketing_emails BOOLEAN DEFAULT false,
    sidebar_collapsed BOOLEAN DEFAULT false,
    dashboard_layout JSONB DEFAULT '{}'::JSONB,
    ai_content_preferences JSONB DEFAULT '{}'::JSONB,
    ai_learning_enabled BOOLEAN DEFAULT true,
    ai_suggestions_enabled BOOLEAN DEFAULT true,
    translations JSONB DEFAULT '{}'::JSONB,
    is_active BOOLEAN DEFAULT true,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID,
    deleted_at TIMESTAMPTZ,
    deleted_by UUID
);

CREATE INDEX idx_user_preferences_profile ON user_preferences(profile_id);
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own preferences" ON user_preferences
    FOR ALL USING (profile_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()));

-- ============================================================================
-- 6. ORGANIZATION MEMBERS
-- ============================================================================

CREATE TABLE IF NOT EXISTS organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member',
    title VARCHAR(200),
    department VARCHAR(100),
    is_primary BOOLEAN DEFAULT false,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    invited_by UUID,
    suspended_at TIMESTAMPTZ,
    suspended_by UUID,
    translations JSONB DEFAULT '{}'::JSONB,
    is_active BOOLEAN DEFAULT true,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID,
    deleted_at TIMESTAMPTZ,
    deleted_by UUID,
    UNIQUE(organization_id, profile_id)
);

CREATE INDEX idx_org_members_org ON organization_members(organization_id);
CREATE INDEX idx_org_members_profile ON organization_members(profile_id);
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own memberships" ON organization_members
    FOR SELECT USING (profile_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()));

COMMIT;
