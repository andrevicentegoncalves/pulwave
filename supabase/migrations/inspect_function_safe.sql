-- Safer inspection script
-- 1. Check organization_members columns
SELECT 
    column_name, 
    data_type 
FROM information_schema.columns 
WHERE table_name = 'organization_members'
ORDER BY ordinal_position;

-- 2. Get definition of get_my_org_role function (specific match)
SELECT p.proname, pg_get_functiondef(p.oid) as definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
  AND p.proname = 'get_my_org_role';
