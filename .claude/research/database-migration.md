# Pulwave Database Migration Plan

> Complete migration strategy from current single-schema database to multi-schema, multi-tenant architecture.

## Table of Contents

1. [Current State](#current-state)
2. [Target State](#target-state)
3. [Migration Phases](#migration-phases)
4. [SQL Scripts](#sql-scripts)
5. [Rollback Strategy](#rollback-strategy)
6. [Verification Checklist](#verification-checklist)

---

## Current State

### Existing Tables (public schema)

Based on `schema-ai.md`, current database contains:

```
public schema
├── Core
│   └── profiles              # User profile information
│
├── Translation System
│   ├── locales               # Supported locales (139)
│   ├── ui_translations       # Static UI strings
│   ├── schema_translations   # Table/column labels
│   ├── enum_translations     # Enum display values
│   ├── content_translations  # Dynamic entity content
│   └── translation_bundles   # Pre-computed JSON caches
│
├── Geographic
│   ├── countries
│   ├── administrative_divisions
│   ├── localities
│   └── timezones
│
├── Master Data
│   ├── master_data_types
│   └── master_data_values
│
└── System
    └── system_settings
```

### Tables to Create (New)

```
├── Platform (multi-tenant infrastructure)
│   ├── apps                    # Registered applications
│   ├── organizations           # Tenants
│   ├── org_members             # User-org membership
│   ├── org_apps                # Org-app access
│   ├── org_app_members         # User permissions per org+app
│   ├── subscriptions           # Per-app-per-org billing
│   ├── invoices                # Billing invoices
│   ├── payment_methods         # Stored payment methods
│   ├── permissions             # Permission definitions
│   ├── roles                   # Role definitions
│   ├── role_permissions        # Role-permission mapping
│   ├── custom_roles            # Org-defined custom roles
│   ├── custom_role_permissions # Custom role permissions
│   ├── feature_flags           # Feature flag system
│   └── audit_log               # Audit trail
│
└── Real Estate (app-specific)
    ├── properties
    ├── units
    ├── leases
    ├── tenants (domain-specific)
    ├── maintenance_requests
    └── payments
```

---

## Target State

### Schema Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     SUPABASE DATABASE                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  SCHEMA: global                                                  │
│  ─────────────────────────────────────────────────────────────  │
│  Shared across ALL apps and tenants - always included           │
│                                                                  │
│  Tables:                                                         │
│  ├── profiles (extends auth.users)                              │
│  ├── locales                                                    │
│  ├── ui_translations                                            │
│  ├── schema_translations                                        │
│  ├── enum_translations                                          │
│  ├── content_translations                                       │
│  ├── translation_bundles                                        │
│  ├── countries                                                  │
│  ├── administrative_divisions                                   │
│  ├── localities                                                 │
│  ├── timezones                                                  │
│  ├── master_data_types                                          │
│  ├── master_data_values                                         │
│  └── system_settings                                            │
│                                                                  │
│  SCHEMA: platform                                                │
│  ─────────────────────────────────────────────────────────────  │
│  Multi-tenant infrastructure - extractable with product         │
│                                                                  │
│  Tables:                                                         │
│  ├── apps                                                       │
│  ├── organizations                                              │
│  ├── org_members                                                │
│  ├── org_apps                                                   │
│  ├── org_app_members                                            │
│  ├── subscriptions                                              │
│  ├── invoices                                                   │
│  ├── payment_methods                                            │
│  ├── permissions                                                │
│  ├── roles                                                      │
│  ├── role_permissions                                           │
│  ├── custom_roles                                               │
│  ├── custom_role_permissions                                    │
│  ├── feature_flags                                              │
│  └── audit_log                                                  │
│                                                                  │
│  SCHEMA: real_estate                                             │
│  ─────────────────────────────────────────────────────────────  │
│  App-specific - Soft refs to platform, hard refs to global      │
│                                                                  │
│  Tables:                                                         │
│  ├── properties          (org_id → platform.organizations)     │
│  ├── units               (property_id → properties)            │
│  ├── leases              (unit_id → units)                     │
│  ├── tenants             (org_id → platform.organizations)     │
│  ├── maintenance_requests                                       │
│  └── payments                                                   │
│                                                                  │
│  SCHEMA: restaurant (future)                                     │
│  SCHEMA: retail (future)                                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Migration Phases

### Phase 1: Create Schemas and Move Global Tables

**Duration**: ~2 hours
**Risk**: Low
**Rollback**: Simple schema reversal

```sql
-- Step 1.1: Create new schemas
CREATE SCHEMA IF NOT EXISTS global;
CREATE SCHEMA IF NOT EXISTS platform;
CREATE SCHEMA IF NOT EXISTS real_estate;

-- Step 1.2: Move global tables
ALTER TABLE public.profiles SET SCHEMA global;
ALTER TABLE public.locales SET SCHEMA global;
ALTER TABLE public.ui_translations SET SCHEMA global;
ALTER TABLE public.schema_translations SET SCHEMA global;
ALTER TABLE public.enum_translations SET SCHEMA global;
ALTER TABLE public.content_translations SET SCHEMA global;
ALTER TABLE public.translation_bundles SET SCHEMA global;
ALTER TABLE public.countries SET SCHEMA global;
ALTER TABLE public.administrative_divisions SET SCHEMA global;
ALTER TABLE public.localities SET SCHEMA global;
ALTER TABLE public.timezones SET SCHEMA global;
ALTER TABLE public.master_data_types SET SCHEMA global;
ALTER TABLE public.master_data_values SET SCHEMA global;
ALTER TABLE public.system_settings SET SCHEMA global;
```

### Phase 2: Create Platform Tables

**Duration**: ~4 hours
**Risk**: Low (new tables)
**Rollback**: Drop tables

```sql
-- Step 2.1: Create apps table
CREATE TABLE platform.apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  is_active BOOLEAN DEFAULT true,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2.2: Create organizations table
CREATE TABLE platform.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  owner_id UUID NOT NULL REFERENCES global.profiles(id),
  logo_url TEXT,
  settings JSONB DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('pending', 'active', 'suspended', 'deleted')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2.3: Create org_apps table
CREATE TABLE platform.org_apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES platform.organizations(id) ON DELETE CASCADE,
  app_id UUID NOT NULL REFERENCES platform.apps(id),
  enabled_at TIMESTAMPTZ DEFAULT NOW(),
  settings JSONB DEFAULT '{}',
  UNIQUE(org_id, app_id)
);

-- Step 2.4: Create permissions table
CREATE TABLE platform.permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id UUID REFERENCES platform.apps(id), -- NULL = platform-wide
  code TEXT NOT NULL,
  resource TEXT NOT NULL,
  action TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  is_sensitive BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(app_id, code)
);

-- Step 2.5: Create roles table
CREATE TABLE platform.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id UUID REFERENCES platform.apps(id), -- NULL = global role
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  hierarchy INT NOT NULL, -- 1=owner, 2=admin, 3=member, 4=viewer
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(app_id, code)
);

-- Step 2.6: Create role_permissions table
CREATE TABLE platform.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES platform.roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES platform.permissions(id) ON DELETE CASCADE,
  UNIQUE(role_id, permission_id)
);

-- Step 2.7: Create org_app_members table (per-org-per-app membership)
CREATE TABLE platform.org_app_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES platform.organizations(id) ON DELETE CASCADE,
  app_id UUID NOT NULL REFERENCES platform.apps(id),
  user_id UUID NOT NULL REFERENCES global.profiles(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES platform.roles(id),
  custom_perms JSONB DEFAULT '{"add": [], "remove": []}',
  invited_by UUID REFERENCES global.profiles(id),
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  joined_at TIMESTAMPTZ,
  UNIQUE(org_id, app_id, user_id)
);

-- Step 2.8: Create org_members view (backwards compatibility)
CREATE VIEW platform.org_members AS
SELECT DISTINCT
  gen_random_uuid() as id,
  oam.org_id,
  oam.user_id,
  r.code as role,
  oam.invited_by,
  oam.invited_at,
  oam.joined_at
FROM platform.org_app_members oam
JOIN platform.roles r ON r.id = oam.role_id
WHERE r.hierarchy = (
  SELECT MIN(r2.hierarchy)
  FROM platform.org_app_members oam2
  JOIN platform.roles r2 ON r2.id = oam2.role_id
  WHERE oam2.org_id = oam.org_id AND oam2.user_id = oam.user_id
);

-- Step 2.9: Create custom_roles table
CREATE TABLE platform.custom_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES platform.organizations(id) ON DELETE CASCADE,
  app_id UUID NOT NULL REFERENCES platform.apps(id),
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  base_role_id UUID REFERENCES platform.roles(id),
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES global.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, app_id, code)
);

-- Step 2.10: Create custom_role_permissions table
CREATE TABLE platform.custom_role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  custom_role_id UUID NOT NULL REFERENCES platform.custom_roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES platform.permissions(id),
  granted BOOLEAN NOT NULL DEFAULT true, -- true=add, false=revoke
  UNIQUE(custom_role_id, permission_id)
);

-- Step 2.11: Create subscriptions table
CREATE TABLE platform.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES platform.organizations(id) ON DELETE CASCADE,
  app_id UUID NOT NULL REFERENCES platform.apps(id),
  plan_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'trialing' CHECK (status IN ('trialing', 'active', 'past_due', 'canceled', 'expired')),
  stripe_subscription_id TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, app_id)
);

-- Step 2.12: Create invoices table
CREATE TABLE platform.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES platform.subscriptions(id),
  stripe_invoice_id TEXT,
  amount_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'usd',
  status TEXT NOT NULL CHECK (status IN ('draft', 'open', 'paid', 'void', 'uncollectible')),
  invoice_pdf TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2.13: Create payment_methods table
CREATE TABLE platform.payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES platform.organizations(id) ON DELETE CASCADE,
  stripe_payment_method_id TEXT NOT NULL,
  type TEXT NOT NULL, -- 'card', 'bank_account'
  last_four TEXT,
  brand TEXT,
  exp_month INTEGER,
  exp_year INTEGER,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2.14: Create feature_flags table
CREATE TABLE platform.feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  is_enabled BOOLEAN DEFAULT false,
  rollout_percentage INTEGER DEFAULT 0 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
  org_whitelist UUID[] DEFAULT '{}',
  app_whitelist UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2.15: Create audit_log table
CREATE TABLE platform.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  app_id UUID,
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Phase 3: Create Real Estate Schema

**Duration**: ~2 hours
**Risk**: Low (new tables)
**Rollback**: Drop tables

```sql
-- Step 3.1: Create properties table
CREATE TABLE real_estate.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL, -- Soft ref to platform.organizations
  name TEXT NOT NULL,
  property_type TEXT NOT NULL,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country_id UUID REFERENCES global.countries(id),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  year_built INTEGER,
  total_units INTEGER DEFAULT 0,
  description TEXT,
  settings JSONB DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'inactive', 'archived')),
  created_by UUID REFERENCES global.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 3.2: Create units table
CREATE TABLE real_estate.units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  property_id UUID NOT NULL REFERENCES real_estate.properties(id) ON DELETE CASCADE,
  unit_number TEXT NOT NULL,
  unit_type TEXT NOT NULL,
  floor_number INTEGER,
  bedrooms INTEGER DEFAULT 0,
  bathrooms DECIMAL(3, 1) DEFAULT 0,
  square_feet INTEGER,
  rent_amount DECIMAL(10, 2),
  deposit_amount DECIMAL(10, 2),
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'maintenance', 'reserved')),
  amenities TEXT[],
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(property_id, unit_number)
);

-- Step 3.3: Create tenants table (domain-specific, not profiles)
CREATE TABLE real_estate.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  profile_id UUID REFERENCES global.profiles(id), -- Optional link to platform user
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  date_of_birth DATE,
  id_type TEXT,
  id_number TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  notes TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('prospect', 'active', 'former', 'blacklisted')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 3.4: Create leases table
CREATE TABLE real_estate.leases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  unit_id UUID NOT NULL REFERENCES real_estate.units(id),
  tenant_id UUID NOT NULL REFERENCES real_estate.tenants(id),
  lease_type TEXT NOT NULL DEFAULT 'fixed' CHECK (lease_type IN ('fixed', 'month-to-month', 'weekly')),
  start_date DATE NOT NULL,
  end_date DATE,
  rent_amount DECIMAL(10, 2) NOT NULL,
  deposit_amount DECIMAL(10, 2),
  payment_day INTEGER DEFAULT 1 CHECK (payment_day >= 1 AND payment_day <= 31),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'active', 'expired', 'terminated')),
  terms TEXT,
  signed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 3.5: Create maintenance_requests table
CREATE TABLE real_estate.maintenance_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  property_id UUID NOT NULL REFERENCES real_estate.properties(id),
  unit_id UUID REFERENCES real_estate.units(id),
  reported_by UUID REFERENCES real_estate.tenants(id),
  assigned_to UUID,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  category TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'pending_parts', 'completed', 'canceled')),
  scheduled_date DATE,
  completed_date DATE,
  cost DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 3.6: Create payments table
CREATE TABLE real_estate.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  lease_id UUID NOT NULL REFERENCES real_estate.leases(id),
  tenant_id UUID NOT NULL REFERENCES real_estate.tenants(id),
  payment_type TEXT NOT NULL CHECK (payment_type IN ('rent', 'deposit', 'fee', 'refund', 'other')),
  amount DECIMAL(10, 2) NOT NULL,
  due_date DATE NOT NULL,
  paid_date DATE,
  payment_method TEXT,
  reference_number TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'partial', 'overdue', 'canceled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 3.7: Create indexes
CREATE INDEX idx_properties_org ON real_estate.properties(org_id);
CREATE INDEX idx_units_org ON real_estate.units(org_id);
CREATE INDEX idx_units_property ON real_estate.units(property_id);
CREATE INDEX idx_tenants_org ON real_estate.tenants(org_id);
CREATE INDEX idx_leases_org ON real_estate.leases(org_id);
CREATE INDEX idx_leases_unit ON real_estate.leases(unit_id);
CREATE INDEX idx_leases_tenant ON real_estate.leases(tenant_id);
CREATE INDEX idx_maintenance_org ON real_estate.maintenance_requests(org_id);
CREATE INDEX idx_payments_org ON real_estate.payments(org_id);
CREATE INDEX idx_payments_lease ON real_estate.payments(lease_id);
```

### Phase 4: Create Auth Helper Functions

**Duration**: ~1 hour
**Risk**: Low
**Rollback**: Drop functions

```sql
-- Step 4.1: Get current org from JWT
CREATE OR REPLACE FUNCTION auth.current_org_id()
RETURNS UUID AS $$
  SELECT (auth.jwt() ->> 'org_id')::uuid;
$$ LANGUAGE SQL STABLE;

-- Step 4.2: Get current app from JWT
CREATE OR REPLACE FUNCTION auth.current_app_id()
RETURNS UUID AS $$
  SELECT (auth.jwt() ->> 'app_id')::uuid;
$$ LANGUAGE SQL STABLE;

-- Step 4.3: Check if user has permission
CREATE OR REPLACE FUNCTION auth.has_permission(permission TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  perms TEXT[];
  resource TEXT;
  action TEXT;
BEGIN
  -- Get permissions from JWT
  perms := ARRAY(
    SELECT jsonb_array_elements_text(auth.jwt() -> 'permissions')
  );

  -- Check wildcard (full access)
  IF '*:*' = ANY(perms) THEN RETURN TRUE; END IF;

  -- Parse permission
  resource := split_part(permission, ':', 1);
  action := split_part(permission, ':', 2);

  -- Check resource wildcard (e.g., properties:*)
  IF (resource || ':*') = ANY(perms) THEN RETURN TRUE; END IF;

  -- Check action wildcard (e.g., *:read)
  IF ('*:' || action) = ANY(perms) THEN RETURN TRUE; END IF;

  -- Check exact match
  RETURN permission = ANY(perms);
END;
$$ LANGUAGE plpgsql STABLE;

-- Step 4.4: Check if org has app access
CREATE OR REPLACE FUNCTION auth.org_has_app(app_slug TEXT)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM platform.org_apps oa
    JOIN platform.apps a ON a.id = oa.app_id
    WHERE oa.org_id = auth.current_org_id()
    AND a.slug = app_slug
  );
$$ LANGUAGE SQL STABLE;

-- Step 4.5: Auto-set org_id trigger function
CREATE OR REPLACE FUNCTION set_org_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.org_id IS NULL THEN
    NEW.org_id := auth.current_org_id();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Phase 5: Create RLS Policies

**Duration**: ~3 hours
**Risk**: Medium (affects data access)
**Rollback**: Drop policies

```sql
-- ═══════════════════════════════════════════════════════════════════
-- GLOBAL SCHEMA POLICIES
-- ═══════════════════════════════════════════════════════════════════

-- Enable RLS on global tables
ALTER TABLE global.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE global.locales ENABLE ROW LEVEL SECURITY;
ALTER TABLE global.ui_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE global.countries ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read any, update own
CREATE POLICY "profiles_select" ON global.profiles
FOR SELECT USING (TRUE);

CREATE POLICY "profiles_update_own" ON global.profiles
FOR UPDATE USING (id = auth.uid());

CREATE POLICY "profiles_insert_own" ON global.profiles
FOR INSERT WITH CHECK (id = auth.uid());

-- Reference tables: Read-only for all authenticated
CREATE POLICY "locales_select" ON global.locales
FOR SELECT USING (TRUE);

CREATE POLICY "countries_select" ON global.countries
FOR SELECT USING (TRUE);

-- Translations: Read all, write for admins
CREATE POLICY "translations_select" ON global.ui_translations
FOR SELECT USING (TRUE);

CREATE POLICY "translations_admin_write" ON global.ui_translations
FOR ALL USING (auth.has_permission('translations:write'));

-- ═══════════════════════════════════════════════════════════════════
-- PLATFORM SCHEMA POLICIES
-- ═══════════════════════════════════════════════════════════════════

ALTER TABLE platform.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform.org_apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform.org_app_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform.roles ENABLE ROW LEVEL SECURITY;

-- Organizations: Members can read their own orgs
CREATE POLICY "orgs_member_select" ON platform.organizations
FOR SELECT USING (
  id IN (
    SELECT DISTINCT org_id FROM platform.org_app_members
    WHERE user_id = auth.uid()
  )
);

-- Organizations: Owners can update
CREATE POLICY "orgs_owner_update" ON platform.organizations
FOR UPDATE USING (
  id = auth.current_org_id()
  AND auth.has_permission('admin:settings')
);

-- Org apps: Same org access
CREATE POLICY "org_apps_select" ON platform.org_apps
FOR SELECT USING (org_id = auth.current_org_id());

-- Org app members: Same org access
CREATE POLICY "org_app_members_select" ON platform.org_app_members
FOR SELECT USING (org_id = auth.current_org_id());

CREATE POLICY "org_app_members_admin" ON platform.org_app_members
FOR ALL USING (
  org_id = auth.current_org_id()
  AND auth.has_permission('admin:users')
);

-- Subscriptions: Org access
CREATE POLICY "subscriptions_select" ON platform.subscriptions
FOR SELECT USING (org_id = auth.current_org_id());

CREATE POLICY "subscriptions_billing" ON platform.subscriptions
FOR ALL USING (
  org_id = auth.current_org_id()
  AND auth.has_permission('admin:billing')
);

-- Permissions/Roles: Public read
CREATE POLICY "permissions_select" ON platform.permissions
FOR SELECT USING (TRUE);

CREATE POLICY "roles_select" ON platform.roles
FOR SELECT USING (TRUE);

-- ═══════════════════════════════════════════════════════════════════
-- REAL_ESTATE SCHEMA POLICIES
-- ═══════════════════════════════════════════════════════════════════

ALTER TABLE real_estate.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE real_estate.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE real_estate.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE real_estate.leases ENABLE ROW LEVEL SECURITY;
ALTER TABLE real_estate.maintenance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE real_estate.payments ENABLE ROW LEVEL SECURITY;

-- Properties: Org + permission check
CREATE POLICY "properties_select" ON real_estate.properties
FOR SELECT USING (
  org_id = auth.current_org_id()
  AND auth.has_permission('properties:read')
);

CREATE POLICY "properties_insert" ON real_estate.properties
FOR INSERT WITH CHECK (
  org_id = auth.current_org_id()
  AND auth.has_permission('properties:write')
);

CREATE POLICY "properties_update" ON real_estate.properties
FOR UPDATE USING (
  org_id = auth.current_org_id()
  AND auth.has_permission('properties:write')
);

CREATE POLICY "properties_delete" ON real_estate.properties
FOR DELETE USING (
  org_id = auth.current_org_id()
  AND auth.has_permission('properties:delete')
);

-- Units: Same pattern
CREATE POLICY "units_select" ON real_estate.units
FOR SELECT USING (
  org_id = auth.current_org_id()
  AND auth.has_permission('units:read')
);

CREATE POLICY "units_insert" ON real_estate.units
FOR INSERT WITH CHECK (
  org_id = auth.current_org_id()
  AND auth.has_permission('units:write')
);

CREATE POLICY "units_update" ON real_estate.units
FOR UPDATE USING (
  org_id = auth.current_org_id()
  AND auth.has_permission('units:write')
);

CREATE POLICY "units_delete" ON real_estate.units
FOR DELETE USING (
  org_id = auth.current_org_id()
  AND auth.has_permission('units:delete')
);

-- Tenants
CREATE POLICY "tenants_select" ON real_estate.tenants
FOR SELECT USING (
  org_id = auth.current_org_id()
  AND auth.has_permission('tenants:read')
);

CREATE POLICY "tenants_write" ON real_estate.tenants
FOR ALL USING (
  org_id = auth.current_org_id()
  AND auth.has_permission('tenants:write')
);

-- Leases
CREATE POLICY "leases_select" ON real_estate.leases
FOR SELECT USING (
  org_id = auth.current_org_id()
  AND auth.has_permission('leases:read')
);

CREATE POLICY "leases_write" ON real_estate.leases
FOR ALL USING (
  org_id = auth.current_org_id()
  AND auth.has_permission('leases:write')
);

-- Maintenance
CREATE POLICY "maintenance_select" ON real_estate.maintenance_requests
FOR SELECT USING (
  org_id = auth.current_org_id()
  AND auth.has_permission('maintenance:read')
);

CREATE POLICY "maintenance_write" ON real_estate.maintenance_requests
FOR ALL USING (
  org_id = auth.current_org_id()
  AND auth.has_permission('maintenance:write')
);

-- Payments
CREATE POLICY "payments_select" ON real_estate.payments
FOR SELECT USING (
  org_id = auth.current_org_id()
  AND auth.has_permission('payments:read')
);

CREATE POLICY "payments_write" ON real_estate.payments
FOR ALL USING (
  org_id = auth.current_org_id()
  AND auth.has_permission('payments:write')
);

-- ═══════════════════════════════════════════════════════════════════
-- AUTO-SET ORG_ID TRIGGERS
-- ═══════════════════════════════════════════════════════════════════

CREATE TRIGGER set_org_id_properties
BEFORE INSERT ON real_estate.properties
FOR EACH ROW EXECUTE FUNCTION set_org_id();

CREATE TRIGGER set_org_id_units
BEFORE INSERT ON real_estate.units
FOR EACH ROW EXECUTE FUNCTION set_org_id();

CREATE TRIGGER set_org_id_tenants
BEFORE INSERT ON real_estate.tenants
FOR EACH ROW EXECUTE FUNCTION set_org_id();

CREATE TRIGGER set_org_id_leases
BEFORE INSERT ON real_estate.leases
FOR EACH ROW EXECUTE FUNCTION set_org_id();

CREATE TRIGGER set_org_id_maintenance
BEFORE INSERT ON real_estate.maintenance_requests
FOR EACH ROW EXECUTE FUNCTION set_org_id();

CREATE TRIGGER set_org_id_payments
BEFORE INSERT ON real_estate.payments
FOR EACH ROW EXECUTE FUNCTION set_org_id();
```

### Phase 6: Seed Initial Data

**Duration**: ~30 minutes
**Risk**: Low
**Rollback**: Delete seeded data

```sql
-- ═══════════════════════════════════════════════════════════════════
-- SEED APPS
-- ═══════════════════════════════════════════════════════════════════

INSERT INTO platform.apps (slug, name, description, icon, is_active) VALUES
('real-estate', 'Real Estate Management', 'Property and tenant management platform', 'building', true),
('restaurant', 'Restaurant Management', 'Restaurant operations and POS', 'utensils', false),
('retail', 'Retail Management', 'Retail inventory and sales', 'store', false);

-- ═══════════════════════════════════════════════════════════════════
-- SEED GLOBAL ROLES (Platform-wide)
-- ═══════════════════════════════════════════════════════════════════

INSERT INTO platform.roles (app_id, code, name, description, hierarchy, is_system) VALUES
(NULL, 'owner', 'Organization Owner', 'Full access to organization and all apps', 1, true),
(NULL, 'admin', 'Administrator', 'Full access except billing and org deletion', 2, true),
(NULL, 'member', 'Member', 'Standard access to resources', 3, true),
(NULL, 'viewer', 'Viewer', 'Read-only access', 4, true);

-- ═══════════════════════════════════════════════════════════════════
-- SEED PLATFORM PERMISSIONS
-- ═══════════════════════════════════════════════════════════════════

INSERT INTO platform.permissions (app_id, code, resource, action, name, category) VALUES
-- Platform permissions (app_id = NULL)
(NULL, 'admin:access', 'admin', 'access', 'Access Admin Panel', 'Admin'),
(NULL, 'admin:users', 'admin', 'users', 'Manage Users', 'Admin'),
(NULL, 'admin:billing', 'admin', 'billing', 'Manage Billing', 'Admin'),
(NULL, 'admin:settings', 'admin', 'settings', 'Manage Settings', 'Admin'),
(NULL, 'org:delete', 'org', 'delete', 'Delete Organization', 'Admin'),
(NULL, 'org:transfer', 'org', 'transfer', 'Transfer Ownership', 'Admin'),
(NULL, 'users:invite', 'users', 'invite', 'Invite Users', 'Users'),
(NULL, 'users:remove', 'users', 'remove', 'Remove Users', 'Users'),
(NULL, 'users:roles', 'users', 'roles', 'Manage User Roles', 'Users'),
(NULL, 'audit:read', 'audit', 'read', 'View Audit Logs', 'Admin'),
(NULL, 'translations:write', 'translations', 'write', 'Manage Translations', 'Admin');

-- ═══════════════════════════════════════════════════════════════════
-- SEED REAL ESTATE PERMISSIONS
-- ═══════════════════════════════════════════════════════════════════

-- Get real-estate app ID
WITH re_app AS (
  SELECT id FROM platform.apps WHERE slug = 'real-estate'
)
INSERT INTO platform.permissions (app_id, code, resource, action, name, category)
SELECT
  re_app.id,
  perm.code,
  perm.resource,
  perm.action,
  perm.name,
  perm.category
FROM re_app, (VALUES
  ('properties:read', 'properties', 'read', 'View Properties', 'Properties'),
  ('properties:write', 'properties', 'write', 'Edit Properties', 'Properties'),
  ('properties:delete', 'properties', 'delete', 'Delete Properties', 'Properties'),
  ('properties:export', 'properties', 'export', 'Export Properties', 'Properties'),
  ('units:read', 'units', 'read', 'View Units', 'Units'),
  ('units:write', 'units', 'write', 'Edit Units', 'Units'),
  ('units:delete', 'units', 'delete', 'Delete Units', 'Units'),
  ('tenants:read', 'tenants', 'read', 'View Tenants', 'Tenants'),
  ('tenants:write', 'tenants', 'write', 'Edit Tenants', 'Tenants'),
  ('tenants:delete', 'tenants', 'delete', 'Delete Tenants', 'Tenants'),
  ('leases:read', 'leases', 'read', 'View Leases', 'Leases'),
  ('leases:write', 'leases', 'write', 'Edit Leases', 'Leases'),
  ('leases:delete', 'leases', 'delete', 'Delete Leases', 'Leases'),
  ('leases:approve', 'leases', 'approve', 'Approve Leases', 'Leases'),
  ('maintenance:read', 'maintenance', 'read', 'View Maintenance', 'Maintenance'),
  ('maintenance:write', 'maintenance', 'write', 'Edit Maintenance', 'Maintenance'),
  ('maintenance:assign', 'maintenance', 'assign', 'Assign Maintenance', 'Maintenance'),
  ('payments:read', 'payments', 'read', 'View Payments', 'Payments'),
  ('payments:write', 'payments', 'write', 'Process Payments', 'Payments'),
  ('reports:read', 'reports', 'read', 'View Reports', 'Reports'),
  ('reports:export', 'reports', 'export', 'Export Reports', 'Reports')
) AS perm(code, resource, action, name, category);

-- ═══════════════════════════════════════════════════════════════════
-- SEED ROLE-PERMISSION MAPPINGS
-- ═══════════════════════════════════════════════════════════════════

-- Owner gets everything
INSERT INTO platform.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM platform.roles r
CROSS JOIN platform.permissions p
WHERE r.code = 'owner';

-- Admin gets everything except org:delete, org:transfer, admin:billing
INSERT INTO platform.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM platform.roles r
CROSS JOIN platform.permissions p
WHERE r.code = 'admin'
AND p.code NOT IN ('org:delete', 'org:transfer', 'admin:billing');

-- Member gets read + write for content, no admin
INSERT INTO platform.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM platform.roles r
CROSS JOIN platform.permissions p
WHERE r.code = 'member'
AND p.action IN ('read', 'write', 'assign')
AND p.resource NOT IN ('admin', 'org', 'users', 'audit');

-- Viewer gets read-only
INSERT INTO platform.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM platform.roles r
CROSS JOIN platform.permissions p
WHERE r.code = 'viewer'
AND p.action = 'read';
```

---

## Rollback Strategy

### Full Rollback Script

```sql
-- ═══════════════════════════════════════════════════════════════════
-- FULL ROLLBACK (USE WITH CAUTION)
-- ═══════════════════════════════════════════════════════════════════

-- Drop RLS policies (must be done before moving tables)
DROP POLICY IF EXISTS "profiles_select" ON global.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON global.profiles;
-- ... (drop all policies)

-- Drop app schema
DROP SCHEMA IF EXISTS real_estate CASCADE;

-- Drop platform tables
DROP TABLE IF EXISTS platform.audit_log CASCADE;
DROP TABLE IF EXISTS platform.feature_flags CASCADE;
DROP TABLE IF EXISTS platform.payment_methods CASCADE;
DROP TABLE IF EXISTS platform.invoices CASCADE;
DROP TABLE IF EXISTS platform.subscriptions CASCADE;
DROP TABLE IF EXISTS platform.custom_role_permissions CASCADE;
DROP TABLE IF EXISTS platform.custom_roles CASCADE;
DROP TABLE IF EXISTS platform.org_app_members CASCADE;
DROP TABLE IF EXISTS platform.role_permissions CASCADE;
DROP TABLE IF EXISTS platform.roles CASCADE;
DROP TABLE IF EXISTS platform.permissions CASCADE;
DROP TABLE IF EXISTS platform.org_apps CASCADE;
DROP TABLE IF EXISTS platform.organizations CASCADE;
DROP TABLE IF EXISTS platform.apps CASCADE;

-- Drop platform schema
DROP SCHEMA IF EXISTS platform CASCADE;

-- Move tables back to public
ALTER TABLE global.profiles SET SCHEMA public;
ALTER TABLE global.locales SET SCHEMA public;
-- ... (move all global tables back)

-- Drop global schema
DROP SCHEMA IF EXISTS global;

-- Drop functions
DROP FUNCTION IF EXISTS auth.current_org_id();
DROP FUNCTION IF EXISTS auth.current_app_id();
DROP FUNCTION IF EXISTS auth.has_permission(TEXT);
DROP FUNCTION IF EXISTS auth.org_has_app(TEXT);
DROP FUNCTION IF EXISTS set_org_id();
```

### Partial Rollback (by Phase)

```sql
-- Rollback Phase 5 only (RLS policies)
-- Run: List and drop all policies on affected tables

-- Rollback Phase 4 only (Helper functions)
DROP FUNCTION IF EXISTS auth.current_org_id();
DROP FUNCTION IF EXISTS auth.current_app_id();
DROP FUNCTION IF EXISTS auth.has_permission(TEXT);
DROP FUNCTION IF EXISTS auth.org_has_app(TEXT);
DROP FUNCTION IF EXISTS set_org_id();

-- Rollback Phase 3 only (Real estate schema)
DROP SCHEMA IF EXISTS real_estate CASCADE;

-- Rollback Phase 2 only (Platform tables)
DROP SCHEMA IF EXISTS platform CASCADE;

-- Rollback Phase 1 only (Schema moves)
ALTER TABLE global.profiles SET SCHEMA public;
-- ... etc
DROP SCHEMA IF EXISTS global;
```

---

## Verification Checklist

### Pre-Migration Checklist

- [ ] Create database backup: `pg_dump -Fc -f backup_pre_migration.dump`
- [ ] Document current table counts
- [ ] Test rollback procedure in staging
- [ ] Notify team of migration window
- [ ] Disable cron jobs temporarily

### Post-Migration Checklist

- [ ] Verify all schemas exist: `SELECT schema_name FROM information_schema.schemata;`
- [ ] Verify table counts match
- [ ] Test auth flow (login, JWT claims)
- [ ] Test org switching
- [ ] Test CRUD operations with RLS
- [ ] Test cross-schema joins
- [ ] Run application test suite
- [ ] Check error logs for access denied
- [ ] Re-enable cron jobs
- [ ] Update environment variables if needed

### Verification Queries

```sql
-- Check schemas exist
SELECT schema_name FROM information_schema.schemata
WHERE schema_name IN ('global', 'platform', 'real_estate');

-- Check table counts
SELECT schemaname, tablename
FROM pg_tables
WHERE schemaname IN ('global', 'platform', 'real_estate')
ORDER BY schemaname, tablename;

-- Check RLS is enabled
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname IN ('global', 'platform', 'real_estate')
AND rowsecurity = true;

-- Check functions exist
SELECT routine_name, routine_schema
FROM information_schema.routines
WHERE routine_name IN ('current_org_id', 'current_app_id', 'has_permission', 'org_has_app');

-- Test permission check (requires valid JWT)
SELECT auth.has_permission('properties:read');

-- Test cross-schema join
SELECT p.*, pr.first_name
FROM real_estate.properties p
JOIN global.profiles pr ON pr.id = p.created_by
LIMIT 5;
```

---

## Migration File Organization

After migration, organize files as:

```
supabase/migrations/
├── 00001_create_global_schema.sql
├── 00002_move_global_tables.sql
├── 00003_create_platform_schema.sql
├── 00004_create_platform_tables.sql
├── 00005_create_real_estate_schema.sql
├── 00006_create_real_estate_tables.sql
├── 00007_create_auth_functions.sql
├── 00008_create_rls_policies_global.sql
├── 00009_create_rls_policies_platform.sql
├── 00010_create_rls_policies_real_estate.sql
├── 00011_seed_apps.sql
├── 00012_seed_roles_permissions.sql
└── 00013_create_triggers.sql
```

---

*Last updated: 2026-01-18*
*Status: Ready for implementation*
