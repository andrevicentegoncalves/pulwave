-- Seed Script for Portugal Divisions and Localities

DO $$
DECLARE 
    portugal_id UUID;
    dist_evora UUID;
    dist_lisboa UUID;
    dist_porto UUID;
    mun_evora UUID;
    mun_lisboa UUID;
    mun_porto UUID;
BEGIN
    -- 1. Get Portugal ID
    SELECT id INTO portugal_id FROM public.countries WHERE iso_code_2 = 'PT';

    IF portugal_id IS NOT NULL THEN
        -- 2. Seed Districts (Administrative Divisions Level 1)
        
        -- Évora District
        INSERT INTO public.administrative_divisions (name, type, country_id, is_active)
        VALUES ('Évora', 'district', portugal_id, true)
        ON CONFLICT (name, type, country_id) DO UPDATE SET is_active = true
        RETURNING id INTO dist_evora;

        -- Lisbon District
        INSERT INTO public.administrative_divisions (name, type, country_id, is_active)
        VALUES ('Lisboa', 'district', portugal_id, true)
        ON CONFLICT (name, type, country_id) DO UPDATE SET is_active = true
        RETURNING id INTO dist_lisboa;

        -- Porto District
        INSERT INTO public.administrative_divisions (name, type, country_id, is_active)
        VALUES ('Porto', 'district', portugal_id, true)
        ON CONFLICT (name, type, country_id) DO UPDATE SET is_active = true
        RETURNING id INTO dist_porto;


        -- 3. Seed Municipalities (Administrative Divisions Level 2)
        
        -- Évora Municipality
        INSERT INTO public.administrative_divisions (name, type, country_id, parent_division_id, is_active)
        VALUES ('Évora', 'municipality', portugal_id, dist_evora, true)
        ON CONFLICT (name, type, country_id) DO UPDATE SET is_active = true
        RETURNING id INTO mun_evora;

        -- Lisboa Municipality
        INSERT INTO public.administrative_divisions (name, type, country_id, parent_division_id, is_active)
        VALUES ('Lisboa', 'municipality', portugal_id, dist_lisboa, true)
        ON CONFLICT (name, type, country_id) DO UPDATE SET is_active = true
        RETURNING id INTO mun_lisboa;
        
        -- Porto Municipality
        INSERT INTO public.administrative_divisions (name, type, country_id, parent_division_id, is_active)
        VALUES ('Porto', 'municipality', portugal_id, dist_porto, true)
        ON CONFLICT (name, type, country_id) DO UPDATE SET is_active = true
        RETURNING id INTO mun_porto;


        -- 4. Seed Localities (Parishes / Freguesias)
        
        -- Évora Parishes
        INSERT INTO public.localities (name, place_type, division_id, postal_code, is_active, country_id)
        VALUES 
            ('Bacelo e Senhora da Saúde', 'parish', mun_evora, '7000', true, portugal_id),
            ('Évora (São Mamede, Sé, São Pedro e Santo Antão)', 'parish', mun_evora, '7000', true, portugal_id),
            ('Canaviais', 'parish', mun_evora, '7000', true, portugal_id),
            ('Malagueira e Horta das Figueiras', 'parish', mun_evora, '7000', true, portugal_id)
        ON CONFLICT DO NOTHING;

        -- Lisbon Parishes (Examples)
        INSERT INTO public.localities (name, place_type, division_id, postal_code, is_active, country_id)
        VALUES 
            ('Santa Maria Maior', 'parish', mun_lisboa, '1100', true, portugal_id),
            ('Belém', 'parish', mun_lisboa, '1300', true, portugal_id),
            ('Parque das Nações', 'parish', mun_lisboa, '1990', true, portugal_id)
        ON CONFLICT DO NOTHING;

    END IF;
END $$;
