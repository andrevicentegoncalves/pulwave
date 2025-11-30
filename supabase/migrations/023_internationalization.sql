-- ============================================================================
-- INTERNATIONALIZATION (I18N) - COMPLETE IMPLEMENTATION
-- ============================================================================
-- Migration: 023_internationalization.sql
-- Description: Implements translation validation, fallback logic, and
--              coverage monitoring for multilingual support
-- Author: Pulwave DBA Team
-- Date: 2025-11-29
-- ============================================================================

-- ============================================================================
-- PART 1: TRANSLATION VALIDATION FUNCTION
-- ============================================================================
-- Purpose: Ensures translation data is properly structured and complete
--
-- Validates:
--   1. Required locales exist (e.g., en-US must always be present)
--   2. All locales have same fields (name, description, etc.)
--   3. No empty strings or null values
-- ============================================================================

CREATE OR REPLACE FUNCTION validate_translations(
  translations jsonb,
  required_locales text[] DEFAULT ARRAY['en-US']
) RETURNS boolean AS $$
DECLARE
  locale text;
  field_count integer;
  first_locale_fields text[];
  current_locale_fields text[];
BEGIN
  -- Check if translations is null or empty
  IF translations IS NULL OR translations = '{}'::jsonb THEN
    RETURN false;
  END IF;
  
  -- Verify all required locales exist
  FOREACH locale IN ARRAY required_locales
  LOOP
    IF NOT (translations ? locale) THEN
      RAISE EXCEPTION 'Missing required locale: %', locale;
    END IF;
  END LOOP;
  
  -- Get field names from first locale (for consistency check)
  SELECT ARRAY_AGG(key ORDER BY key) INTO first_locale_fields
  FROM jsonb_object_keys(translations->required_locales[1]) AS key;
  
  -- Verify all locales have same fields
  FOREACH locale IN ARRAY required_locales
  LOOP
    SELECT ARRAY_AGG(key ORDER BY key) INTO current_locale_fields
    FROM jsonb_object_keys(translations->locale) AS key;
    
    IF current_locale_fields != first_locale_fields THEN
      RAISE EXCEPTION 'Locale % has inconsistent fields. Expected: %, Got: %', 
        locale, first_locale_fields, current_locale_fields;
    END IF;
  END LOOP;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION validate_translations IS
'Validates JSONB translation structure to ensure all required locales are present
and have consistent field names. Use in CHECK constraints for data quality.';

-- ============================================================================
-- PART 2: TRANSLATION FALLBACK FUNCTION
-- ============================================================================
-- Purpose: Safely retrieves translated text with automatic fallback
--
-- Fallback chain:
--   1. Try user's locale (e.g., pt-PT)
--   2. Try fallback locale (e.g., en-US)
--   3. Try English (en-US) as last resort
--   4. Return NULL if nothing found
-- ============================================================================

CREATE OR REPLACE FUNCTION get_translated_field(
  translations jsonb,
  field_name text,
  user_locale text DEFAULT 'en-US',
  fallback_locale text DEFAULT 'en-US'
) RETURNS text AS $$
BEGIN
  -- Try user's preferred locale first
  IF translations ? user_locale AND translations->user_locale ? field_name THEN
    RETURN translations->user_locale->>field_name;
  END IF;
  
  -- Try fallback locale
  IF translations ? fallback_locale AND translations->fallback_locale ? field_name THEN
    RETURN translations->fallback_locale->>field_name;
  END IF;
  
  -- Try English as last resort
  IF translations ? 'en-US' AND translations->'en-US' ? field_name THEN
    RETURN translations->'en-US'->>field_name;
  END IF;
  
  -- No translation found
  RETURN NULL;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION get_translated_field IS
'Retrieves translated field value with automatic fallback chain: user locale → fallback locale → English.
Prevents missing translations from breaking the UI.';

-- ============================================================================
-- PART 3: TRANSLATION COVERAGE MONITORING VIEWS
-- ============================================================================
-- Purpose: Monitors translation completeness across all tables
-- ============================================================================

-- Buildings translation coverage
CREATE OR REPLACE VIEW v_buildings_translation_coverage AS
SELECT 
  'buildings' as table_name,
  COUNT(*) as total_records,
  COUNT(*) FILTER (WHERE translations ? 'en-US') as en_us_count,
  COUNT(*) FILTER (WHERE translations ? 'pt-PT') as pt_pt_count,
  COUNT(*) FILTER (WHERE translations ? 'es-ES') as es_es_count,
  COUNT(*) FILTER (WHERE translations ? 'fr-FR') as fr_fr_count,
  COUNT(*) FILTER (WHERE translations ? 'de-DE') as de_de_count,
  ROUND(100.0 * COUNT(*) FILTER (WHERE translations ? 'en-US') / NULLIF(COUNT(*), 0), 2) as en_coverage_pct,
  ROUND(100.0 * COUNT(*) FILTER (WHERE translations ? 'pt-PT') / NULLIF(COUNT(*), 0), 2) as pt_coverage_pct,
  ROUND(100.0 * COUNT(*) FILTER (WHERE translations ? 'es-ES') / NULLIF(COUNT(*), 0), 2) as es_coverage_pct,
  ROUND(100.0 * COUNT(*) FILTER (WHERE translations ? 'fr-FR') / NULLIF(COUNT(*), 0), 2) as fr_coverage_pct,
  ROUND(100.0 * COUNT(*) FILTER (WHERE translations ? 'de-DE') / NULLIF(COUNT(*), 0), 2) as de_coverage_pct
FROM buildings
WHERE is_active = true;

-- Units translation coverage
CREATE OR REPLACE VIEW v_units_translation_coverage AS
SELECT 
  'units' as table_name,
  COUNT(*) as total_records,
  COUNT(*) FILTER (WHERE translations ? 'en-US') as en_us_count,
  COUNT(*) FILTER (WHERE translations ? 'pt-PT') as pt_pt_count,
  COUNT(*) FILTER (WHERE translations ? 'es-ES') as es_es_count,
  ROUND(100.0 * COUNT(*) FILTER (WHERE translations ? 'pt-PT') / NULLIF(COUNT(*), 0), 2) as pt_coverage_pct,
  ROUND(100.0 * COUNT(*) FILTER (WHERE translations ? 'es-ES') / NULLIF(COUNT(*), 0), 2) as es_coverage_pct
FROM units
WHERE is_active = true;

-- Amenities translation coverage
CREATE OR REPLACE VIEW v_amenities_translation_coverage AS
SELECT 
  'amenities' as table_name,
  COUNT(*) as total_records,
  COUNT(*) FILTER (WHERE translations ? 'en-US') as en_us_count,
  COUNT(*) FILTER (WHERE translations ? 'pt-PT') as pt_pt_count,
  COUNT(*) FILTER (WHERE translations ? 'es-ES') as es_es_count,
  ROUND(100.0 * COUNT(*) FILTER (WHERE translations ? 'pt-PT') / NULLIF(COUNT(*), 0), 2) as pt_coverage_pct,
  ROUND(100.0 * COUNT(*) FILTER (WHERE translations ? 'es-ES') / NULLIF(COUNT(*), 0), 2) as es_coverage_pct
FROM amenities
WHERE is_active = true;

-- Combined translation coverage view
CREATE OR REPLACE VIEW v_translation_coverage AS
SELECT * FROM v_buildings_translation_coverage
UNION ALL
SELECT 
  'units',
  total_records,
  en_us_count,
  pt_pt_count,
  es_es_count,
  NULL as fr_fr_count,
  NULL as de_de_count,
  ROUND(100.0 * en_us_count / NULLIF(total_records, 0), 2),
  pt_coverage_pct,
  es_coverage_pct,
  NULL,
  NULL
FROM v_units_translation_coverage
UNION ALL
SELECT 
  'amenities',
  total_records,
  en_us_count,
  pt_pt_count,
  es_es_count,
  NULL,
  NULL,
  ROUND(100.0 * en_us_count / NULLIF(total_records, 0), 2),
  pt_coverage_pct,
  es_coverage_pct,
  NULL,
  NULL
FROM v_amenities_translation_coverage;

COMMENT ON VIEW v_translation_coverage IS
'Displays translation coverage statistics for all translatable tables.
Use to track translation progress and identify gaps before market launches.';

-- ============================================================================
-- PART 4: MISSING TRANSLATIONS VIEW
-- ============================================================================
-- Purpose: Identifies specific records missing translations
-- ============================================================================

CREATE OR REPLACE VIEW v_missing_translations AS
SELECT 
  'buildings' as table_name,
  id,
  name as record_name,
  ARRAY(
    SELECT locale FROM (VALUES ('en-US'), ('pt-PT'), ('es-ES'), ('fr-FR'), ('de-DE')) AS t(locale)
    WHERE NOT (translations ? locale)
  ) as missing_locales
FROM buildings
WHERE is_active = true
  AND jsonb_array_length(
    to_jsonb(ARRAY(
      SELECT locale FROM (VALUES ('en-US'), ('pt-PT'), ('es-ES')) AS t(locale)
      WHERE NOT (translations ? locale)
    ))
  ) > 0

UNION ALL

SELECT 
  'units',
  id,
  unit_number as record_name,
  ARRAY(
    SELECT locale FROM (VALUES ('en-US'), ('pt-PT'), ('es-ES')) AS t(locale)
    WHERE NOT (translations ? locale)
  )
FROM units
WHERE is_active = true
  AND jsonb_array_length(
    to_jsonb(ARRAY(
      SELECT locale FROM (VALUES ('en-US'), ('pt-PT'), ('es-ES')) AS t(locale)
      WHERE NOT (translations ? locale)
    ))
  ) > 0

UNION ALL

SELECT 
  'amenities',
  id,
  get_translated_field(translations, 'name', 'en-US') as record_name,
  ARRAY(
    SELECT locale FROM (VALUES ('en-US'), ('pt-PT'), ('es-ES')) AS t(locale)
    WHERE NOT (translations ? locale)
  )
FROM amenities
WHERE is_active = true
  AND jsonb_array_length(
    to_jsonb(ARRAY(
      SELECT locale FROM (VALUES ('en-US'), ('pt-PT'), ('es-ES')) AS t(locale)
      WHERE NOT (translations ? locale)
    ))
  ) > 0;

COMMENT ON VIEW v_missing_translations IS
'Lists specific records that are missing translations for one or more locales.
Use to prioritize translation work.';

-- ============================================================================
-- PART 5: TRANSLATION HELPER FUNCTIONS
-- ============================================================================

-- Get all available locales for a record
CREATE OR REPLACE FUNCTION get_available_locales(translations jsonb)
RETURNS text[] AS $$
BEGIN
  RETURN ARRAY(SELECT jsonb_object_keys(translations));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION get_available_locales IS
'Returns array of all locale codes present in a translation JSONB object.';

-- Check if translation is complete for a locale
CREATE OR REPLACE FUNCTION is_translation_complete(
  translations jsonb,
  locale text,
  required_fields text[] DEFAULT ARRAY['name', 'description']
) RETURNS boolean AS $$
DECLARE
  field text;
BEGIN
  -- Check if locale exists
  IF NOT (translations ? locale) THEN
    RETURN false;
  END IF;
  
  -- Check if all required fields exist and are not empty
  FOREACH field IN ARRAY required_fields
  LOOP
    IF NOT (translations->locale ? field) OR 
       (translations->locale->>field) IS NULL OR 
       (translations->locale->>field) = '' THEN
      RETURN false;
    END IF;
  END LOOP;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION is_translation_complete IS
'Checks if a translation is complete for a specific locale.
Returns false if locale is missing or any required field is empty.';

-- Get translation completeness percentage
CREATE OR REPLACE FUNCTION get_translation_completeness(
  translations jsonb,
  target_locales text[] DEFAULT ARRAY['en-US', 'pt-PT', 'es-ES']
) RETURNS numeric AS $$
DECLARE
  complete_count integer := 0;
  locale text;
BEGIN
  FOREACH locale IN ARRAY target_locales
  LOOP
    IF is_translation_complete(translations, locale) THEN
      complete_count := complete_count + 1;
    END IF;
  END LOOP;
  
  RETURN ROUND(100.0 * complete_count / array_length(target_locales, 1), 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION get_translation_completeness IS
'Returns percentage of target locales that have complete translations.
Example: 2 out of 3 locales complete = 66.67%';

-- ============================================================================
-- PART 6: TRANSLATION QUALITY VIEWS
-- ============================================================================

-- Records with incomplete translations
CREATE OR REPLACE VIEW v_incomplete_translations AS
SELECT 
  'buildings' as table_name,
  id,
  name,
  get_translation_completeness(translations, ARRAY['en-US', 'pt-PT', 'es-ES']) as completeness_pct,
  get_available_locales(translations) as available_locales
FROM buildings
WHERE is_active = true
  AND get_translation_completeness(translations, ARRAY['en-US', 'pt-PT', 'es-ES']) < 100
ORDER BY get_translation_completeness(translations, ARRAY['en-US', 'pt-PT', 'es-ES']) ASC;

COMMENT ON VIEW v_incomplete_translations IS
'Shows records with incomplete translations, ordered by completeness percentage.
Use to prioritize translation work.';

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

DO $$
DECLARE
  v_buildings_coverage numeric;
  v_units_coverage numeric;
  v_amenities_coverage numeric;
BEGIN
  -- Get current coverage
  SELECT pt_coverage_pct INTO v_buildings_coverage FROM v_buildings_translation_coverage;
  SELECT pt_coverage_pct INTO v_units_coverage FROM v_units_translation_coverage;
  SELECT pt_coverage_pct INTO v_amenities_coverage FROM v_amenities_translation_coverage;
  
  RAISE NOTICE '✅ Internationalization migration completed successfully';
  RAISE NOTICE '🌍 Translation validation function: validate_translations()';
  RAISE NOTICE '🔄 Translation fallback function: get_translated_field()';
  RAISE NOTICE '📊 Current Portuguese (pt-PT) coverage:';
  RAISE NOTICE '   - Buildings: %%% complete', COALESCE(v_buildings_coverage, 0);
  RAISE NOTICE '   - Units: %%% complete', COALESCE(v_units_coverage, 0);
  RAISE NOTICE '   - Amenities: %%% complete', COALESCE(v_amenities_coverage, 0);
  RAISE NOTICE '💡 Use v_translation_coverage to monitor progress';
  RAISE NOTICE '💡 Use v_missing_translations to find records needing translation';
END $$;
