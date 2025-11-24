-- ============================================================================
-- FIX ALL FUNCTION SEARCH_PATH WARNINGS - USING ALTER FUNCTION
-- ============================================================================
-- Each ALTER is wrapped in a DO block to continue even if one fails

-- Timestamp/Audit Functions
DO $$ BEGIN ALTER FUNCTION public.set_created_audit_fields() SET search_path = public, pg_temp; EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'Skipped: set_created_audit_fields'; END $$;
DO $$ BEGIN ALTER FUNCTION public.update_timestamp() SET search_path = public, pg_temp; EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'Skipped: update_timestamp'; END $$;
DO $$ BEGIN ALTER FUNCTION public.update_buildings_timestamp() SET search_path = public, pg_temp; EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'Skipped: update_buildings_timestamp'; END $$;
DO $$ BEGIN ALTER FUNCTION public.update_buildings_updated_at() SET search_path = public, pg_temp; EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'Skipped: update_buildings_updated_at'; END $$;
DO $$ BEGIN ALTER FUNCTION public.update_profiles_updated_at() SET search_path = public, pg_temp; EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'Skipped: update_profiles_updated_at'; END $$;
DO $$ BEGIN ALTER FUNCTION public.update_building_owners_updated_at() SET search_path = public, pg_temp; EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'Skipped: update_building_owners_updated_at'; END $$;
DO $$ BEGIN ALTER FUNCTION public.update_updated_at_column() SET search_path = public, pg_temp; EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'Skipped: update_updated_at_column'; END $$;
DO $$ BEGIN ALTER FUNCTION public.set_updated_audit_fields() SET search_path = public, pg_temp; EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'Skipped: set_updated_audit_fields'; END $$;

-- Validation Functions
DO $$ BEGIN ALTER FUNCTION public.validate_timezone() SET search_path = public, pg_temp; EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'Skipped: validate_timezone'; END $$;
DO $$ BEGIN ALTER FUNCTION public.validate_total_ownership() SET search_path = public, pg_temp; EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'Skipped: validate_total_ownership'; END $$;

-- Organization Functions
DO $$ BEGIN ALTER FUNCTION public.is_org_member(uuid) SET search_path = public, pg_temp; EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'Skipped: is_org_member'; END $$;
DO $$ BEGIN ALTER FUNCTION public.check_org_members_structure() SET search_path = public, pg_temp; EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'Skipped: check_org_members_structure'; END $$;

-- Building Ownership Functions
DO $$ BEGIN ALTER FUNCTION public.check_building_ownership_complete(uuid) SET search_path = public, pg_temp; EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'Skipped: check_building_ownership_complete'; END $$;
DO $$ BEGIN ALTER FUNCTION public.get_building_owners(uuid) SET search_path = public, pg_temp; EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'Skipped: get_building_owners'; END $$;

-- Property Hierarchy Function
DO $$ BEGIN ALTER FUNCTION public.get_property_hierarchy(uuid) SET search_path = public, pg_temp; EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'Skipped: get_property_hierarchy'; END $$;

-- RLS Helper Functions
DO $$ BEGIN ALTER FUNCTION public.check_rls_enabled(text) SET search_path = public, pg_temp; EXCEPTION WHEN OTHERS THEN RAISE NOTICE 'Skipped: check_rls_enabled'; END $$;

-- Try has_role_permission with different signatures
DO $$ BEGIN 
    ALTER FUNCTION public.has_role_permission(uuid, uuid, text[]) SET search_path = public, pg_temp;
    RAISE NOTICE '✅ Fixed: has_role_permission(uuid, uuid, text[])';
EXCEPTION WHEN OTHERS THEN 
    BEGIN
        ALTER FUNCTION public.has_role_permission(p_user_id uuid, p_organization_id uuid, p_required_roles text[]) SET search_path = public, pg_temp;
        RAISE NOTICE '✅ Fixed: has_role_permission(p_user_id, p_organization_id, p_required_roles)';
    EXCEPTION WHEN OTHERS THEN 
        RAISE NOTICE 'Skipped: has_role_permission (signature not found)';
    END;
END $$;

DO $$ BEGIN
    RAISE NOTICE '✅ Function search_path update complete';
END $$;
