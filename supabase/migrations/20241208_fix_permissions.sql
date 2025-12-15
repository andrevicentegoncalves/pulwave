-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Grant access to profiles table
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO anon, authenticated, service_role;

-- Grant access to addresses table
GRANT SELECT, INSERT, UPDATE, DELETE ON public.addresses TO anon, authenticated, service_role;

-- Grant access to other related tables to be sure
GRANT SELECT, INSERT, UPDATE, DELETE ON public.professional_profiles TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.social_profiles TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profile_preferences TO anon, authenticated, service_role;

-- Force PostgREST schema cache reload (again)
NOTIFY pgrst, 'reload config';
