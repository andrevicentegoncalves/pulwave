-- ============================================================================
-- INSPECT FULL SCHEMA
-- Lists all normalized tables with their columns and foreign keys
-- ============================================================================

WITH tables_to_inspect AS (
    SELECT unnest(ARRAY[
        'profiles',
        'contacts',
        'user_preferences',
        'professional_profiles',
        'social_profiles',
        'verification_records',
        'compliance_consents',
        'user_security_log',
        'user_onboarding',
        'user_suspensions'
    ]) AS table_name
),
table_info AS (
    SELECT 
        t.table_name,
        (
            SELECT json_agg(json_build_object(
                'column', c.column_name,
                'type', CASE WHEN c.data_type = 'USER-DEFINED' THEN c.udt_name ELSE c.data_type END,
                'nullable', c.is_nullable
            ) ORDER BY c.ordinal_position)
            FROM information_schema.columns c
            WHERE c.table_name = t.table_name
        ) as columns,
        (
            SELECT json_agg(json_build_object(
                'constraint', tc.constraint_name,
                'type', tc.constraint_type,
                'column', kcu.column_name,
                'foreign_table', ccu.table_name
            ))
            FROM information_schema.table_constraints tc
            JOIN information_schema.key_column_usage kcu 
                ON tc.constraint_name = kcu.constraint_name
            LEFT JOIN information_schema.constraint_column_usage ccu 
                ON ccu.constraint_name = tc.constraint_name
            WHERE tc.table_name = t.table_name
            AND tc.constraint_type IN ('PRIMARY KEY', 'FOREIGN KEY')
        ) as keys
    FROM tables_to_inspect t
)
SELECT 
    json_agg(json_build_object(
        'table', table_name,
        'columns', columns,
        'keys', keys
    )) as full_schema
FROM table_info;
