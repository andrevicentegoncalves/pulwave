-- ============================================================================
-- CLEANUP ZOMBIE TRIGGERS & BACKUP TABLE
-- ============================================================================
-- We found the culprits! There were old triggers still active:
-- 1. trigger_create_profile -> create_profile_for_user()
-- 2. trigger_sync_email -> sync_profile_email()
-- These were likely failing because they used the old schema.

-- 1. Drop the zombie triggers
DROP TRIGGER IF EXISTS trigger_create_profile ON auth.users;
DROP TRIGGER IF EXISTS trigger_sync_email ON auth.users;

-- 2. Drop the zombie functions
DROP FUNCTION IF EXISTS public.create_profile_for_user();
DROP FUNCTION IF EXISTS public.sync_profile_email();

-- 3. Drop the backup table (as requested)
DROP TABLE IF EXISTS public.profiles_backup_pre_normalization;

-- 4. Re-install the CORRECT fail-safe trigger
-- Just to be absolutely sure we have the right one active
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
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
    RAISE WARNING '⚠️ Profile creation failed for user %: %', new.id, SQLERRM;
  END;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DO $$ BEGIN
    RAISE NOTICE '✅ Zombie triggers killed. Backup table deleted. Correct trigger installed.';
END $$;
