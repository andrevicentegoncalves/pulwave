-- ============================================================================
-- SETTINGS TABLES COLUMN AUDIT
-- Run this in Supabase SQL Editor to check column order for all settings tables
-- ============================================================================

-- Tables used in settings pages
-- 1. profiles (Core identity, auth state)
-- 2. user_preferences (UI, locale, notifications)
-- 3. contacts (Phones, emergency contacts)
-- 4. addresses (Physical addresses)
-- 5. organization_members (User-org relationships)
-- 6. professional_profiles (Work/career info)
-- 7. social_profiles (Social media links)

-- ============================================================================
-- QUERY: Show column order for all settings tables
-- ============================================================================

SELECT 
    table_name,
    ordinal_position,
    column_name,
    data_type,
    is_nullable,
    column_default,
    CASE 
        WHEN column_name IN ('created_at', 'created_by', 'updated_at', 'updated_by', 'deleted_at', 'deleted_by', 'version') 
        THEN 'AUDIT'
        WHEN column_name = 'id' THEN 'PK'
        WHEN column_name LIKE '%_id' AND column_name != 'id' THEN 'FK'
        WHEN column_name LIKE 'is_%' THEN 'FLAG'
        ELSE 'DATA'
    END as column_category
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name IN (
    'profiles',
    'user_preferences',
    'contacts',
    'addresses',
    'organization_members',
    'professional_profiles',
    'social_profiles'
)
ORDER BY 
    table_name,
    ordinal_position;

-- ============================================================================
-- QUERY: Check if audit columns are at the end (validation query)
-- ============================================================================

WITH column_analysis AS (
    SELECT 
        table_name,
        column_name,
        ordinal_position,
        MAX(ordinal_position) OVER (PARTITION BY table_name) as max_position,
        CASE 
            WHEN column_name IN ('created_at', 'created_by', 'updated_at', 'updated_by', 'deleted_at', 'deleted_by', 'version') 
            THEN true 
            ELSE false 
        END as is_audit_column
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name IN (
        'profiles',
        'user_preferences',
        'contacts',
        'addresses',
        'organization_members',
        'professional_profiles',
        'social_profiles'
    )
),
audit_position_check AS (
    SELECT 
        table_name,
        column_name,
        ordinal_position,
        is_audit_column,
        -- Check: non-audit columns should come BEFORE audit columns
        -- If a non-audit column has position > min audit position, it's out of order
        MIN(CASE WHEN is_audit_column THEN ordinal_position END) OVER (PARTITION BY table_name) as first_audit_position,
        MAX(CASE WHEN NOT is_audit_column THEN ordinal_position END) OVER (PARTITION BY table_name) as last_data_position
    FROM column_analysis
)
SELECT 
    table_name,
    first_audit_position,
    last_data_position,
    CASE 
        WHEN first_audit_position IS NULL THEN 'NO AUDIT COLUMNS'
        WHEN last_data_position < first_audit_position THEN '✓ CORRECT ORDER'
        ELSE '✗ NEEDS REORDER - Data columns after audit columns'
    END as order_status
FROM audit_position_check
GROUP BY table_name, first_audit_position, last_data_position
ORDER BY 
    CASE 
        WHEN last_data_position >= first_audit_position THEN 0 
        ELSE 1 
    END,
    table_name;

-- ============================================================================
-- QUERY: Count total columns per table
-- ============================================================================

SELECT 
    table_name,
    COUNT(*) as total_columns,
    COUNT(*) FILTER (WHERE column_name IN ('created_at', 'created_by', 'updated_at', 'updated_by', 'deleted_at', 'deleted_by', 'version')) as audit_columns
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name IN (
    'profiles',
    'user_preferences',
    'contacts',
    'addresses',
    'organization_members',
    'professional_profiles',
    'social_profiles'
)
GROUP BY table_name
ORDER BY table_name;
