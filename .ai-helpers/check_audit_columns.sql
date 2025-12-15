-- ============================================================================
-- AUDIT SETTINGS TABLES - Check Full Audit Trail Columns
-- Run this in Supabase SQL Editor to see which tables need audit columns added
-- Standard: 8 audit columns per table
-- ============================================================================

-- Check if all 7 settings tables have all 8 audit trail columns
WITH target_tables AS (
    SELECT unnest(ARRAY['profiles', 'user_preferences', 'contacts', 'addresses', 
                        'organization_members', 'professional_profiles', 'social_profiles']) AS table_name
),
audit_columns AS (
    SELECT unnest(ARRAY['created_at', 'created_by', 'updated_at', 'updated_by',
                        'deleted_at', 'deleted_by', 'is_active', 'version']) AS column_name
),
expected AS (
    SELECT t.table_name, a.column_name
    FROM target_tables t
    CROSS JOIN audit_columns a
),
actual AS (
    SELECT table_name, column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND column_name IN ('created_at', 'created_by', 'updated_at', 'updated_by',
                        'deleted_at', 'deleted_by', 'is_active', 'version')
)
SELECT 
    e.table_name,
    e.column_name AS expected_column,
    CASE WHEN a.column_name IS NOT NULL THEN '✅' ELSE '❌ MISSING' END AS status
FROM expected e
LEFT JOIN actual a ON e.table_name = a.table_name AND e.column_name = a.column_name
ORDER BY e.table_name, e.column_name;

-- ============================================================================
-- SUMMARY: Tables missing audit columns
-- ============================================================================
SELECT 
    table_name,
    COUNT(*) FILTER (WHERE actual_col IS NULL) AS missing_count,
    ARRAY_AGG(expected_col) FILTER (WHERE actual_col IS NULL) AS missing_columns
FROM (
    SELECT 
        e.table_name,
        e.column_name AS expected_col,
        a.column_name AS actual_col
    FROM (
        SELECT t.table_name, a.column_name
        FROM (SELECT unnest(ARRAY['profiles', 'user_preferences', 'contacts', 'addresses', 
                                  'organization_members', 'professional_profiles', 'social_profiles']) AS table_name) t
        CROSS JOIN (SELECT unnest(ARRAY['created_at', 'created_by', 'updated_at', 'updated_by',
                                        'deleted_at', 'deleted_by', 'is_active', 'version']) AS column_name) a
    ) e
    LEFT JOIN (
        SELECT table_name, column_name
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND column_name IN ('created_at', 'created_by', 'updated_at', 'updated_by',
                            'deleted_at', 'deleted_by', 'is_active', 'version')
    ) a ON e.table_name = a.table_name AND e.column_name = a.column_name
) sub
GROUP BY table_name
HAVING COUNT(*) FILTER (WHERE actual_col IS NULL) > 0
ORDER BY table_name;

-- ============================================================================
-- Check column order for each table (audit columns should be at the END)
-- ============================================================================
SELECT 
    table_name,
    MIN(ordinal_position) FILTER (WHERE column_name IN ('created_at', 'created_by', 'updated_at', 'updated_by',
                                                         'deleted_at', 'deleted_by', 'is_active', 'version')) AS first_audit_position,
    MAX(ordinal_position) AS total_columns,
    CASE 
        WHEN MAX(ordinal_position) - MIN(ordinal_position) FILTER (WHERE column_name IN ('created_at', 'created_by', 'updated_at', 'updated_by',
                                                                                          'deleted_at', 'deleted_by', 'is_active', 'version')) <= 7
        THEN '✅ AUDIT COLS AT END'
        ELSE '❌ NEEDS REORDER'
    END AS order_status
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name IN ('profiles', 'user_preferences', 'contacts', 'addresses', 
                   'organization_members', 'professional_profiles', 'social_profiles')
GROUP BY table_name
ORDER BY table_name;

-- ============================================================================
-- Check for deprecated columns (columns to potentially remove)
-- ============================================================================
SELECT 
    table_name,
    column_name,
    data_type,
    CASE 
        WHEN column_name LIKE '%deprecated%' THEN '⚠️ DEPRECATED'
        WHEN column_name LIKE '%old_%' THEN '⚠️ OLD'
        WHEN column_name LIKE '%temp%' THEN '⚠️ TEMP'
        WHEN column_name LIKE '%bak%' THEN '⚠️ BACKUP'
        ELSE ''
    END AS flag
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name IN ('profiles', 'user_preferences', 'contacts', 'addresses', 
                   'organization_members', 'professional_profiles', 'social_profiles')
AND (column_name LIKE '%deprecated%' OR column_name LIKE '%old_%' 
     OR column_name LIKE '%temp%' OR column_name LIKE '%bak%')
ORDER BY table_name, column_name;
