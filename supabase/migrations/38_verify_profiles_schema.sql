-- Diagnostic query to check if address_id columns exist in profiles table
-- Migration: 38_verify_profiles_schema.sql

-- Check if columns exist
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
    AND table_name = 'profiles'
    AND column_name IN ('address_id', 'billing_address_id')
ORDER BY column_name;

-- If the above returns no rows, the columns don't exist yet
-- Run migration 37_add_address_columns_to_profiles.sql to add them
