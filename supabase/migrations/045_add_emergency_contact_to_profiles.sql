-- Migration: Add emergency contact and security columns to profiles table
-- Description: Adds two_factor_enabled and emergency contact fields to the profiles table
-- Date: 2025-12-03

-- Add two_factor_enabled column
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT false;

-- Add emergency contact columns
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT;

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT;

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS emergency_contact_relationship TEXT;

-- Add comments to document the columns
COMMENT ON COLUMN profiles.two_factor_enabled IS 'Whether two-factor authentication is enabled for this profile';
COMMENT ON COLUMN profiles.emergency_contact_name IS 'Full name of the emergency contact person';
COMMENT ON COLUMN profiles.emergency_contact_phone IS 'Phone number of the emergency contact person';
COMMENT ON COLUMN profiles.emergency_contact_relationship IS 'Relationship to the emergency contact (e.g., spouse, parent, friend)';
