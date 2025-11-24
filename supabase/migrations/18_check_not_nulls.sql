-- ============================================================================
-- FIND REMAINING NOT NULL COLUMNS
-- ============================================================================

SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns
WHERE 
    table_schema = 'public' 
    AND table_name = 'profiles'
    AND is_nullable = 'NO'
    AND column_default IS NULL;

-- Also check if the handle_new_user function is correct
SELECT prosrc FROM pg_proc WHERE proname = 'handle_new_user';
