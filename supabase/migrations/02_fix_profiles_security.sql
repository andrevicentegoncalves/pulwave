-- ============================================================================
-- FIX PROFILES SECURITY
-- Adds missing FK to auth.users and enables RLS/Policies on profiles
-- ============================================================================

DO $$
BEGIN
    -- 1. Add Foreign Key to auth.users
    -- We use a DO block to check if constraint exists to avoid errors
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'profiles_auth_user_id_fkey'
    ) THEN
        ALTER TABLE profiles
        ADD CONSTRAINT profiles_auth_user_id_fkey
        FOREIGN KEY (auth_user_id)
        REFERENCES auth.users(id)
        ON DELETE CASCADE;
        RAISE NOTICE '✓ Added FK to auth.users';
    ELSE
        RAISE NOTICE '✓ FK to auth.users already exists';
    END IF;

    -- 2. Enable RLS
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE '✓ Enabled RLS on profiles';

    -- 3. Add Policies
    -- Drop if exists to ensure we have the latest version
    DROP POLICY IF EXISTS "Users view own profile" ON profiles;
    DROP POLICY IF EXISTS "Users update own profile" ON profiles;
    
    CREATE POLICY "Users view own profile"
        ON profiles FOR SELECT
        TO authenticated
        USING (auth_user_id = auth.uid());
        
    CREATE POLICY "Users update own profile"
        ON profiles FOR UPDATE
        TO authenticated
        USING (auth_user_id = auth.uid());
        
    RAISE NOTICE '✓ Added RLS policies to profiles';
    
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ SECURITY FIX COMPLETE!';
    RAISE NOTICE '========================================';
END $$;
