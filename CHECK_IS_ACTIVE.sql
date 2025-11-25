-- Check is_active column in profiles table

-- 1. Check column definition and default value
SELECT 
    column_name,
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles' 
  AND column_name = 'is_active';

-- 2. Check current values for all profiles
SELECT 
    id,
    email,
    is_active,
    created_at
FROM public.profiles
ORDER BY created_at DESC
LIMIT 10;

-- 3. If is_active doesn't default to true, run this:
-- ALTER TABLE public.profiles 
-- ALTER COLUMN is_active SET DEFAULT true;

-- 4. Update any existing NULL values to true:
-- UPDATE public.profiles 
-- SET is_active = true 
-- WHERE is_active IS NULL;
