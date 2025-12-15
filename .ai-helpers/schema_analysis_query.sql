-- ============================================================================
-- SCHEMA ANALYSIS QUERY - Get full structure of all 7 tables
-- Run this in Supabase SQL Editor and share results
-- ============================================================================

-- 1. Full column details for all 7 tables
SELECT 
    c.table_name,
    c.column_name,
    c.data_type,
    c.character_maximum_length,
    c.column_default,
    c.is_nullable,
    c.ordinal_position
FROM information_schema.columns c
WHERE c.table_schema = 'public'
AND c.table_name IN (
    'profiles', 'user_preferences', 'contacts', 'addresses',
    'organization_members', 'professional_profiles', 'social_profiles'
)
ORDER BY c.table_name, c.ordinal_position;

-- 2. Foreign key relationships
SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table,
    ccu.column_name AS foreign_column
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_schema = 'public'
AND tc.table_name IN (
    'profiles', 'user_preferences', 'contacts', 'addresses',
    'organization_members', 'professional_profiles', 'social_profiles'
)
ORDER BY tc.table_name, kcu.column_name;

-- 3. Unique constraints
SELECT
    tc.table_name,
    tc.constraint_name,
    string_agg(kcu.column_name, ', ') AS columns
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.constraint_type IN ('PRIMARY KEY', 'UNIQUE')
AND tc.table_schema = 'public'
AND tc.table_name IN (
    'profiles', 'user_preferences', 'contacts', 'addresses',
    'organization_members', 'professional_profiles', 'social_profiles'
)
GROUP BY tc.table_name, tc.constraint_name
ORDER BY tc.table_name;

-- 4. Row counts
SELECT 'profiles' as table_name, COUNT(*) as row_count FROM profiles
UNION ALL SELECT 'user_preferences', COUNT(*) FROM user_preferences
UNION ALL SELECT 'contacts', COUNT(*) FROM contacts
UNION ALL SELECT 'addresses', COUNT(*) FROM addresses
UNION ALL SELECT 'organization_members', COUNT(*) FROM organization_members
UNION ALL SELECT 'professional_profiles', COUNT(*) FROM professional_profiles
UNION ALL SELECT 'social_profiles', COUNT(*) FROM social_profiles;
