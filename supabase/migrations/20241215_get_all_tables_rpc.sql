-- =============================================================================
-- MIGRATION: Add RPC function to get all public tables
-- Date: 2024-12-15
-- Purpose: Query all tables from information_schema for the multi-select dropdown
-- =============================================================================

-- Function to get all public tables (bypasses RLS)
CREATE OR REPLACE FUNCTION get_all_public_tables()
RETURNS TABLE (table_name text, table_type text)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT 
        t.table_name::text,
        t.table_type::text
    FROM information_schema.tables t
    WHERE t.table_schema = 'public'
      AND t.table_type = 'BASE TABLE'
    ORDER BY t.table_name;
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION get_all_public_tables() TO authenticated;

SELECT 'RPC function get_all_public_tables created' as status;
