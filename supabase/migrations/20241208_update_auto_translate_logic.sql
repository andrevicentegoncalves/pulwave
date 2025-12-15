-- =============================================================================
-- MIGRATION: Update Schema Translation Logic
-- Objective: Only translate columns, not table names themselves.
-- =============================================================================

-- Populate schema translations for a single table (UPDATED)
CREATE OR REPLACE FUNCTION populate_schema_translations(target_table TEXT)
RETURNS INTEGER AS $$
DECLARE
    col_record RECORD;
    v_locale_code TEXT;
    target_locales TEXT[];
    insert_count INTEGER := 0;
BEGIN
    target_locales := get_english_locales();
    
    FOREACH v_locale_code IN ARRAY target_locales
    LOOP
        -- REMOVED: Table name translation insertion
        
        -- Column translations
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
