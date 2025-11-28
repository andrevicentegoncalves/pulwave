SELECT 
    p.proname AS function_name,
    pg_get_function_arguments(p.oid) AS arguments
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND p.proname IN ('is_org_member', 'is_org_admin', 'get_my_org_role', 'get_profile_org_id', 'get_profile_organizations');
