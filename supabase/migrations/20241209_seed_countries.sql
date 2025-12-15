-- Seed Countries
INSERT INTO public.countries (name, iso_code_2, iso_code_3, phone_code, currency_code, region)
VALUES 
    ('Portugal', 'PT', 'PRT', '+351', 'EUR', 'Europe'),
    ('Spain', 'ES', 'ESP', '+34', 'EUR', 'Europe'),
    ('France', 'FR', 'FRA', '+33', 'EUR', 'Europe'),
    ('United Kingdom', 'GB', 'GBR', '+44', 'GBP', 'Europe'),
    ('United States', 'US', 'USA', '+1', 'USD', 'Americas'),
    ('Germany', 'DE', 'DEU', '+49', 'EUR', 'Europe'),
    ('Italy', 'IT', 'ITA', '+39', 'EUR', 'Europe'),
    ('Netherlands', 'NL', 'NLD', '+31', 'EUR', 'Europe'),
    ('Belgium', 'BE', 'BEL', '+32', 'EUR', 'Europe'),
    ('Switzerland', 'CH', 'CHE', '+41', 'CHF', 'Europe'),
    ('Brazil', 'BR', 'BRA', '+55', 'BRL', 'Americas'),
    ('Angola', 'AO', 'AGO', '+244', 'AOA', 'Africa'),
    ('Mozambique', 'MZ', 'MOZ', '+258', 'MZN', 'Africa'),
    ('Cape Verde', 'CV', 'CPV', '+238', 'CVE', 'Africa')
ON CONFLICT (iso_code_2) DO NOTHING;
