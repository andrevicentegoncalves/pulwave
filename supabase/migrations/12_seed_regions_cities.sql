-- ============================================================================
-- COMPREHENSIVE REGIONS AND CITIES SEED SCRIPT
-- ============================================================================
-- This script populates regions (states/provinces) and major cities for
-- multiple countries to provide a comprehensive geographic database.

DO $$
DECLARE
    -- Country IDs
    us_id UUID;
    es_id UUID;
    gb_id UUID;
    ca_id UUID;
    fr_id UUID;
    de_id UUID;
    it_id UUID;
    au_id UUID;
    br_id UUID;
    mx_id UUID;
    
    -- Region IDs (for cities)
    ca_us_id UUID;
    ny_us_id UUID;
    tx_us_id UUID;
    fl_us_id UUID;
    il_us_id UUID;
    
BEGIN
    -- Get country IDs
    SELECT id INTO us_id FROM countries WHERE iso_code_2 = 'US';
    SELECT id INTO es_id FROM countries WHERE iso_code_2 = 'ES';
    SELECT id INTO gb_id FROM countries WHERE iso_code_2 = 'GB';
    SELECT id INTO ca_id FROM countries WHERE iso_code_2 = 'CA';
    SELECT id INTO fr_id FROM countries WHERE iso_code_2 = 'FR';
    SELECT id INTO de_id FROM countries WHERE iso_code_2 = 'DE';
    SELECT id INTO it_id FROM countries WHERE iso_code_2 = 'IT';
    SELECT id INTO au_id FROM countries WHERE iso_code_2 = 'AU';
    SELECT id INTO br_id FROM countries WHERE iso_code_2 = 'BR';
    SELECT id INTO mx_id FROM countries WHERE iso_code_2 = 'MX';

    -- ========================================================================
    -- UNITED STATES - States and Major Cities
    -- ========================================================================
    IF us_id IS NOT NULL THEN
        -- Insert all 50 US states
        INSERT INTO regions (country_id, name, code) VALUES
        (us_id, 'Alabama', 'AL'),
        (us_id, 'Alaska', 'AK'),
        (us_id, 'Arizona', 'AZ'),
        (us_id, 'Arkansas', 'AR'),
        (us_id, 'California', 'CA'),
        (us_id, 'Colorado', 'CO'),
        (us_id, 'Connecticut', 'CT'),
        (us_id, 'Delaware', 'DE'),
        (us_id, 'Florida', 'FL'),
        (us_id, 'Georgia', 'GA'),
        (us_id, 'Hawaii', 'HI'),
        (us_id, 'Idaho', 'ID'),
        (us_id, 'Illinois', 'IL'),
        (us_id, 'Indiana', 'IN'),
        (us_id, 'Iowa', 'IA'),
        (us_id, 'Kansas', 'KS'),
        (us_id, 'Kentucky', 'KY'),
        (us_id, 'Louisiana', 'LA'),
        (us_id, 'Maine', 'ME'),
        (us_id, 'Maryland', 'MD'),
        (us_id, 'Massachusetts', 'MA'),
        (us_id, 'Michigan', 'MI'),
        (us_id, 'Minnesota', 'MN'),
        (us_id, 'Mississippi', 'MS'),
        (us_id, 'Missouri', 'MO'),
        (us_id, 'Montana', 'MT'),
        (us_id, 'Nebraska', 'NE'),
        (us_id, 'Nevada', 'NV'),
        (us_id, 'New Hampshire', 'NH'),
        (us_id, 'New Jersey', 'NJ'),
        (us_id, 'New Mexico', 'NM'),
        (us_id, 'New York', 'NY'),
        (us_id, 'North Carolina', 'NC'),
        (us_id, 'North Dakota', 'ND'),
        (us_id, 'Ohio', 'OH'),
        (us_id, 'Oklahoma', 'OK'),
        (us_id, 'Oregon', 'OR'),
        (us_id, 'Pennsylvania', 'PA'),
        (us_id, 'Rhode Island', 'RI'),
        (us_id, 'South Carolina', 'SC'),
        (us_id, 'South Dakota', 'SD'),
        (us_id, 'Tennessee', 'TN'),
        (us_id, 'Texas', 'TX'),
        (us_id, 'Utah', 'UT'),
        (us_id, 'Vermont', 'VT'),
        (us_id, 'Virginia', 'VA'),
        (us_id, 'Washington', 'WA'),
        (us_id, 'West Virginia', 'WV'),
        (us_id, 'Wisconsin', 'WI'),
        (us_id, 'Wyoming', 'WY')
        ON CONFLICT DO NOTHING;

        -- Get region IDs for major cities
        SELECT id INTO ca_us_id FROM regions WHERE code = 'CA' AND country_id = us_id;
        SELECT id INTO ny_us_id FROM regions WHERE code = 'NY' AND country_id = us_id;
        SELECT id INTO tx_us_id FROM regions WHERE code = 'TX' AND country_id = us_id;
        SELECT id INTO fl_us_id FROM regions WHERE code = 'FL' AND country_id = us_id;
        SELECT id INTO il_us_id FROM regions WHERE code = 'IL' AND country_id = us_id;

        -- Insert major US cities
        INSERT INTO cities (country_id, region_id, name, image_url) VALUES
        -- California
        (us_id, ca_us_id, 'Los Angeles', 'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?auto=format&fit=crop&w=800&q=80'),
        (us_id, ca_us_id, 'San Francisco', 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=80'),
        (us_id, ca_us_id, 'San Diego', 'https://images.unsplash.com/photo-1506760610100-1af6025cf0c7?auto=format&fit=crop&w=800&q=80'),
        (us_id, ca_us_id, 'San Jose', NULL),
        (us_id, ca_us_id, 'Sacramento', NULL),
        (us_id, ca_us_id, 'Oakland', NULL),
        -- New York
        (us_id, ny_us_id, 'New York City', 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80'),
        (us_id, ny_us_id, 'Buffalo', NULL),
        (us_id, ny_us_id, 'Rochester', NULL),
        (us_id, ny_us_id, 'Albany', NULL),
        -- Texas
        (us_id, tx_us_id, 'Houston', 'https://images.unsplash.com/photo-1530089711124-9ca31fb99452?auto=format&fit=crop&w=800&q=80'),
        (us_id, tx_us_id, 'Dallas', 'https://images.unsplash.com/photo-1570129477492-45f003f2ddfa?auto=format&fit=crop&w=800&q=80'),
        (us_id, tx_us_id, 'Austin', 'https://images.unsplash.com/photo-1531218150217-54595bc2b934?auto=format&fit=crop&w=800&q=80'),
        (us_id, tx_us_id, 'San Antonio', NULL),
        (us_id, tx_us_id, 'Fort Worth', NULL),
        -- Florida
        (us_id, fl_us_id, 'Miami', 'https://images.unsplash.com/photo-1514214246283-ef1e12db6153?auto=format&fit=crop&w=800&q=80'),
        (us_id, fl_us_id, 'Orlando', NULL),
        (us_id, fl_us_id, 'Tampa', NULL),
        (us_id, fl_us_id, 'Jacksonville', NULL),
        -- Illinois
        (us_id, il_us_id, 'Chicago', 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?auto=format&fit=crop&w=800&q=80')
        ON CONFLICT (name) DO UPDATE SET image_url = EXCLUDED.image_url;
    END IF;

    -- ========================================================================
    -- SPAIN - Autonomous Communities and Major Cities
    -- ========================================================================
    IF es_id IS NOT NULL THEN
        INSERT INTO regions (country_id, name, code) VALUES
        (es_id, 'Andalucía', 'AN'),
        (es_id, 'Aragón', 'AR'),
        (es_id, 'Asturias', 'AS'),
        (es_id, 'Islas Baleares', 'IB'),
        (es_id, 'Canarias', 'CN'),
        (es_id, 'Cantabria', 'CB'),
        (es_id, 'Castilla y León', 'CL'),
        (es_id, 'Castilla-La Mancha', 'CM'),
        (es_id, 'Cataluña', 'CT'),
        (es_id, 'Comunidad Valenciana', 'VC'),
        (es_id, 'Extremadura', 'EX'),
        (es_id, 'Galicia', 'GA'),
        (es_id, 'Madrid', 'MD'),
        (es_id, 'Murcia', 'MC'),
        (es_id, 'Navarra', 'NC'),
        (es_id, 'País Vasco', 'PV'),
        (es_id, 'La Rioja', 'RI')
        ON CONFLICT DO NOTHING;

        -- Insert major Spanish cities
        INSERT INTO cities (country_id, region_id, name, image_url) VALUES
        (es_id, (SELECT id FROM regions WHERE name = 'Madrid' AND country_id = es_id), 'Madrid', 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=800&q=80'),
        (es_id, (SELECT id FROM regions WHERE name = 'Cataluña' AND country_id = es_id), 'Barcelona', 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80'),
        (es_id, (SELECT id FROM regions WHERE name = 'Comunidad Valenciana' AND country_id = es_id), 'Valencia', NULL),
        (es_id, (SELECT id FROM regions WHERE name = 'Andalucía' AND country_id = es_id), 'Sevilla', NULL),
        (es_id, (SELECT id FROM regions WHERE name = 'Andalucía' AND country_id = es_id), 'Málaga', NULL),
        (es_id, (SELECT id FROM regions WHERE name = 'País Vasco' AND country_id = es_id), 'Bilbao', NULL)
        ON CONFLICT (name) DO UPDATE SET image_url = EXCLUDED.image_url;
    END IF;

    -- ========================================================================
    -- UNITED KINGDOM - Countries and Major Cities
    -- ========================================================================
    IF gb_id IS NOT NULL THEN
        INSERT INTO regions (country_id, name, code) VALUES
        (gb_id, 'England', 'ENG'),
        (gb_id, 'Scotland', 'SCT'),
        (gb_id, 'Wales', 'WLS'),
        (gb_id, 'Northern Ireland', 'NIR')
        ON CONFLICT DO NOTHING;

        INSERT INTO cities (country_id, region_id, name, image_url) VALUES
        (gb_id, (SELECT id FROM regions WHERE name = 'England' AND country_id = gb_id), 'London', 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80'),
        (gb_id, (SELECT id FROM regions WHERE name = 'England' AND country_id = gb_id), 'Manchester', NULL),
        (gb_id, (SELECT id FROM regions WHERE name = 'England' AND country_id = gb_id), 'Birmingham', NULL),
        (gb_id, (SELECT id FROM regions WHERE name = 'England' AND country_id = gb_id), 'Liverpool', NULL),
        (gb_id, (SELECT id FROM regions WHERE name = 'Scotland' AND country_id = gb_id), 'Edinburgh', NULL),
        (gb_id, (SELECT id FROM regions WHERE name = 'Scotland' AND country_id = gb_id), 'Glasgow', NULL),
        (gb_id, (SELECT id FROM regions WHERE name = 'Wales' AND country_id = gb_id), 'Cardiff', NULL),
        (gb_id, (SELECT id FROM regions WHERE name = 'Northern Ireland' AND country_id = gb_id), 'Belfast', NULL)
        ON CONFLICT (name) DO UPDATE SET image_url = EXCLUDED.image_url;
    END IF;

    -- ========================================================================
    -- CANADA - Provinces and Major Cities
    -- ========================================================================
    IF ca_id IS NOT NULL THEN
        INSERT INTO regions (country_id, name, code) VALUES
        (ca_id, 'Alberta', 'AB'),
        (ca_id, 'British Columbia', 'BC'),
        (ca_id, 'Manitoba', 'MB'),
        (ca_id, 'New Brunswick', 'NB'),
        (ca_id, 'Newfoundland and Labrador', 'NL'),
        (ca_id, 'Nova Scotia', 'NS'),
        (ca_id, 'Ontario', 'ON'),
        (ca_id, 'Prince Edward Island', 'PE'),
        (ca_id, 'Quebec', 'QC'),
        (ca_id, 'Saskatchewan', 'SK')
        ON CONFLICT DO NOTHING;

        INSERT INTO cities (country_id, region_id, name, image_url) VALUES
        (ca_id, (SELECT id FROM regions WHERE name = 'Ontario' AND country_id = ca_id), 'Toronto', 'https://images.unsplash.com/photo-1517935706615-2717063c2225?auto=format&fit=crop&w=800&q=80'),
        (ca_id, (SELECT id FROM regions WHERE name = 'Quebec' AND country_id = ca_id), 'Montreal', NULL),
        (ca_id, (SELECT id FROM regions WHERE name = 'British Columbia' AND country_id = ca_id), 'Vancouver', NULL),
        (ca_id, (SELECT id FROM regions WHERE name = 'Alberta' AND country_id = ca_id), 'Calgary', NULL),
        (ca_id, (SELECT id FROM regions WHERE name = 'Alberta' AND country_id = ca_id), 'Edmonton', NULL),
        (ca_id, (SELECT id FROM regions WHERE name = 'Ontario' AND country_id = ca_id), 'Ottawa', NULL)
        ON CONFLICT (name) DO UPDATE SET image_url = EXCLUDED.image_url;
    END IF;

    -- ========================================================================
    -- FRANCE - Regions and Major Cities
    -- ========================================================================
    IF fr_id IS NOT NULL THEN
        INSERT INTO regions (country_id, name, code) VALUES
        (fr_id, 'Île-de-France', 'IDF'),
        (fr_id, 'Provence-Alpes-Côte d''Azur', 'PAC'),
        (fr_id, 'Auvergne-Rhône-Alpes', 'ARA'),
        (fr_id, 'Nouvelle-Aquitaine', 'NAQ'),
        (fr_id, 'Occitanie', 'OCC'),
        (fr_id, 'Hauts-de-France', 'HDF'),
        (fr_id, 'Pays de la Loire', 'PDL'),
        (fr_id, 'Bretagne', 'BRE'),
        (fr_id, 'Grand Est', 'GES'),
        (fr_id, 'Normandie', 'NOR')
        ON CONFLICT DO NOTHING;

        INSERT INTO cities (country_id, region_id, name, image_url) VALUES
        (fr_id, (SELECT id FROM regions WHERE name = 'Île-de-France' AND country_id = fr_id), 'Paris', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80'),
        (fr_id, (SELECT id FROM regions WHERE name = 'Provence-Alpes-Côte d''Azur' AND country_id = fr_id), 'Marseille', NULL),
        (fr_id, (SELECT id FROM regions WHERE name = 'Auvergne-Rhône-Alpes' AND country_id = fr_id), 'Lyon', NULL),
        (fr_id, (SELECT id FROM regions WHERE name = 'Occitanie' AND country_id = fr_id), 'Toulouse', NULL),
        (fr_id, (SELECT id FROM regions WHERE name = 'Provence-Alpes-Côte d''Azur' AND country_id = fr_id), 'Nice', NULL)
        ON CONFLICT (name) DO UPDATE SET image_url = EXCLUDED.image_url;
    END IF;

    -- ========================================================================
    -- GERMANY - States and Major Cities
    -- ========================================================================
    IF de_id IS NOT NULL THEN
        INSERT INTO regions (country_id, name, code) VALUES
        (de_id, 'Baden-Württemberg', 'BW'),
        (de_id, 'Bayern', 'BY'),
        (de_id, 'Berlin', 'BE'),
        (de_id, 'Brandenburg', 'BB'),
        (de_id, 'Bremen', 'HB'),
        (de_id, 'Hamburg', 'HH'),
        (de_id, 'Hessen', 'HE'),
        (de_id, 'Niedersachsen', 'NI'),
        (de_id, 'Nordrhein-Westfalen', 'NW'),
        (de_id, 'Rheinland-Pfalz', 'RP'),
        (de_id, 'Saarland', 'SL'),
        (de_id, 'Sachsen', 'SN'),
        (de_id, 'Sachsen-Anhalt', 'ST'),
        (de_id, 'Schleswig-Holstein', 'SH'),
        (de_id, 'Thüringen', 'TH')
        ON CONFLICT DO NOTHING;

        INSERT INTO cities (country_id, region_id, name, image_url) VALUES
        (de_id, (SELECT id FROM regions WHERE name = 'Berlin' AND country_id = de_id), 'Berlin', 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=800&q=80'),
        (de_id, (SELECT id FROM regions WHERE name = 'Hamburg' AND country_id = de_id), 'Hamburg', NULL),
        (de_id, (SELECT id FROM regions WHERE name = 'Bayern' AND country_id = de_id), 'Munich', NULL),
        (de_id, (SELECT id FROM regions WHERE name = 'Nordrhein-Westfalen' AND country_id = de_id), 'Cologne', NULL),
        (de_id, (SELECT id FROM regions WHERE name = 'Hessen' AND country_id = de_id), 'Frankfurt', NULL)
        ON CONFLICT (name) DO UPDATE SET image_url = EXCLUDED.image_url;
    END IF;

    -- ========================================================================
    -- ITALY - Regions and Major Cities
    -- ========================================================================
    IF it_id IS NOT NULL THEN
        INSERT INTO regions (country_id, name, code) VALUES
        (it_id, 'Lazio', 'LAZ'),
        (it_id, 'Lombardia', 'LOM'),
        (it_id, 'Campania', 'CAM'),
        (it_id, 'Sicilia', 'SIC'),
        (it_id, 'Veneto', 'VEN'),
        (it_id, 'Emilia-Romagna', 'EMR'),
        (it_id, 'Piemonte', 'PIE'),
        (it_id, 'Toscana', 'TOS')
        ON CONFLICT DO NOTHING;

        INSERT INTO cities (country_id, region_id, name, image_url) VALUES
        (it_id, (SELECT id FROM regions WHERE name = 'Lazio' AND country_id = it_id), 'Rome', 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80'),
        (it_id, (SELECT id FROM regions WHERE name = 'Lombardia' AND country_id = it_id), 'Milan', NULL),
        (it_id, (SELECT id FROM regions WHERE name = 'Campania' AND country_id = it_id), 'Naples', NULL),
        (it_id, (SELECT id FROM regions WHERE name = 'Piemonte' AND country_id = it_id), 'Turin', NULL),
        (it_id, (SELECT id FROM regions WHERE name = 'Toscana' AND country_id = it_id), 'Florence', NULL),
        (it_id, (SELECT id FROM regions WHERE name = 'Veneto' AND country_id = it_id), 'Venice', NULL)
        ON CONFLICT (name) DO UPDATE SET image_url = EXCLUDED.image_url;
    END IF;

    -- ========================================================================
    -- AUSTRALIA - States and Major Cities
    -- ========================================================================
    IF au_id IS NOT NULL THEN
        INSERT INTO regions (country_id, name, code) VALUES
        (au_id, 'New South Wales', 'NSW'),
        (au_id, 'Victoria', 'VIC'),
        (au_id, 'Queensland', 'QLD'),
        (au_id, 'Western Australia', 'WA'),
        (au_id, 'South Australia', 'SA'),
        (au_id, 'Tasmania', 'TAS'),
        (au_id, 'Australian Capital Territory', 'ACT'),
        (au_id, 'Northern Territory', 'NT')
        ON CONFLICT DO NOTHING;

        INSERT INTO cities (country_id, region_id, name, image_url) VALUES
        (au_id, (SELECT id FROM regions WHERE name = 'New South Wales' AND country_id = au_id), 'Sydney', 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80'),
        (au_id, (SELECT id FROM regions WHERE name = 'Victoria' AND country_id = au_id), 'Melbourne', NULL),
        (au_id, (SELECT id FROM regions WHERE name = 'Queensland' AND country_id = au_id), 'Brisbane', NULL),
        (au_id, (SELECT id FROM regions WHERE name = 'Western Australia' AND country_id = au_id), 'Perth', NULL),
        (au_id, (SELECT id FROM regions WHERE name = 'South Australia' AND country_id = au_id), 'Adelaide', NULL)
        ON CONFLICT (name) DO UPDATE SET image_url = EXCLUDED.image_url;
    END IF;

    -- ========================================================================
    -- BRAZIL - States and Major Cities
    -- ========================================================================
    IF br_id IS NOT NULL THEN
        INSERT INTO regions (country_id, name, code) VALUES
        (br_id, 'São Paulo', 'SP'),
        (br_id, 'Rio de Janeiro', 'RJ'),
        (br_id, 'Minas Gerais', 'MG'),
        (br_id, 'Bahia', 'BA'),
        (br_id, 'Paraná', 'PR'),
        (br_id, 'Rio Grande do Sul', 'RS'),
        (br_id, 'Pernambuco', 'PE'),
        (br_id, 'Ceará', 'CE')
        ON CONFLICT DO NOTHING;

        INSERT INTO cities (country_id, region_id, name, image_url) VALUES
        (br_id, (SELECT id FROM regions WHERE name = 'São Paulo' AND country_id = br_id), 'São Paulo', NULL),
        (br_id, (SELECT id FROM regions WHERE name = 'Rio de Janeiro' AND country_id = br_id), 'Rio de Janeiro', 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=800&q=80'),
        (br_id, (SELECT id FROM regions WHERE name = 'Bahia' AND country_id = br_id), 'Salvador', NULL),
        (br_id, (SELECT id FROM regions WHERE name = 'Minas Gerais' AND country_id = br_id), 'Belo Horizonte', NULL),
        (br_id, (SELECT id FROM regions WHERE name = 'Paraná' AND country_id = br_id), 'Curitiba', NULL)
        ON CONFLICT (name) DO UPDATE SET image_url = EXCLUDED.image_url;
    END IF;

    -- ========================================================================
    -- MEXICO - States and Major Cities
    -- ========================================================================
    IF mx_id IS NOT NULL THEN
        INSERT INTO regions (country_id, name, code) VALUES
        (mx_id, 'Ciudad de México', 'CMX'),
        (mx_id, 'Jalisco', 'JAL'),
        (mx_id, 'Nuevo León', 'NLE'),
        (mx_id, 'Puebla', 'PUE'),
        (mx_id, 'Guanajuato', 'GTO'),
        (mx_id, 'Veracruz', 'VER'),
        (mx_id, 'Yucatán', 'YUC'),
        (mx_id, 'Quintana Roo', 'ROO')
        ON CONFLICT DO NOTHING;

        INSERT INTO cities (country_id, region_id, name, image_url) VALUES
        (mx_id, (SELECT id FROM regions WHERE name = 'Ciudad de México' AND country_id = mx_id), 'Mexico City', NULL),
        (mx_id, (SELECT id FROM regions WHERE name = 'Jalisco' AND country_id = mx_id), 'Guadalajara', NULL),
        (mx_id, (SELECT id FROM regions WHERE name = 'Nuevo León' AND country_id = mx_id), 'Monterrey', NULL),
        (mx_id, (SELECT id FROM regions WHERE name = 'Puebla' AND country_id = mx_id), 'Puebla', NULL),
        (mx_id, (SELECT id FROM regions WHERE name = 'Quintana Roo' AND country_id = mx_id), 'Cancún', NULL)
        ON CONFLICT (name) DO UPDATE SET image_url = EXCLUDED.image_url;
    END IF;

END $$;
