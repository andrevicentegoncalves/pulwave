-- Check the valid values for org_member_role enum
SELECT 
    t.typname AS enum_name,
    e.enumlabel AS enum_value
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
WHERE t.typname = 'org_member_role'
ORDER BY e.enumsortorder;
