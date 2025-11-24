-- ============================================================================
-- CREATE MISSING ENUMS - Run BEFORE profiles_normalization.sql
-- ============================================================================

-- Create emergency_relationship enum (likely missing!)
DO $$ BEGIN
    CREATE TYPE emergency_relationship AS ENUM (
        'spouse',
        'partner',
        'parent',
        'child',
        'sibling',
        'friend',
        'neighbor',
        'colleague',
        'other'
    );
    RAISE NOTICE '✓ Created emergency_relationship enum';
EXCEPTION WHEN duplicate_object THEN
    RAISE NOTICE '  emergency_relationship enum already exists';
END $$;

-- Create payment_method enum (likely missing!)
DO $$ BEGIN
    CREATE TYPE payment_method AS ENUM (
        'credit-card',
        'debit-card',
        'bank-transfer',
        'paypal',
        'stripe',
        'check',
        'cash',
        'other'
    );
    RAISE NOTICE '✓ Created payment_method enum';
EXCEPTION WHEN duplicate_object THEN
    RAISE NOTICE '  payment_method enum already exists';
END $$;

-- Create update_timestamp function if it doesn't exist
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Done!
DO $$
BEGIN
    RAISE NOTICE '✓ Created/updated update_timestamp() function';
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ ENUMS AND FUNCTIONS CREATED!';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE 'You can now run profiles_normalization.sql';
END $$;
