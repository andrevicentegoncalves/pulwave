-- Ensure explicit, known constraint names for ambiguous relationships

-- 1. profile_preferences -> profiles (profile_id)
DO $$
BEGIN
    -- Attempt to drop the constraint if it exists with the standard name
    ALTER TABLE public.profile_preferences DROP CONSTRAINT IF EXISTS profile_preferences_profile_id_fkey;
    
    -- We can't easily guess other names, but we can verify if the constraint exists. 
    -- For now, we will ADD the constraint with the explicit name. 
    -- If a duplicate exists (different name), PostgREST will still be able to resolve 
    -- the specific one we request by name (!profile_preferences_profile_id_fkey).
    
    ALTER TABLE public.profile_preferences 
    ADD CONSTRAINT profile_preferences_profile_id_fkey 
    FOREIGN KEY (profile_id) 
    REFERENCES public.profiles(id) 
    ON DELETE CASCADE;
    
EXCEPTION WHEN duplicate_object THEN
    -- If it already exists (e.g. we failed to drop it above for some reason), ignore.
    NULL;
END $$;


-- 2. organization_members -> profiles (profile_id)
-- (Just in case, though not currently reporting error)
DO $$
BEGIN
    ALTER TABLE public.organization_members DROP CONSTRAINT IF EXISTS organization_members_profile_id_fkey;
    
    ALTER TABLE public.organization_members 
    ADD CONSTRAINT organization_members_profile_id_fkey 
    FOREIGN KEY (profile_id) 
    REFERENCES public.profiles(id) 
    ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN
    NULL;
END $$;


-- 3. professional_profiles -> profiles (profile_id)
DO $$
BEGIN
    ALTER TABLE public.professional_profiles DROP CONSTRAINT IF EXISTS professional_profiles_profile_id_fkey;
    
    ALTER TABLE public.professional_profiles 
    ADD CONSTRAINT professional_profiles_profile_id_fkey 
    FOREIGN KEY (profile_id) 
    REFERENCES public.profiles(id) 
    ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN
    NULL;
END $$;


-- 4. social_profiles -> profiles (profile_id)
DO $$
BEGIN
    ALTER TABLE public.social_profiles DROP CONSTRAINT IF EXISTS social_profiles_profile_id_fkey;
    
    ALTER TABLE public.social_profiles 
    ADD CONSTRAINT social_profiles_profile_id_fkey 
    FOREIGN KEY (profile_id) 
    REFERENCES public.profiles(id) 
    ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN
    NULL;
END $$;
