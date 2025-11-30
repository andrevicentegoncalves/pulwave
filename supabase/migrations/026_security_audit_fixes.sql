-- ============================================================================
-- SECURITY AUDIT FIXES
-- ============================================================================
-- Migration: 026_security_audit_fixes.sql
-- Description: Enables RLS on remaining unprotected tables and adds policies
-- Author: Pulwave DBA Team
-- Date: 2025-11-29
-- ============================================================================

-- ============================================================================
-- 1. ACTIVITY LOG (High Sensitivity)
-- ============================================================================
-- Enable RLS (Propagates to partitions automatically in PG)
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Policy: Members can view logs for their own organization
CREATE POLICY "Members can view org activity" ON activity_log
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM organization_members 
      WHERE organization_id = activity_log.organization_id
      AND is_active = true
    )
  );

-- Policy: System/Triggers insert logs (via SECURITY DEFINER functions usually)
-- But if app inserts directly, ensure they belong to the org
CREATE POLICY "System can insert activity" ON activity_log
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM organization_members 
      WHERE organization_id = activity_log.organization_id
      AND is_active = true
    )
  );

-- ============================================================================
-- 2. API USAGE LOG (Billing Data)
-- ============================================================================
-- Check if table exists first
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'api_usage_log' AND table_schema = 'public') THEN
    
    EXECUTE 'ALTER TABLE api_usage_log ENABLE ROW LEVEL SECURITY';
    
    -- Policy: Only Admins/Owners can view API usage (billing implications)
    EXECUTE '
      CREATE POLICY "Admins can view api usage" ON api_usage_log
      FOR SELECT
      USING (
        is_org_admin(organization_id)
      )
    ';

  END IF;
END $$;

-- ============================================================================
-- 3. AUDIT LOGS (Legacy/Other)
-- ============================================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'audit_logs' AND table_schema = 'public') THEN
    
    EXECUTE 'ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY';
    
    -- Policy: Admins only
    EXECUTE '
      CREATE POLICY "Admins can view audit logs" ON audit_logs
      FOR SELECT
      USING (
        is_org_admin(organization_id)
      )
    ';

  END IF;
END $$;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Security fixes applied';
  RAISE NOTICE '🔒 RLS enabled on activity_log';
  RAISE NOTICE '🔒 RLS enabled on api_usage_log (if exists)';
  RAISE NOTICE '🔒 RLS enabled on audit_logs (if exists)';
END $$;
