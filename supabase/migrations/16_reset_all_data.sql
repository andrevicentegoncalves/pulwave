-- ============================================================================
-- RESET ALL DATA (AUTH & PROFILES)
-- ============================================================================
-- WARNING: This will delete ALL users and profiles. Use with caution.

-- 1. Delete from public tables (Child tables first)
DELETE FROM public.user_preferences;
DELETE FROM public.professional_profiles;
DELETE FROM public.addresses;

-- 2. Delete from profiles
DELETE FROM public.profiles;

-- 3. Delete from auth.users
-- Note: This might fail if you don't have permissions or if there are other dependencies.
-- If it fails, please delete users manually from the Supabase Dashboard -> Authentication.
DELETE FROM auth.users;

-- 4. Verify clean slate
DO $$
DECLARE
    profile_count integer;
    user_count integer;
BEGIN
    SELECT count(*) INTO profile_count FROM public.profiles;
    SELECT count(*) INTO user_count FROM auth.users;
    
    RAISE NOTICE 'Reset Complete. Remaining Profiles: %, Remaining Users: %', profile_count, user_count;
END $$;
