-- SQL to set super_admin role for a user
-- Run this in Supabase SQL Editor

-- Option 1: Update by email
UPDATE profiles
SET app_role = 'super_admin',
    updated_at = NOW()
WHERE email = 'YOUR_EMAIL_HERE';

-- Option 2: Update by auth_user_id (get from Supabase Auth)
-- UPDATE profiles
-- SET app_role = 'super_admin',
--     updated_at = NOW()
-- WHERE auth_user_id = 'YOUR_AUTH_USER_ID_HERE';

-- Verify the update
SELECT id, email, first_name, last_name, app_role
FROM profiles
WHERE app_role IN ('admin', 'super_admin');
