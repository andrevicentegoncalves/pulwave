-- ============================================================================
-- DEBUG: Check RLS Status and Policies
-- ============================================================================
-- Run this to verify the migration was applied correctly

-- 1. Check if RLS is enabled on profiles
SELECT 
    schemaname,
    tablename,
    rowsecurity AS rls_enabled
FROM pg_tables
WHERE tablename = 'profiles';

-- Expected: rls_enabled = true

-- 2. List all RLS policies on profiles table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd AS operation,
    qual AS using_clause,
    with_check
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;

-- Expected: Should show 3 policies using auth_user_id

-- 3. Test if you can query your own profile
SELECT 
    id,
    auth_user_id,
    first_name,
    last_name,
    email,
    CASE 
        WHEN auth_user_id = auth.uid() THEN '✅ Match'
        ELSE '❌ No Match'
    END AS auth_check
FROM profiles
WHERE auth_user_id = auth.uid();

-- Expected: Should return your profile with ✅ Match

-- 4. Check what auth.uid() returns
SELECT auth.uid() AS current_user_id;

-- 5. Check if there are ANY policies
SELECT COUNT(*) AS policy_count
FROM pg_policies
WHERE tablename = 'profiles';

-- Expected: Should be >= 3
