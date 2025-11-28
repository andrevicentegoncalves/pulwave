-- Check if professional_profiles table exists and its structure
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'professional_profiles'
ORDER BY ordinal_position;
