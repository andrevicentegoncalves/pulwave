-- ============================================================================
-- ENSURE PROFILES EXIST AND RESTORE TRIGGER
-- ============================================================================

-- 1. Create/Restore the handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, auth_user_id, first_name, last_name, email)
  VALUES (
    new.id, 
    new.id, 
    new.raw_user_meta_data->>'first_name', 
    new.raw_user_meta_data->>'last_name', 
    new.email
  )
  ON CONFLICT (id) DO NOTHING; -- Prevent error if it already exists
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create/Restore the trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Backfill profiles for any existing users who don't have one
-- This fixes the 406 error for existing users whose profiles were lost or not migrated
INSERT INTO public.profiles (id, auth_user_id, email, first_name, last_name)
SELECT 
    id, 
    id, 
    email,
    raw_user_meta_data->>'first_name',
    raw_user_meta_data->>'last_name'
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles);

DO $$
BEGIN
    RAISE NOTICE '✓ Restored handle_new_user trigger and backfilled missing profiles';
END $$;
