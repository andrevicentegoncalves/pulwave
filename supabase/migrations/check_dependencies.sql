-- Check if profile_id is populated
SELECT 
    COUNT(*) AS total_records,
    COUNT(profile_id) AS records_with_profile,
    COUNT(user_id) AS records_with_user
FROM organization_members;

-- Find dependent policies (using the error message details as a guide, but querying system catalogs is better)
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE (qual::text LIKE '%organization_members%' AND qual::text LIKE '%user_id%')
   OR (with_check::text LIKE '%organization_members%' AND with_check::text LIKE '%user_id%');
