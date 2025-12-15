-- =============================================================================
-- MIGRATION: Reset and Refine Translations
-- Objective: 
-- 1. Remove existing schema/enum translations.
-- 2. Update logic to ONLY translate columns (not table names).
-- 3. Re-populate for English locales.
-- =============================================================================

-- 1. Clear existing translations
DELETE FROM schema_translations;
DELETE FROM enum_translations;

-- 2. Update Function: populate_schema_translations
-- Logic: Only insert for columns.
CREATE OR REPLACE FUNCTION populate_schema_translations(target_table TEXT)
RETURNS INTEGER AS $$
DECLARE
    col_record RECORD;
    v_locale_code TEXT;
    target_locales TEXT[];
    insert_count INTEGER := 0;
BEGIN
    target_locales := get_english_locales(); -- Helper that returns en-US, en-GB etc.
    
    FOREACH v_locale_code IN ARRAY target_locales
    LOOP
        -- Column translations ONLY
        FOR col_record IN 
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_schema = 'public' 
              AND table_name = target_table
            ORDER BY ordinal_position
        LOOP
            INSERT INTO schema_translations (
                table_name, column_name, locale_code, translated_label, 
                status, is_verified, schema_exists
            ) VALUES (
                target_table, col_record.column_name, v_locale_code, 
                to_title_case(col_record.column_name), 
                'published', TRUE, TRUE
            ) ON CONFLICT (table_name, column_name, locale_code, organization_id) 
              DO UPDATE SET 
                  schema_exists = TRUE,
                  is_active = TRUE,
                  updated_at = NOW();
            
            insert_count := insert_count + 1;
        END LOOP;
    END LOOP;
    
    RETURN insert_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Update Function: populate_all_enum_translations
-- Logic: Ensure it covers all english locales and only values.
CREATE OR REPLACE FUNCTION populate_all_enum_translations()
RETURNS INTEGER AS $$
DECLARE
    enum_rec RECORD;
    v_locale_code TEXT;
    target_locales TEXT[];
    insert_count INTEGER := 0;
BEGIN
    target_locales := get_english_locales();
    
    FOR enum_rec IN 
        SELECT 
            t.typname AS enum_name,
            e.enumlabel AS enum_value
        FROM pg_type t 
        JOIN pg_enum e ON t.oid = e.enumtypid
        JOIN pg_namespace n ON t.typnamespace = n.oid
        WHERE n.nspname = 'public'
        ORDER BY t.typname, e.enumsortorder
    LOOP
        FOREACH v_locale_code IN ARRAY target_locales
        LOOP
            -- Translate strict Enum Values
            INSERT INTO enum_translations (
                enum_name, enum_value, locale, translated_label
            ) VALUES (
                enum_rec.enum_name,
                enum_rec.enum_value,
                v_locale_code,
                to_title_case(REPLACE(enum_rec.enum_value, '-', ' '))
            ) ON CONFLICT (enum_name, enum_value, locale) DO NOTHING;
            
            insert_count := insert_count + 1;
        END LOOP;
    END LOOP;
    
    RETURN insert_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Re-populate everything
SELECT populate_all_schema_translations();
SELECT populate_all_enum_translations();

