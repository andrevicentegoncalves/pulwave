-- =============================================================================
-- MIGRATION: Add RPC functions for smart column detection
-- Date: 2024-12-15
-- Purpose: Auto-detect translatable columns (text types) across all tables
-- =============================================================================

-- Function to get all text columns from all tables (for auto-suggesting translatable columns)
CREATE OR REPLACE FUNCTION get_all_text_columns()
RETURNS TABLE (table_name text, column_name text, data_type text)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT 
        c.table_name::text,
        c.column_name::text,
        c.data_type::text
    FROM information_schema.columns c
    INNER JOIN information_schema.tables t 
        ON c.table_name = t.table_name 
        AND c.table_schema = t.table_schema
    WHERE c.table_schema = 'public'
      AND t.table_type = 'BASE TABLE'
      AND c.data_type IN ('text', 'character varying', 'character', 'varchar', 'char')
    ORDER BY c.table_name, c.column_name;
$$;

-- Function to get columns for a specific table
CREATE OR REPLACE FUNCTION get_table_columns(p_table_name text)
RETURNS TABLE (column_name text, data_type text, is_nullable text)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT 
        c.column_name::text,
        c.data_type::text,
        c.is_nullable::text
    FROM information_schema.columns c
    INNER JOIN information_schema.tables t 
        ON c.table_name = t.table_name 
        AND c.table_schema = t.table_schema
    WHERE c.table_schema = 'public'
      AND t.table_type = 'BASE TABLE'
      AND c.table_name = p_table_name
    ORDER BY c.ordinal_position;
$$;

-- Function to get common translatable column names across all tables
-- (name, description, title, label, content, notes, etc.)
CREATE OR REPLACE FUNCTION get_common_translatable_columns()
RETURNS TABLE (table_name text, column_name text)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT 
        c.table_name::text,
        c.column_name::text
    FROM information_schema.columns c
    INNER JOIN information_schema.tables t 
        ON c.table_name = t.table_name 
        AND c.table_schema = t.table_schema
    WHERE c.table_schema = 'public'
      AND t.table_type = 'BASE TABLE'
      AND c.data_type IN ('text', 'character varying', 'character', 'varchar', 'char')
      AND c.column_name IN ('name', 'description', 'title', 'label', 'content', 'notes', 
                            'display_name', 'short_name', 'full_name', 'official_name',
                            'native_name', 'subject', 'body', 'message', 'summary',
                            'bio', 'about', 'about_me', 'introduction')
    ORDER BY c.table_name, c.column_name;
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION get_all_text_columns() TO authenticated;
GRANT EXECUTE ON FUNCTION get_table_columns(text) TO authenticated;
GRANT EXECUTE ON FUNCTION get_common_translatable_columns() TO authenticated;

SELECT 'RPC functions for smart column detection created' as status;
