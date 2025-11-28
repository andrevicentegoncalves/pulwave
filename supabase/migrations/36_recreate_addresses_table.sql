-- ============================================================================
-- ADDRESSES TABLE - CLEAN RECREATION
-- Drop and recreate with proper structure, no duplicates, control columns at end
-- ============================================================================

-- PART 1: Seed Portugal Regions (if not exists)
-- ============================================================================
DO $$
DECLARE
    pt_id UUID;
    region_exists BOOLEAN;
BEGIN
    SELECT id INTO pt_id FROM public.countries WHERE iso_code_2 = 'PT';
    
    IF pt_id IS NOT NULL THEN
        SELECT EXISTS (
            SELECT 1 FROM public.regions 
            WHERE country_id = pt_id AND code LIKE 'PT-%'
        ) INTO region_exists;
        
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

-- PART 2: Backup existing data
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.addresses_backup AS 
SELECT * FROM public.addresses;

-- PART 3: Drop and recreate addresses table
-- ============================================================================
DROP TABLE IF EXISTS public.addresses CASCADE;

CREATE TABLE public.addresses (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Foreign Keys
    country_id UUID REFERENCES public.countries(id) ON DELETE RESTRICT,
    region_id UUID REFERENCES public.regions(id) ON DELETE RESTRICT,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    
    -- Geographic Information
    city_name TEXT NOT NULL,
    council TEXT, -- Municipality (Concelho in Portuguese)
    parish TEXT,  -- Freguesia in Portuguese
    district TEXT,
    
    -- Street Address
    street_name TEXT NOT NULL,
    number TEXT,
    floor TEXT,
    postal_code TEXT,
    
    -- Geolocation
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    place_id TEXT,
    
    -- Additional Address Info
    formatted_address TEXT,
    
    -- Address Type & Status
    type TEXT DEFAULT 'home' CHECK (type IN ('home', 'work', 'billing', 'shipping', 'other')),
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    is_primary BOOLEAN DEFAULT FALSE,
    
    -- Multilingual Support
    translations JSONB DEFAULT '{}'::jsonb,
    
    -- Metadata
    notes TEXT,
    
    -- Control/Audit Columns (at the end)
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    deleted_at TIMESTAMPTZ,
    deleted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- PART 4: Migrate data from backup
-- ============================================================================
INSERT INTO public.addresses (
    id,
    country_id,
    region_id,
    organization_id,
    city_name,
    district,
    street_name,
    number,
    floor,
    postal_code,
    latitude,
    longitude,
    place_id,
    formatted_address,
    type,
    is_active,
    is_verified,
    is_primary,
    translations,
    notes,
    created_at,
    created_by,
    updated_at,
    updated_by,
    deleted_at,
    deleted_by
)
SELECT 
    id,
    country_id,
    region_id,
    organization_id,
    COALESCE(city_name, '') as city_name,
    district,
    COALESCE(street_address, '') as street_name,
    number,
    floor,
    postal_code,
    CASE WHEN latitude ~ '^[0-9.+-]+$' THEN latitude::DECIMAL(10,8) ELSE NULL END as latitude,
    CASE WHEN longitude ~ '^[0-9.+-]+$' THEN longitude::DECIMAL(10,8) ELSE NULL END as longitude,
    place_id,
    formatted_address,
    COALESCE(type, 'home') as type,
    COALESCE(is_active, TRUE) as is_active,
    COALESCE(is_verified, FALSE) as is_verified,
    COALESCE(is_primary, FALSE) as is_primary,
    COALESCE(translations, '{}'::jsonb) as translations,
    notes,
    COALESCE(created_at, NOW()) as created_at,
    created_by,
    COALESCE(updated_at, NOW()) as updated_at,
    updated_by,
    deleted_at,
    deleted_by
FROM public.addresses_backup
WHERE city_name IS NOT NULL AND street_address IS NOT NULL;

-- PART 5: Create Indexes
-- ============================================================================
CREATE INDEX idx_addresses_country_id ON public.addresses(country_id);
CREATE INDEX idx_addresses_region_id ON public.addresses(region_id);
CREATE INDEX idx_addresses_city_name ON public.addresses(city_name);
CREATE INDEX idx_addresses_council ON public.addresses(council);
CREATE INDEX idx_addresses_parish ON public.addresses(parish);
CREATE INDEX idx_addresses_postal_code ON public.addresses(postal_code);
CREATE INDEX idx_addresses_organization_id ON public.addresses(organization_id);
CREATE INDEX idx_addresses_created_by ON public.addresses(created_by);
CREATE INDEX idx_addresses_is_active ON public.addresses(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_addresses_deleted_at ON public.addresses(deleted_at) WHERE deleted_at IS NULL;

-- PART 6: Create Trigger
-- ============================================================================
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_addresses_updated_at ON public.addresses;

CREATE TRIGGER update_addresses_updated_at
    BEFORE UPDATE ON public.addresses
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

-- PART 7: Restore foreign key references
-- ============================================================================
-- Update profiles table references if they exist
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'address_id') THEN
        ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_address_id_fkey;
        ALTER TABLE public.profiles ADD CONSTRAINT profiles_address_id_fkey 
            FOREIGN KEY (address_id) REFERENCES public.addresses(id) ON DELETE SET NULL;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'billing_address_id') THEN
        ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_billing_address_id_fkey;
        ALTER TABLE public.profiles ADD CONSTRAINT profiles_billing_address_id_fkey 
            FOREIGN KEY (billing_address_id) REFERENCES public.addresses(id) ON DELETE SET NULL;
    END IF;
END $$;

-- PART 8: Drop backup table (optional - comment out if you want to keep it)
-- DROP TABLE IF EXISTS public.addresses_backup;
