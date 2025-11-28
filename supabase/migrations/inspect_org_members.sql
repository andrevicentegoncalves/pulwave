-- Inspect organization_members table and policies
-- Check table columns
SELECT 
    column_name, 
    data_type 
FROM information_schema.columns 
WHERE table_name = 'organization_members';

-- Check policies on profiles and organization_members
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename IN ('profiles', 'organization_members');
