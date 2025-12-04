-- Query to check subscription_plans table structure and content
-- Run this in your Supabase SQL Editor to inspect the table

-- 1. Check if table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'subscription_plans'
) AS table_exists;

-- 2. Get table structure (columns, data types, constraints)
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    column_default,
    is_nullable,
    udt_name
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'subscription_plans'
ORDER BY ordinal_position;

-- 3. Get all data from the table (if it exists)
SELECT * FROM public.subscription_plans
ORDER BY display_order;

-- 4. Count records
SELECT COUNT(*) as total_plans FROM public.subscription_plans;

-- 5. Check RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'subscription_plans';
