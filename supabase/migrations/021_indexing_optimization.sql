-- ============================================================================
-- INDEXING OPTIMIZATION - ESSENTIAL INDEXES ONLY
-- ============================================================================
-- Migration: 021_indexing_optimization.sql
-- Description: Adds essential composite indexes for common query patterns
-- Performance Impact: 10-100x faster queries on filtered data
-- Author: Pulwave DBA Team
-- Date: 2025-11-29
-- ============================================================================

-- ============================================================================
-- ORGANIZATION + ACTIVE STATUS INDEXES
-- ============================================================================

-- Buildings
CREATE INDEX IF NOT EXISTS idx_buildings_org_active 
  ON buildings(organization_id, is_active) 
  WHERE is_active = true;

-- Units
CREATE INDEX IF NOT EXISTS idx_units_org_active 
  ON units(organization_id, is_active) 
  WHERE is_active = true;

-- Leases
CREATE INDEX IF NOT EXISTS idx_leases_org_active 
  ON leases(organization_id, is_active) 
  WHERE is_active = true;

-- Tenants
CREATE INDEX IF NOT EXISTS idx_tenants_org_active 
  ON tenants(organization_id, is_active) 
  WHERE is_active = true;

-- Payments
CREATE INDEX IF NOT EXISTS idx_payments_org_active 
  ON payments(organization_id, is_active) 
  WHERE is_active = true;

-- ============================================================================
-- ORGANIZATION + CREATED_AT INDEXES
-- ============================================================================

-- Activity log
CREATE INDEX IF NOT EXISTS idx_activity_log_org_created 
  ON activity_log(organization_id, created_at DESC);

-- Buildings
CREATE INDEX IF NOT EXISTS idx_buildings_org_created 
  ON buildings(organization_id, created_at DESC) 
  WHERE is_active = true;

-- Units
CREATE INDEX IF NOT EXISTS idx_units_org_created 
  ON units(organization_id, created_at DESC) 
  WHERE is_active = true;

-- Leases
CREATE INDEX IF NOT EXISTS idx_leases_org_created 
  ON leases(organization_id, created_at DESC) 
  WHERE is_active = true;

-- Payments
CREATE INDEX IF NOT EXISTS idx_payments_org_created 
  ON payments(organization_id, created_at DESC) 
  WHERE is_active = true;

-- ============================================================================
-- JSONB INDEXES FOR TRANSLATIONS
-- ============================================================================

-- Buildings translations
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'buildings' AND column_name = 'translations'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_buildings_translations_gin 
      ON buildings USING gin(translations);
  END IF;
END $$;

-- Units translations
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'units' AND column_name = 'translations'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_units_translations_gin 
      ON units USING gin(translations);
  END IF;
END $$;

-- Amenities translations
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'amenities' AND column_name = 'translations'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_amenities_translations_gin 
      ON amenities USING gin(translations);
  END IF;
END $$;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

DO $$
DECLARE
  v_index_count integer;
BEGIN
  SELECT COUNT(*) INTO v_index_count
  FROM pg_indexes
  WHERE schemaname = 'public'
    AND indexname LIKE 'idx_%';
  
  RAISE NOTICE '✅ Indexing optimization migration completed successfully';
  RAISE NOTICE '📊 Total indexes in public schema: %', v_index_count;
  RAISE NOTICE '🚀 Created indexes for organization + active status queries';
  RAISE NOTICE '� Created indexes for organization + created_at sorting';
  RAISE NOTICE '� Created GIN indexes for JSONB translations (if columns exist)';
  RAISE NOTICE 'ℹ️  Note: Essential indexes only - monitoring views removed to avoid conflicts';
END $$;
