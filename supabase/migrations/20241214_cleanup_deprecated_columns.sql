-- ============================================================================
-- Migration: Clean Up Deprecated Columns from Profiles
-- Date: 2024-12-14
-- Description: Remove deprecated/duplicate columns from profiles table
-- ============================================================================

BEGIN;

-- ============================================================================
-- PHASE 1: REMOVE DEPRECATED COLUMNS FROM PROFILES
-- ============================================================================

-- user_type: Now in professional_profiles table
-- Keep in profiles for backward compatibility but consider removal after data migration
ALTER TABLE profiles DROP COLUMN IF EXISTS user_type CASCADE;

-- country_of_residence: Derive from primary address in addresses table
ALTER TABLE profiles DROP COLUMN IF EXISTS country_of_residence CASCADE;

-- tax_identification_type: Already in professional_profiles.tax_id
ALTER TABLE profiles DROP COLUMN IF EXISTS tax_identification_type CASCADE;

-- ============================================================================
-- PHASE 2: ADD TRANSLATIONS JSONB TO PROFILES (if missing)
-- ============================================================================

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'translations'
    ) THEN
        ALTER TABLE profiles ADD COLUMN translations JSONB DEFAULT '{}'::JSONB;
    END IF;
END $$;

-- ============================================================================
-- PHASE 3: RECREATE SOCIAL_PROFILES WITH VERIFICATION_STATUS
-- (To maintain proper column order - audit columns must be LAST)
-- ============================================================================

-- Save existing data
CREATE TEMP TABLE _social_profiles_backup AS SELECT * FROM social_profiles;

-- Drop and recreate with proper order
DROP TABLE IF EXISTS social_profiles CASCADE;

CREATE TABLE social_profiles (
    -- Identity
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Social media links
    linkedin_url VARCHAR(500),
    twitter_url VARCHAR(500),
    facebook_url VARCHAR(500),
    instagram_url VARCHAR(500),
    youtube_url VARCHAR(500),
    tiktok_url VARCHAR(500),
    github_url VARCHAR(500),
    website_url VARCHAR(500),
    other_social_urls JSONB DEFAULT '[]'::JSONB,
    
    -- Verification (NEW)
    verification_status VARCHAR(50) DEFAULT 'unverified',
    
    -- Translations
    translations JSONB DEFAULT '{}'::JSONB,
    
    -- Audit trail (ALWAYS LAST)
    is_active BOOLEAN DEFAULT true,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id),
    deleted_at TIMESTAMPTZ,
    deleted_by UUID REFERENCES auth.users(id)
);

-- Restore data
INSERT INTO social_profiles (
    id, profile_id, linkedin_url, twitter_url, facebook_url, instagram_url,
    youtube_url, tiktok_url, github_url, website_url, other_social_urls,
    translations, is_active, version, created_at, created_by, updated_at, updated_by, deleted_at, deleted_by
)
SELECT 
    id, profile_id, linkedin_url, twitter_url, facebook_url, instagram_url,
    youtube_url, tiktok_url, github_url, website_url, other_social_urls,
    COALESCE(translations, '{}'::JSONB), is_active, version, created_at, created_by, updated_at, updated_by, deleted_at, deleted_by
FROM _social_profiles_backup;

-- Recreate indexes
CREATE INDEX idx_social_profiles_profile ON social_profiles(profile_id);
CREATE INDEX idx_social_profiles_is_active ON social_profiles(is_active) WHERE is_active = true;

-- Enable RLS
ALTER TABLE social_profiles ENABLE ROW LEVEL SECURITY;

-- Recreate RLS policy
CREATE POLICY "Users can manage own social profiles" ON social_profiles
    FOR ALL USING (profile_id IN (
        SELECT id FROM profiles WHERE auth_user_id = auth.uid()
    ));

DROP TABLE _social_profiles_backup;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Run this to verify columns were removed:
-- SELECT column_name FROM information_schema.columns 
-- WHERE table_name = 'profiles' 
--   AND column_name IN ('user_type', 'country_of_residence', 'tax_identification_type');
-- Should return 0 rows

-- Verify social_profiles column order:
-- SELECT column_name, ordinal_position FROM information_schema.columns
-- WHERE table_name = 'social_profiles' ORDER BY ordinal_position;

COMMIT;
