-- Diagnostic script to check why profiles are not being fetched
-- Run this in your Supabase SQL Editor

-- 1. Check if the profile exists
SELECT id, first_name, last_name, email, created_at 
FROM profiles 
WHERE id = auth.uid();

-- 2. Check RLS policies on profiles table
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- 3. Test if RLS is blocking SELECT
SELECT 
  tablename,
  rowsecurity 
FROM pg_tables 
WHERE tablename = 'profiles';

-- 4. Temporary fix: Disable RLS to test (ONLY FOR DEBUGGING - RE-ENABLE AFTER)
-- ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 5. Create a simple SELECT policy if none exists
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

-- 6. Test the query again
SELECT id, first_name, last_name, avatar_url 
FROM profiles 
WHERE id = auth.uid();
