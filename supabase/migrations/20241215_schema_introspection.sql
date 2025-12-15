-- ============================================================================
-- Migration: Schema Introspection Functions
-- Date: 2024-12-15
-- Description: Functions to query database schema for admin UI
-- ============================================================================

-- Function to get all user tables in public schema
CREATE OR REPLACE FUNCTION public.get_all_tables()
RETURNS TABLE (
    table_name TEXT,
    table_schema TEXT,
    table_type TEXT
)
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT 
        t.table_name::TEXT,
        t.table_schema::TEXT,
        t.table_type::TEXT
    FROM information_schema.tables t
    WHERE t.table_schema = 'public'
    AND t.table_type = 'BASE TABLE'
    ORDER BY t.table_name;
$$;

-- Function to get columns for a specific table
CREATE OR REPLACE FUNCTION public.get_table_columns(
    p_table_name TEXT,
    p_schema_name TEXT DEFAULT 'public'
)
RETURNS TABLE (
    column_name TEXT,
    data_type TEXT,
    is_nullable TEXT,
    column_default TEXT,
    ordinal_position INTEGER
)
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT 
        c.column_name::TEXT,
        c.data_type::TEXT,
        c.is_nullable::TEXT,
        c.column_default::TEXT,
        c.ordinal_position::INTEGER
    FROM information_schema.columns c
    WHERE c.table_schema = p_schema_name
    AND c.table_name = p_table_name
    ORDER BY c.ordinal_position;
$$;

-- Grant execute to authenticated users (for admin panel)
GRANT EXECUTE ON FUNCTION public.get_all_tables() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_table_columns(TEXT, TEXT) TO authenticated;

-- Comments
COMMENT ON FUNCTION public.get_all_tables() IS 'Returns all user tables in the public schema';
COMMENT ON FUNCTION public.get_table_columns(TEXT, TEXT) IS 'Returns columns for a specific table';
