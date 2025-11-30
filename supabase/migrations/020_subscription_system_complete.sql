-- ============================================================================
-- PULWAVE SUBSCRIPTION SYSTEM - COMPLETE IMPLEMENTATION
-- ============================================================================
-- Migration: 020_subscription_system_complete.sql
-- Description: Implements subscription tiers, resource quotas, usage tracking,
--              and quota enforcement for multi-tenant property management
-- Author: Pulwave DBA Team
-- Date: 2025-11-29
-- ============================================================================

-- ============================================================================
-- PART 1: SUBSCRIPTION PLANS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Plan identification
  plan_code text UNIQUE NOT NULL,
  plan_name text NOT NULL,
  plan_tier text NOT NULL,
  
  -- Resource limits
  max_buildings integer NOT NULL,
  max_units integer NOT NULL,
  max_storage_gb numeric(10,2) NOT NULL,
  max_users integer NOT NULL,
  max_api_calls_per_month integer NOT NULL DEFAULT 1000,
  
  -- Pricing
  monthly_price numeric(10,2) NOT NULL DEFAULT 0.00,
  annual_price numeric(10,2),
  currency text NOT NULL DEFAULT 'USD',
  
  -- Overage pricing (for enterprise)
  overage_unit_price numeric(10,2) DEFAULT 0.00,
  overage_storage_price_per_gb numeric(10,2) DEFAULT 0.00,
  
  -- Feature flags (JSONB for flexibility)
  features jsonb DEFAULT '{}',
  
  -- Metadata
  is_active boolean DEFAULT true,
  display_order integer,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_subscription_plans_active 
  ON subscription_plans(is_active, display_order);

-- Comments
COMMENT ON TABLE subscription_plans IS 
'Defines subscription tiers with resource limits and pricing. Supports overage pricing for enterprise tiers.';

COMMENT ON COLUMN subscription_plans.overage_unit_price IS 
'Price per additional unit beyond plan limit (e.g., $0.30/unit for Enterprise Plus)';

COMMENT ON COLUMN subscription_plans.overage_storage_price_per_gb IS 
'Price per GB of storage beyond plan limit (e.g., $0.10/GB)';

-- ============================================================================
-- PART 2: ORGANIZATION SUBSCRIPTIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS organization_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  subscription_plan_id uuid NOT NULL REFERENCES subscription_plans(id),
  
  -- Contract terms
  contract_start_date date NOT NULL DEFAULT CURRENT_DATE,
  contract_end_date date,
  billing_cycle text NOT NULL DEFAULT 'monthly',
  auto_renew boolean DEFAULT true,
  
  -- Status
  status text NOT NULL DEFAULT 'active',
  trial_ends_at timestamptz,
  suspended_at timestamptz,
  suspended_reason text,
  cancelled_at timestamptz,
  cancelled_by uuid REFERENCES profiles(id),
  cancellation_reason text,
  
  -- Custom resource overrides (for enterprise deals)
  max_buildings_override integer,
  max_units_override integer,
  max_storage_gb_override numeric(10,2),
  max_users_override integer,
  
  -- Audit trail
  is_active boolean DEFAULT true,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES profiles(id),
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES profiles(id),
  
  -- Constraints
  CONSTRAINT valid_contract_dates CHECK (
    contract_end_date IS NULL OR contract_end_date > contract_start_date
  ),
  CONSTRAINT valid_billing_cycle CHECK (
    billing_cycle IN ('monthly', 'annual', 'custom')
  ),
  CONSTRAINT valid_status CHECK (
    status IN ('active', 'trial', 'suspended', 'cancelled', 'expired')
  )
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_org_subscriptions_org_status 
  ON organization_subscriptions(organization_id, status) 
  WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_org_subscriptions_trial_expiry 
  ON organization_subscriptions(trial_ends_at) 
  WHERE status = 'trial' AND trial_ends_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_org_subscriptions_plan 
  ON organization_subscriptions(subscription_plan_id);

-- Comments
COMMENT ON TABLE organization_subscriptions IS 
'Tracks active subscriptions for each organization with contract terms and custom overrides.';

-- ============================================================================
-- PART 3: SUBSCRIPTION USAGE TRACKING
-- ============================================================================
CREATE TABLE IF NOT EXISTS subscription_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  subscription_id uuid NOT NULL REFERENCES organization_subscriptions(id),
  
  -- Usage period
  period_start date NOT NULL,
  period_end date NOT NULL,
  
  -- Current usage
  current_buildings integer DEFAULT 0,
  current_units integer DEFAULT 0,
  current_storage_gb numeric(10,2) DEFAULT 0.0,
  current_users integer DEFAULT 0,
  current_api_calls integer DEFAULT 0,
  
  -- Peak usage (for billing/analytics)
  peak_buildings integer DEFAULT 0,
  peak_units integer DEFAULT 0,
  peak_storage_gb numeric(10,2) DEFAULT 0.0,
  peak_users integer DEFAULT 0,
  
  -- Metadata
  last_calculated_at timestamptz DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  
  CONSTRAINT valid_usage_period CHECK (period_end > period_start),
  UNIQUE(organization_id, period_start, period_end)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_subscription_usage_org_period 
  ON subscription_usage(organization_id, period_start, period_end);

CREATE INDEX IF NOT EXISTS idx_subscription_usage_subscription 
  ON subscription_usage(subscription_id);

-- Comments
COMMENT ON TABLE subscription_usage IS 
'Monitors resource consumption for quota enforcement and usage analytics.';

-- ============================================================================
-- PART 4: HELPER FUNCTIONS
-- ============================================================================

-- Get organization resource limits
CREATE OR REPLACE FUNCTION get_organization_limits(org_id uuid)
RETURNS TABLE(
  max_buildings integer,
  max_units integer,
  max_storage_gb numeric,
  max_users integer,
  max_api_calls integer,
  plan_name text,
  plan_code text,
  subscription_status text,
  overage_unit_price numeric,
  overage_storage_price numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(os.max_buildings_override, sp.max_buildings) as max_buildings,
    COALESCE(os.max_units_override, sp.max_units) as max_units,
    COALESCE(os.max_storage_gb_override, sp.max_storage_gb) as max_storage_gb,
    COALESCE(os.max_users_override, sp.max_users) as max_users,
    sp.max_api_calls_per_month as max_api_calls,
    sp.plan_name,
    sp.plan_code,
    os.status as subscription_status,
    sp.overage_unit_price,
    sp.overage_storage_price_per_gb as overage_storage_price
  FROM organization_subscriptions os
  JOIN subscription_plans sp ON sp.id = os.subscription_plan_id
  WHERE os.organization_id = org_id
    AND os.is_active = true
    AND os.status IN ('active', 'trial')
  ORDER BY os.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

COMMENT ON FUNCTION get_organization_limits IS 
'Returns effective resource limits for an organization, considering plan defaults and custom overrides.';

-- ============================================================================
-- PART 5: QUOTA ENFORCEMENT TRIGGER FUNCTION
-- ============================================================================
CREATE OR REPLACE FUNCTION check_organization_quota()
RETURNS TRIGGER AS $$
DECLARE
  v_limits record;
  v_current_count integer;
  v_resource_type text;
  v_upgrade_suggestion text;
BEGIN
  v_resource_type := TG_TABLE_NAME;
  
  -- Get organization limits
  SELECT * INTO v_limits FROM get_organization_limits(NEW.organization_id);
  
  -- No active subscription = deny operation
  IF v_limits IS NULL THEN
    RAISE EXCEPTION 'No active subscription found. Please subscribe to a plan to continue.';
  END IF;
  
  -- Check quota based on resource type
  CASE v_resource_type
    WHEN 'buildings' THEN
      SELECT COUNT(*) INTO v_current_count 
      FROM buildings 
      WHERE organization_id = NEW.organization_id AND is_active = true;
      
      IF v_current_count >= v_limits.max_buildings THEN
        -- Suggest upgrade path
        v_upgrade_suggestion := CASE v_limits.plan_code
          WHEN 'free' THEN 'Upgrade to Growing Portfolio ($29/mo) for 5 buildings'
          WHEN 'starter' THEN 'Upgrade to Property Manager ($99/mo) for 20 buildings'
          WHEN 'professional' THEN 'Upgrade to Portfolio Manager ($299/mo) for 100 buildings'
          ELSE 'Contact sales for custom enterprise pricing'
        END;
        
        RAISE EXCEPTION 'Building quota exceeded. Current: %, Limit: %. %',
          v_current_count, v_limits.max_buildings, v_upgrade_suggestion;
      END IF;
      
    WHEN 'units' THEN
      SELECT COUNT(*) INTO v_current_count 
      FROM units 
      WHERE organization_id = NEW.organization_id AND is_active = true;
      
      IF v_current_count >= v_limits.max_units THEN
        v_upgrade_suggestion := CASE v_limits.plan_code
          WHEN 'free' THEN 'Upgrade to Growing Portfolio ($29/mo) for 50 units'
          WHEN 'starter' THEN 'Upgrade to Property Manager ($99/mo) for 200 units'
          WHEN 'professional' THEN 'Upgrade to Portfolio Manager ($299/mo) for 1,000 units'
          ELSE 'Contact sales for overage pricing ($0.30/unit)'
        END;
        
        RAISE EXCEPTION 'Unit quota exceeded. Current: %, Limit: %. %',
          v_current_count, v_limits.max_units, v_upgrade_suggestion;
      END IF;
      
    WHEN 'organization_members' THEN
      SELECT COUNT(*) INTO v_current_count 
      FROM organization_members 
      WHERE organization_id = NEW.organization_id AND is_active = true;
      
      IF v_current_count >= v_limits.max_users THEN
        v_upgrade_suggestion := CASE v_limits.plan_code
          WHEN 'free' THEN 'Upgrade to Growing Portfolio ($29/mo) for 5 users'
          WHEN 'starter' THEN 'Upgrade to Property Manager ($99/mo) for 20 users'
          WHEN 'professional' THEN 'Upgrade to Portfolio Manager ($299/mo) for 50 users'
          ELSE 'Contact sales for unlimited users'
        END;
        
        RAISE EXCEPTION 'User quota exceeded. Current: %, Limit: %. %',
          v_current_count, v_limits.max_users, v_upgrade_suggestion;
      END IF;
  END CASE;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION check_organization_quota IS 
'Enforces resource quotas before INSERT operations. Raises helpful exceptions with upgrade suggestions.';

-- ============================================================================
-- PART 6: APPLY QUOTA ENFORCEMENT TRIGGERS
-- ============================================================================

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS enforce_building_quota ON buildings;
DROP TRIGGER IF EXISTS enforce_unit_quota ON units;
DROP TRIGGER IF EXISTS enforce_user_quota ON organization_members;

-- Create new triggers
CREATE TRIGGER enforce_building_quota
  BEFORE INSERT ON buildings
  FOR EACH ROW EXECUTE FUNCTION check_organization_quota();

CREATE TRIGGER enforce_unit_quota
  BEFORE INSERT ON units
  FOR EACH ROW EXECUTE FUNCTION check_organization_quota();

CREATE TRIGGER enforce_user_quota
  BEFORE INSERT ON organization_members
  FOR EACH ROW EXECUTE FUNCTION check_organization_quota();

-- ============================================================================
-- PART 7: USAGE TRACKING FUNCTION
-- ============================================================================
CREATE OR REPLACE FUNCTION update_subscription_usage(org_id uuid)
RETURNS void AS $$
DECLARE
  v_subscription_id uuid;
  v_period_start date;
  v_period_end date;
  v_buildings_count integer;
  v_units_count integer;
  v_users_count integer;
  v_storage_gb numeric;
BEGIN
  -- Get active subscription
  SELECT id INTO v_subscription_id
  FROM organization_subscriptions
  WHERE organization_id = org_id
    AND is_active = true
    AND status IN ('active', 'trial')
  ORDER BY created_at DESC
  LIMIT 1;
  
  IF v_subscription_id IS NULL THEN
    RETURN; -- No active subscription
  END IF;
  
  -- Determine current billing period
  v_period_start := date_trunc('month', CURRENT_DATE)::date;
  v_period_end := (date_trunc('month', CURRENT_DATE) + interval '1 month' - interval '1 day')::date;
  
  -- Calculate current usage
  SELECT COUNT(*) INTO v_buildings_count
  FROM buildings WHERE organization_id = org_id AND is_active = true;
  
  SELECT COUNT(*) INTO v_units_count
  FROM units WHERE organization_id = org_id AND is_active = true;
  
  SELECT COUNT(*) INTO v_users_count
  FROM organization_members WHERE organization_id = org_id AND is_active = true;
  
  -- Calculate storage (placeholder - implement based on your storage strategy)
  v_storage_gb := 0.0;
  
  -- Insert or update usage record
  INSERT INTO subscription_usage (
    organization_id, subscription_id, period_start, period_end,
    current_buildings, current_units, current_users, current_storage_gb,
    peak_buildings, peak_units, peak_users, peak_storage_gb,
    last_calculated_at
  ) VALUES (
    org_id, v_subscription_id, v_period_start, v_period_end,
    v_buildings_count, v_units_count, v_users_count, v_storage_gb,
    v_buildings_count, v_units_count, v_users_count, v_storage_gb,
    now()
  )
  ON CONFLICT (organization_id, period_start, period_end)
  DO UPDATE SET
    current_buildings = EXCLUDED.current_buildings,
    current_units = EXCLUDED.current_units,
    current_users = EXCLUDED.current_users,
    current_storage_gb = EXCLUDED.current_storage_gb,
    peak_buildings = GREATEST(subscription_usage.peak_buildings, EXCLUDED.current_buildings),
    peak_units = GREATEST(subscription_usage.peak_units, EXCLUDED.current_units),
    peak_users = GREATEST(subscription_usage.peak_users, EXCLUDED.current_users),
    peak_storage_gb = GREATEST(subscription_usage.peak_storage_gb, EXCLUDED.current_storage_gb),
    last_calculated_at = now(),
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION update_subscription_usage IS 
'Updates subscription usage metrics for an organization. Call daily via cron or after significant changes.';

-- ============================================================================
-- PART 8: SEED SUBSCRIPTION PLANS
-- ============================================================================
INSERT INTO subscription_plans (
  plan_code, plan_name, plan_tier,
  max_buildings, max_units, max_storage_gb, max_users, max_api_calls_per_month,
  monthly_price, annual_price,
  overage_unit_price, overage_storage_price_per_gb,
  features, description, display_order
) VALUES 
  -- Solo Landlord (Free)
  (
    'free',
    'Solo Landlord',
    'free',
    1,                    -- 1 building
    1,                    -- 1 unit
    5.0,                  -- 5GB storage
    2,                    -- 2 users
    1000,                 -- 1K API calls/month
    0.00,                 -- Free
    0.00,
    0.00,                 -- No overage
    0.00,
    '{
      "mobile_app": true,
      "tenant_portal": true,
      "basic_reporting": true,
      "email_support": true
    }',
    'Perfect for managing your rental property or the home you live in',
    1
  ),
  
  -- Growing Portfolio (Starter)
  (
    'starter',
    'Growing Portfolio',
    'starter',
    5,                    -- 5 buildings
    50,                   -- 50 units
    25.0,                 -- 25GB storage
    5,                    -- 5 users
    10000,                -- 10K API calls/month
    29.00,                -- $29/month
    290.00,               -- $290/year (2 months free)
    0.00,                 -- No overage
    0.00,
    '{
      "mobile_app": true,
      "tenant_portal": true,
      "owner_portal": true,
      "basic_reporting": true,
      "advanced_reporting": false,
      "email_support": true,
      "maintenance_tracking": true,
      "online_payments": true
    }',
    'Ideal for landlords with multiple properties',
    2
  ),
  
  -- Property Manager (Professional)
  (
    'professional',
    'Property Manager',
    'professional',
    20,                   -- 20 buildings
    200,                  -- 200 units
    100.0,                -- 100GB storage
    20,                   -- 20 users
    50000,                -- 50K API calls/month
    99.00,                -- $99/month
    990.00,               -- $990/year (2 months free)
    0.00,                 -- No overage
    0.00,
    '{
      "mobile_app": true,
      "tenant_portal": true,
      "owner_portal": true,
      "basic_reporting": true,
      "advanced_reporting": true,
      "api_access": true,
      "priority_support": true,
      "maintenance_tracking": true,
      "online_payments": true,
      "accounting_integration": true,
      "custom_branding": false,
      "bulk_operations": true
    }',
    'For professional property management companies',
    3
  ),
  
  -- Portfolio Manager (Enterprise Base)
  (
    'enterprise',
    'Portfolio Manager',
    'enterprise',
    100,                  -- 100 buildings
    1000,                 -- 1,000 units
    500.0,                -- 500GB storage
    50,                   -- 50 users
    200000,               -- 200K API calls/month
    299.00,               -- $299/month
    2990.00,              -- $2,990/year (2 months free)
    0.30,                 -- $0.30/unit overage
    0.10,                 -- $0.10/GB overage
    '{
      "mobile_app": true,
      "tenant_portal": true,
      "owner_portal": true,
      "basic_reporting": true,
      "advanced_reporting": true,
      "api_access": true,
      "priority_support": true,
      "phone_support": true,
      "maintenance_tracking": true,
      "online_payments": true,
      "accounting_integration": true,
      "custom_branding": true,
      "bulk_operations": true,
      "dedicated_support": false,
      "sla_99_9": true,
      "custom_integrations": true
    }',
    'For large property management portfolios',
    4
  ),
  
  -- Enterprise Plus (Custom)
  (
    'enterprise_plus',
    'Enterprise Plus',
    'enterprise_plus',
    999,                  -- 999 buildings (soft limit)
    9999,                 -- 9,999 units (soft limit)
    1000.0,               -- 1TB storage
    100,                  -- 100 users
    999999,               -- Unlimited API calls
    299.00,               -- Starts at $299/month
    2990.00,
    0.30,                 -- $0.30/unit overage
    0.10,                 -- $0.10/GB overage
    '{
      "mobile_app": true,
      "tenant_portal": true,
      "owner_portal": true,
      "basic_reporting": true,
      "advanced_reporting": true,
      "api_access": true,
      "priority_support": true,
      "phone_support": true,
      "maintenance_tracking": true,
      "online_payments": true,
      "accounting_integration": true,
      "custom_branding": true,
      "white_label": true,
      "bulk_operations": true,
      "dedicated_support": true,
      "dedicated_account_manager": true,
      "sla_99_9": true,
      "custom_integrations": true,
      "sso": true,
      "custom_contracts": true
    }',
    'Custom pricing for institutional portfolios. Contact sales for details.',
    5
  )
ON CONFLICT (plan_code) DO UPDATE SET
  plan_name = EXCLUDED.plan_name,
  max_buildings = EXCLUDED.max_buildings,
  max_units = EXCLUDED.max_units,
  max_storage_gb = EXCLUDED.max_storage_gb,
  max_users = EXCLUDED.max_users,
  max_api_calls_per_month = EXCLUDED.max_api_calls_per_month,
  monthly_price = EXCLUDED.monthly_price,
  annual_price = EXCLUDED.annual_price,
  overage_unit_price = EXCLUDED.overage_unit_price,
  overage_storage_price_per_gb = EXCLUDED.overage_storage_price_per_gb,
  features = EXCLUDED.features,
  description = EXCLUDED.description,
  display_order = EXCLUDED.display_order,
  updated_at = now();

-- ============================================================================
-- PART 9: UTILITY VIEWS
-- ============================================================================

-- View: Subscription overview
CREATE OR REPLACE VIEW v_subscription_overview AS
SELECT 
  o.id as organization_id,
  o.name as organization_name,
  sp.plan_name,
  sp.plan_code,
  os.status as subscription_status,
  os.contract_start_date,
  os.contract_end_date,
  os.trial_ends_at,
  sp.monthly_price,
  sp.max_buildings,
  sp.max_units,
  sp.max_storage_gb,
  sp.max_users,
  COALESCE(os.max_buildings_override, sp.max_buildings) as effective_max_buildings,
  COALESCE(os.max_units_override, sp.max_units) as effective_max_units,
  COALESCE(os.max_storage_gb_override, sp.max_storage_gb) as effective_max_storage_gb,
  COALESCE(os.max_users_override, sp.max_users) as effective_max_users
FROM organizations o
LEFT JOIN organization_subscriptions os ON os.organization_id = o.id AND os.is_active = true
LEFT JOIN subscription_plans sp ON sp.id = os.subscription_plan_id
WHERE o.is_active = true;

COMMENT ON VIEW v_subscription_overview IS 
'Displays current subscription status and limits for all active organizations.';

-- View: Usage vs Limits
CREATE OR REPLACE VIEW v_usage_vs_limits AS
SELECT 
  o.id as organization_id,
  o.name as organization_name,
  sp.plan_name,
  
  -- Buildings
  (SELECT COUNT(*) FROM buildings WHERE organization_id = o.id AND is_active = true) as current_buildings,
  COALESCE(os.max_buildings_override, sp.max_buildings) as max_buildings,
  ROUND(100.0 * (SELECT COUNT(*) FROM buildings WHERE organization_id = o.id AND is_active = true) / 
    NULLIF(COALESCE(os.max_buildings_override, sp.max_buildings), 0), 2) as buildings_usage_pct,
  
  -- Units
  (SELECT COUNT(*) FROM units WHERE organization_id = o.id AND is_active = true) as current_units,
  COALESCE(os.max_units_override, sp.max_units) as max_units,
  ROUND(100.0 * (SELECT COUNT(*) FROM units WHERE organization_id = o.id AND is_active = true) / 
    NULLIF(COALESCE(os.max_units_override, sp.max_units), 0), 2) as units_usage_pct,
  
  -- Users
  (SELECT COUNT(*) FROM organization_members WHERE organization_id = o.id AND is_active = true) as current_users,
  COALESCE(os.max_users_override, sp.max_users) as max_users,
  ROUND(100.0 * (SELECT COUNT(*) FROM organization_members WHERE organization_id = o.id AND is_active = true) / 
    NULLIF(COALESCE(os.max_users_override, sp.max_users), 0), 2) as users_usage_pct
  
FROM organizations o
LEFT JOIN organization_subscriptions os ON os.organization_id = o.id AND os.is_active = true
LEFT JOIN subscription_plans sp ON sp.id = os.subscription_plan_id
WHERE o.is_active = true;

COMMENT ON VIEW v_usage_vs_limits IS 
'Shows current resource usage compared to subscription limits. Use to identify organizations approaching quotas.';

-- ============================================================================
-- PART 10: RLS POLICIES FOR NEW TABLES
-- ============================================================================

-- Enable RLS
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_usage ENABLE ROW LEVEL SECURITY;

-- Subscription plans: Public read (for pricing page)
CREATE POLICY "subscription_plans_select" ON subscription_plans
  FOR SELECT TO public
  USING (is_active = true);

-- Organization subscriptions: Members can view their org's subscription
CREATE POLICY "org_subscriptions_select" ON organization_subscriptions
  FOR SELECT TO public
  USING (is_org_member(organization_id));

-- Organization subscriptions: Only admins can modify
CREATE POLICY "org_subscriptions_insert" ON organization_subscriptions
  FOR INSERT TO public
  WITH CHECK (is_org_admin(organization_id));

CREATE POLICY "org_subscriptions_update" ON organization_subscriptions
  FOR UPDATE TO public
  USING (is_org_admin(organization_id))
  WITH CHECK (is_org_admin(organization_id));

-- Subscription usage: Members can view their org's usage
CREATE POLICY "subscription_usage_select" ON subscription_usage
  FOR SELECT TO public
  USING (is_org_member(organization_id));

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Log migration
DO $$
BEGIN
  RAISE NOTICE '✅ Subscription system migration completed successfully';
  RAISE NOTICE '📊 Created % subscription plans', (SELECT COUNT(*) FROM subscription_plans);
  RAISE NOTICE '🎯 Quota enforcement triggers applied to: buildings, units, organization_members';
  RAISE NOTICE '📈 Usage tracking function ready: update_subscription_usage()';
  RAISE NOTICE '🔒 RLS policies enabled on all subscription tables';
END $$;
