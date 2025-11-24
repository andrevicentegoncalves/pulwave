-- ============================================================================
-- PROPOSED GEOGRAPHIC COLUMNS & POLICIES
-- ============================================================================

-- 1. Internet TLD (Top Level Domain) for Countries
--    Example: '.us', '.uk', '.jp'
ALTER TABLE countries ADD COLUMN IF NOT EXISTS tld TEXT;

-- 2. Official Languages (Array)
--    Example: ['en', 'es'] for USA (de facto), ['fr', 'de', 'it', 'rm'] for Switzerland
ALTER TABLE countries ADD COLUMN IF NOT EXISTS languages TEXT[];

-- 3. Demonym (What you call the people)
--    Example: 'American', 'Spaniard', 'Kenyan'
ALTER TABLE countries ADD COLUMN IF NOT EXISTS demonym TEXT;

-- 4. Driving Side
--    Example: 'right', 'left'
ALTER TABLE countries ADD COLUMN IF NOT EXISTS driving_side TEXT CHECK (driving_side IN ('right', 'left'));

-- 5. Area / Size
--    Useful for sorting or display
ALTER TABLE countries ADD COLUMN IF NOT EXISTS area_sq_km BIGINT;

-- 6. Calling Codes (Array)
--    Some countries have multiple or complex codes (e.g. +1 for US/Canada)
--    (You already have 'phone_code' text, but an array might be better for edge cases)
ALTER TABLE countries ADD COLUMN IF NOT EXISTS calling_codes TEXT[];

-- 7. Region Capital
--    Link a Region (State) to its Capital City (e.g. California -> Sacramento)
ALTER TABLE regions ADD COLUMN IF NOT EXISTS capital_city_id UUID REFERENCES cities(id);

-- 8. City Elevation
--    Useful for geography/travel apps
ALTER TABLE cities ADD COLUMN IF NOT EXISTS elevation_meters INT;

-- 9. City Website
--    Official government link
ALTER TABLE cities ADD COLUMN IF NOT EXISTS website_url TEXT;

-- 10. Flexible Metadata (The "Catch-All")
--     Store anything else: voltage, plug type, weather code, etc.
ALTER TABLE countries ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;


-- ============================================================================
-- POLICY CHECK & HARDENING
-- ============================================================================

-- Current Status:
-- You likely have "Public Read" enabled (which is good).
-- But anyone might be able to INSERT/UPDATE if you haven't restricted it.

-- RECOMMENDED: Restrict Write Access to Admins/Service Role only

-- 1. Enable RLS (Already done, but good to ensure)
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;

-- 2. Ensure Public Read (Already done)
-- CREATE POLICY "Public read access" ON countries FOR SELECT USING (true);

-- 3. RESTRICT WRITE (Insert/Update/Delete) to Service Role only
--    This prevents random users from deleting your countries!

DO $$ BEGIN
    CREATE POLICY "Service role only for countries" ON countries 
    FOR ALL 
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY "Service role only for regions" ON regions 
    FOR ALL 
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY "Service role only for cities" ON cities 
    FOR ALL 
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
