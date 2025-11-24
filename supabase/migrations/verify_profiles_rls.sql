-- ============================================================================
-- VERIFY PROFILES RLS POLICIES
-- ============================================================================
-- Run this script AFTER applying 32_restore_profiles_rls_policies.sql
-- to verify that the RLS policies are working correctly.
-- ============================================================================

-- 1. Check if RLS is enabled on profiles table
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
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;

-- Expected: 3 policies
-- - Users can insert own profile (INSERT)
-- - Users can update own profile (UPDATE)
-- - Users can view own profile (SELECT)

-- 3. Test SELECT policy (as authenticated user)
-- This should return your own profile
SELECT id, first_name, last_name, email, created_at
FROM profiles
WHERE auth_user_id = auth.uid();

-- Expected: Returns 1 row with your profile data

-- 4. Count total policies
SELECT COUNT(*) AS policy_count
FROM pg_policies
WHERE tablename = 'profiles';

-- Expected: policy_count >= 3

-- 5. Verify auth_user_id is set correctly
SELECT 
    id,
    auth_user_id,
    email,
    CASE 
        WHEN auth_user_id = id THEN '✅ Correct'
        ELSE '❌ Mismatch'
    END AS auth_user_id_status
FROM profiles
LIMIT 10;

-- Expected: All rows should show '✅ Correct'

-- ============================================================================
-- SUCCESS CRITERIA
-- ============================================================================
-- ✅ RLS is enabled on profiles table
-- ✅ At least 3 policies exist (SELECT, UPDATE, INSERT)
-- ✅ SELECT query returns your profile data
-- ✅ auth_user_id matches id for all profiles
