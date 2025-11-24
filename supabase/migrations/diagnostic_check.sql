-- ============================================================================
-- DIAGNOSTIC SCRIPT - Run this FIRST to check your database state
-- ============================================================================

-- Check if profiles table exists and its structure
SELECT 
    'profiles' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- Check if backup table exists
SELECT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'profiles_backup_pre_normalization'
) as backup_exists;

-- Check what enums exist
SELECT typname 
FROM pg_type 
WHERE typname IN (
    'user_type', 
    'contact_method', 
    'profile_visibility',
    'theme_preference',
    'payment_method',
    'verification_type',
    'verification_status',
    'suspension_reason',
    'consent_type',
    'emergency_relationship',
    'background_check_status',
    'user_locale'
)
ORDER BY typname;

-- Check if these tables already exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'contacts',
    'professional_profiles',
    'social_profiles',
    'verification_records',
    'user_preferences',
    'compliance_consents',
    'user_security_log',
    'user_onboarding',
    'user_suspensions'
)
ORDER BY table_name;
