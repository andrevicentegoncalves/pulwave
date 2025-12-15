-- =============================================================================
-- RESEED TRANSLATIONS AND ENSURE AUDIT COLUMNS
-- =============================================================================

-- 1. Function to add audit columns to all public tables
CREATE OR REPLACE FUNCTION ensure_audit_columns_for_all_tables()
RETURNS void LANGUAGE plpgsql AS $$
DECLARE
    tbl RECORD;
    col_exists BOOLEAN;
BEGIN
    FOR tbl IN 
        SELECT tablename FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename NOT IN ('spatial_ref_sys') -- Exclude PostGIS system table
    LOOP
        -- Mitigation: Deadlocks happen because ALTER TABLE requires AccessExclusiveLock.
        -- We can minimize this by checking catalog first. "ADD COLUMN IF NOT EXISTS" still requests lock.
        
        -- Created At
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name=tbl.tablename AND column_name='created_at') THEN
            EXECUTE format('ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW()', tbl.tablename);
        END IF;

        -- Updated At
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name=tbl.tablename AND column_name='updated_at') THEN
            EXECUTE format('ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW()', tbl.tablename);
        END IF;

        -- Created By
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name=tbl.tablename AND column_name='created_by') THEN
             EXECUTE format('ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id)', tbl.tablename);
        END IF;

        -- Updated By
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name=tbl.tablename AND column_name='updated_by') THEN
            EXECUTE format('ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id)', tbl.tablename);
        END IF;
    END LOOP;
END;
$$;

-- 2. Function to reseed schema translations
CREATE OR REPLACE FUNCTION reseed_schema_translations()
RETURNS void LANGUAGE plpgsql AS $$
DECLARE
    rec RECORD;
BEGIN
    -- Clear existing (as requested)
    TRUNCATE TABLE schema_translations CASCADE;
    TRUNCATE TABLE enum_translations CASCADE;
    
    -- Insert Schema Translations (All English variants)
    INSERT INTO schema_translations (table_name, column_name, locale_code, translated_label, is_active, schema_exists)
    SELECT 
        c.table_name, 
        c.column_name, 
        l.code, -- Use locale code from Locales table
        INITCAP(REPLACE(c.column_name, '_', ' ')), 
        true,
        true
    FROM information_schema.columns c
    CROSS JOIN locales l
    WHERE c.table_schema = 'public'
    AND c.table_name NOT IN ('schema_translations', 'ui_translations', 'enum_translations', 'content_translations', 'locales', 'spatial_ref_sys')
    AND l.language_code = 'en'; -- Only seed English variants (en-US, en-GB, etc.)

    -- Insert Enum Translations (All English variants)
    INSERT INTO enum_translations (enum_name, enum_value, locale, translated_label)
    SELECT 
        t.typname::text,
        e.enumlabel::text,
        l.code,
        INITCAP(REPLACE(e.enumlabel, '_', ' '))
    FROM pg_type t 
    JOIN pg_enum e ON t.oid = e.enumtypid
    JOIN pg_namespace n ON t.typnamespace = n.oid
    CROSS JOIN locales l
    WHERE n.nspname = 'public'
    AND l.language_code = 'en';

END;
$$;

-- 3. Execute logic (Uncomment to Run immediately, or User runs via Dashboard)
SELECT ensure_audit_columns_for_all_tables();
SELECT reseed_schema_translations();

-- Drop functions after use? Or keep as utilities.
-- DROP FUNCTION ensure_audit_columns_for_all_tables();
-- DROP FUNCTION reseed_schema_translations();
