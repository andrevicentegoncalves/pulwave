-- Migration: Create get_all_tables RPC function
-- Allows listing all public tables via Supabase client

CREATE OR REPLACE FUNCTION get_all_tables()
RETURNS TABLE(table_name text, table_type text)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT
    t.table_name::text,
    t.table_type::text
  FROM information_schema.tables t
  WHERE t.table_schema = 'public'
    AND t.table_type IN ('BASE TABLE', 'VIEW')
  ORDER BY t.table_name;
$$;

-- Grant execute permission to authenticated users (adjust as needed)
GRANT EXECUTE ON FUNCTION get_all_tables() TO authenticated;
GRANT EXECUTE ON FUNCTION get_all_tables() TO anon;

COMMENT ON FUNCTION get_all_tables() IS 'Returns all public schema tables and views';
