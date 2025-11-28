-- Add address_id and billing_address_id columns to profiles table
-- Migration: 37_add_address_columns_to_profiles.sql

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
