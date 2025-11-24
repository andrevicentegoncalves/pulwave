-- ============================================================================
-- RESTORE PROFILES RLS POLICIES AFTER NORMALIZATION
-- ============================================================================
-- The profiles_normalization.sql migration dropped the profiles table CASCADE,
-- which removed all RLS policies. This migration restores them.
--
-- Root Cause: profiles_normalization.sql created RLS policies for related
-- tables (contacts, preferences, etc.) but forgot to create policies for
-- the profiles table itself, causing 406 errors on all profile queries.
-- ============================================================================

-- Enable RLS on profiles table (idempotent)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (idempotent)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- ============================================================================
-- CREATE RLS POLICIES
-- ============================================================================

-- SELECT: Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT
    TO authenticated
    USING (auth_user_id = auth.uid());

-- UPDATE: Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE
    TO authenticated
    USING (auth_user_id = auth.uid())
    WITH CHECK (auth_user_id = auth.uid());

-- INSERT: Users can insert their own profile (for signup flow)
CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth_user_id = auth.uid());

-- ============================================================================
-- VERIFICATION
-- ============================================================================

DO $$
DECLARE
    policy_count INTEGER;
BEGIN
    -- Count policies on profiles table
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies
    WHERE tablename = 'profiles';
    
    IF policy_count >= 3 THEN
        RAISE NOTICE '✅ RLS policies restored on profiles table (% policies)', policy_count;
        RAISE NOTICE '✅ Users can now query their own profile data';
    ELSE
        RAISE WARNING '⚠ Expected at least 3 policies, found %', policy_count;
    END IF;
END $$;
