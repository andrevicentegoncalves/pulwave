-- ============================================================================
-- FINAL FIX FOR SIGNUP ERROR
-- ============================================================================
-- The previous fix failed because ON CONFLICT (auth_user_id) requires a unique constraint.
-- This script:
-- 1. Removes any duplicate profiles (keeping the latest)
-- 2. Adds a UNIQUE constraint to auth_user_id
-- 3. Re-applies the correct trigger function

-- 1. Deduplicate profiles (keep the one with the latest updated_at or largest id)
DELETE FROM public.profiles a USING public.profiles b
WHERE a.id < b.id AND a.auth_user_id = b.auth_user_id;

-- 2. Add Unique Constraint to auth_user_id
-- This is required for ON CONFLICT (auth_user_id) to work
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'profiles_auth_user_id_key'
    ) THEN
        ALTER TABLE public.profiles ADD CONSTRAINT profiles_auth_user_id_key UNIQUE (auth_user_id);
    END IF;
END $$;

-- 3. Update the handle_new_user function (same as before, but now it will work)
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
  ON CONFLICT (auth_user_id) DO NOTHING; -- Now this works because of the unique constraint
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Successfully added unique constraint and fixed signup trigger';
END $$;
