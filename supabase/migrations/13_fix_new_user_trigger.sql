-- ============================================================================
-- FIX HANDLE_NEW_USER TRIGGER FOR NORMALIZED SCHEMA
-- ============================================================================
-- After profiles normalization, the trigger needs to be updated:
-- - id: auto-generated UUID (primary key)
-- - auth_user_id: links to auth.users(id)

-- 1. Update the handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (auth_user_id, first_name, last_name, email)
  VALUES (
    new.id,  -- auth_user_id links to auth.users
    new.raw_user_meta_data->>'first_name', 
    new.raw_user_meta_data->>'last_name', 
    new.email
  )
  ON CONFLICT (auth_user_id) DO NOTHING; -- Prevent duplicate profiles for same auth user
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Fixed handle_new_user trigger for normalized profiles schema';
END $$;
