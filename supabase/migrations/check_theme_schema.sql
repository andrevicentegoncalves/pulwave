-- Check user_preferences table schema
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns
WHERE table_name = 'user_preferences';

-- Check profiles table schema (just in case)
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
AND column_name LIKE '%theme%';
