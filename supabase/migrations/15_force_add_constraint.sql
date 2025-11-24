-- ============================================================================
-- FORCE ADD UNIQUE CONSTRAINT TO AUTH_USER_ID
-- ============================================================================
-- This script aggressively ensures the unique constraint exists.
-- It handles duplicate data first to prevent errors.

-- 1. Deduplicate profiles (keep the one with the latest updated_at or largest id)
-- This is critical: you can't add a unique constraint if duplicates exist
DELETE FROM public.profiles a USING public.profiles b
WHERE a.id < b.id AND a.auth_user_id = b.auth_user_id;

-- 2. Drop constraint if it exists (to ensure we start fresh)
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_auth_user_id_key;

-- 3. Add the unique constraint explicitly
ALTER TABLE public.profiles ADD CONSTRAINT profiles_auth_user_id_key UNIQUE (auth_user_id);

-- 4. Verify it exists
DO $$
DECLARE
    constraint_count integer;
BEGIN
    SELECT count(*) INTO constraint_count
    FROM pg_constraint 
    WHERE conname = 'profiles_auth_user_id_key';
    
    IF constraint_count > 0 THEN
        RAISE NOTICE '✅ SUCCESS: Unique constraint profiles_auth_user_id_key created.';
    ELSE
        RAISE EXCEPTION '❌ ERROR: Failed to create unique constraint.';
    END IF;
END $$;
