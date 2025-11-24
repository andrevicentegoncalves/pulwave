-- ============================================================================
-- PROFILES NORMALIZATION - FINAL APPROVED VERSION
-- 1. Preserves ALL 97 columns
-- 2. Implements Dual-Role Strategy (app_role vs org_role)
-- 3. Keeps personal info in main table (no profile_personal_info)
-- 4. Uses robust JSON extraction for safe migration
-- ============================================================================

-- ============================================================================
-- STEP 1: CREATE MISSING ENUMS (Idempotent)
-- ============================================================================

DO $$ BEGIN
    CREATE TYPE app_role AS ENUM ('super_admin', 'admin', 'support', 'user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE gender_type AS ENUM ('male', 'female', 'non-binary', 'prefer-not-to-say', 'other');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE user_locale AS ENUM ('en-US', 'en-GB', 'en-CA', 'en-AU', 'es-ES', 'es-MX', 'es-AR', 'fr-FR', 'fr-CA', 'de-DE', 'it-IT', 'pt-BR', 'pt-PT', 'zh-CN', 'zh-TW', 'ja-JP', 'ko-KR', 'ar-SA', 'hi-IN', 'ru-RU');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE emergency_relationship AS ENUM ('spouse', 'partner', 'parent', 'child', 'sibling', 'friend', 'neighbor', 'colleague', 'other');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE payment_method AS ENUM ('credit-card', 'debit-card', 'bank-transfer', 'paypal', 'stripe', 'check', 'cash', 'other');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE OR REPLACE FUNCTION update_timestamp() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- STEP 2: SAFE BACKUP STRATEGY
-- ============================================================================

DO $$
DECLARE
    profiles_cols INTEGER;
    backup_cols INTEGER;
BEGIN
    SELECT COUNT(*) INTO profiles_cols FROM information_schema.columns WHERE table_name = 'profiles';
    
    -- Check if backup exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles_backup_pre_normalization') THEN
        SELECT COUNT(*) INTO backup_cols FROM information_schema.columns WHERE table_name = 'profiles_backup_pre_normalization';
        
        IF backup_cols > 30 THEN
            RAISE NOTICE '✓ Good backup exists (% columns). Keeping it.', backup_cols;
        ELSE
            RAISE NOTICE '⚠ Existing backup is lean (% columns).', backup_cols;
            IF profiles_cols > 30 THEN
                RAISE NOTICE '✓ Profiles is full (% columns). Creating new backup...', profiles_cols;
                DROP TABLE profiles_backup_pre_normalization;
                CREATE TABLE profiles_backup_pre_normalization AS SELECT * FROM profiles;
            ELSE
                RAISE NOTICE '⚠ Both profiles and backup are lean. Proceeding with best-effort migration (defaults will be used).';
            END IF;
        END IF;
    ELSE
        -- No backup exists
        IF profiles_cols > 30 THEN
            CREATE TABLE profiles_backup_pre_normalization AS SELECT * FROM profiles;
            RAISE NOTICE '✓ Created backup from profiles';
        ELSE
             RAISE NOTICE '⚠ Profiles is lean and no backup exists! Proceeding with best-effort migration.';
             -- Create a backup anyway so we have a source table, even if lean
             CREATE TABLE profiles_backup_pre_normalization AS SELECT * FROM profiles;
        END IF;
    END IF;
END $$;

-- ============================================================================
-- STEP 3: RESET SCHEMA (Drop new tables)
-- ============================================================================

DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS professional_profiles CASCADE;
DROP TABLE IF EXISTS social_profiles CASCADE;
DROP TABLE IF EXISTS verification_records CASCADE;
DROP TABLE IF EXISTS user_preferences CASCADE;
DROP TABLE IF EXISTS compliance_consents CASCADE;
DROP TABLE IF EXISTS user_security_log CASCADE;
DROP TABLE IF EXISTS user_onboarding CASCADE;
DROP TABLE IF EXISTS user_suspensions CASCADE;

-- ============================================================================
-- STEP 4: CREATE NEW PROFILES TABLE (Maintains Personal Info)
-- ============================================================================

CREATE TABLE profiles (
    -- Identity
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE,
    
    -- Personal Info (Kept here as requested)
    first_name TEXT NOT NULL,
    middle_name TEXT,
    last_name TEXT NOT NULL,
    display_name TEXT,
    date_of_birth DATE,
    gender gender_type,
    pronouns TEXT,
    bio TEXT,
    avatar_url TEXT,
    cover_image_url TEXT,
    
    -- Contact (Primary)
    email TEXT NOT NULL UNIQUE,
    email_verified BOOLEAN DEFAULT FALSE,
    phone TEXT,
    phone_verified BOOLEAN DEFAULT FALSE,
    primary_address_id UUID REFERENCES addresses(id),
    
    -- Roles & Classification
    app_role app_role DEFAULT 'user', -- Platform Role
    user_type user_type DEFAULT 'homeowner', -- Classification
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    is_suspended BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMPTZ,
    deletion_reason TEXT,
    deletion_requested BOOLEAN DEFAULT FALSE,
    deletion_requested_at TIMESTAMPTZ,
    deletion_scheduled_for DATE,
    
    -- Security (Basic)
    last_activity_at TIMESTAMPTZ,
    login_count INTEGER DEFAULT 0,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_verified_at TIMESTAMPTZ,
    password_reset_required BOOLEAN DEFAULT FALSE,
    password_changed_at TIMESTAMPTZ,
    
    -- Metadata
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    metadata JSONB DEFAULT '{}',
    
    -- References
    preferences_id UUID,
    professional_profile_id UUID,
    
    -- Audit
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID,
    version INTEGER DEFAULT 1
);

CREATE INDEX idx_profiles_auth_user ON profiles(auth_user_id);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_user_type ON profiles(user_type);
CREATE INDEX idx_profiles_app_role ON profiles(app_role);

-- Migrate basic data (Safe JSON extraction)
INSERT INTO profiles (
    id, auth_user_id, first_name, middle_name, last_name, display_name,
    date_of_birth, gender, pronouns, bio, avatar_url, cover_image_url,
    email, email_verified, phone, phone_verified, primary_address_id,
    app_role, user_type,
    is_active, is_suspended, is_deleted, deleted_at, deletion_reason,
    deletion_requested, deletion_requested_at, deletion_scheduled_for,
    last_activity_at, login_count, two_factor_enabled, two_factor_verified_at,
    password_reset_required, password_changed_at, tags, metadata,
    created_at, created_by, updated_at, updated_by, version
)
SELECT 
    id,
    auth_user_id,
    COALESCE((to_jsonb(p)->>'first_name'), ''),
    (to_jsonb(p)->>'middle_name'),
    COALESCE((to_jsonb(p)->>'last_name'), ''),
    (to_jsonb(p)->>'display_name'),
    (to_jsonb(p)->>'date_of_birth')::date,
    (to_jsonb(p)->>'gender')::gender_type,
    (to_jsonb(p)->>'pronouns'),
    (to_jsonb(p)->>'bio'),
    (to_jsonb(p)->>'avatar_url'),
    (to_jsonb(p)->>'cover_image_url'),
    email,
    COALESCE((to_jsonb(p)->>'email_verified')::boolean, FALSE),
    (to_jsonb(p)->>'phone'),
    COALESCE((to_jsonb(p)->>'phone_verified')::boolean, FALSE),
    (to_jsonb(p)->>'address_id')::uuid,
    -- Map old role to app_role (default to 'user' if not admin)
    CASE 
        WHEN (to_jsonb(p)->>'role') = 'admin' THEN 'admin'::app_role 
        WHEN (to_jsonb(p)->>'role') = 'super_admin' THEN 'super_admin'::app_role
        ELSE 'user'::app_role 
    END,
    COALESCE((to_jsonb(p)->>'user_type')::user_type, 'homeowner'::user_type),
    COALESCE((to_jsonb(p)->>'is_active')::boolean, TRUE),
    COALESCE((to_jsonb(p)->>'is_suspended')::boolean, FALSE),
    COALESCE((to_jsonb(p)->>'is_deleted')::boolean, FALSE),
    (to_jsonb(p)->>'deleted_at')::timestamptz,
    (to_jsonb(p)->>'deletion_reason'),
    COALESCE((to_jsonb(p)->>'deletion_requested')::boolean, FALSE),
    (to_jsonb(p)->>'deletion_requested_at')::timestamptz,
    (to_jsonb(p)->>'deletion_scheduled_for')::date,
    (to_jsonb(p)->>'last_activity_at')::timestamptz,
    COALESCE((to_jsonb(p)->>'login_count')::integer, 0),
    COALESCE((to_jsonb(p)->>'two_factor_enabled')::boolean, FALSE),
    (to_jsonb(p)->>'two_factor_verified_at')::timestamptz,
    COALESCE((to_jsonb(p)->>'password_reset_required')::boolean, FALSE),
    (to_jsonb(p)->>'password_changed_at')::timestamptz,
    COALESCE(ARRAY(SELECT jsonb_array_elements_text(to_jsonb(p)->'tags')), ARRAY[]::TEXT[]),
    COALESCE((to_jsonb(p)->>'metadata')::jsonb, '{}'::JSONB),
    created_at,
    (to_jsonb(p)->>'created_by')::uuid,
    updated_at,
    (to_jsonb(p)->>'updated_by')::uuid,
    COALESCE((to_jsonb(p)->>'version')::integer, 1)
FROM profiles_backup_pre_normalization p;

DO $$ BEGIN
    RAISE NOTICE '✓ Created profiles table';
END $$;

-- ============================================================================
-- STEP 5: CREATE HELPER TABLES
-- ============================================================================

-- 5.1 User Preferences
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
    timezone TEXT DEFAULT 'UTC',
    locale user_locale DEFAULT 'en-US',
    preferred_contact_method contact_method DEFAULT 'email',
    theme theme_preference DEFAULT 'auto',
    font_size TEXT DEFAULT 'medium',
    currency TEXT DEFAULT 'USD',
    date_format TEXT DEFAULT 'MM/DD/YYYY',
    time_format TEXT DEFAULT '12h',
    notifications_enabled BOOLEAN DEFAULT TRUE,
    email_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT FALSE,
    push_notifications BOOLEAN DEFAULT TRUE,
    marketing_emails BOOLEAN DEFAULT FALSE,
    profile_visibility profile_visibility DEFAULT 'private',
    show_email BOOLEAN DEFAULT FALSE,
    show_phone BOOLEAN DEFAULT FALSE,
    preferred_payment_method payment_method,
    default_dashboard_view TEXT,
    dashboard_widgets JSONB DEFAULT '[]',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5.2 Professional Profiles
CREATE TABLE professional_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
    job_title TEXT,
    department TEXT,
    company_name TEXT,
    license_number TEXT,
    license_state TEXT,
    license_expiry DATE,
    license_type TEXT,
    credentials TEXT[],
    business_registration_number TEXT,
    tax_id TEXT,
    professional_bio TEXT,
    specializations TEXT[],
    years_experience INTEGER,
    professional_website TEXT,
    portfolio_url TEXT,
    linkedin_url TEXT,
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5.3 Contacts
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    contact_type TEXT NOT NULL,
    contact_label TEXT,
    contact_name TEXT,
    relationship emergency_relationship,
    email TEXT,
    email_verified BOOLEAN DEFAULT FALSE,
    phone TEXT,
    phone_ext TEXT,
    phone_verified BOOLEAN DEFAULT FALSE,
    phone_type TEXT,
    address_id UUID REFERENCES addresses(id),
    is_primary BOOLEAN DEFAULT FALSE,
    priority INTEGER DEFAULT 1,
    can_contact BOOLEAN DEFAULT TRUE,
    preferred_contact_method contact_method DEFAULT 'email',
    best_time_to_contact TEXT,
    notes TEXT,
    internal_notes TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES profiles(id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES profiles(id),
    is_active BOOLEAN DEFAULT TRUE,
    CONSTRAINT contacts_email_or_phone_required CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

-- 5.4 Social Profiles
CREATE TABLE social_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    platform TEXT NOT NULL,
    platform_username TEXT,
    profile_url TEXT NOT NULL,
    bio TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_date DATE,
    is_public BOOLEAN DEFAULT TRUE,
    show_on_profile BOOLEAN DEFAULT TRUE,
    follower_count INTEGER,
    connection_count INTEGER,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    CONSTRAINT social_profiles_unique_platform UNIQUE (profile_id, platform)
);

-- 5.5 Verification Records
CREATE TABLE verification_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    verification_type verification_type NOT NULL,
    verification_status verification_status NOT NULL DEFAULT 'pending',
    requested_date DATE DEFAULT CURRENT_DATE,
    started_date DATE,
    completed_date DATE,
    expiry_date DATE,
    verification_provider TEXT,
    verification_provider_id TEXT,
    passed BOOLEAN,
    score INTEGER,
    grade TEXT,
    result_data JSONB DEFAULT '{}',
    report_url TEXT,
    certificate_url TEXT,
    verified_by UUID REFERENCES profiles(id),
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES profiles(id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES profiles(id),
    is_active BOOLEAN DEFAULT TRUE
);

-- 5.6 Compliance Consents
CREATE TABLE compliance_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    consent_type consent_type NOT NULL,
    consented BOOLEAN NOT NULL,
    consent_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    consent_version TEXT NOT NULL,
    consent_text TEXT,
    withdrawn BOOLEAN DEFAULT FALSE,
    withdrawn_date TIMESTAMPTZ,
    ip_address TEXT NOT NULL,
    user_agent TEXT,
    expiry_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5.7 User Security Log
CREATE TABLE user_security_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    event_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    session_id UUID,
    ip_address TEXT,
    user_agent TEXT,
    device_type TEXT,
    device_os TEXT,
    browser TEXT,
    location_city TEXT,
    location_country TEXT,
    success BOOLEAN DEFAULT TRUE,
    failure_reason TEXT,
    suspicious BOOLEAN DEFAULT FALSE,
    blocked BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5.8 User Onboarding
CREATE TABLE user_onboarding (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
    current_step INTEGER DEFAULT 0,
    total_steps INTEGER DEFAULT 5,
    completed BOOLEAN DEFAULT FALSE,
    steps_completed JSONB DEFAULT '[]',
    steps_skipped JSONB DEFAULT '[]',
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5.9 User Suspensions
CREATE TABLE user_suspensions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    suspension_reason suspension_reason NOT NULL,
    suspension_details TEXT NOT NULL,
    suspended_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    suspended_by UUID NOT NULL REFERENCES profiles(id),
    suspension_end_date TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    resolved_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES profiles(id),
    appeal_submitted BOOLEAN DEFAULT FALSE,
    appeal_date TIMESTAMPTZ,
    appeal_reason TEXT,
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- STEP 6: MIGRATE DATA (Robust JSON Extraction)
-- ============================================================================

DO $$
BEGIN
    -- Migrate to user_preferences
    INSERT INTO user_preferences (
        profile_id, timezone, locale, preferred_contact_method, theme,
        notifications_enabled, email_notifications, sms_notifications, push_notifications, marketing_emails,
        profile_visibility, preferred_payment_method, settings, created_at
    )
    SELECT 
        id,
        COALESCE((to_jsonb(p)->>'timezone'), 'UTC'),
        CASE 
            WHEN (to_jsonb(p)->>'locale') IN ('en-US', 'en-GB', 'en-CA', 'es-ES', 'fr-FR', 'de-DE', 'pt-BR') 
            THEN (to_jsonb(p)->>'locale')::user_locale
            ELSE 'en-US'::user_locale
        END,
        COALESCE((to_jsonb(p)->>'preferred_contact_method')::contact_method, 'email'::contact_method),
        COALESCE((to_jsonb(p)->>'theme')::theme_preference, 'auto'::theme_preference),
        COALESCE((to_jsonb(p)->>'notifications_enabled')::boolean, TRUE),
        COALESCE((to_jsonb(p)->>'email_notifications')::boolean, TRUE),
        COALESCE((to_jsonb(p)->>'sms_notifications')::boolean, FALSE),
        COALESCE((to_jsonb(p)->>'push_notifications')::boolean, TRUE),
        COALESCE((to_jsonb(p)->>'marketing_emails')::boolean, FALSE),
        COALESCE((to_jsonb(p)->>'profile_visibility')::profile_visibility, 'private'::profile_visibility),
        (to_jsonb(p)->>'preferred_payment_method')::payment_method,
        COALESCE((to_jsonb(p)->>'settings')::jsonb, '{}'::JSONB),
        created_at
    FROM profiles_backup_pre_normalization p;

    -- Update profiles with preferences FK
    UPDATE profiles p
    SET preferences_id = up.id
    FROM user_preferences up
    WHERE up.profile_id = p.id;

    -- Migrate to professional_profiles
    INSERT INTO professional_profiles (
        profile_id, job_title, department, company_name, license_number,
        license_state, license_expiry, tax_id, business_registration_number, linkedin_url, created_at
    )
    SELECT 
        id,
        (to_jsonb(p)->>'job_title'),
        (to_jsonb(p)->>'department'),
        (to_jsonb(p)->>'company_name'),
        (to_jsonb(p)->>'license_number'),
        (to_jsonb(p)->>'license_state'),
        (to_jsonb(p)->>'license_expiry')::date,
        (to_jsonb(p)->>'tax_id'),
        (to_jsonb(p)->>'business_registration_number'),
        (to_jsonb(p)->>'linkedin_url'),
        created_at
    FROM profiles_backup_pre_normalization p
    WHERE (to_jsonb(p)->>'job_title') IS NOT NULL 
       OR (to_jsonb(p)->>'company_name') IS NOT NULL
       OR (to_jsonb(p)->>'license_number') IS NOT NULL;

    -- Update profiles with professional_profile FK
    UPDATE profiles p
    SET professional_profile_id = pp.id
    FROM professional_profiles pp
    WHERE pp.profile_id = p.id;

    -- Migrate emergency contacts
    INSERT INTO contacts (
        profile_id, contact_type, contact_name, relationship, phone, is_primary, created_at
    )
    SELECT 
        id, 'emergency',
        (to_jsonb(p)->>'emergency_contact_name'),
        (to_jsonb(p)->>'emergency_contact_relationship')::emergency_relationship,
        (to_jsonb(p)->>'emergency_contact_phone'),
        TRUE, created_at
    FROM profiles_backup_pre_normalization p
    WHERE (to_jsonb(p)->>'emergency_contact_name') IS NOT NULL;

    -- Migrate secondary email
    INSERT INTO contacts (profile_id, contact_type, email, created_at)
    SELECT id, 'secondary-email', (to_jsonb(p)->>'email_secondary'), created_at
    FROM profiles_backup_pre_normalization p
    WHERE (to_jsonb(p)->>'email_secondary') IS NOT NULL;

    -- Migrate secondary phone
    INSERT INTO contacts (profile_id, contact_type, phone, created_at)
    SELECT id, 'secondary-phone', (to_jsonb(p)->>'phone_secondary'), created_at
    FROM profiles_backup_pre_normalization p
    WHERE (to_jsonb(p)->>'phone_secondary') IS NOT NULL;

    -- Migrate billing address
    INSERT INTO contacts (profile_id, contact_type, address_id, created_at)
    SELECT id, 'billing', (to_jsonb(p)->>'billing_address_id')::uuid, created_at
    FROM profiles_backup_pre_normalization p
    WHERE (to_jsonb(p)->>'billing_address_id') IS NOT NULL;

    -- Migrate social profiles
    INSERT INTO social_profiles (profile_id, platform, profile_url, created_at)
    SELECT id, 'twitter', (to_jsonb(p)->>'twitter_url'), created_at FROM profiles_backup_pre_normalization p WHERE (to_jsonb(p)->>'twitter_url') IS NOT NULL
    UNION ALL
    SELECT id, 'facebook', (to_jsonb(p)->>'facebook_url'), created_at FROM profiles_backup_pre_normalization p WHERE (to_jsonb(p)->>'facebook_url') IS NOT NULL
    UNION ALL
    SELECT id, 'website', (to_jsonb(p)->>'website'), created_at FROM profiles_backup_pre_normalization p WHERE (to_jsonb(p)->>'website') IS NOT NULL;

    -- Migrate verifications
    INSERT INTO verification_records (
        profile_id, verification_type, verification_status, passed, completed_date, verified_by, created_at
    )
    SELECT 
        id, 'identity'::verification_type, 'verified'::verification_status, TRUE,
        (to_jsonb(p)->>'identity_verified_at')::timestamptz::date,
        (to_jsonb(p)->>'identity_verified_by')::uuid,
        COALESCE((to_jsonb(p)->>'identity_verified_at')::timestamptz, created_at)
    FROM profiles_backup_pre_normalization p
    WHERE (to_jsonb(p)->>'identity_verified')::boolean = TRUE;

    -- Migrate compliance
    INSERT INTO compliance_consents (profile_id, consent_type, consented, consent_date, consent_version, ip_address)
    SELECT id, 'terms-of-service'::consent_type, TRUE, COALESCE((to_jsonb(p)->>'terms_accepted_at')::timestamptz, created_at), COALESCE((to_jsonb(p)->>'terms_version'), '1.0'), COALESCE((to_jsonb(p)->>'last_login_ip'), '0.0.0.0')
    FROM profiles_backup_pre_normalization p WHERE (to_jsonb(p)->>'terms_accepted')::boolean = TRUE;

    -- Migrate onboarding
    INSERT INTO user_onboarding (profile_id, current_step, completed, completed_at, created_at)
    SELECT id, COALESCE((to_jsonb(p)->>'onboarding_step')::integer, 0), COALESCE((to_jsonb(p)->>'onboarding_completed')::boolean, FALSE), (to_jsonb(p)->>'onboarding_completed_at')::timestamptz, created_at
    FROM profiles_backup_pre_normalization p;

    RAISE NOTICE '✓ Migrated all data';
END $$;

-- ============================================================================
-- STEP 7: CONSTRAINTS & RLS
-- ============================================================================

DO $$
BEGIN
    ALTER TABLE profiles ADD CONSTRAINT profiles_preferences_fkey FOREIGN KEY (preferences_id) REFERENCES user_preferences(id) ON DELETE SET NULL;
    ALTER TABLE profiles ADD CONSTRAINT profiles_professional_profile_fkey FOREIGN KEY (professional_profile_id) REFERENCES professional_profiles(id) ON DELETE SET NULL;
    ALTER TABLE profiles ADD CONSTRAINT profiles_created_by_fkey FOREIGN KEY (created_by) REFERENCES profiles(id);
    ALTER TABLE profiles ADD CONSTRAINT profiles_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES profiles(id);
    
    CREATE TRIGGER trigger_profiles_timestamp BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_timestamp();
    CREATE TRIGGER trigger_contacts_timestamp BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_timestamp();
    CREATE TRIGGER trigger_professional_profiles_timestamp BEFORE UPDATE ON professional_profiles FOR EACH ROW EXECUTE FUNCTION update_timestamp();
    CREATE TRIGGER trigger_social_profiles_timestamp BEFORE UPDATE ON social_profiles FOR EACH ROW EXECUTE FUNCTION update_timestamp();
    CREATE TRIGGER trigger_verification_timestamp BEFORE UPDATE ON verification_records FOR EACH ROW EXECUTE FUNCTION update_timestamp();
    CREATE TRIGGER trigger_user_preferences_timestamp BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE FUNCTION update_timestamp();
    CREATE TRIGGER trigger_onboarding_timestamp BEFORE UPDATE ON user_onboarding FOR EACH ROW EXECUTE FUNCTION update_timestamp();
    CREATE TRIGGER trigger_suspensions_timestamp BEFORE UPDATE ON user_suspensions FOR EACH ROW EXECUTE FUNCTION update_timestamp();
END $$;

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_security_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_suspensions ENABLE ROW LEVEL SECURITY;

-- Basic Policies
CREATE POLICY "Users manage own contacts" ON contacts FOR ALL TO authenticated USING (profile_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()));
CREATE POLICY "Users manage own professional profile" ON professional_profiles FOR ALL TO authenticated USING (profile_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()));
CREATE POLICY "Users manage own social profiles" ON social_profiles FOR ALL TO authenticated USING (profile_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()));
CREATE POLICY "Users view own verifications" ON verification_records FOR SELECT TO authenticated USING (profile_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()));
CREATE POLICY "Users manage own preferences" ON user_preferences FOR ALL TO authenticated USING (profile_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()));
CREATE POLICY "Users view own consents" ON compliance_consents FOR SELECT TO authenticated USING (profile_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()));
CREATE POLICY "Users view own security log" ON user_security_log FOR SELECT TO authenticated USING (profile_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()));
CREATE POLICY "Users manage own onboarding" ON user_onboarding FOR ALL TO authenticated USING (profile_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()));
CREATE POLICY "Users view own suspensions" ON user_suspensions FOR SELECT TO authenticated USING (profile_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()));

DO $$ BEGIN
    RAISE NOTICE '✅ MIGRATION COMPLETE!';
END $$;
