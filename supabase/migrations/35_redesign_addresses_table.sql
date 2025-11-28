-- ============================================================================
-- ADDRESSES TABLE REDESIGN
-- Add foreign keys to countries/regions, audit columns, and Portugal regions
-- ============================================================================

-- PART 1: Seed Portugal Regions
-- ============================================================================
DO $$
DECLARE
    pt_id UUID;
    region_exists BOOLEAN;
BEGIN
    -- Get Portugal country ID
    SELECT id INTO pt_id FROM public.countries WHERE iso_code_2 = 'PT';
    
    IF pt_id IS NOT NULL THEN
        -- Check if Portugal regions already exist
        SELECT EXISTS (
            SELECT 1 FROM public.regions 
            WHERE country_id = pt_id AND code LIKE 'PT-%'
        ) INTO region_exists;
        
        -- Only insert if regions don't exist
        IF NOT region_exists THEN
            INSERT INTO public.regions (country_id, name, code) VALUES
            (pt_id, 'Aveiro', 'PT-01'),
            (pt_id, 'Beja', 'PT-02'),
            (pt_id, 'Braga', 'PT-03'),
            (pt_id, 'Bragança', 'PT-04'),
            (pt_id, 'Castelo Branco', 'PT-05'),
            (pt_id, 'Coimbra', 'PT-06'),
            (pt_id, 'Évora', 'PT-07'),
            (pt_id, 'Faro', 'PT-08'),
            (pt_id, 'Guarda', 'PT-09'),
            (pt_id, 'Leiria', 'PT-10'),
            (pt_id, 'Lisboa', 'PT-11'),
            (pt_id, 'Portalegre', 'PT-12'),
            (pt_id, 'Porto', 'PT-13'),
            (pt_id, 'Santarém', 'PT-14'),
            (pt_id, 'Setúbal', 'PT-15'),
            (pt_id, 'Viana do Castelo', 'PT-16'),
            (pt_id, 'Vila Real', 'PT-17'),
            (pt_id, 'Viseu', 'PT-18'),
            (pt_id, 'Região Autónoma dos Açores', 'PT-20'),
            (pt_id, 'Região Autónoma da Madeira', 'PT-30');
        END IF;
    END IF;
END $$;

-- PART 2: Modify Addresses Table
-- ============================================================================

-- Rename existing columns to match new schema
DO $$
BEGIN
    -- Rename street to street_address if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'addresses' AND column_name = 'street'
    ) THEN
        ALTER TABLE public.addresses RENAME COLUMN street TO street_address;
    END IF;
END $$;

-- Add new columns if they don't exist
ALTER TABLE public.addresses
    ADD COLUMN IF NOT EXISTS country_id UUID REFERENCES public.countries(id) ON DELETE RESTRICT,
    ADD COLUMN IF NOT EXISTS region_id UUID REFERENCES public.regions(id) ON DELETE RESTRICT,
    ADD COLUMN IF NOT EXISTS city_name TEXT,
    ADD COLUMN IF NOT EXISTS street_address_2 TEXT,
    ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
    ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8),
    ADD COLUMN IF NOT EXISTS place_id TEXT,
    ADD COLUMN IF NOT EXISTS organization_id UUID,
    ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS is_primary BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS notes TEXT,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Migrate old city_id to city_name if city_id column exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'addresses' AND column_name = 'city_id'
    ) THEN
        -- Try to populate city_name from cities table if it exists
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'cities') THEN
            UPDATE public.addresses a
            SET city_name = c.name
            FROM public.cities c
            WHERE a.city_id = c.id AND a.city_name IS NULL;
        END IF;
        
        -- Drop the old city_id column
        ALTER TABLE public.addresses DROP COLUMN city_id;
    END IF;
END $$;

-- Set NOT NULL constraints
ALTER TABLE public.addresses
    ALTER COLUMN city_name SET NOT NULL,
    ALTER COLUMN street_address SET NOT NULL,
    ALTER COLUMN is_active SET NOT NULL,
    ALTER COLUMN created_at SET NOT NULL,
    ALTER COLUMN updated_at SET NOT NULL;

-- Add type constraint if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'addresses_type_check'
    ) THEN
        ALTER TABLE public.addresses
            ADD CONSTRAINT addresses_type_check 
            CHECK (type IN ('home', 'work', 'billing', 'shipping', 'other'));
    END IF;
END $$;

-- PART 3: Create Indexes
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_addresses_country_id ON public.addresses(country_id);
CREATE INDEX IF NOT EXISTS idx_addresses_region_id ON public.addresses(region_id);
CREATE INDEX IF NOT EXISTS idx_addresses_city_name ON public.addresses(city_name);
CREATE INDEX IF NOT EXISTS idx_addresses_postal_code ON public.addresses(postal_code);
CREATE INDEX IF NOT EXISTS idx_addresses_organization_id ON public.addresses(organization_id);
CREATE INDEX IF NOT EXISTS idx_addresses_created_by ON public.addresses(created_by);
CREATE INDEX IF NOT EXISTS idx_addresses_is_active ON public.addresses(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_addresses_deleted_at ON public.addresses(deleted_at) WHERE deleted_at IS NULL;

-- PART 4: Create/Update Trigger
-- ============================================================================
DROP TRIGGER IF EXISTS update_addresses_updated_at ON public.addresses;

CREATE TRIGGER update_addresses_updated_at
    BEFORE UPDATE ON public.addresses
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();
