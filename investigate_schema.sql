-- Investigate system_settings table schema
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM 
    information_schema.columns
WHERE 
    table_name = 'system_settings'
ORDER BY 
    ordinal_position;

-- Check if specific columns exist
SELECT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'system_settings' 
    AND column_name = 'category'
) as has_category_column;
