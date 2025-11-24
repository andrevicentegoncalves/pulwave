-- ============================================================================
-- MAKE NAMES NULLABLE TO FIX SIGNUP ERROR
-- ============================================================================
-- The signup trigger fails if first_name/last_name are missing from metadata
-- because they are currently set to NOT NULL in the database.
-- We will relax this constraint and enforce it in the UI instead.

-- 1. Make first_name nullable
ALTER TABLE public.profiles ALTER COLUMN first_name DROP NOT NULL;

-- 2. Make last_name nullable
ALTER TABLE public.profiles ALTER COLUMN last_name DROP NOT NULL;

-- 3. Verify changes
DO $$
DECLARE
    fn_nullable text;
    ln_nullable text;
BEGIN
    SELECT is_nullable INTO fn_nullable FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'first_name';
    SELECT is_nullable INTO ln_nullable FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'last_name';
    
    IF fn_nullable = 'YES' AND ln_nullable = 'YES' THEN
        RAISE NOTICE '✅ SUCCESS: first_name and last_name are now nullable.';
    ELSE
        RAISE EXCEPTION '❌ ERROR: Failed to update columns.';
    END IF;
END $$;
