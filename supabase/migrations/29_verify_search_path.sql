-- ============================================================================
-- VERIFY FUNCTION SEARCH_PATH SETTINGS
-- ============================================================================
-- This query checks if all functions have search_path properly set

SELECT 
    p.proname AS function_name,
    pg_get_function_identity_arguments(p.oid) AS arguments,
    CASE 
        WHEN p.proconfig IS NULL THEN '❌ NO search_path set'
        WHEN array_to_string(p.proconfig, ', ') LIKE '%search_path%' THEN '✅ search_path IS set: ' || array_to_string(p.proconfig, ', ')
        ELSE '❌ NO search_path set'
    END AS search_path_status,
    CASE 
        WHEN p.prosecdef THEN 'SECURITY DEFINER'
        ELSE 'SECURITY INVOKER'
    END AS security_type
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND p.proname IN (
    'set_created_audit_fields',
    'update_timestamp',
    'is_org_member',
    'get_property_hierarchy',
    'update_buildings_timestamp',
    'validate_timezone',
    'check_building_ownership_complete',
    'update_buildings_updated_at',
    'check_org_members_structure',
    'update_profiles_updated_at',
    'check_rls_enabled',
    'update_building_owners_updated_at',
    'get_building_owners',
    'has_role_permission',
    'update_updated_at_column',
    'set_updated_audit_fields',
    'validate_total_ownership'
  )
ORDER BY 
    CASE WHEN p.proconfig IS NULL THEN 1 ELSE 0 END,
    p.proname;
