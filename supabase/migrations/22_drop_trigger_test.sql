-- ============================================================================
-- ISOLATION TEST: DROP SIGNUP TRIGGER
-- ============================================================================
-- We are dropping the trigger COMPLETELY.
-- This will tell us if the trigger is the cause of the 500 error.

-- 1. Drop the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_v2 ON auth.users;
DROP TRIGGER IF EXISTS create_profile_on_signup ON auth.users;
DROP TRIGGER IF EXISTS handle_new_user_trigger ON auth.users;

-- 2. Verify no triggers exist on auth.users
SELECT 
    trigger_name, 
    event_manipulation, 
    action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'auth' AND event_object_table = 'users';

DO $$ BEGIN
    RAISE NOTICE '✅ All signup triggers DROPPED. Try signing up now.';
END $$;
