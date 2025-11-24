-- Inspect policies on storage.objects
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM
    pg_policies
WHERE
    (schemaname = 'storage' AND tablename = 'objects')
    OR (schemaname = 'public' AND tablename IN ('profiles', 'organization_members'));

-- Also check for any triggers that might be relevant
SELECT 
    event_object_schema as table_schema,
    event_object_table as table_name,
    trigger_schema,
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers
WHERE event_object_table IN ('objects', 'profiles', 'organization_members');
