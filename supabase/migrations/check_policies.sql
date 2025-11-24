-- Run this EXACT query to check if policies exist:
SELECT 
    policyname,
    cmd AS operation,
    qual AS using_expression
FROM pg_policies 
WHERE tablename = 'profiles';

-- If this returns 0 rows, run the migration again.
-- If it returns 3 rows, the policies exist and the problem is elsewhere.
