-- ============================================================================
-- Migration: Auto-Populate Database Translations
-- Description: Creates functions and triggers to automatically generate 
--              ui_translations entries (en-US, en-GB) when a table is added 
--              to master_data_values as a 'translatable_tables'.
-- ============================================================================

-- 1. Helper Function: Convert snake_case to Title Case
CREATE OR REPLACE FUNCTION to_title_case(text) RETURNS text AS $$
BEGIN
    RETURN initcap(replace($1, '_', ' '));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 2. Main Function: Populate Translations for a Table
CREATE OR REPLACE FUNCTION populate_table_translations(target_table text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- Run as owner to ensure access to ui_translations
AS $$
DECLARE
    col_record RECORD;
    col_label text;
BEGIN
    -- Iterate over all columns of the target table in public schema
    FOR col_record IN 
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = target_table
    LOOP
        -- Generate a human-readable label (e.g., 'first_name' -> 'First Name')
        col_label := to_title_case(col_record.column_name);

        -- Insert for English (US)
        INSERT INTO ui_translations (
            translation_key, 
            locale_code, 
            translated_text, 
            source_type, 
            source_table, 
            source_column, 
            status
        )
        VALUES (
            'db.' || target_table || '.' || col_record.column_name,
            'en-US',
            col_label,
            'database',
            target_table,
            col_record.column_name,
            'published'
        )
        ON CONFLICT (translation_key, locale_code) DO NOTHING;

        -- Insert for English (UK) - Defaults to same label
        INSERT INTO ui_translations (
            translation_key, 
            locale_code, 
            translated_text, 
            source_type, 
            source_table, 
            source_column, 
            status
        )
        VALUES (
            'db.' || target_table || '.' || col_record.column_name,
            'en-GB',
            col_label,
            'database',
            target_table,
            col_record.column_name,
            'published'
        )
        ON CONFLICT (translation_key, locale_code) DO NOTHING;
    END LOOP;
END;
$$;

-- 3. Trigger Function
CREATE OR REPLACE FUNCTION on_translatable_table_added()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Only trigger if the new item is a translatable table configuration
    IF NEW.type_key = 'translatable_tables' THEN
        -- Safely attempt to populate. 
        -- Note: If the table doesn't exist yet in information_schema, loop will just be empty.
        PERFORM populate_table_translations(NEW.value_key);
    END IF;
    RETURN NEW;
END;
$$;

-- 4. Create Trigger on master_data_values
DROP TRIGGER IF EXISTS trigger_auto_populate_translations ON master_data_values;
CREATE TRIGGER trigger_auto_populate_translations
AFTER INSERT ON master_data_values
FOR EACH ROW
EXECUTE FUNCTION on_translatable_table_added();

-- 5. Run for existing supported tables (One-off)
-- This ensures current tables (profiles, etc.) get populated if they aren't already.
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN SELECT value_key FROM master_data_values WHERE type_key = 'translatable_tables'
    LOOP
        PERFORM populate_table_translations(t);
    END LOOP;
END $$;
