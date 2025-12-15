-- ============================================================================
-- Migration: Complete Audit Trail for Translation Tables
-- Date: 2024-12-15
-- Description: Add complete audit columns to all translation tables
-- Audit columns should be at the end of each table
-- ============================================================================

-- =============================================================================
-- AUDIT TRAIL COLUMNS TO ADD:
-- - created_at (TIMESTAMPTZ, already exists on most)
-- - created_by (UUID, FK to profiles)
-- - updated_at (TIMESTAMPTZ, already exists on most)
-- - updated_by (UUID, FK to profiles)
-- - deleted_at (TIMESTAMPTZ, for soft delete)
-- - deleted_by (UUID, FK to profiles)
-- - version (INTEGER, for optimistic locking)
-- - is_active (BOOLEAN, already exists on most)
-- =============================================================================

-- =============================================================================
-- UI TRANSLATIONS
-- =============================================================================

-- Add missing audit columns
ALTER TABLE ui_translations 
    ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES profiles(id),
    ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES profiles(id),
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES profiles(id),
    ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;

COMMENT ON COLUMN ui_translations.deleted_at IS 'Soft delete timestamp';
COMMENT ON COLUMN ui_translations.deleted_by IS 'User who soft-deleted this record';
COMMENT ON COLUMN ui_translations.version IS 'Optimistic locking version';

-- =============================================================================
-- SCHEMA TRANSLATIONS
-- =============================================================================

ALTER TABLE schema_translations 
    ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES profiles(id),
    ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES profiles(id),
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES profiles(id),
    ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;

COMMENT ON COLUMN schema_translations.deleted_at IS 'Soft delete timestamp';
COMMENT ON COLUMN schema_translations.deleted_by IS 'User who soft-deleted this record';
COMMENT ON COLUMN schema_translations.version IS 'Optimistic locking version';

-- =============================================================================
-- ENUM TRANSLATIONS
-- =============================================================================

ALTER TABLE enum_translations 
    ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES profiles(id),
    ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES profiles(id),
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES profiles(id),
    ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;

COMMENT ON COLUMN enum_translations.deleted_at IS 'Soft delete timestamp';
COMMENT ON COLUMN enum_translations.deleted_by IS 'User who soft-deleted this record';
COMMENT ON COLUMN enum_translations.version IS 'Optimistic locking version';

-- =============================================================================
-- CONTENT TRANSLATIONS
-- =============================================================================

ALTER TABLE content_translations 
    ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES profiles(id),
    ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES profiles(id),
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES profiles(id),
    ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;

COMMENT ON COLUMN content_translations.deleted_at IS 'Soft delete timestamp';
COMMENT ON COLUMN content_translations.deleted_by IS 'User who soft-deleted this record';
COMMENT ON COLUMN content_translations.version IS 'Optimistic locking version';

-- =============================================================================
-- MASTER DATA TRANSLATIONS (already has most columns)
-- =============================================================================

ALTER TABLE master_data_translations 
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES profiles(id),
    ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;

COMMENT ON COLUMN master_data_translations.deleted_at IS 'Soft delete timestamp';
COMMENT ON COLUMN master_data_translations.deleted_by IS 'User who soft-deleted this record';
COMMENT ON COLUMN master_data_translations.version IS 'Optimistic locking version';

-- =============================================================================
-- TRANSLATION REGISTRY (add complete audit)
-- =============================================================================

ALTER TABLE translation_registry 
    ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES profiles(id),
    ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES profiles(id),
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES profiles(id),
    ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;

-- =============================================================================
-- AUTO-UPDATE TRIGGER FOR updated_at
-- =============================================================================

CREATE OR REPLACE FUNCTION update_modified_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    -- Increment version on update
    IF TG_OP = 'UPDATE' AND NEW.version IS NOT NULL THEN
        NEW.version = COALESCE(OLD.version, 0) + 1;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to translation tables (if not exists)
DO $$ 
BEGIN
    -- ui_translations
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_ui_translations_updated') THEN
        CREATE TRIGGER trg_ui_translations_updated
            BEFORE UPDATE ON ui_translations
            FOR EACH ROW EXECUTE FUNCTION update_modified_timestamp();
    END IF;
    
    -- schema_translations
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_schema_translations_updated') THEN
        CREATE TRIGGER trg_schema_translations_updated
            BEFORE UPDATE ON schema_translations
            FOR EACH ROW EXECUTE FUNCTION update_modified_timestamp();
    END IF;
    
    -- enum_translations
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_enum_translations_updated') THEN
        CREATE TRIGGER trg_enum_translations_updated
            BEFORE UPDATE ON enum_translations
            FOR EACH ROW EXECUTE FUNCTION update_modified_timestamp();
    END IF;
    
    -- content_translations
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_content_translations_updated') THEN
        CREATE TRIGGER trg_content_translations_updated
            BEFORE UPDATE ON content_translations
            FOR EACH ROW EXECUTE FUNCTION update_modified_timestamp();
    END IF;
    
    -- master_data_translations
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_master_data_translations_updated') THEN
        CREATE TRIGGER trg_master_data_translations_updated
            BEFORE UPDATE ON master_data_translations
            FOR EACH ROW EXECUTE FUNCTION update_modified_timestamp();
    END IF;
    
    -- translation_registry
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_translation_registry_updated') THEN
        CREATE TRIGGER trg_translation_registry_updated
            BEFORE UPDATE ON translation_registry
            FOR EACH ROW EXECUTE FUNCTION update_modified_timestamp();
    END IF;
END $$;

-- =============================================================================
-- COLUMN ORDER CHECK: List tables that may need reordering
-- Audit columns should be at the end of each table
-- =============================================================================

-- Query to check column order (run manually to audit)
-- SELECT 
--     table_name,
--     string_agg(column_name || ' (' || ordinal_position::text || ')', ', ' ORDER BY ordinal_position) as columns
-- FROM information_schema.columns
-- WHERE table_name IN ('ui_translations', 'schema_translations', 'enum_translations', 
--                      'content_translations', 'master_data_translations', 'translation_registry')
-- AND table_schema = 'public'
-- GROUP BY table_name
-- ORDER BY table_name;

-- Note: In PostgreSQL, column order doesn't affect performance.
-- Reordering requires table recreation. Only do this if visual consistency is critical.
-- The ALTER TABLE ADD COLUMN automatically adds to the end, which is correct behavior.
