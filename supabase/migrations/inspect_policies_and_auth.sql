-- ============================================================================
-- INSPECT POLICIES & AUTH FK
-- Checks for RLS policies and the link to auth.users
-- ============================================================================

WITH policy_info AS (
    SELECT 
        json_agg(json_build_object(
            'policy_name', policyname,
            'command', cmd,
            'roles', roles,
            'using', qual,
            'with_check', with_check
        )) as policies
    FROM pg_policies 
    WHERE tablename = 'profiles'
),
auth_fk_info AS (
    SELECT 
        json_agg(json_build_object(
            'constraint_name', tc.constraint_name,
            'foreign_table', ccu.table_name,
            'foreign_schema', ccu.table_schema
        )) as auth_fks
    FROM 
        information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
    WHERE tc.table_name = 'profiles' 
    AND ccu.table_schema = 'auth' 
    AND ccu.table_name = 'users'
)
SELECT 
    json_build_object(
        'table', 'profiles',
        'rls_enabled', (SELECT relrowsecurity FROM pg_class WHERE relname = 'profiles'),
        'policies', COALESCE((SELECT policies FROM policy_info), '[]'::json),
        'auth_users_fk', COALESCE((SELECT auth_fks FROM auth_fk_info), '[]'::json)
    ) as security_info;
