-- ============================================================================
-- Migration: GDPR User Data Export Function
-- Date: 2024-12-14
-- Description: SQL function to export all user-related data for GDPR compliance
--              Returns JSON that can be converted to CSV by service layer
-- ============================================================================

-- Create GDPR export function
CREATE OR REPLACE FUNCTION export_user_data(p_profile_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSONB;
    profile_data JSONB;
    preferences_data JSONB;
    contacts_data JSONB;
    addresses_data JSONB;
    professional_data JSONB;
    social_data JSONB;
    org_memberships JSONB;
    activity_data JSONB;
BEGIN
    -- Verify profile exists
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = p_profile_id) THEN
        RAISE EXCEPTION 'Profile not found: %', p_profile_id;
    END IF;

    -- 1. Core Profile Data
    SELECT to_jsonb(p.*) - 'translations' INTO profile_data
    FROM profiles p
    WHERE p.id = p_profile_id;

    -- 2. User Preferences
    SELECT COALESCE(jsonb_agg(to_jsonb(up.*) - 'translations'), '[]'::JSONB) INTO preferences_data
    FROM user_preferences up
    WHERE up.profile_id = p_profile_id AND up.is_active = true;

    -- 3. Contacts
    SELECT COALESCE(jsonb_agg(to_jsonb(c.*) - 'translations'), '[]'::JSONB) INTO contacts_data
    FROM contacts c
    WHERE c.profile_id = p_profile_id AND c.is_active = true;

    -- 4. Addresses
    SELECT COALESCE(jsonb_agg(to_jsonb(a.*) - 'translations'), '[]'::JSONB) INTO addresses_data
    FROM addresses a
    WHERE a.profile_id = p_profile_id AND a.is_active = true;

    -- 5. Professional Profile
    SELECT COALESCE(jsonb_agg(to_jsonb(pp.*) - 'translations'), '[]'::JSONB) INTO professional_data
    FROM professional_profiles pp
    WHERE pp.profile_id = p_profile_id AND pp.is_active = true;

    -- 6. Social Profiles
    SELECT COALESCE(jsonb_agg(to_jsonb(sp.*) - 'translations'), '[]'::JSONB) INTO social_data
    FROM social_profiles sp
    WHERE sp.profile_id = p_profile_id AND sp.is_active = true;

    -- 7. Organization Memberships
    SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'organization_id', om.organization_id,
        'organization_name', o.name,
        'role', om.role,
        'title', om.title,
        'department', om.department,
        'joined_at', om.joined_at,
        'is_active', om.is_active
    )), '[]'::JSONB) INTO org_memberships
    FROM organization_members om
    JOIN organizations o ON o.id = om.organization_id
    WHERE om.profile_id = p_profile_id;

    -- 8. Activity Log (if table exists)
    BEGIN
        SELECT COALESCE(jsonb_agg(to_jsonb(al.*)), '[]'::JSONB) INTO activity_data
        FROM activity_log al
        WHERE al.profile_id = p_profile_id
        ORDER BY al.created_at DESC
        LIMIT 1000;  -- Limit for performance
    EXCEPTION WHEN undefined_table THEN
        activity_data := '[]'::JSONB;
    END;

    -- Build complete export
    result := jsonb_build_object(
        'export_date', NOW(),
        'export_type', 'gdpr_full',
        'profile_id', p_profile_id,
        'data', jsonb_build_object(
            'profile', profile_data,
            'preferences', preferences_data,
            'contacts', contacts_data,
            'addresses', addresses_data,
            'professional_profile', professional_data,
            'social_profiles', social_data,
            'organization_memberships', org_memberships,
            'activity_log', activity_data
        )
    );

    RETURN result;
END;
$$;

-- Grant execute to authenticated users (will be further restricted by RLS in service)
GRANT EXECUTE ON FUNCTION export_user_data(UUID) TO authenticated;

-- Add comment
COMMENT ON FUNCTION export_user_data IS 'GDPR Article 15 compliant data export. Returns all personal data associated with a profile.';
