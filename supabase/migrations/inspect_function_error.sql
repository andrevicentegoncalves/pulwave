-- Inspect function definition and table columns
-- Check organization_members columns
SELECT 
    column_name, 
    data_type 
FROM information_schema.columns 
WHERE table_name = 'organization_members';

-- Get definition of get_my_org_role function
SELECT pg_get_functiondef(oid)
FROM pg_proc
WHERE proname = 'get_my_org_role';

-- Search for other functions that might contain 'om.role_id'
SELECT proname, pg_get_functiondef(oid)
FROM pg_proc
WHERE pg_get_functiondef(oid) ILIKE '%om.role_id%';
