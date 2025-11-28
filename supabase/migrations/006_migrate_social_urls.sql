-- ============================================================================
-- MIGRATION 006: Migrate Social URLs from profiles to social_profiles
-- ============================================================================
-- Description: Moves linkedin_url, twitter_url, facebook_url, website
-- from profiles table to social_profiles table
-- 
-- NOTE: instagram_url is NOT included as it doesn't exist in the profiles table
-- 
-- PREREQUISITE: Run 005a_fix_org_members_profile_id.sql first
-- Now uses get_profile_org_id() which works with profile_id directly
-- ============================================================================

BEGIN;

-- ============================================================================
-- STEP 1: Check if social URL columns exist in profiles
-- ============================================================================

DO $$
DECLARE
    v_has_linkedin BOOLEAN;
    v_has_twitter BOOLEAN;
    v_has_facebook BOOLEAN;
    v_has_website BOOLEAN;
BEGIN
    SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'linkedin_url') INTO v_has_linkedin;
    SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'twitter_url') INTO v_has_twitter;
    SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'facebook_url') INTO v_has_facebook;
    SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'website') INTO v_has_website;
    
    RAISE NOTICE 'Columns in profiles: linkedin_url=%, twitter_url=%, facebook_url=%, website=%',
        v_has_linkedin, v_has_twitter, v_has_facebook, v_has_website;
END $$;

-- ============================================================================
-- STEP 2: Migrate LinkedIn URLs
-- ============================================================================

INSERT INTO social_profiles (
    profile_id,
    platform,
    profile_url,
    platform_username,
    show_on_profile,
    is_public,
    display_order,
    organization_id,
    created_at,
    updated_at,
    is_active
)
SELECT 
    p.id AS profile_id,
    'linkedin' AS platform,
    p.linkedin_url AS profile_url,
    REGEXP_REPLACE(p.linkedin_url, '^https?://(www\.)?linkedin\.com/in/', '') AS platform_username,
    TRUE AS show_on_profile,
    TRUE AS is_public,
    1 AS display_order,
    get_profile_org_id(p.id) AS organization_id,
    COALESCE(p.updated_at, NOW()) AS created_at,
    NOW() AS updated_at,
    TRUE AS is_active
FROM profiles p
WHERE p.linkedin_url IS NOT NULL 
AND p.linkedin_url != ''
AND NOT EXISTS (
    SELECT 1 FROM social_profiles sp 
    WHERE sp.profile_id = p.id 
    AND sp.platform = 'linkedin'
);

-- ============================================================================
-- STEP 3: Migrate Twitter URLs
-- ============================================================================

INSERT INTO social_profiles (
    profile_id, platform, profile_url, platform_username,
    show_on_profile, is_public, display_order, organization_id,
    created_at, updated_at, is_active
)
SELECT 
    p.id,
    'twitter',
    p.twitter_url,
    REGEXP_REPLACE(p.twitter_url, '^https?://(www\.)?(twitter|x)\.com/', ''),
    TRUE, TRUE, 2,
    get_profile_org_id(p.id),
    COALESCE(p.updated_at, NOW()), NOW(), TRUE
FROM profiles p
WHERE p.twitter_url IS NOT NULL 
AND p.twitter_url != ''
AND NOT EXISTS (
    SELECT 1 FROM social_profiles sp 
    WHERE sp.profile_id = p.id 
    AND sp.platform = 'twitter'
);

-- ============================================================================
-- STEP 4: Migrate Facebook URLs
-- ============================================================================

INSERT INTO social_profiles (
    profile_id, platform, profile_url, platform_username,
    show_on_profile, is_public, display_order, organization_id,
    created_at, updated_at, is_active
)
SELECT 
    p.id,
    'facebook',
    p.facebook_url,
    REGEXP_REPLACE(p.facebook_url, '^https?://(www\.)?facebook\.com/', ''),
    TRUE, TRUE, 3,
    get_profile_org_id(p.id),
    COALESCE(p.updated_at, NOW()), NOW(), TRUE
FROM profiles p
WHERE p.facebook_url IS NOT NULL 
AND p.facebook_url != ''
AND NOT EXISTS (
    SELECT 1 FROM social_profiles sp 
    WHERE sp.profile_id = p.id 
    AND sp.platform = 'facebook'
);

-- ============================================================================
-- STEP 5: Migrate Website URLs
-- ============================================================================

INSERT INTO social_profiles (
    profile_id, platform, profile_url, platform_username,
    show_on_profile, is_public, display_order, organization_id,
    created_at, updated_at, is_active
)
SELECT 
    p.id,
    'website',
    p.website,
    REGEXP_REPLACE(p.website, '^https?://(www\.)?', ''),
    TRUE, TRUE, 4,
    get_profile_org_id(p.id),
    COALESCE(p.updated_at, NOW()), NOW(), TRUE
FROM profiles p
WHERE p.website IS NOT NULL 
AND p.website != ''
AND NOT EXISTS (
    SELECT 1 FROM social_profiles sp 
    WHERE sp.profile_id = p.id 
    AND sp.platform = 'website'
);

COMMIT;

-- ============================================================================
-- Verification
-- ============================================================================

SELECT 'Migration 006 verification:' AS status;

SELECT 
    platform,
    COUNT(*) AS count
FROM social_profiles
GROUP BY platform
ORDER BY count DESC;

-- ============================================================================
-- Drop columns (OPTIONAL - run separately after verification)
-- ============================================================================

/*
BEGIN;

ALTER TABLE profiles DROP COLUMN IF EXISTS linkedin_url;
ALTER TABLE profiles DROP COLUMN IF EXISTS twitter_url;
ALTER TABLE profiles DROP COLUMN IF EXISTS facebook_url;
ALTER TABLE profiles DROP COLUMN IF EXISTS website;

COMMIT;
*/

SELECT '✅ Social URLs migrated to social_profiles table!' AS next_step;
