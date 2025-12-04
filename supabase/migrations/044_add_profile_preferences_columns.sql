-- Migration: Add missing columns to profile_preferences table
-- Description: Adds timezone, locale, and profile_visibility columns to the existing profile_preferences table
-- Date: 2025-12-03

-- Add timezone column (user's timezone preference)
ALTER TABLE profile_preferences
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC';

-- Add locale column (language/region preference)
ALTER TABLE profile_preferences
ADD COLUMN IF NOT EXISTS locale TEXT DEFAULT 'en-US';

-- Add profile_visibility column (who can see the profile)
ALTER TABLE profile_preferences
ADD COLUMN IF NOT EXISTS profile_visibility TEXT DEFAULT 'private';

-- Add check constraint for profile_visibility to ensure valid values
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'profile_visibility_check'
    ) THEN
        ALTER TABLE profile_preferences
        ADD CONSTRAINT profile_visibility_check 
        CHECK (profile_visibility IN ('public', 'private', 'organization', 'connections'));
    END IF;
END $$;

-- Add comments to document the columns
COMMENT ON COLUMN profile_preferences.timezone IS 'User timezone preference (e.g., UTC, America/New_York, Europe/Lisbon)';
COMMENT ON COLUMN profile_preferences.locale IS 'User language and region preference (e.g., en-US, pt-PT, es-ES)';
COMMENT ON COLUMN profile_preferences.profile_visibility IS 'Profile visibility setting: public, private, organization, or connections';
