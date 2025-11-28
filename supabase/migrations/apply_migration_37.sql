-- Apply Migration 37: Add address columns to profiles table
-- This migration adds address_id and billing_address_id to the profiles table
-- Run this in your Supabase Dashboard SQL Editor

-- Add address_id column (foreign key to addresses table)
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS address_id UUID REFERENCES addresses(id) ON DELETE SET NULL;

-- Add billing_address_id column (foreign key to addresses table)
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS billing_address_id UUID REFERENCES addresses(id) ON DELETE SET NULL;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_address_id ON profiles(address_id);
CREATE INDEX IF NOT EXISTS idx_profiles_billing_address_id ON profiles(billing_address_id);

-- Add comments for documentation
COMMENT ON COLUMN profiles.address_id IS 'Primary address for the user';
COMMENT ON COLUMN profiles.billing_address_id IS 'Billing address for the user (can be different from primary address)';

-- Verify the columns were added
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
    AND table_name = 'profiles'
    AND column_name IN ('address_id', 'billing_address_id')
ORDER BY column_name;
