-- Verification script to confirm address columns exist in profiles table
-- Run this after applying the migration to verify success

-- Check if columns exist and their properties
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default,
    CASE 
        WHEN column_name = 'address_id' THEN '✓ Primary address column'
        WHEN column_name = 'billing_address_id' THEN '✓ Billing address column'
    END as description
FROM information_schema.columns
WHERE table_schema = 'public' 
    AND table_name = 'profiles'
    AND column_name IN ('address_id', 'billing_address_id')
ORDER BY column_name;

-- Expected result: 2 rows showing both columns with data_type = 'uuid' and is_nullable = 'YES'

-- Check if indexes were created
SELECT 
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
    AND tablename = 'profiles'
    AND indexname IN ('idx_profiles_address_id', 'idx_profiles_billing_address_id')
ORDER BY indexname;

-- Expected result: 2 rows showing both indexes

-- Check if foreign key constraints exist
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name = 'profiles'
    AND kcu.column_name IN ('address_id', 'billing_address_id')
ORDER BY kcu.column_name;

-- Expected result: 2 rows showing foreign key constraints to addresses(id)
