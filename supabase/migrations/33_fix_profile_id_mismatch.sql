-- ============================================================================
-- RESTORE PROFILES RLS POLICIES (SEPARATE ID AND AUTH_USER_ID)
-- ============================================================================
-- Problem: The profiles table has RLS enabled but no policies, causing 406 errors.
--
-- Solution: Create RLS policies using auth_user_id = auth.uid() to maintain
-- separation between internal profile id and auth provider reference.
--
-- Design Decision: Keep id and auth_user_id separate for flexibility in
-- future auth provider migrations.
-- ============================================================================

-- Enable RLS (idempotent)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- ============================================================================
-- CREATE RLS POLICIES USING auth_user_id = auth.uid()
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
    SELECT COUNT(*) INTO policy_count FROM pg_policies WHERE tablename = 'profiles';
    
    IF policy_count >= 3 THEN
        RAISE NOTICE '✅ RLS policies created using auth_user_id = auth.uid() (% policies)', policy_count;
        RAISE NOTICE '✅ Separate id and auth_user_id columns maintained for flexibility';
        RAISE NOTICE '⚠ Application queries must use .eq(''auth_user_id'', user.id)';
    ELSE
        RAISE WARNING '⚠ Expected at least 3 policies, found %', policy_count;
    END IF;
END $$;
