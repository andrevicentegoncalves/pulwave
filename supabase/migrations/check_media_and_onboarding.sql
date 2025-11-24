-- Check media_type enum
SELECT t.typname, e.enumlabel
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE t.typname = 'media_type';

-- Check media_library table definition
SELECT column_name, data_type, udt_name
FROM information_schema.columns
WHERE table_name = 'media_library';

-- Check profiles table columns related to onboarding
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'profiles' AND column_name LIKE '%onboard%';
