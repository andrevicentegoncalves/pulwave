-- ============================================================================
-- COMPLETE DATABASE SCHEMA EXPORT TO JSON (ENHANCED)
-- ============================================================================
-- Description: Exports the entire database structure including tables, columns,
-- constraints, indexes, policies, enums, functions, triggers, views,
-- EXTENSIONS, and MATERIALIZED VIEWS.
-- 
-- Usage: Run in Supabase SQL Editor, copy the JSON result
-- ============================================================================

WITH 
-- ============================================================================
-- EXTENSIONS (NEW)
-- ============================================================================
extensions AS (
    SELECT jsonb_agg(
        jsonb_build_object(
            'name', extname,
            'version', extversion,
            'schema', n.nspname
        ) ORDER BY extname
    ) AS data
    FROM pg_extension e
    JOIN pg_namespace n ON n.oid = e.extnamespace
),

-- ============================================================================
-- ENUMS
-- ============================================================================
enums AS (
    SELECT jsonb_agg(
        jsonb_build_object(
            'name', t.typname,
            'values', (
                SELECT string_agg(e.enumlabel, ', ' ORDER BY e.enumsortorder)
                FROM pg_enum e
                WHERE e.enumtypid = t.oid
            )
        ) ORDER BY t.typname
    ) AS data
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typtype = 'e'
    AND n.nspname = 'public'
),

-- ============================================================================
-- COLUMNS
-- ============================================================================
columns AS (
    SELECT 
        c.table_name,
        jsonb_agg(
            jsonb_build_object(
                'name', c.column_name,
                'type', CASE 
                    WHEN c.data_type = 'USER-DEFINED' THEN c.udt_name
                    WHEN c.data_type = 'ARRAY' THEN c.udt_name
                    ELSE c.data_type
                END,
                'is_nullable', c.is_nullable,
                'default', c.column_default,
                'ordinal', c.ordinal_position
            ) ORDER BY c.ordinal_position
        ) AS cols
    FROM information_schema.columns c
    WHERE c.table_schema = 'public'
    AND c.table_name NOT LIKE 'pg_%'
    GROUP BY c.table_name
),

-- ============================================================================
-- PRIMARY KEYS
-- ============================================================================
primary_keys AS (
    SELECT 
        tc.table_name,
        jsonb_agg(kcu.column_name ORDER BY kcu.ordinal_position) AS pk_columns
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
    WHERE tc.constraint_type = 'PRIMARY KEY'
    AND tc.table_schema = 'public'
    GROUP BY tc.table_name
),

-- ============================================================================
-- FOREIGN KEYS
-- ============================================================================
foreign_keys AS (
    SELECT 
        tc.table_name,
        jsonb_agg(
            jsonb_build_object(
                'constraint', tc.constraint_name,
                'column', kcu.column_name,
                'references_table', ccu.table_name,
                'references_column', ccu.column_name
            )
        ) AS fks
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage ccu 
        ON tc.constraint_name = ccu.constraint_name
        AND tc.table_schema = ccu.table_schema
    WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
    GROUP BY tc.table_name
),

-- ============================================================================
-- UNIQUE CONSTRAINTS
-- ============================================================================
unique_constraints AS (
    SELECT 
        tc.table_name,
        jsonb_agg(
            jsonb_build_object(
                'constraint', tc.constraint_name,
                'columns', (
                    SELECT jsonb_agg(kcu2.column_name ORDER BY kcu2.ordinal_position)
                    FROM information_schema.key_column_usage kcu2
                    WHERE kcu2.constraint_name = tc.constraint_name
                    AND kcu2.table_schema = tc.table_schema
                )
            )
        ) AS uniques
    FROM information_schema.table_constraints tc
    WHERE tc.constraint_type = 'UNIQUE'
    AND tc.table_schema = 'public'
    GROUP BY tc.table_name
),

-- ============================================================================
-- CHECK CONSTRAINTS
-- ============================================================================
check_constraints AS (
    SELECT 
        tc.table_name,
        jsonb_agg(
            jsonb_build_object(
                'constraint', tc.constraint_name,
                'definition', cc.check_clause
            )
        ) AS checks
    FROM information_schema.table_constraints tc
    JOIN information_schema.check_constraints cc 
        ON tc.constraint_name = cc.constraint_name
        AND tc.table_schema = cc.constraint_schema
    WHERE tc.constraint_type = 'CHECK'
    AND tc.table_schema = 'public'
    AND tc.constraint_name NOT LIKE '%_not_null'
    GROUP BY tc.table_name
),

-- ============================================================================
-- INDEXES
-- ============================================================================
indexes AS (
    SELECT 
        tablename AS table_name,
        jsonb_agg(
            jsonb_build_object(
                'name', indexname,
                'definition', indexdef,
                'is_unique', indexdef LIKE '%UNIQUE%'
            )
        ) AS idxs
    FROM pg_indexes
    WHERE schemaname = 'public'
    AND indexname NOT LIKE '%_pkey'
    GROUP BY tablename
),

-- ============================================================================
-- RLS POLICIES
-- ============================================================================
policies AS (
    SELECT 
        tablename AS table_name,
        jsonb_agg(
            jsonb_build_object(
                'name', policyname,
                'command', cmd,
                'permissive', permissive,
                'roles', roles,
                'using', qual,
                'with_check', with_check
            )
        ) AS pols
    FROM pg_policies
    WHERE schemaname = 'public'
    GROUP BY tablename
),

-- ============================================================================
-- RLS STATUS
-- ============================================================================
rls_status AS (
    SELECT 
        relname AS table_name,
        relrowsecurity AS rls_enabled,
        relforcerowsecurity AS rls_forced
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
    AND c.relkind = 'r'
),

-- ============================================================================
-- TABLE SIZES
-- ============================================================================
table_sizes AS (
    SELECT 
        relname AS table_name,
        pg_size_pretty(pg_total_relation_size(c.oid)) AS size
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
    AND c.relkind = 'r'
),

-- ============================================================================
-- TRIGGERS
-- ============================================================================
triggers AS (
    SELECT 
        event_object_table AS table_name,
        jsonb_agg(
            jsonb_build_object(
                'name', trigger_name,
                'timing', action_timing,
                'event', event_manipulation,
                'orientation', action_orientation
            )
        ) AS trigs
    FROM information_schema.triggers
    WHERE trigger_schema = 'public'
    GROUP BY event_object_table
),

-- ============================================================================
-- TABLES COMBINED
-- ============================================================================
tables AS (
    SELECT jsonb_agg(
        jsonb_build_object(
            'name', t.table_name,
            'type', t.table_type,
            'columns', COALESCE(c.cols, '[]'::jsonb),
            'primary_key', COALESCE(pk.pk_columns, '[]'::jsonb),
            'foreign_keys', COALESCE(fk.fks, '[]'::jsonb),
            'unique_constraints', COALESCE(uc.uniques, '[]'::jsonb),
            'check_constraints', COALESCE(cc.checks, '[]'::jsonb),
            'indexes', COALESCE(i.idxs, '[]'::jsonb),
            'rls_enabled', COALESCE(rls.rls_enabled, FALSE),
            'rls_forced', COALESCE(rls.rls_forced, FALSE),
            'rls_policies', COALESCE(p.pols, '[]'::jsonb),
            'triggers', COALESCE(tr.trigs, '[]'::jsonb),
            'size', COALESCE(ts.size, '0 bytes')
        ) ORDER BY t.table_name
    ) AS data
    FROM information_schema.tables t
    LEFT JOIN columns c ON c.table_name = t.table_name
    LEFT JOIN primary_keys pk ON pk.table_name = t.table_name
    LEFT JOIN foreign_keys fk ON fk.table_name = t.table_name
    LEFT JOIN unique_constraints uc ON uc.table_name = t.table_name
    LEFT JOIN check_constraints cc ON cc.table_name = t.table_name
    LEFT JOIN indexes i ON i.table_name = t.table_name
    LEFT JOIN rls_status rls ON rls.table_name = t.table_name
    LEFT JOIN policies p ON p.table_name = t.table_name
    LEFT JOIN triggers tr ON tr.table_name = t.table_name
    LEFT JOIN table_sizes ts ON ts.table_name = t.table_name
    WHERE t.table_schema = 'public'
    AND t.table_type = 'BASE TABLE'
    AND t.table_name NOT LIKE 'pg_%'
),

-- ============================================================================
-- VIEWS
-- ============================================================================
views AS (
    SELECT jsonb_agg(
        jsonb_build_object(
            'name', v.table_name,
            'definition', pg_get_viewdef((v.table_schema || '.' || v.table_name)::regclass, true)
        ) ORDER BY v.table_name
    ) AS data
    FROM information_schema.views v
    WHERE v.table_schema = 'public'
),

-- ============================================================================
-- MATERIALIZED VIEWS (NEW)
-- ============================================================================
materialized_views AS (
    SELECT jsonb_agg(
        jsonb_build_object(
            'name', matviewname,
            'definition', definition,
            'is_populated', ispopulated
        ) ORDER BY matviewname
    ) AS data
    FROM pg_matviews
    WHERE schemaname = 'public'
),

-- ============================================================================
-- FUNCTIONS
-- ============================================================================
functions AS (
    SELECT jsonb_agg(
        jsonb_build_object(
            'name', p.proname,
            'arguments', pg_get_function_arguments(p.oid),
            'return_type', pg_get_function_result(p.oid),
            'language', l.lanname,
            'volatility', CASE p.provolatile 
                WHEN 'i' THEN 'immutable'
                WHEN 's' THEN 'stable'
                WHEN 'v' THEN 'volatile'
            END,
            'security', CASE WHEN p.prosecdef THEN 'definer' ELSE 'invoker' END
        ) ORDER BY p.proname
    ) AS data
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    JOIN pg_language l ON l.oid = p.prolang
    WHERE n.nspname = 'public'
    AND p.prokind = 'f'
),

-- ============================================================================
-- SUMMARY STATS
-- ============================================================================
summary AS (
    SELECT jsonb_build_object(
        'total_tables', (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'),
        'total_columns', (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = 'public'),
        'total_enums', (SELECT COUNT(*) FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace WHERE t.typtype = 'e' AND n.nspname = 'public'),
        'total_functions', (SELECT COUNT(*) FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'public' AND p.prokind = 'f'),
        'total_views', (SELECT COUNT(*) FROM information_schema.views WHERE table_schema = 'public'),
        'total_indexes', (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public'),
        'total_policies', (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public'),
        'tables_with_rls', (SELECT COUNT(*) FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = 'public' AND c.relkind = 'r' AND c.relrowsecurity = TRUE)
    ) AS data
)

-- ============================================================================
-- FINAL OUTPUT
-- ============================================================================
SELECT jsonb_pretty(
    jsonb_build_object(
        'complete_schema', jsonb_build_object(
            'database', 'public',
            'generated_at', NOW(),
            'summary', (SELECT data FROM summary),
            'extensions', COALESCE((SELECT data FROM extensions), '[]'::jsonb),
            'enums', COALESCE((SELECT data FROM enums), '[]'::jsonb),
            'tables', COALESCE((SELECT data FROM tables), '[]'::jsonb),
            'views', COALESCE((SELECT data FROM views), '[]'::jsonb),
            'materialized_views', COALESCE((SELECT data FROM materialized_views), '[]'::jsonb),
            'functions', COALESCE((SELECT data FROM functions), '[]'::jsonb)
        )
    )
) AS complete_schema;
