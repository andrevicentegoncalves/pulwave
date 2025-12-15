-- Fixed script for Supabase SQL Editor
-- Using a DO block to define the variable safely

DO $$
DECLARE
    target_email TEXT := 'andre@andrevicentegoncalves.com';
BEGIN
    -- 1. Delete from public.profiles
    -- Cascade will handle related public tables (addresses, social_profiles, etc.)
    DELETE FROM public.profiles 
    WHERE auth_user_id IN (SELECT id FROM auth.users WHERE email = target_email);

    -- 2. Delete from auth.users
    -- This removes the authentication record
    DELETE FROM auth.users 
    WHERE email = target_email;
    
    RAISE NOTICE 'User % has been deleted.', target_email;
END $$;
