-- ============================================================================
-- SEED GEOGRAPHIC DATA (Idempotent)
-- ============================================================================

-- 1. Ensure a default continent exists (since countries requires continent_id)
DO $$
DECLARE
    default_continent_id UUID;
BEGIN
    -- Try to find an existing continent
    SELECT id INTO default_continent_id FROM continents LIMIT 1;

    -- If no continent exists, create one (e.g., 'Global' or 'Unspecified')
    IF default_continent_id IS NULL THEN
        INSERT INTO continents (name, code, slug) 
        VALUES ('Global', 'GL', 'global')
        RETURNING id INTO default_continent_id;
    END IF;

    -- 2. Insert Countries (Using the found/created continent_id)
    -- Note: We use ON CONFLICT (code) DO NOTHING to avoid duplicates
    INSERT INTO countries (name, code, iso_code_2, iso_code_3, continent_id) VALUES
    ('Afghanistan', 'AF', 'AF', 'AFG', default_continent_id),
    ('Albania', 'AL', 'AL', 'ALB', default_continent_id),
    ('Algeria', 'DZ', 'DZ', 'DZA', default_continent_id),
    ('Andorra', 'AD', 'AD', 'AND', default_continent_id),
    ('Angola', 'AO', 'AO', 'AGO', default_continent_id),
    ('Antigua and Barbuda', 'AG', 'AG', 'ATG', default_continent_id),
    ('Argentina', 'AR', 'AR', 'ARG', default_continent_id),
    ('Armenia', 'AM', 'AM', 'ARM', default_continent_id),
    ('Australia', 'AU', 'AU', 'AUS', default_continent_id),
    ('Austria', 'AT', 'AT', 'AUT', default_continent_id),
    ('Azerbaijan', 'AZ', 'AZ', 'AZE', default_continent_id),
    ('Bahamas', 'BS', 'BS', 'BHS', default_continent_id),
    ('Bahrain', 'BH', 'BH', 'BHR', default_continent_id),
    ('Bangladesh', 'BD', 'BD', 'BGD', default_continent_id),
    ('Barbados', 'BB', 'BB', 'BRB', default_continent_id),
    ('Belarus', 'BY', 'BY', 'BLR', default_continent_id),
    ('Belgium', 'BE', 'BE', 'BEL', default_continent_id),
    ('Belize', 'BZ', 'BZ', 'BLZ', default_continent_id),
    ('Benin', 'BJ', 'BJ', 'BEN', default_continent_id),
    ('Bhutan', 'BT', 'BT', 'BTN', default_continent_id),
    ('Bolivia', 'BO', 'BO', 'BOL', default_continent_id),
    ('Bosnia and Herzegovina', 'BA', 'BA', 'BIH', default_continent_id),
    ('Botswana', 'BW', 'BW', 'BWA', default_continent_id),
    ('Brazil', 'BR', 'BR', 'BRA', default_continent_id),
    ('Brunei', 'BN', 'BN', 'BRN', default_continent_id),
    ('Bulgaria', 'BG', 'BG', 'BGR', default_continent_id),
    ('Burkina Faso', 'BF', 'BF', 'BFA', default_continent_id),
    ('Burundi', 'BI', 'BI', 'BDI', default_continent_id),
    ('Cabo Verde', 'CV', 'CV', 'CPV', default_continent_id),
    ('Cambodia', 'KH', 'KH', 'KHM', default_continent_id),
    ('Cameroon', 'CM', 'CM', 'CMR', default_continent_id),
    ('Canada', 'CA', 'CA', 'CAN', default_continent_id),
    ('Central African Republic', 'CF', 'CF', 'CAF', default_continent_id),
    ('Chad', 'TD', 'TD', 'TCD', default_continent_id),
    ('Chile', 'CL', 'CL', 'CHL', default_continent_id),
    ('China', 'CN', 'CN', 'CHN', default_continent_id),
    ('Colombia', 'CO', 'CO', 'COL', default_continent_id),
    ('Comoros', 'KM', 'KM', 'COM', default_continent_id),
    ('Congo (Congo-Brazzaville)', 'CG', 'CG', 'COG', default_continent_id),
    ('Costa Rica', 'CR', 'CR', 'CRI', default_continent_id),
    ('Croatia', 'HR', 'HR', 'HRV', default_continent_id),
    ('Cuba', 'CU', 'CU', 'CUB', default_continent_id),
    ('Cyprus', 'CY', 'CY', 'CYP', default_continent_id),
    ('Czechia (Czech Republic)', 'CZ', 'CZ', 'CZE', default_continent_id),
    ('Democratic Republic of the Congo', 'CD', 'CD', 'COD', default_continent_id),
    ('Denmark', 'DK', 'DK', 'DNK', default_continent_id),
    ('Djibouti', 'DJ', 'DJ', 'DJI', default_continent_id),
    ('Dominica', 'DM', 'DM', 'DMA', default_continent_id),
    ('Dominican Republic', 'DO', 'DO', 'DOM', default_continent_id),
    ('Ecuador', 'EC', 'EC', 'ECU', default_continent_id),
    ('Egypt', 'EG', 'EG', 'EGY', default_continent_id),
    ('El Salvador', 'SV', 'SV', 'SLV', default_continent_id),
    ('Equatorial Guinea', 'GQ', 'GQ', 'GNQ', default_continent_id),
    ('Eritrea', 'ER', 'ER', 'ERI', default_continent_id),
    ('Estonia', 'EE', 'EE', 'EST', default_continent_id),
    ('Eswatini (fmr. "Swaziland")', 'SZ', 'SZ', 'SWZ', default_continent_id),
    ('Ethiopia', 'ET', 'ET', 'ETH', default_continent_id),
    ('Fiji', 'FJ', 'FJ', 'FJI', default_continent_id),
    ('Finland', 'FI', 'FI', 'FIN', default_continent_id),
    ('France', 'FR', 'FR', 'FRA', default_continent_id),
    ('Gabon', 'GA', 'GA', 'GAB', default_continent_id),
    ('Gambia', 'GM', 'GM', 'GMB', default_continent_id),
    ('Georgia', 'GE', 'GE', 'GEO', default_continent_id),
    ('Germany', 'DE', 'DE', 'DEU', default_continent_id),
    ('Ghana', 'GH', 'GH', 'GHA', default_continent_id),
    ('Greece', 'GR', 'GR', 'GRC', default_continent_id),
    ('Grenada', 'GD', 'GD', 'GRD', default_continent_id),
    ('Guatemala', 'GT', 'GT', 'GTM', default_continent_id),
    ('Guinea', 'GN', 'GN', 'GIN', default_continent_id),
    ('Guinea-Bissau', 'GW', 'GW', 'GNB', default_continent_id),
    ('Guyana', 'GY', 'GY', 'GUY', default_continent_id),
    ('Haiti', 'HT', 'HT', 'HTI', default_continent_id),
    ('Holy See', 'VA', 'VA', 'VAT', default_continent_id),
    ('Honduras', 'HN', 'HN', 'HND', default_continent_id),
    ('Hungary', 'HU', 'HU', 'HUN', default_continent_id),
    ('Iceland', 'IS', 'IS', 'ISL', default_continent_id),
    ('India', 'IN', 'IN', 'IND', default_continent_id),
    ('Indonesia', 'ID', 'ID', 'IDN', default_continent_id),
    ('Iran', 'IR', 'IR', 'IRN', default_continent_id),
    ('Iraq', 'IQ', 'IQ', 'IRQ', default_continent_id),
    ('Ireland', 'IE', 'IE', 'IRL', default_continent_id),
    ('Israel', 'IL', 'IL', 'ISR', default_continent_id),
    ('Italy', 'IT', 'IT', 'ITA', default_continent_id),
    ('Jamaica', 'JM', 'JM', 'JAM', default_continent_id),
    ('Japan', 'JP', 'JP', 'JPN', default_continent_id),
    ('Jordan', 'JO', 'JO', 'JOR', default_continent_id),
    ('Kazakhstan', 'KZ', 'KZ', 'KAZ', default_continent_id),
    ('Kenya', 'KE', 'KE', 'KEN', default_continent_id),
    ('Kiribati', 'KI', 'KI', 'KIR', default_continent_id),
    ('Kuwait', 'KW', 'KW', 'KWT', default_continent_id),
    ('Kyrgyzstan', 'KG', 'KG', 'KGZ', default_continent_id),
    ('Laos', 'LA', 'LA', 'LAO', default_continent_id),
    ('Latvia', 'LV', 'LV', 'LVA', default_continent_id),
    ('Lebanon', 'LB', 'LB', 'LBN', default_continent_id),
    ('Lesotho', 'LS', 'LS', 'LSO', default_continent_id),
    ('Liberia', 'LR', 'LR', 'LBR', default_continent_id),
    ('Libya', 'LY', 'LY', 'LBY', default_continent_id),
    ('Liechtenstein', 'LI', 'LI', 'LIE', default_continent_id),
    ('Lithuania', 'LT', 'LT', 'LTU', default_continent_id),
    ('Luxembourg', 'LU', 'LU', 'LUX', default_continent_id),
    ('Madagascar', 'MG', 'MG', 'MDG', default_continent_id),
    ('Malawi', 'MW', 'MW', 'MWI', default_continent_id),
    ('Malaysia', 'MY', 'MY', 'MYS', default_continent_id),
    ('Maldives', 'MV', 'MV', 'MDV', default_continent_id),
    ('Mali', 'ML', 'ML', 'MLI', default_continent_id),
    ('Malta', 'MT', 'MT', 'MLT', default_continent_id),
    ('Marshall Islands', 'MH', 'MH', 'MHL', default_continent_id),
    ('Mauritania', 'MR', 'MR', 'MRT', default_continent_id),
    ('Mauritius', 'MU', 'MU', 'MUS', default_continent_id),
    ('Mexico', 'MX', 'MX', 'MEX', default_continent_id),
    ('Micronesia', 'FM', 'FM', 'FSM', default_continent_id),
    ('Moldova', 'MD', 'MD', 'MDA', default_continent_id),
    ('Monaco', 'MC', 'MC', 'MCO', default_continent_id),
    ('Mongolia', 'MN', 'MN', 'MNG', default_continent_id),
    ('Montenegro', 'ME', 'ME', 'MNE', default_continent_id),
    ('Morocco', 'MA', 'MA', 'MAR', default_continent_id),
    ('Mozambique', 'MZ', 'MZ', 'MOZ', default_continent_id),
    ('Myanmar (formerly Burma)', 'MM', 'MM', 'MMR', default_continent_id),
    ('Namibia', 'NA', 'NA', 'NAM', default_continent_id),
    ('Nauru', 'NR', 'NR', 'NRU', default_continent_id),
    ('Nepal', 'NP', 'NP', 'NPL', default_continent_id),
    ('Netherlands', 'NL', 'NL', 'NLD', default_continent_id),
    ('New Zealand', 'NZ', 'NZ', 'NZL', default_continent_id),
    ('Nicaragua', 'NI', 'NI', 'NIC', default_continent_id),
    ('Niger', 'NE', 'NE', 'NER', default_continent_id),
    ('Nigeria', 'NG', 'NG', 'NGA', default_continent_id),
    ('North Korea', 'KP', 'KP', 'PRK', default_continent_id),
    ('North Macedonia', 'MK', 'MK', 'MKD', default_continent_id),
    ('Norway', 'NO', 'NO', 'NOR', default_continent_id),
    ('Oman', 'OM', 'OM', 'OMN', default_continent_id),
    ('Pakistan', 'PK', 'PK', 'PAK', default_continent_id),
    ('Palau', 'PW', 'PW', 'PLW', default_continent_id),
    ('Palestine State', 'PS', 'PS', 'PSE', default_continent_id),
    ('Panama', 'PA', 'PA', 'PAN', default_continent_id),
    ('Papua New Guinea', 'PG', 'PG', 'PNG', default_continent_id),
    ('Paraguay', 'PY', 'PY', 'PRY', default_continent_id),
    ('Peru', 'PE', 'PE', 'PER', default_continent_id),
    ('Philippines', 'PH', 'PH', 'PHL', default_continent_id),
    ('Poland', 'PL', 'PL', 'POL', default_continent_id),
    ('Portugal', 'PT', 'PT', 'PRT', default_continent_id),
    ('Qatar', 'QA', 'QA', 'QAT', default_continent_id),
    ('Romania', 'RO', 'RO', 'ROU', default_continent_id),
    ('Russia', 'RU', 'RU', 'RUS', default_continent_id),
    ('Rwanda', 'RW', 'RW', 'RWA', default_continent_id),
    ('Saint Kitts and Nevis', 'KN', 'KN', 'KNA', default_continent_id),
    ('Saint Lucia', 'LC', 'LC', 'LCA', default_continent_id),
    ('Saint Vincent and the Grenadines', 'VC', 'VC', 'VCT', default_continent_id),
    ('Samoa', 'WS', 'WS', 'WSM', default_continent_id),
    ('San Marino', 'SM', 'SM', 'SMR', default_continent_id),
    ('Sao Tome and Principe', 'ST', 'ST', 'STP', default_continent_id),
    ('Saudi Arabia', 'SA', 'SA', 'SAU', default_continent_id),
    ('Senegal', 'SN', 'SN', 'SEN', default_continent_id),
    ('Serbia', 'RS', 'RS', 'SRB', default_continent_id),
    ('Seychelles', 'SC', 'SC', 'SYC', default_continent_id),
    ('Sierra Leone', 'SL', 'SL', 'SLE', default_continent_id),
    ('Singapore', 'SG', 'SG', 'SGP', default_continent_id),
    ('Slovakia', 'SK', 'SK', 'SVK', default_continent_id),
    ('Slovenia', 'SI', 'SI', 'SVN', default_continent_id),
    ('Solomon Islands', 'SB', 'SB', 'SLB', default_continent_id),
    ('Somalia', 'SO', 'SO', 'SOM', default_continent_id),
    ('South Africa', 'ZA', 'ZA', 'ZAF', default_continent_id),
    ('South Korea', 'KR', 'KR', 'KOR', default_continent_id),
    ('South Sudan', 'SS', 'SS', 'SSD', default_continent_id),
    ('Spain', 'ES', 'ES', 'ESP', default_continent_id),
    ('Sri Lanka', 'LK', 'LK', 'LKA', default_continent_id),
    ('Sudan', 'SD', 'SD', 'SDN', default_continent_id),
    ('Suriname', 'SR', 'SR', 'SUR', default_continent_id),
    ('Sweden', 'SE', 'SE', 'SWE', default_continent_id),
    ('Switzerland', 'CH', 'CH', 'CHE', default_continent_id),
    ('Syria', 'SY', 'SY', 'SYR', default_continent_id),
    ('Tajikistan', 'TJ', 'TJ', 'TJK', default_continent_id),
    ('Tanzania', 'TZ', 'TZ', 'TZA', default_continent_id),
    ('Thailand', 'TH', 'TH', 'THA', default_continent_id),
    ('Timor-Leste', 'TL', 'TL', 'TLS', default_continent_id),
    ('Togo', 'TG', 'TG', 'TGO', default_continent_id),
    ('Tonga', 'TO', 'TO', 'TON', default_continent_id),
    ('Trinidad and Tobago', 'TT', 'TT', 'TTO', default_continent_id),
    ('Tunisia', 'TN', 'TN', 'TUN', default_continent_id),
    ('Turkey', 'TR', 'TR', 'TUR', default_continent_id),
    ('Turkmenistan', 'TM', 'TM', 'TKM', default_continent_id),
    ('Tuvalu', 'TV', 'TV', 'TUV', default_continent_id),
    ('Uganda', 'UG', 'UG', 'UGA', default_continent_id),
    ('Ukraine', 'UA', 'UA', 'UKR', default_continent_id),
    ('United Arab Emirates', 'AE', 'AE', 'ARE', default_continent_id),
    ('United Kingdom', 'GB', 'GB', 'GBR', default_continent_id),
    ('United States of America', 'US', 'US', 'USA', default_continent_id),
    ('Uruguay', 'UY', 'UY', 'URY', default_continent_id),
    ('Uzbekistan', 'UZ', 'UZ', 'UZB', default_continent_id),
    ('Vanuatu', 'VU', 'VU', 'VUT', default_continent_id),
    ('Venezuela', 'VE', 'VE', 'VEN', default_continent_id),
    ('Vietnam', 'VN', 'VN', 'VNM', default_continent_id),
    ('Yemen', 'YE', 'YE', 'YEM', default_continent_id),
    ('Zambia', 'ZM', 'ZM', 'ZMB', default_continent_id),
    ('Zimbabwe', 'ZW', 'ZW', 'ZWE', default_continent_id)
    ON CONFLICT (name) DO NOTHING;

    -- Auto-generate flag URLs using FlagCDN
    UPDATE countries 
    SET flag_url = 'https://flagcdn.com/w320/' || LOWER(iso_code_2) || '.png'
    WHERE flag_url IS NULL AND iso_code_2 IS NOT NULL;
END $$;

-- 3. Insert Regions for US (Example)
DO $$
DECLARE
    us_id UUID;
BEGIN
    SELECT id INTO us_id FROM countries WHERE iso_code_2 = 'US';
    
    IF us_id IS NOT NULL THEN
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
    END IF;
END $$;

-- 4. Insert Cities for US (Major Cities Example with Images)
DO $$
DECLARE
    us_id UUID;
    ny_id UUID;
    ca_id UUID;
    tx_id UUID;
    fl_id UUID;
    il_id UUID;
BEGIN
    SELECT id INTO us_id FROM countries WHERE iso_code_2 = 'US';
    SELECT id INTO ny_id FROM regions WHERE code = 'NY' AND country_id = us_id;
    SELECT id INTO ca_id FROM regions WHERE code = 'CA' AND country_id = us_id;
    SELECT id INTO tx_id FROM regions WHERE code = 'TX' AND country_id = us_id;
    SELECT id INTO fl_id FROM regions WHERE code = 'FL' AND country_id = us_id;
    SELECT id INTO il_id FROM regions WHERE code = 'IL' AND country_id = us_id;

    IF us_id IS NOT NULL THEN
        -- New York Cities
        IF ny_id IS NOT NULL THEN
            INSERT INTO cities (country_id, region_id, name, image_url) VALUES
            (us_id, ny_id, 'New York City', 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80'),
            (us_id, ny_id, 'Buffalo', NULL),
            (us_id, ny_id, 'Rochester', NULL),
            (us_id, ny_id, 'Yonkers', NULL),
            (us_id, ny_id, 'Syracuse', NULL)
            ON CONFLICT (name) DO UPDATE SET image_url = EXCLUDED.image_url;
        END IF;

        -- California Cities
        IF ca_id IS NOT NULL THEN
            INSERT INTO cities (country_id, region_id, name, image_url) VALUES
            (us_id, ca_id, 'Los Angeles', 'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?auto=format&fit=crop&w=800&q=80'),
            (us_id, ca_id, 'San Diego', 'https://images.unsplash.com/photo-1506760610100-1af6025cf0c7?auto=format&fit=crop&w=800&q=80'),
            (us_id, ca_id, 'San Jose', NULL),
            (us_id, ca_id, 'San Francisco', 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=80'),
            (us_id, ca_id, 'Fresno', NULL),
            (us_id, ca_id, 'Sacramento', NULL)
            ON CONFLICT (name) DO UPDATE SET image_url = EXCLUDED.image_url;
        END IF;

        -- Texas Cities
        IF tx_id IS NOT NULL THEN
            INSERT INTO cities (country_id, region_id, name, image_url) VALUES
            (us_id, tx_id, 'Houston', 'https://images.unsplash.com/photo-1530089711124-9ca31fb99452?auto=format&fit=crop&w=800&q=80'),
            (us_id, tx_id, 'San Antonio', NULL),
            (us_id, tx_id, 'Dallas', 'https://images.unsplash.com/photo-1570129477492-45f003f2ddfa?auto=format&fit=crop&w=800&q=80'),
            (us_id, tx_id, 'Austin', 'https://images.unsplash.com/photo-1531218150217-54595bc2b934?auto=format&fit=crop&w=800&q=80'),
            (us_id, tx_id, 'Fort Worth', NULL)
            ON CONFLICT (name) DO UPDATE SET image_url = EXCLUDED.image_url;
        END IF;
        
        -- Florida Cities
        IF fl_id IS NOT NULL THEN
            INSERT INTO cities (country_id, region_id, name, image_url) VALUES
            (us_id, fl_id, 'Jacksonville', NULL),
            (us_id, fl_id, 'Miami', 'https://images.unsplash.com/photo-1514214246283-ef1e12db6153?auto=format&fit=crop&w=800&q=80'),
            (us_id, fl_id, 'Tampa', NULL),
            (us_id, fl_id, 'Orlando', NULL),
            (us_id, fl_id, 'St. Petersburg', NULL)
            ON CONFLICT (name) DO UPDATE SET image_url = EXCLUDED.image_url;
        END IF;

        -- Illinois Cities
        IF il_id IS NOT NULL THEN
            INSERT INTO cities (country_id, region_id, name, image_url) VALUES
            (us_id, il_id, 'Chicago', 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?auto=format&fit=crop&w=800&q=80'),
            (us_id, il_id, 'Aurora', NULL),
            (us_id, il_id, 'Naperville', NULL)
            ON CONFLICT (name) DO UPDATE SET image_url = EXCLUDED.image_url;
        END IF;
    END IF;
END $$;
