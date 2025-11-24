-- ============================================================================
-- ENHANCE GEOGRAPHIC SCHEMA
-- 1. Support for multiple media types (flags, lifestyle, maps)
-- 2. Better classification (Region Types, City Status)
-- 3. Lifecycle management (Status)
-- ============================================================================

-- 1. Create Enums
DO $$ BEGIN
    CREATE TYPE content_status AS ENUM ('active', 'inactive', 'archived', 'draft');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE region_type AS ENUM ('state', 'province', 'territory', 'district', 'canton', 'prefecture', 'region', 'other');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2. Enhance Countries Table
ALTER TABLE countries 
ADD COLUMN IF NOT EXISTS media JSONB DEFAULT '{}'::jsonb, -- { "flag": "url", "gallery": ["url1", "url2"], "lifestyle": [] }
ADD COLUMN IF NOT EXISTS status content_status DEFAULT 'active',
ADD COLUMN IF NOT EXISTS native_name JSONB, -- { "lang_code": "name" }
ADD COLUMN IF NOT EXISTS capital_city_id UUID; -- Will link to cities table later

-- 3. Enhance Regions Table
ALTER TABLE regions 
ADD COLUMN IF NOT EXISTS media JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS type region_type DEFAULT 'other',
ADD COLUMN IF NOT EXISTS status content_status DEFAULT 'active';

-- 4. Enhance Cities Table
ALTER TABLE cities 
ADD COLUMN IF NOT EXISTS media JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS is_capital BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS population BIGINT,
ADD COLUMN IF NOT EXISTS timezone TEXT,
ADD COLUMN IF NOT EXISTS status content_status DEFAULT 'active';

-- 5. Migrate existing data (One-time migration)
-- Move flag_url to media->'flag'
UPDATE countries 
SET media = jsonb_set(media, '{flag}', to_jsonb(flag_url))
WHERE flag_url IS NOT NULL AND media->>'flag' IS NULL;

-- Move image_url to media->'cover'
UPDATE cities 
SET media = jsonb_set(media, '{cover}', to_jsonb(image_url))
WHERE image_url IS NOT NULL AND media->>'cover' IS NULL;

-- 6. Add Foreign Key for Capital City (Circular dependency handled by adding column first)
DO $$ BEGIN
    ALTER TABLE countries 
    ADD CONSTRAINT countries_capital_city_id_fkey 
    FOREIGN KEY (capital_city_id) REFERENCES cities(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 7. Performance & Integrity Improvements
-- Add indexes on Foreign Keys (Postgres doesn't do this automatically)
CREATE INDEX IF NOT EXISTS idx_regions_country_id ON regions(country_id);
CREATE INDEX IF NOT EXISTS idx_cities_country_id ON cities(country_id);
CREATE INDEX IF NOT EXISTS idx_cities_region_id ON cities(region_id);

-- Add Check Constraint for Population
ALTER TABLE cities ADD CONSTRAINT cities_population_check CHECK (population >= 0);

-- Enable Fuzzy Search (Trigram) if available
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Add GIN indexes for fast search on names
CREATE INDEX IF NOT EXISTS idx_countries_name_trgm ON countries USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_cities_name_trgm ON cities USING gin (name gin_trgm_ops);

