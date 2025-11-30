-- ============================================================================
-- DBA OPTIMIZATIONS
-- ============================================================================
-- Migration: 024_dba_optimizations.sql
-- Description: Implements autovacuum tuning, audit triggers, and archival functions
-- Author: Pulwave DBA Team
-- Date: 2025-11-29
-- ============================================================================

-- ============================================================================
-- 1. AUTOVACUUM TUNING
-- ============================================================================
-- Tune activity_log for frequent vacuuming to prevent bloat
-- Scale factor 0.05 means vacuum runs when 5% of rows change (default is 20%)

ALTER TABLE activity_log SET (
  autovacuum_vacuum_scale_factor = 0.05,
  autovacuum_analyze_scale_factor = 0.02,
  autovacuum_vacuum_cost_limit = 1000
);

-- Tune other high-churn tables if they exist
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'sessions' AND table_schema = 'public') THEN
    EXECUTE 'ALTER TABLE public.sessions SET (autovacuum_vacuum_scale_factor = 0.05)';
  END IF;
END $$;

-- ============================================================================
-- 2. AUDIT TRIGGER SYSTEM
-- ============================================================================

-- Create a generic function to log changes
CREATE OR REPLACE FUNCTION log_audit_event()
RETURNS TRIGGER AS $$
DECLARE
  v_old_data jsonb;
  v_new_data jsonb;
  v_user_id uuid;
  v_org_id uuid;
BEGIN
  -- Try to get user ID from session (works in Supabase)
  v_user_id := auth.uid();
  
  -- Determine organization_id (prioritize NEW, then OLD)
  IF (TG_OP = 'DELETE') THEN
    v_old_data := to_jsonb(OLD);
    v_org_id := OLD.organization_id;
  ELSE
    v_new_data := to_jsonb(NEW);
    v_org_id := NEW.organization_id;
    
    IF (TG_OP = 'UPDATE') THEN
      v_old_data := to_jsonb(OLD);
    END IF;
  END IF;

  -- Insert into activity_log
  INSERT INTO activity_log (
    organization_id,
    user_id,
    action,
    entity_type,
    entity_id,
    old_values,
    new_values,
    created_at
  ) VALUES (
    v_org_id,
    v_user_id,
    TG_OP, -- INSERT, UPDATE, DELETE
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    v_old_data,
    v_new_data,
    NOW()
  );

  RETURN NULL; -- Result is ignored for AFTER triggers
EXCEPTION WHEN OTHERS THEN
  -- Fail safe: don't block the transaction if logging fails
  RAISE WARNING 'Audit logging failed: %', SQLERRM;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit trigger to critical tables
-- (We use DO block to avoid errors if triggers already exist)

DO $$
DECLARE
  t text;
  tables text[] := ARRAY['profiles', 'organizations', 'subscription_plans'];
BEGIN
  FOREACH t IN ARRAY tables
  LOOP
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = t) THEN
      EXECUTE format('
        DROP TRIGGER IF EXISTS audit_trigger_%I ON %I;
        CREATE TRIGGER audit_trigger_%I
        AFTER INSERT OR UPDATE OR DELETE ON %I
        FOR EACH ROW EXECUTE FUNCTION log_audit_event();
      ', t, t, t, t);
    END IF;
  END LOOP;
END $$;

-- ============================================================================
-- 3. ARCHIVAL STRATEGY
-- ============================================================================

-- Create an archive schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS archive;

-- Function to archive soft-deleted records
CREATE OR REPLACE FUNCTION archive_soft_deleted_records(
  p_table_name text,
  p_retention_days integer DEFAULT 90
) RETURNS integer AS $$
DECLARE
  v_count integer;
  v_archive_table text := 'archive.' || p_table_name;
BEGIN
  -- 1. Create archive table if not exists (inheriting structure)
  EXECUTE format('
    CREATE TABLE IF NOT EXISTS %s (LIKE %I INCLUDING ALL);
  ', v_archive_table, p_table_name);

  -- 2. Move records
  EXECUTE format('
    WITH moved_rows AS (
      DELETE FROM %I
      WHERE deleted_at < NOW() - INTERVAL ''%s days''
      RETURNING *
    )
    INSERT INTO %s SELECT * FROM moved_rows;
  ', p_table_name, p_retention_days, v_archive_table);
  
  GET DIAGNOSTICS v_count = ROW_COUNT;
  
  RETURN v_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION archive_soft_deleted_records IS
'Moves records soft-deleted more than X days ago to the archive schema.';

-- ============================================================================
-- 4. STATEMENT TIMEOUT (Safety)
-- ============================================================================
-- Prevent runaway queries from locking the database
-- Note: This applies to the session running the migration, 
-- but serves as a template for role-level configuration.

-- ALTER ROLE authenticated SET statement_timeout = '15s';

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ DBA Optimizations applied successfully';
  RAISE NOTICE '🧹 Autovacuum tuned for activity_log';
  RAISE NOTICE '📝 Audit triggers applied to critical tables';
  RAISE NOTICE '📦 Archival function archive_soft_deleted_records() created';
END $$;
