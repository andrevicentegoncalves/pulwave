-- Check if legal document acceptance data is being stored
-- Run this in Supabase SQL Editor

-- 1. Check what legal documents exist
SELECT 
    document_type,
    version,
    is_current,
    effective_date,
    LEFT(content, 50) as content_preview
FROM public.legal_documents
ORDER BY document_type, version;

-- 2. Check current user's profile for legal acceptance data
-- Replace 'YOUR_USER_EMAIL' with your actual email
SELECT 
    id,
    username,
    email,
    terms_accepted_version,
    terms_accepted_at,
    privacy_accepted_version,
    privacy_accepted_at,
    updated_at
FROM public.profiles
WHERE email = 'YOUR_USER_EMAIL';  -- CHANGE THIS!

-- 3. Check ALL profiles to see if ANY have acceptance data
SELECT 
    email,
    terms_accepted_version,
    terms_accepted_at,
    privacy_accepted_version,
    privacy_accepted_at
FROM public.profiles
WHERE terms_accepted_version IS NOT NULL 
   OR privacy_accepted_version IS NOT NULL;

-- 4. Check if the columns exist in profiles table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND column_name IN (
    'terms_accepted_version', 
    'terms_accepted_at',
    'privacy_accepted_version',
    'privacy_accepted_at'
  )
ORDER BY column_name;

-- 5. Test if you can manually update (to verify RLS policies)
-- Replace with your auth_user_id
-- UPDATE public.profiles
-- SET terms_accepted_version = '1.0',
--     terms_accepted_at = NOW()
-- WHERE auth_user_id = 'YOUR_AUTH_USER_ID';  -- Get this from query #2
