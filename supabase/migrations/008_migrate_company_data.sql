-- ============================================================================
-- MIGRATION 008: Migrate Company Data from profiles to professional_profiles
-- ============================================================================
-- Description: Moves company_name, vat_id from profiles to 
-- professional_profiles table (vat_id → tax_id for generic naming)
--
-- PREREQUISITE: Run 005a_fix_org_members_profile_id.sql first
-- ============================================================================

BEGIN;

-- ============================================================================
-- STEP 1: Ensure professional_profiles has required columns
-- ============================================================================

ALTER TABLE professional_profiles ADD COLUMN IF NOT EXISTS company_name TEXT;
ALTER TABLE professional_profiles ADD COLUMN IF NOT EXISTS tax_id TEXT;

COMMENT ON COLUMN professional_profiles.tax_id IS 'Tax identification number (VAT ID in Europe, EIN in US, etc.)';

-- ============================================================================
-- STEP 2: Create professional_profiles for users with company data
-- ============================================================================

INSERT INTO professional_profiles (
    profile_id, company_name, tax_id, organization_id,
    created_at, updated_at, is_active
)
SELECT 
    p.id,
    p.company_name,
    p.vat_id,  -- vat_id from profiles becomes tax_id in professional_profiles
    get_profile_org_id(p.id),
    COALESCE(p.created_at, NOW()), NOW(), TRUE
FROM profiles p
WHERE (p.company_name IS NOT NULL AND p.company_name != '')
   OR (p.vat_id IS NOT NULL AND p.vat_id != '')
AND NOT EXISTS (
    SELECT 1 FROM professional_profiles pp WHERE pp.profile_id = p.id
);

-- ============================================================================
-- STEP 3: Update existing professional_profiles
-- ============================================================================

UPDATE professional_profiles pp
SET 
    company_name = COALESCE(pp.company_name, p.company_name),
    tax_id = COALESCE(pp.tax_id, p.vat_id),
    updated_at = NOW()
FROM profiles p
WHERE pp.profile_id = p.id
AND (
    (p.company_name IS NOT NULL AND pp.company_name IS NULL)
    OR (p.vat_id IS NOT NULL AND pp.tax_id IS NULL)
);

-- ============================================================================
-- STEP 4: Link profiles to professional_profiles
-- ============================================================================

-- Column already exists in profiles schema, just ensure the index exists
CREATE INDEX IF NOT EXISTS idx_profiles_professional_profile_id 
    ON profiles(professional_profile_id);

-- Update the link where it's missing
UPDATE profiles p
SET professional_profile_id = pp.id
FROM professional_profiles pp
WHERE pp.profile_id = p.id
AND p.professional_profile_id IS NULL;

COMMIT;

-- ============================================================================
-- STEP 5: Helper function
-- ============================================================================

BEGIN;

CREATE OR REPLACE FUNCTION get_or_create_professional_profile(
    p_profile_id UUID,
    p_organization_id UUID DEFAULT NULL
) RETURNS UUID 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_pp_id UUID;
    v_org_id UUID;
BEGIN
    -- Check if professional profile already exists
    SELECT id INTO v_pp_id 
    FROM professional_profiles 
    WHERE profile_id = p_profile_id;
    
    IF v_pp_id IS NOT NULL THEN 
        RETURN v_pp_id; 
    END IF;
    
    -- Get organization ID
    v_org_id := COALESCE(p_organization_id, get_profile_org_id(p_profile_id));
    
    -- Create new professional profile
    INSERT INTO professional_profiles (
        profile_id, 
        organization_id, 
        created_at, 
        updated_at, 
        is_active
    )
    VALUES (
        p_profile_id, 
        v_org_id, 
        NOW(), 
        NOW(), 
        TRUE
    )
    RETURNING id INTO v_pp_id;
    
    -- Link it back to the profile
    UPDATE profiles 
    SET professional_profile_id = v_pp_id 
    WHERE id = p_profile_id;
    
    RETURN v_pp_id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_or_create_professional_profile IS 
    'Gets existing professional profile or creates a new one for the given profile_id';

COMMIT;

-- ============================================================================
-- Verification
-- ============================================================================

SELECT 'Migration 008 verification:' AS status;

SELECT 
    'Professional profiles' AS metric,
    COUNT(*) AS total,
    COUNT(*) FILTER (WHERE company_name IS NOT NULL) AS with_company,
    COUNT(*) FILTER (WHERE tax_id IS NOT NULL) AS with_tax_id
FROM professional_profiles;

SELECT 
    'Profile links' AS metric,
    COUNT(*) FILTER (WHERE professional_profile_id IS NOT NULL) AS linked_profiles
FROM profiles;

-- ============================================================================
-- Drop columns (OPTIONAL - run separately after verification)
-- ============================================================================

/*
BEGIN;

ALTER TABLE profiles DROP COLUMN IF EXISTS company_name;
ALTER TABLE profiles DROP COLUMN IF EXISTS vat_id;

COMMIT;
*/

SELECT '✅ Company data migrated to professional_profiles!' AS next_step;
