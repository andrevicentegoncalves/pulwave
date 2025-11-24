-- ============================================================================
-- COMPREHENSIVE RLS DIAGNOSTIC
-- ============================================================================
-- Run this entire script to diagnose the RLS issue

-- 1. Check if RLS is enabled
SELECT 
    'RLS Status' AS check_type,
    tablename,
    rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'profiles';

-- 2. Count policies
SELECT 
    'Policy Count' AS check_type,
    COUNT(*) AS total_policies
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'profiles';

-- 3. List all policies (if any)
SELECT 
    'Policy Details' AS check_type,
    policyname,
    cmd AS operation,
    roles,
    qual AS using_clause
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'profiles';

-- 4. Check current user
SELECT 
    'Current User' AS check_type,
    current_user AS username,
    auth.uid() AS auth_uid;

-- 5. Try to query profiles (this will fail if RLS blocks it)
SELECT 
    'Profile Query Test' AS check_type,
    COUNT(*) AS profile_count
FROM profiles;
