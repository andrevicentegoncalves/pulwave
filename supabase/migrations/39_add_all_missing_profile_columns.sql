-- Comprehensive migration to add all missing columns to profiles table
-- Migration: 39_add_all_missing_profile_columns.sql

-- Personal Information
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS middle_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS display_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pronouns TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;

-- Contact Information
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_secondary TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone_secondary TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferred_contact_method TEXT DEFAULT 'email';

-- Social Links
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS twitter_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS facebook_url TEXT;

-- Professional Information
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS company_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS vat_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS job_title TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS department TEXT;

-- Preferences
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'light';

-- Notification Preferences
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS notifications_enabled BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS sms_notifications BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS push_notifications BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS marketing_emails BOOLEAN DEFAULT false;

-- Privacy Preferences
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS data_processing_consent BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS marketing_consent BOOLEAN DEFAULT false;

-- Add indexes for commonly queried fields
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_email_secondary ON profiles(email_secondary);
CREATE INDEX IF NOT EXISTS idx_profiles_company_name ON profiles(company_name);

-- Add comments for documentation
COMMENT ON COLUMN profiles.username IS 'Unique username for the user';
COMMENT ON COLUMN profiles.display_name IS 'Display name shown in the UI';
COMMENT ON COLUMN profiles.company_name IS 'Company name for business accounts';
COMMENT ON COLUMN profiles.vat_id IS 'VAT/Tax ID for business accounts';
COMMENT ON COLUMN profiles.theme IS 'UI theme preference (light/dark)';
COMMENT ON COLUMN profiles.preferred_contact_method IS 'Preferred method of contact (email/phone/sms)';

-- Verify columns were added
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
    AND table_name = 'profiles'
ORDER BY ordinal_position;
