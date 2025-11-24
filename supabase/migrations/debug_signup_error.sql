-- ============================================================================
-- INSPECT SCHEMA FOR DEBUGGING SIGNUP ERROR
-- ============================================================================

-- 1. Check profiles table columns and types
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'profiles';

-- 2. Check constraints on profiles table (Primary Keys, Foreign Keys, Unique)
SELECT conname, contype, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'public.profiles'::regclass;

-- 3. Check indexes on profiles table (to see if auth_user_id is unique)
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'profiles';

-- 4. Check triggers on auth.users
SELECT trigger_name, event_manipulation, action_statement, action_timing
FROM information_schema.triggers
WHERE event_object_schema = 'auth' AND event_object_table = 'users';

-- 5. Check the handle_new_user function definition
SELECT prosrc 
FROM pg_proc 
WHERE proname = 'handle_new_user';
