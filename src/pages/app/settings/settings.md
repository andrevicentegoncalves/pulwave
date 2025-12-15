# PulWave Profiles System Documentation

**Version:** 3.0  
**Last Updated:** December 14, 2025  
**Status:** Production Architecture Specification

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architecture Overview](#2-architecture-overview)
3. [Core Tables](#3-core-tables)
4. [Normalization Strategy](#4-normalization-strategy)
5. [Multi-Tenancy Design](#5-multi-tenancy-design)
6. [RLS Policies](#6-rls-policies)
7. [Triggers & Automation](#7-triggers--automation)
8. [Enums Reference](#8-enums-reference)
9. [Design Decisions](#9-design-decisions)
10. [Multi-Language Support](#10-multi-language-support)
11. [Future Considerations](#11-future-considerations)
12. [Migration Guide](#12-migration-guide)

---

## 1. Executive Summary

The PulWave profiles system is the identity foundation for a multi-tenant real estate management SaaS platform. It supports:

- **Multiple user types**: Homeowners, tenants, landlords, property managers, condominium admins, vendors
- **Multi-organization membership**: Users can have different roles across organizations
- **Enterprise security**: RLS policies, 2FA, soft-delete, audit trails
- **GDPR compliance**: Deletion workflows, data export capability
- **Internationalization**: 20+ locales, multi-language support

### Key Principles

1. **Single Source of Truth**: Each data type lives in exactly one table
2. **Multi-Tenant Isolation**: Organization-scoped data with RLS enforcement
3. **Audit Everything**: Complete `created_at/by`, `updated_at/by` on all tables
4. **Soft Delete**: `is_active`, `is_deleted` flags with scheduled purge
5. **Extensibility**: JSONB for flexible configuration, proper enums for fixed values

---

## 2. Architecture Overview

### Entity Relationship Diagram (ERD)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           auth.users                                        │
│  (Supabase Auth - email, password, OAuth)                                   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ 1:1 (auth_user_id FK)
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              profiles                                       │
│  - Core identity (name, email, avatar)                                      │
│  - Auth state (is_active, is_suspended, 2FA)                               │
│  - Platform role (app_role)                                                 │
│  - Audit (created_at/by, updated_at/by, version)                           │
└──────┬─────────────────┬─────────────────┬─────────────────┬───────────────┘
       │ 1:N             │ 1:N             │ 1:N             │ N:M
       ▼                 ▼                 ▼                 ▼
┌─────────────┐ ┌─────────────────┐ ┌─────────────┐ ┌─────────────────────────┐
│  addresses  │ │    contacts     │ │ user_prefs  │ │   organization_members  │
│             │ │ (phones, email, │ │ (single     │ │                         │
│             │ │  emergency)     │ │  source)    │ │                         │
└─────────────┘ └─────────────────┘ └─────────────┘ └────────────┬────────────┘
                                                                 │
                                                                 ▼
                                                    ┌─────────────────────────┐
                                                    │     organizations       │
                                                    └─────────────────────────┘
```

### Table Responsibilities

| Table | Responsibility | Multi-Tenant? |
|-------|---------------|---------------|
| `profiles` | Core identity, auth state | No (user-owned) |
| `user_preferences` | UI, locale, notifications | Yes (per org) |
| `contacts` | Phones, emergency contacts | Yes |
| `addresses` | Physical addresses | Yes |
| `organizations` | Company/condominium entities | Yes (root) |
| `organization_members` | User-org relationships | Yes |
| `professional_profiles` | Work/career info | Yes |
| `social_profiles` | Social media links | Yes |
| `legal_documents` | Contracts, agreements | Yes |
| `notifications` | User notifications | Yes |

---

## 3. Core Tables

### 3.1 profiles

The central identity table linking to Supabase Auth. Auth state columns moved to `profile_auth_state` table.

```sql
CREATE TABLE profiles (
    -- ============================================
    -- IDENTITY (5 columns)
    -- ============================================
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    email TEXT NOT NULL UNIQUE,
    last_active_organization_id UUID,
    
    -- ============================================
    -- PERSONAL INFO (7 columns)
    -- ============================================
    first_name TEXT,
    middle_name TEXT,
    last_name TEXT,
    display_name TEXT,
    date_of_birth DATE,
    gender VARCHAR(50),  -- References master_data
    pronouns TEXT,
    
    -- ============================================
    -- PROFILE CONTENT (2 columns)
    -- ============================================
    bio TEXT,
    avatar_url TEXT,
    
    -- ============================================
    -- PLATFORM ROLE (1 column)
    -- ============================================
    app_role VARCHAR(50) DEFAULT 'user',
    
    -- ============================================
    -- STATUS (3 columns)
    -- ============================================
    is_deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMPTZ,
    deletion_reason TEXT,
    
    -- ============================================
    -- ACTIVITY (2 columns)
    -- ============================================
    last_activity_at TIMESTAMPTZ,
    login_count INTEGER DEFAULT 0,
    
    -- ============================================
    -- ADDRESS REFERENCES (2 columns)
    -- ============================================
    address_id UUID,
    billing_address_id UUID,
    
    -- ============================================
    -- BILLING (2 columns)
    -- ============================================
    has_billing_access BOOLEAN DEFAULT false,
    stripe_customer_id TEXT,
    
    -- ============================================
    -- ATTRIBUTION (5 columns)
    -- ============================================
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    referral_code TEXT,
    referred_by UUID REFERENCES profiles(id),
    
    -- ============================================
    -- COMPLIANCE (2 columns)
    -- ============================================
    profile_completeness_score INTEGER DEFAULT 0,
    dashboard_layout JSONB DEFAULT '{}'::JSONB,
    
    -- ============================================
    -- METADATA (2 columns)
    -- ============================================
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    metadata JSONB DEFAULT '{}'::JSONB,
    
    -- ============================================
    -- AI (2 columns)
    -- ============================================
    ai_profile_embedding VECTOR(1536),
    ai_last_analyzed_at TIMESTAMPTZ,
    
    -- ============================================
    -- TRANSLATIONS (1 column)
    -- ============================================
    translations JSONB DEFAULT '{}'::JSONB,
    
    -- ============================================
    -- AUDIT TRAIL (ALWAYS LAST - 7 columns)
    -- ============================================
    is_active BOOLEAN DEFAULT true,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID,
    deleted_by UUID
);

-- Indexes
CREATE INDEX idx_profiles_auth_user_id ON profiles(auth_user_id);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_username ON profiles(username) WHERE username IS NOT NULL;
CREATE INDEX idx_profiles_app_role ON profiles(app_role);
CREATE INDEX idx_profiles_is_active ON profiles(is_active) WHERE is_active = true;
```

### 3.1.1 profile_auth_state (NEW)

Auth-related state separated from profiles for cleaner architecture.

```sql
CREATE TABLE profile_auth_state (
    profile_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    two_factor_enabled BOOLEAN DEFAULT false,
    two_factor_verified_at TIMESTAMPTZ,
    password_reset_required BOOLEAN DEFAULT false,
    password_changed_at TIMESTAMPTZ,
    webauthn_enabled BOOLEAN DEFAULT false,
    webauthn_registered_at TIMESTAMPTZ,
    sso_provider TEXT,
    sso_provider_id TEXT,
    is_suspended BOOLEAN DEFAULT false,
    suspended_at TIMESTAMPTZ,
    suspended_by UUID,
    suspension_reason TEXT,
    deletion_requested BOOLEAN DEFAULT false,
    deletion_requested_at TIMESTAMPTZ,
    deletion_scheduled_for DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```


### 3.2 user_preferences (Consolidated)

Single source of truth for all user preferences.

```sql
CREATE TABLE user_preferences (
    -- ============================================
    -- PRIMARY KEYS (3 columns)
    -- ============================================
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- ============================================
    -- LOCALIZATION (5 columns)
    -- ============================================
    timezone TEXT DEFAULT 'UTC',
    locale locale_type DEFAULT 'en-US',
    date_format TEXT DEFAULT 'YYYY-MM-DD',
    time_format TEXT DEFAULT '24h',  -- '12h' or '24h'
    preferred_currency TEXT DEFAULT 'USD',
    
    -- ============================================
    -- CONTACT PREFERENCES (2 columns)
    -- ============================================
    preferred_contact_method contact_method DEFAULT 'email',
    do_not_disturb_enabled BOOLEAN DEFAULT false,
    
    -- ============================================
    -- UI PREFERENCES (5 columns)
    -- ============================================
    theme theme_preference DEFAULT 'auto',
    font_size TEXT DEFAULT 'medium',  -- 'small', 'medium', 'large'
    sidebar_collapsed BOOLEAN DEFAULT false,
    dashboard_widgets JSONB DEFAULT '[]'::JSONB,
    ui_layout JSONB DEFAULT '{}'::JSONB,  -- Pulwave/Minimalist config
    
    -- ============================================
    -- NOTIFICATION PREFERENCES (5 columns)
    -- ============================================
    notifications_enabled BOOLEAN DEFAULT true,
    email_notifications BOOLEAN DEFAULT true,
    sms_notifications BOOLEAN DEFAULT false,
    push_notifications BOOLEAN DEFAULT true,
    marketing_emails BOOLEAN DEFAULT false,
    
    -- ============================================
    -- PRIVACY SETTINGS (4 columns)
    -- ============================================
    profile_visibility profile_visibility DEFAULT 'organization',
    show_email BOOLEAN DEFAULT false,
    show_phone BOOLEAN DEFAULT false,
    activity_status_visible BOOLEAN DEFAULT true,
    
    -- ============================================
    -- CONSENT FLAGS (3 columns)
    -- ============================================
    data_processing_consent BOOLEAN DEFAULT false,
    marketing_consent BOOLEAN DEFAULT false,
    analytics_consent BOOLEAN DEFAULT true,
    
    -- ============================================
    -- AUDIT (6 columns)
    -- ============================================
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID,
    
    -- ============================================
    -- CONSTRAINTS
    -- ============================================
    CONSTRAINT uq_user_preferences_profile_org 
        UNIQUE (profile_id, organization_id)
);

-- Indexes
CREATE INDEX idx_user_prefs_profile ON user_preferences(profile_id);
CREATE INDEX idx_user_prefs_org ON user_preferences(organization_id);
```

### 3.3 contacts

Normalized contact information (phones, emergency contacts).

```sql
CREATE TABLE contacts (
    -- ============================================
    -- IDENTITY (4 columns)
    -- ============================================
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    contact_type contact_type NOT NULL,  -- 'phone-primary', 'phone-emergency', etc.
    
    -- ============================================
    -- CONTACT DETAILS (6 columns)
    -- ============================================
    contact_label TEXT,  -- Custom label like "Mom's Cell"
    contact_name TEXT,   -- For emergency contacts
    relationship emergency_relationship,  -- parent, spouse, friend, etc.
    email TEXT,
    email_verified BOOLEAN DEFAULT false,
    phone TEXT,
    phone_country_code TEXT,
    phone_verified BOOLEAN DEFAULT false,
    
    -- ============================================
    -- ADDRESS LINK (1 column)
    -- ============================================
    address_id UUID REFERENCES addresses(id) ON DELETE SET NULL,
    
    -- ============================================
    -- METADATA (3 columns)
    -- ============================================
    is_primary BOOLEAN DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    notes TEXT,
    
    -- ============================================
    -- AUDIT (4 columns)
    -- ============================================
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES profiles(id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES profiles(id),
    
    -- ============================================
    -- CONSTRAINTS
    -- ============================================
    CONSTRAINT contacts_email_or_phone_required 
        CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

-- Indexes
CREATE INDEX idx_contacts_profile ON contacts(profile_id);
CREATE INDEX idx_contacts_org ON contacts(organization_id);
CREATE INDEX idx_contacts_type ON contacts(contact_type);
```

### 3.4 addresses

Physical addresses with international support.

```sql
CREATE TABLE addresses (
    -- ============================================
    -- IDENTITY (4 columns)
    -- ============================================
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    address_type address_type NOT NULL DEFAULT 'home',
    
    -- ============================================
    -- ADDRESS FIELDS (10 columns)
    -- ============================================
    label TEXT,  -- Custom label
    line1 TEXT NOT NULL,
    line2 TEXT,
    line3 TEXT,
    city TEXT NOT NULL,
    state_province TEXT,
    postal_code TEXT,
    country_code TEXT NOT NULL,  -- ISO 3166-1 alpha-2
    
    -- ============================================
    -- ADMINISTRATIVE DIVISIONS (3 columns)
    -- ============================================
    region_division_id UUID REFERENCES administrative_divisions(id),
    municipality_division_id UUID REFERENCES administrative_divisions(id),
    parish_division_id UUID REFERENCES administrative_divisions(id),
    
    -- ============================================
    -- GEOLOCATION (2 columns)
    -- ============================================
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- ============================================
    -- METADATA (4 columns)
    -- ============================================
    is_primary BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    verified_at TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT true,
    
    -- ============================================
    -- AUDIT (6 columns)
    -- ============================================
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID,
    deleted_at TIMESTAMPTZ,
    deleted_by UUID
);

-- Indexes
CREATE INDEX idx_addresses_profile ON addresses(profile_id);
CREATE INDEX idx_addresses_org ON addresses(organization_id);
CREATE INDEX idx_addresses_type ON addresses(address_type);
CREATE INDEX idx_addresses_country ON addresses(country_code);
```

### 3.5 organization_members

Many-to-many relationship with roles.

```sql
CREATE TABLE organization_members (
    -- ============================================
    -- IDENTITY (4 columns)
    -- ============================================
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role org_member_role NOT NULL DEFAULT 'viewer',
    
    -- ============================================
    -- MEMBERSHIP DETAILS (4 columns)
    -- ============================================
    title TEXT,  -- Job title
    department TEXT,
    is_personal_org BOOLEAN DEFAULT false,  -- Auto-created personal workspace
    invited_by UUID REFERENCES profiles(id),
    
    -- ============================================
    -- STATUS (2 columns)
    -- ============================================
    is_active BOOLEAN NOT NULL DEFAULT true,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- ============================================
    -- AUDIT (4 columns)
    -- ============================================
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID,
    
    -- ============================================
    -- CONSTRAINTS
    -- ============================================
    CONSTRAINT uq_org_member UNIQUE (organization_id, profile_id)
);

-- Indexes
CREATE INDEX idx_org_members_org ON organization_members(organization_id);
CREATE INDEX idx_org_members_profile ON organization_members(profile_id);
CREATE INDEX idx_org_members_role ON organization_members(role);
```

---

## 4. Normalization Strategy

### What Was Normalized (and Why)

#### 4.1 Contacts (from profiles)

**Before:**
```sql
-- In profiles table
phone_code TEXT,
phone_number TEXT,
phone_secondary_code TEXT,
phone_secondary_number TEXT,
emergency_contact_name TEXT,
emergency_contact_phone TEXT,
emergency_contact_relationship TEXT,
```

**After:** Moved to `contacts` table with:
- Support for unlimited contacts per user
- Contact type enum (primary, emergency, work, etc.)
- Independent verification per contact
- Organization scoping for shared contacts

#### 4.2 Preferences (consolidated)

**Before:** Three sources:
1. `profiles` table: timezone, date_format, time_format, dashboard_layout
2. `profile_preferences` table: 19 columns
3. `user_preferences` table: 28 columns

**After:** Single `user_preferences` table with:
- All UI preferences
- All notification preferences
- All privacy settings
- Per-organization customization support

#### 4.3 Addresses (already normalized)

Already in separate `addresses` table with:
- Profile link (`profile_id`)
- Organization link (`organization_id`)
- Address type enum
- International support (country_code, admin divisions)

### What Stays in Profiles

These fields remain in `profiles` because they are:
- Core identity (name, email, avatar)
- Auth state (is_active, 2FA, password status)
- Platform-wide (not org-specific)

---

## 5. Multi-Tenancy Design

### Organization Hierarchy

```
Organization (Company/Condominium)
├── Members (Users with roles)
├── Properties (Land → Building → Unit)
├── Finances (Accounts, Transactions)
└── Settings (Preferences, Notifications)
```

### Data Isolation Rules

| Data Type | Isolation Level | RLS Pattern |
|-----------|-----------------|-------------|
| Profiles | User-owned | `auth_user_id = auth.uid()` |
| User Preferences | Org-scoped | `organization_id IN get_my_organization_ids()` |
| Contacts | Org-scoped | `profile_id = current_profile() OR is_org_member(org_id)` |
| Addresses | Hybrid | Profile OR org access |
| Properties | Org-scoped | `organization_id` FK |
| Transactions | Org-scoped | `organization_id` FK |

### Helper Functions

```sql
-- Get current user's profile ID
CREATE FUNCTION get_current_profile_id() RETURNS UUID AS $$
    SELECT id FROM profiles WHERE auth_user_id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Get all organizations user belongs to
CREATE FUNCTION get_my_organization_ids() RETURNS SETOF UUID AS $$
    SELECT organization_id 
    FROM organization_members 
    WHERE profile_id = get_current_profile_id() 
    AND is_active = true
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Check if user is org member
CREATE FUNCTION is_org_member(org_id UUID) RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM organization_members 
        WHERE organization_id = org_id 
        AND profile_id = get_current_profile_id()
        AND is_active = true
    )
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Check if user is org admin
CREATE FUNCTION is_org_admin(org_id UUID) RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM organization_members 
        WHERE organization_id = org_id 
        AND profile_id = get_current_profile_id()
        AND is_active = true
        AND role IN ('owner', 'admin', 'co-owner')
    )
$$ LANGUAGE sql SECURITY DEFINER STABLE;
```

---

## 6. RLS Policies

### profiles Table

```sql
-- Service role bypass
CREATE POLICY "Service role full access" ON profiles
    FOR ALL USING (auth.role() = 'service_role');

-- Users can only see their own profile
CREATE POLICY "profiles_select_own" ON profiles
    FOR SELECT USING (auth_user_id = auth.uid());

-- Users can only update their own profile
CREATE POLICY "profiles_update_own" ON profiles
    FOR UPDATE USING (auth_user_id = auth.uid())
    WITH CHECK (auth_user_id = auth.uid());

-- Users can insert their own profile (signup)
CREATE POLICY "profiles_insert_own" ON profiles
    FOR INSERT WITH CHECK (auth_user_id = auth.uid());

-- Org members can view colleague profiles (limited fields via view)
CREATE POLICY "profiles_select_org_members" ON profiles
    FOR SELECT USING (
        id IN (
            SELECT om2.profile_id 
            FROM organization_members om1
            JOIN organization_members om2 ON om1.organization_id = om2.organization_id
            WHERE om1.profile_id = get_current_profile_id()
            AND om1.is_active = true 
            AND om2.is_active = true
        )
    );
```

### user_preferences Table

```sql
CREATE POLICY "user_preferences_select" ON user_preferences
    FOR SELECT USING (
        profile_id = get_current_profile_id() 
        OR organization_id IN (SELECT get_my_organization_ids())
    );

CREATE POLICY "user_preferences_insert" ON user_preferences
    FOR INSERT WITH CHECK (
        profile_id = get_current_profile_id()
    );

CREATE POLICY "user_preferences_update" ON user_preferences
    FOR UPDATE USING (profile_id = get_current_profile_id());

CREATE POLICY "user_preferences_delete" ON user_preferences
    FOR DELETE USING (profile_id = get_current_profile_id());
```

### contacts Table

```sql
CREATE POLICY "contacts_select" ON contacts
    FOR SELECT USING (
        profile_id = get_current_profile_id() 
        OR organization_id IN (SELECT get_my_organization_ids())
    );

CREATE POLICY "contacts_insert" ON contacts
    FOR INSERT WITH CHECK (
        profile_id = get_current_profile_id() 
        OR organization_id IN (SELECT get_my_organization_ids())
    );

CREATE POLICY "contacts_update" ON contacts
    FOR UPDATE USING (
        profile_id = get_current_profile_id() 
        OR organization_id IN (SELECT get_my_organization_ids())
    );

CREATE POLICY "contacts_delete" ON contacts
    FOR DELETE USING (
        profile_id = get_current_profile_id() 
        OR is_org_admin(organization_id)
    );
```

---

## 7. Triggers & Automation

### Audit Trail Trigger

```sql
CREATE OR REPLACE FUNCTION set_audit_fields()
RETURNS TRIGGER AS $$
DECLARE
    current_profile_id UUID;
BEGIN
    -- Get current user's profile ID
    SELECT id INTO current_profile_id 
    FROM profiles 
    WHERE auth_user_id = auth.uid();
    
    IF TG_OP = 'INSERT' THEN
        NEW.created_at := COALESCE(NEW.created_at, NOW());
        NEW.created_by := COALESCE(NEW.created_by, current_profile_id);
        NEW.updated_at := NEW.created_at;
        NEW.updated_by := NEW.created_by;
    ELSIF TG_OP = 'UPDATE' THEN
        NEW.updated_at := NOW();
        NEW.updated_by := current_profile_id;
        NEW.version := COALESCE(OLD.version, 0) + 1;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply to all profile-related tables
CREATE TRIGGER trg_profiles_audit
    BEFORE INSERT OR UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION set_audit_fields();

CREATE TRIGGER trg_user_preferences_audit
    BEFORE INSERT OR UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION set_audit_fields();

CREATE TRIGGER trg_contacts_audit
    BEFORE INSERT OR UPDATE ON contacts
    FOR EACH ROW EXECUTE FUNCTION set_audit_fields();
```

### Personal Organization Auto-Creation

```sql
CREATE OR REPLACE FUNCTION create_personal_organization()
RETURNS TRIGGER AS $$
DECLARE
    new_org_id UUID;
BEGIN
    -- Create personal workspace
    INSERT INTO organizations (
        name,
        organization_type,
        is_personal,
        created_by
    ) VALUES (
        COALESCE(NEW.display_name, NEW.first_name || '''s Workspace', 'My Workspace'),
        'personal',
        true,
        NEW.id
    ) RETURNING id INTO new_org_id;
    
    -- Add user as owner
    INSERT INTO organization_members (
        organization_id,
        profile_id,
        role,
        is_personal_org,
        created_by
    ) VALUES (
        new_org_id,
        NEW.id,
        'owner',
        true,
        NEW.id
    );
    
    -- Set as last active org
    UPDATE profiles 
    SET last_active_organization_id = new_org_id
    WHERE id = NEW.id;
    
    -- Create default preferences
    INSERT INTO user_preferences (
        profile_id,
        organization_id,
        created_by
    ) VALUES (
        NEW.id,
        new_org_id,
        NEW.id
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_create_personal_organization
    AFTER INSERT ON profiles
    FOR EACH ROW EXECUTE FUNCTION create_personal_organization();
```

### Profile Completeness Calculator

```sql
CREATE OR REPLACE FUNCTION calculate_profile_completeness()
RETURNS TRIGGER AS $$
DECLARE
    score INTEGER := 0;
    max_score INTEGER := 100;
BEGIN
    -- Basic info (40 points)
    IF NEW.first_name IS NOT NULL THEN score := score + 10; END IF;
    IF NEW.last_name IS NOT NULL THEN score := score + 10; END IF;
    IF NEW.avatar_url IS NOT NULL THEN score := score + 10; END IF;
    IF NEW.bio IS NOT NULL THEN score := score + 10; END IF;
    
    -- Verification (30 points)
    IF NEW.email_verified = true THEN score := score + 15; END IF;
    IF NEW.phone_verified = true THEN score := score + 15; END IF;
    
    -- Security (20 points)
    IF NEW.two_factor_enabled = true THEN score := score + 20; END IF;
    
    -- Additional (10 points)
    IF NEW.date_of_birth IS NOT NULL THEN score := score + 5; END IF;
    IF EXISTS (SELECT 1 FROM addresses WHERE profile_id = NEW.id AND is_active = true) THEN
        score := score + 5;
    END IF;
    
    NEW.profile_completeness_score := score;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_calculate_completeness
    BEFORE INSERT OR UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION calculate_profile_completeness();
```

---

## 8. Enums Reference

### app_role
Platform-wide roles for system access.
```sql
CREATE TYPE app_role AS ENUM ('super_admin', 'admin', 'support', 'user');
```

### user_type
Business context classification.
```sql
CREATE TYPE user_type AS ENUM (
    'homeowner', 'tenant', 'landlord', 'property-manager',
    'condominium-admin', 'real-estate-agent', 'vendor', 'admin',
    'contractor', 'broker', 'investor', 'developer', 'manager', 'designer'
);
```

### org_member_role
Organization-specific roles (36 values).
```sql
CREATE TYPE org_member_role AS ENUM (
    'owner', 'co-owner', 'investor', 'board-member', 'executive',
    'shareholder', 'partner', 'admin', 'manager', 'portfolio-manager',
    'property-manager', 'asset-manager', 'community-manager',
    'facility-manager', 'accountant', 'bookkeeper', 'financial-analyst',
    'auditor', 'inspector', 'maintenance', 'viewer', ...
);
```

### contact_type
```sql
CREATE TYPE contact_type AS ENUM (
    'phone-primary', 'phone-secondary', 'phone-mobile', 'phone-work',
    'phone-home', 'phone-emergency', 'email-primary', 'email-secondary',
    'email-work', 'email-personal', 'fax', 'whatsapp', 'telegram', 'other'
);
```

### theme_preference
```sql
CREATE TYPE theme_preference AS ENUM ('light', 'dark', 'auto', 'system');
```

### profile_visibility
```sql
CREATE TYPE profile_visibility AS ENUM ('public', 'organization', 'private');
```

### gender_type
```sql
CREATE TYPE gender_type AS ENUM ('male', 'female', 'non-binary', 'prefer-not-to-say', 'other');
```

### address_type
```sql
CREATE TYPE address_type AS ENUM (
    'home', 'work', 'billing', 'shipping', 'property',
    'mailing', 'legal', 'temporary', 'previous', 'other'
);
```

### user_locale
```sql
CREATE TYPE user_locale AS ENUM (
    'en-US', 'en-GB', 'en-CA', 'en-AU', 'es-ES', 'es-MX', 'es-AR',
    'fr-FR', 'fr-CA', 'de-DE', 'it-IT', 'pt-BR', 'pt-PT',
    'zh-CN', 'zh-TW', 'ja-JP', 'ko-KR', 'ar-SA', 'hi-IN', 'ru-RU'
);
```

---

## 9. Design Decisions

### 9.1 Why `auth_user_id` Must Be NOT NULL

**Problem:** Nullable `auth_user_id` allows orphaned profiles.

**Decision:** Make it NOT NULL with FK to auth.users.

**Rationale:**
- Every profile MUST have an auth identity
- Prevents orphaned data
- Simplifies RLS policies
- Enables cascading delete when user is removed from auth

### 9.2 Theme Layout Configuration

**Options Considered:**
1. Enum column (`theme_layout_type`)
2. Reference table (`theme_layouts`)
3. JSONB in `user_preferences.ui_layout`

**Decision:** JSONB in `user_preferences.ui_layout`

**Rationale:**
- Maximum flexibility for UI customization
- No schema migration for new layouts
- Supports complex configuration (Pulwave, Minimalist, future themes)
- Can store component-level preferences

**Example:**
```json
{
  "layout": "pulwave",
  "sidebar": { "collapsed": false, "position": "left" },
  "header": { "sticky": true },
  "components": {
    "dashboard": { "widgets": ["stats", "chart", "tasks"] }
  }
}
```

### 9.3 Emergency Contacts

**Decision:** Store in `contacts` table with `contact_type = 'phone-emergency'`

**Rationale:**
- Supports multiple emergency contacts
- Consistent data model
- Inherits RLS and audit trail
- Can link to addresses

### 9.4 Circular FK Resolution

**Problem:** `created_by`/`updated_by` reference `profiles.id`, but profile creation needs these fields.

**Solutions:**
1. Reference `auth.users(id)` instead
2. Allow NULL for self-references
3. Use trigger to auto-populate

**Decision:** Option 2 + Option 3 (hybrid)
- Allow NULL initially
- Trigger sets to `NEW.id` for profile's own record
- Regular updates set to current user's profile ID

### 9.5 Preference Organization Scoping

**Question:** Should preferences be global or per-organization?

**Decision:** Per-organization with global fallback

**Implementation:**
```sql
-- Unique constraint allows org-specific OR global (NULL org)
CONSTRAINT uq_user_preferences_profile_org 
    UNIQUE (profile_id, organization_id)
```

**Query pattern:**
```sql
SELECT * FROM user_preferences
WHERE profile_id = :profile_id
AND (organization_id = :current_org_id OR organization_id IS NULL)
ORDER BY organization_id NULLS LAST
LIMIT 1;
```

---

## 10. Multi-Language Support

### Translation Strategy

The profiles system uses three translation approaches:

#### 10.1 UI Translations
Static UI strings stored in `ui_translations` table.
```sql
SELECT translation 
FROM ui_translations 
WHERE locale = 'pt-PT' AND key = 'profile.settings.title';
```

#### 10.2 Schema Translations
Database labels (column names, enum values) in `schema_translations`.
```sql
SELECT translation 
FROM schema_translations 
WHERE locale = 'de-DE' 
AND entity_type = 'enum' 
AND entity_name = 'user_type' 
AND item_key = 'homeowner';
```

#### 10.3 Content Translations
User-generated content with JSONB per row.
```sql
-- organizations table has translations JSONB column
{
  "name": {
    "en-US": "Ocean View Condos",
    "pt-PT": "Condos Vista Mar",
    "zh-CN": "海景公寓"
  }
}
```

### Locale-Aware Queries

```sql
-- Get user's preferred locale
CREATE FUNCTION get_user_locale() RETURNS TEXT AS $$
    SELECT COALESCE(
        (SELECT locale::TEXT FROM user_preferences WHERE profile_id = get_current_profile_id() LIMIT 1),
        'en-US'
    )
$$ LANGUAGE sql STABLE;

-- Get translated enum value
CREATE FUNCTION get_enum_translation(
    enum_name TEXT,
    enum_value TEXT,
    target_locale TEXT DEFAULT NULL
) RETURNS TEXT AS $$
    SELECT COALESCE(
        (SELECT translation FROM schema_translations 
         WHERE entity_type = 'enum' 
         AND entity_name = enum_name 
         AND item_key = enum_value
         AND locale = COALESCE(target_locale, get_user_locale())),
        enum_value
    )
$$ LANGUAGE sql STABLE;
```

---

## 11. Future Considerations

### 11.1 AI Personalization
```sql
-- Future: Add to user_preferences
ai_preferences JSONB DEFAULT '{
    "enabled": true,
    "assistant_name": "Claude",
    "response_style": "professional",
    "suggestions_enabled": true
}'::JSONB
```

### 11.2 Multi-App Support
If PulWave expands to multiple apps (restaurant management, etc.):
```sql
-- Future: app-specific preferences
app_id UUID REFERENCES apps(id),
app_preferences JSONB
```

### 11.3 Multi-Currency
```sql
-- Already supported via:
preferred_currency TEXT DEFAULT 'USD'
-- Plus currency_exchange_rates table
```

### 11.4 Advanced Privacy Controls
```sql
-- Future: granular data sharing
data_sharing_consents JSONB DEFAULT '{
    "analytics": { "enabled": true, "providers": ["mixpanel"] },
    "marketing": { "enabled": false },
    "third_party": { "enabled": false, "partners": [] }
}'::JSONB
```

---

## 12. Migration Guide

See separate documents:
- `profiles_migration_v3.sql` - Main migration script
- `profiles_backup_and_verify.sql` - Backup procedures
- `profiles_rollback.sql` - Rollback procedures
- `implementation_checklist.md` - Step-by-step guide

### Quick Migration Summary

1. **Backup** all profile-related tables
2. **Add FK** `auth_user_id -> auth.users(id)`
3. **Migrate phones** to `contacts` table
4. **Migrate emergency contacts** to `contacts` table
5. **Consolidate preferences** into `user_preferences`
6. **Add new columns** (phone_verified, attribution, SSO)
7. **Drop deprecated columns** from profiles
8. **Deprecate** `profile_preferences` table
9. **Update views** to reflect new structure
10. **Verify** with test queries

---

## Appendix A: Column Removal List

Columns to remove from `profiles` after migration:

```sql
-- Phone columns (migrated to contacts)
phone_code
phone_number
phone_secondary_code
phone_secondary_number
emergency_contact_name
emergency_contact_phone
emergency_contact_relationship

-- Preference columns (migrated to user_preferences)
timezone
date_format
time_format
preferred_locale
dashboard_layout
```

## Appendix B: View Updates Required

```sql
-- v_profiles_organized needs update for new structure
-- v_payment_methods_with_icons - no changes needed
-- v_prospect_summary - no changes needed
```