-- ============================================================================
-- SCHEMA CLEANUP & I18N CONSISTENCY
-- ============================================================================
-- Migration: 027_schema_cleanup.sql
-- Description: Adds translations to global tables and removes legacy translation tables
-- Author: Pulwave DBA Team
-- Date: 2025-11-29
-- ============================================================================

-- 1. Add I18N to Global Tables
-- Roles and Permissions are global but need localized display names
ALTER TABLE roles ADD COLUMN IF NOT EXISTS translations jsonb DEFAULT '{}'::jsonb;
ALTER TABLE permissions ADD COLUMN IF NOT EXISTS translations jsonb DEFAULT '{}'::jsonb;

-- Add GIN indexes for performance
CREATE INDEX IF NOT EXISTS idx_roles_translations ON roles USING gin(translations);
CREATE INDEX IF NOT EXISTS idx_permissions_translations ON permissions USING gin(translations);

-- 2. Remove Legacy Translation Tables
-- We now use the JSONB 'translations' column on the main tables
DROP TABLE IF EXISTS building_translations;
DROP TABLE IF EXISTS land_parcel_translations;
-- Add others if found (e.g. unit_translations)
DROP TABLE IF EXISTS unit_translations;
DROP TABLE IF EXISTS amenity_translations;

-- 3. Verify Organization ID on critical tables
-- (No changes needed, analysis confirmed 'profiles' and 'roles' are intentionally global)

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Schema cleanup complete';
  RAISE NOTICE '🌍 Added translations to roles and permissions';
  RAISE NOTICE '🗑️ Removed legacy translation tables';
END $$;
