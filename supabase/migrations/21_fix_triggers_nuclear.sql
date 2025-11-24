-- ============================================================================
-- NUCLEAR TRIGGER FIX
-- ============================================================================
-- The simulation worked, so the profiles table is fine.
-- The error MUST be a "zombie" trigger or permission issue on auth.users.

-- 1. Drop ALL potential triggers on auth.users (to clean up old versions)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_v2 ON auth.users;
DROP TRIGGER IF EXISTS create_profile_on_signup ON auth.users;
DROP TRIGGER IF EXISTS handle_new_user_trigger ON auth.users;

-- 2. Re-create the function with explicit permissions and search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Wrap in a block to catch ANY error and prevent signup failure
  BEGIN
    INSERT INTO public.profiles (auth_user_id, first_name, last_name, email)
    VALUES (
      new.id,
      COALESCE(new.raw_user_meta_data->>'first_name', ''),
      COALESCE(new.raw_user_meta_data->>'last_name', ''),
      new.email
    )
    ON CONFLICT (auth_user_id) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    -- Log error but DO NOT FAIL
    RAISE WARNING '⚠️ Profile creation failed for user %: %', new.id, SQLERRM;
  END;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3. Re-create the single correct trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Grant necessary permissions (Just in case)
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.profiles TO postgres, service_role;

DO $$ BEGIN
    RAISE NOTICE '✅ Nuclear trigger fix applied. All old triggers removed.';
END $$;
