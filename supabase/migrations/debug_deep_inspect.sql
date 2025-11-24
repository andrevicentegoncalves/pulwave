-- ============================================================================
-- DEEP INSPECTION OF PROFILES TABLE
-- ============================================================================

-- 1. Check all columns, types, nullability, and default values
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'profiles';

-- 2. Check for any other triggers on auth.users
SELECT 
    trigger_name, 
    action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'auth' AND event_object_table = 'users';

-- 3. Check for triggers on public.profiles (maybe a trigger on insert is failing)
SELECT 
    trigger_name, 
    action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'public' AND event_object_table = 'profiles';

-- 4. Check the exact definition of the handle_new_user function
SELECT prosrc 
FROM pg_proc 
WHERE proname = 'handle_new_user';
