-- Check migration status for migrations 006-011

-- Check if profiles table has data that needs migration
SELECT 
    'Profiles with data to migrate' AS check_type,
    COUNT(*) AS count
FROM profiles 
WHERE linkedin_url IS NOT NULL 
   OR twitter_url IS NOT NULL 
   OR phone IS NOT NULL 
   OR company_name IS NOT NULL
   OR terms_accepted_at IS NOT NULL;

-- Check social_profiles table
SELECT 
    'Social profiles migrated' AS check_type,
    COUNT(*) AS count
FROM social_profiles;

-- Check contacts table
SELECT 
    'Contacts with type' AS check_type,
    COUNT(*) AS count
FROM contacts 
WHERE contact_type IS NOT NULL;

-- Check professional_profiles table
SELECT 
    'Professional profiles' AS check_type,
    COUNT(*) AS count
FROM professional_profiles;

-- Check compliance_consents table
SELECT 
    'Compliance consents' AS check_type,
    COUNT(*) AS count
FROM compliance_consents 
WHERE consent_type IS NOT NULL;

-- Check which columns still exist in profiles
SELECT 
    'Columns still in profiles' AS check_type,
    string_agg(column_name, ', ') AS columns
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'profiles'
AND column_name IN (
    'linkedin_url', 'twitter_url', 'facebook_url', 'instagram_url', 'website',
    'phone', 'phone_secondary', 'email_secondary',
    'company_name', 'vat_id',
    'terms_accepted_at', 'terms_accepted_version',
    'privacy_accepted_at', 'privacy_accepted_version'
);
