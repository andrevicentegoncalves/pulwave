-- Distinct UI Keys
CREATE OR REPLACE VIEW distinct_ui_translations AS
SELECT DISTINCT translation_key, category, source_type, is_active
FROM ui_translations
WHERE is_active = true;

-- Distinct Schema Tables (Counting tables, as requested)
CREATE OR REPLACE VIEW distinct_schema_tables AS
SELECT DISTINCT table_name, is_active
FROM schema_translations
WHERE is_active = true;

-- Distinct Enum Names
CREATE OR REPLACE VIEW distinct_enum_names AS
SELECT DISTINCT enum_name
FROM enum_translations;

-- Distinct Content Records
CREATE OR REPLACE VIEW distinct_content_records AS
SELECT DISTINCT table_name, record_id
FROM content_translations;

GRANT SELECT ON distinct_ui_translations TO authenticated;
GRANT SELECT ON distinct_schema_tables TO authenticated;
GRANT SELECT ON distinct_enum_names TO authenticated;
GRANT SELECT ON distinct_content_records TO authenticated;
