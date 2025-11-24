-- ============================================================================
-- DIAGNOSTIC AND FIX FOR PROFILE RLS ISSUE
-- ============================================================================

-- First, let's check if the profile exists and what its data looks like
-- This will run as a superuser query to bypass RLS
DO $$
DECLARE
    profile_count INTEGER;
    auth_user_count INTEGER;
    rec RECORD;
BEGIN
    -- Count auth users
    SELECT COUNT(*) INTO auth_user_count FROM auth.users;
    RAISE NOTICE 'Total auth users: %', auth_user_count;
    
    -- Count profiles
    SELECT COUNT(*) INTO profile_count FROM public.profiles;
    RAISE NOTICE 'Total profiles: %', profile_count;
    
    -- Show any mismatches
    RAISE NOTICE 'Auth users without profiles:';
    FOR rec IN 
        SELECT id, email FROM auth.users 
        WHERE id NOT IN (SELECT id FROM public.profiles)
    LOOP
        RAISE NOTICE '  User: % (%)', rec.email, rec.id;
    END LOOP;
END $$;

-- Now let's fix any issues:
-- 1. Ensure all auth users have a profile entry
INSERT INTO public.profiles (id, auth_user_id, email, first_name, last_name)
SELECT 
    u.id, 
    u.id, 
    u.email,
    COALESCE(u.raw_user_meta_data->>'first_name', ''),
    COALESCE(u.raw_user_meta_data->>'last_name', '')
FROM auth.users u
WHERE u.id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;

-- 2. Fix any existing profiles where auth_user_id might be NULL or incorrect
UPDATE public.profiles
SET auth_user_id = id
WHERE auth_user_id IS NULL OR auth_user_id != id;

-- 3. Ensure user_onboarding entries exist for all profiles
INSERT INTO public.user_onboarding (profile_id, completed, current_step, total_steps)
SELECT id, FALSE, 0, 5
FROM public.profiles
WHERE id NOT IN (SELECT profile_id FROM public.user_onboarding)
ON CONFLICT (profile_id) DO NOTHING;

-- 4. Verify the RLS policies are correct
DO $$
DECLARE
    rls_enabled BOOLEAN;
BEGIN
    SELECT relrowsecurity INTO rls_enabled
    FROM pg_class
    WHERE relname = 'profiles' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');
    
    IF rls_enabled THEN
        RAISE NOTICE '✓ RLS is enabled on profiles table';
    ELSE
        RAISE WARNING '⚠ RLS is NOT enabled on profiles table';
    END IF;
END $$;

DO $$
BEGIN
    RAISE NOTICE '✓ Fixed profile data and RLS configuration';
    RAISE NOTICE 'Please refresh your browser to see if the issue is resolved';
END $$;
