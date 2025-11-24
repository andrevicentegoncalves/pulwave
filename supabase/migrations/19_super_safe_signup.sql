-- ============================================================================
-- SUPER SAFE SIGNUP TRIGGER
-- ============================================================================
-- This trigger is designed to NEVER fail the signup process.
-- If profile creation fails, it logs the error but allows the user to be created.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  BEGIN
    INSERT INTO public.profiles (auth_user_id, first_name, last_name, email)
    VALUES (
      new.id,
      COALESCE(new.raw_user_meta_data->>'first_name', ''), -- Default to empty string if missing
      COALESCE(new.raw_user_meta_data->>'last_name', ''),  -- Default to empty string if missing
      new.email
    )
    ON CONFLICT (auth_user_id) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    -- Log the error but DO NOT fail the transaction
    RAISE WARNING 'Error creating profile for user %: %', new.id, SQLERRM;
  END;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DO $$ BEGIN
    RAISE NOTICE '✅ Installed fail-safe signup trigger';
END $$;
