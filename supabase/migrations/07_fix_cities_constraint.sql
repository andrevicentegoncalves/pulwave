-- ============================================================================
-- FIX INCORRECT UNIQUE CONSTRAINT ON CITIES
-- ============================================================================

-- The user reported an error: duplicate key value violates unique constraint "cities_country_id_key"
-- This means there is a UNIQUE constraint on country_id in the cities table, which is wrong.
-- A country has MANY cities, so country_id should NOT be unique.

DO $$
BEGIN
    -- Drop the incorrect unique constraint if it exists
    IF EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE constraint_name = 'cities_country_id_key'
        AND table_name = 'cities'
    ) THEN
        ALTER TABLE cities DROP CONSTRAINT cities_country_id_key;
        RAISE NOTICE 'Dropped incorrect unique constraint cities_country_id_key';
    END IF;
END $$;
