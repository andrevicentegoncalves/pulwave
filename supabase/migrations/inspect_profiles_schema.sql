-- ============================================================================
-- INSPECT PROFILES SCHEMA (JSON OUTPUT)
-- Returns a single JSON object with table structure
-- ============================================================================

WITH column_info AS (
    SELECT 
        json_agg(json_build_object(
            'column_name', column_name,
            'data_type', CASE WHEN data_type = 'USER-DEFINED' THEN udt_name ELSE data_type END,
            'is_nullable', is_nullable,
            'column_default', column_default
        ) ORDER BY ordinal_position) as columns
    FROM information_schema.columns 
    WHERE table_name = 'profiles'
),
constraint_info AS (
    SELECT 
        json_agg(json_build_object(
            'constraint_name', tc.constraint_name,
            'type', tc.constraint_type,
            'column', kcu.column_name,
            'foreign_table', ccu.table_name
        )) as constraints
    FROM 
        information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        LEFT JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
    WHERE tc.table_name = 'profiles'
)
SELECT 
    json_build_object(
        'table', 'profiles',
        'columns', (SELECT columns FROM column_info),
        'constraints', (SELECT constraints FROM constraint_info)
    ) as schema_info;
