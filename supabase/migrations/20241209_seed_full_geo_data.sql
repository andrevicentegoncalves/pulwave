-- 20241209_seed_full_geo_data.sql
-- Comprehensive Master Data Seed
-- Order: Continents -> Regional Blocks -> Countries -> Memberships

BEGIN;

-- 1. CONTINENTS
INSERT INTO public.continents (name, code, is_active, display_order)
VALUES 
    ('Africa', 'AF', true, 1),
    ('Antarctica', 'AN', true, 7),
    ('Asia', 'AS', true, 2),
    ('Europe', 'EU', true, 3),
    ('North America', 'NA', true, 4),
    ('Oceania', 'OC', true, 6),
    ('South America', 'SA', true, 5)
ON CONFLICT (code) DO UPDATE SET 
    name = EXCLUDED.name,
    is_active = true;

-- 2. REGIONAL BLOCKS
-- Using text strings for block_type as it is user-defined enum.
INSERT INTO public.regional_blocks (
    code, name, abbreviation, block_type, description, 
    headquarters_city, headquarters_country_code, is_active, display_order
) VALUES
('EU', 'European Union', 'EU', 'political', 'Political and economic union of 27 member states that are located primarily in Europe.', 'Brussels', 'BE', true, 1),
('ASEAN', 'Association of Southeast Asian Nations', 'ASEAN', 'economic', 'Regional grouping that promotes economic, political, and security cooperation.', 'Jakarta', 'ID', true, 2),
('AU', 'African Union', 'AU', 'political', 'Continental union consisting of 55 member states located on the continent of Africa.', 'Addis Ababa', 'ET', true, 3),
('USMCA', 'United States–Mexico–Canada Agreement', 'USMCA', 'economic', 'Free trade agreement between Canada, Mexico, and the United States.', 'Washington, D.C.', 'US', true, 4),
('MERCOSUR', 'Southern Common Market', 'MERCOSUR', 'economic', 'South American trade bloc established by the Treaty of Asunción.', 'Montevideo', 'UY', true, 5),
('SCHENGEN', 'Schengen Area', 'Schengen', 'other', 'Area comprising 27 European countries that have officially abolished all passport and all other types of border control at their mutual borders.', 'Schengen', 'LU', true, 6),
('EEA', 'European Economic Area', 'EEA', 'economic', 'Area that provides for the free movement of persons, goods, services and capital within the European Single Market.', 'Brussels', 'BE', true, 7),
('NATO', 'North Atlantic Treaty Organization', 'NATO', 'political', 'Intergovernmental military alliance between 31 member states – 29 European and two North American.', 'Brussels', 'BE', true, 8)
ON CONFLICT (code) DO UPDATE SET 
    name = EXCLUDED.name,
    is_active = true;

COMMIT;

-- 3. COUNTRIES & MEMBERSHIPS (Dynamically linked)
DO $$
DECLARE
    -- Continents
    id_af UUID; id_an UUID; id_as UUID; id_eu UUID; id_na UUID; id_oc UUID; id_sa UUID;
    -- Blocks
    block_eu_id UUID; block_asean_id UUID; block_au_id UUID; block_mercosur_id UUID; block_usmca_id UUID;
BEGIN
    SELECT id INTO id_af FROM public.continents WHERE code = 'AF';
    SELECT id INTO id_an FROM public.continents WHERE code = 'AN';
    SELECT id INTO id_as FROM public.continents WHERE code = 'AS';
    SELECT id INTO id_eu FROM public.continents WHERE code = 'EU';
    SELECT id INTO id_na FROM public.continents WHERE code = 'NA';
    SELECT id INTO id_oc FROM public.continents WHERE code = 'OC';
    SELECT id INTO id_sa FROM public.continents WHERE code = 'SA';

    -- INSERT COUNTRIES (A-Z)
    -- Added 'code' column mapping to iso_code_2
    INSERT INTO public.countries (name, code, iso_code_2, iso_code_3, phone_code, currency_code, continent_id, flag_emoji, is_active) VALUES
    ('Afghanistan', 'AF', 'AF', 'AFG', '+93', 'AFN', id_as, '🇦🇫', true),
    ('Albania', 'AL', 'AL', 'ALB', '+355', 'ALL', id_eu, '🇦🇱', true),
    ('Algeria', 'DZ', 'DZ', 'DZA', '+213', 'DZD', id_af, '🇩🇿', true),
    ('American Samoa', 'AS', 'AS', 'ASM', '+1-684', 'USD', id_oc, '🇦🇸', true),
    ('Andorra', 'AD', 'AD', 'AND', '+376', 'EUR', id_eu, '🇦🇩', true),
    ('Angola', 'AO', 'AO', 'AGO', '+244', 'AOA', id_af, '🇦🇴', true),
    ('Anguilla', 'AI', 'AI', 'AIA', '+1-264', 'XCD', id_na, '🇦🇮', true),
    ('Antarctica', 'AQ', 'AQ', 'ATA', '+672', '', id_an, '🇦🇶', true),
    ('Antigua and Barbuda', 'AG', 'AG', 'ATG', '+1-268', 'XCD', id_na, '🇦🇬', true),
    ('Argentina', 'AR', 'AR', 'ARG', '+54', 'ARS', id_sa, '🇦🇷', true),
    ('Armenia', 'AM', 'AM', 'ARM', '+374', 'AMD', id_as, '🇦🇲', true),
    ('Aruba', 'AW', 'AW', 'ABW', '+297', 'AWG', id_na, '🇦🇼', true),
    ('Australia', 'AU', 'AU', 'AUS', '+61', 'AUD', id_oc, '🇦🇺', true),
    ('Austria', 'AT', 'AT', 'AUT', '+43', 'EUR', id_eu, '🇦🇹', true),
    ('Azerbaijan', 'AZ', 'AZ', 'AZE', '+994', 'AZN', id_as, '🇦🇿', true),
    ('Bahamas', 'BS', 'BS', 'BHS', '+1-242', 'BSD', id_na, '🇧🇸', true),
    ('Bahrain', 'BH', 'BH', 'BHR', '+973', 'BHD', id_as, '🇧🇭', true),
    ('Bangladesh', 'BD', 'BD', 'BGD', '+880', 'BDT', id_as, '🇧🇩', true),
    ('Barbados', 'BB', 'BB', 'BRB', '+1-246', 'BBD', id_na, '🇧🇧', true),
    ('Belarus', 'BY', 'BY', 'BLR', '+375', 'BYN', id_eu, '🇧🇾', true),
    ('Belgium', 'BE', 'BE', 'BEL', '+32', 'EUR', id_eu, '🇧🇪', true),
    ('Belize', 'BZ', 'BZ', 'BLZ', '+501', 'BZD', id_na, '🇧🇿', true),
    ('Benin', 'BJ', 'BJ', 'BEN', '+229', 'XOF', id_af, '🇧🇯', true),
    ('Bermuda', 'BM', 'BM', 'BMU', '+1-441', 'BMD', id_na, '🇧🇲', true),
    ('Bhutan', 'BT', 'BT', 'BTN', '+975', 'BTN', id_as, '🇧🇹', true),
    ('Bolivia', 'BO', 'BO', 'BOL', '+591', 'BOB', id_sa, '🇧🇴', true),
    ('Bosnia and Herzegovina', 'BA', 'BA', 'BIH', '+387', 'BAM', id_eu, '🇧🇦', true),
    ('Botswana', 'BW', 'BW', 'BWA', '+267', 'BWP', id_af, '🇧🇼', true),
    ('Bouvet Island', 'BV', 'BV', 'BVT', '', 'NOK', id_an, '🇧🇻', true),
    ('Brazil', 'BR', 'BR', 'BRA', '+55', 'BRL', id_sa, '🇧🇷', true),
    ('British Indian Ocean Territory', 'IO', 'IO', 'IOT', '+246', 'USD', id_as, '🇮🇴', true),
    ('Brunei Darussalam', 'BN', 'BN', 'BRN', '+673', 'BND', id_as, '🇧🇳', true),
    ('Bulgaria', 'BG', 'BG', 'BGR', '+359', 'BGN', id_eu, '🇧🇬', true),
    ('Burkina Faso', 'BF', 'BF', 'BFA', '+226', 'XOF', id_af, '🇧🇫', true),
    ('Burundi', 'BI', 'BI', 'BDI', '+257', 'BIF', id_af, '🇧🇮', true),
    ('Cambodia', 'KH', 'KH', 'KHM', '+855', 'KHR', id_as, '🇰🇭', true),
    ('Cameroon', 'CM', 'CM', 'CMR', '+237', 'XAF', id_af, '🇨🇲', true),
    ('Canada', 'CA', 'CA', 'CAN', '+1', 'CAD', id_na, '🇨🇦', true),
    ('Cape Verde', 'CV', 'CV', 'CPV', '+238', 'CVE', id_af, '🇨🇻', true),
    ('Cayman Islands', 'KY', 'KY', 'CYM', '+1-345', 'KYD', id_na, '🇰🇾', true),
    ('Central African Republic', 'CF', 'CF', 'CAF', '+236', 'XAF', id_af, '🇨🇫', true),
    ('Chad', 'TD', 'TD', 'TCD', '+235', 'XAF', id_af, '🇹🇩', true),
    ('Chile', 'CL', 'CL', 'CHL', '+56', 'CLP', id_sa, '🇨🇱', true),
    ('China', 'CN', 'CN', 'CHN', '+86', 'CNY', id_as, '🇨🇳', true),
    ('Christmas Island', 'CX', 'CX', 'CXR', '+61', 'AUD', id_oc, '🇨🇽', true),
    ('Cocos (Keeling) Islands', 'CC', 'CC', 'CCK', '+61', 'AUD', id_oc, '🇨🇨', true),
    ('Colombia', 'CO', 'CO', 'COL', '+57', 'COP', id_sa, '🇨🇴', true),
    ('Comoros', 'KM', 'KM', 'COM', '+269', 'KMF', id_af, '🇰🇲', true),
    ('Congo', 'CG', 'CG', 'COG', '+242', 'XAF', id_af, '🇨🇬', true),
    ('Congo, Democratic Republic of the', 'CD', 'CD', 'COD', '+243', 'CDF', id_af, '🇨🇩', true),
    ('Cook Islands', 'CK', 'CK', 'COK', '+682', 'NZD', id_oc, '🇨🇰', true),
    ('Costa Rica', 'CR', 'CR', 'CRI', '+506', 'CRC', id_na, '🇨🇷', true),
    ('Croatia', 'HR', 'HR', 'HRV', '+385', 'EUR', id_eu, '🇭🇷', true),
    ('Cuba', 'CU', 'CU', 'CUB', '+53', 'CUP', id_na, '🇨🇺', true),
    ('Cyprus', 'CY', 'CY', 'CYP', '+357', 'EUR', id_eu, '🇨🇾', true),
    ('Czech Republic', 'CZ', 'CZ', 'CZE', '+420', 'CZK', id_eu, '🇨🇿', true),
    ('Denmark', 'DK', 'DK', 'DNK', '+45', 'DKK', id_eu, '🇩🇰', true),
    ('Djibouti', 'DJ', 'DJ', 'DJI', '+253', 'DJF', id_af, '🇩🇯', true),
    ('Dominica', 'DM', 'DM', 'DMA', '+1-767', 'XCD', id_na, '🇩🇲', true),
    ('Dominican Republic', 'DO', 'DO', 'DOM', '+1-809', 'DOP', id_na, '🇩🇴', true),
    ('Ecuador', 'EC', 'EC', 'ECU', '+593', 'USD', id_sa, '🇪🇨', true),
    ('Egypt', 'EG', 'EG', 'EGY', '+20', 'EGP', id_af, '🇪🇬', true),
    ('El Salvador', 'SV', 'SV', 'SLV', '+503', 'USD', id_na, '🇸🇻', true),
    ('Equatorial Guinea', 'GQ', 'GQ', 'GNQ', '+240', 'XAF', id_af, '🇬🇶', true),
    ('Eritrea', 'ER', 'ER', 'ERI', '+291', 'ERN', id_af, '🇪🇷', true),
    ('Estonia', 'EE', 'EE', 'EST', '+372', 'EUR', id_eu, '🇪🇪', true),
    ('Ethiopia', 'ET', 'ET', 'ETH', '+251', 'ETB', id_af, '🇪🇹', true),
    ('Falkland Islands (Malvinas)', 'FK', 'FK', 'FLK', '+500', 'FKP', id_sa, '🇫🇰', true),
    ('Faroe Islands', 'FO', 'FO', 'FRO', '+298', 'DKK', id_eu, '🇫🇴', true),
    ('Fiji', 'FJ', 'FJ', 'FJI', '+679', 'FJD', id_oc, '🇫🇯', true),
    ('Finland', 'FI', 'FI', 'FIN', '+358', 'EUR', id_eu, '🇫🇮', true),
    ('France', 'FR', 'FR', 'FRA', '+33', 'EUR', id_eu, '🇫🇷', true),
    ('French Guiana', 'GF', 'GF', 'GUF', '+594', 'EUR', id_sa, '🇬🇫', true),
    ('French Polynesia', 'PF', 'PF', 'PYF', '+689', 'XPF', id_oc, '🇵🇫', true),
    ('Gabon', 'GA', 'GA', 'GAB', '+241', 'XAF', id_af, '🇬🇦', true),
    ('Gambia', 'GM', 'GM', 'GMB', '+220', 'GMD', id_af, '🇬🇲', true),
    ('Georgia', 'GE', 'GE', 'GEO', '+995', 'GEL', id_as, '🇬🇪', true),
    ('Germany', 'DE', 'DE', 'DEU', '+49', 'EUR', id_eu, '🇩🇪', true),
    ('Ghana', 'GH', 'GH', 'GHA', '+233', 'GHS', id_af, '🇬🇭', true),
    ('Gibraltar', 'GI', 'GI', 'GIB', '+350', 'GIP', id_eu, '🇬🇮', true),
    ('Greece', 'GR', 'GR', 'GRC', '+30', 'EUR', id_eu, '🇬🇷', true),
    ('Greenland', 'GL', 'GL', 'GRL', '+299', 'DKK', id_na, '🇬🇱', true),
    ('Grenada', 'GD', 'GD', 'GRD', '+1-473', 'XCD', id_na, '🇬🇩', true),
    ('Guadeloupe', 'GP', 'GP', 'GLP', '+590', 'EUR', id_na, '🇬🇵', true),
    ('Guam', 'GU', 'GU', 'GUM', '+1-671', 'USD', id_oc, '🇬🇺', true),
    ('Guatemala', 'GT', 'GT', 'GTM', '+502', 'GTQ', id_na, '🇬🇹', true),
    ('Guernsey', 'GG', 'GG', 'GGY', '+44-1481', 'GBP', id_eu, '🇬🇬', true),
    ('Guinea', 'GN', 'GN', 'GIN', '+224', 'GNF', id_af, '🇬🇳', true),
    ('Guinea-Bissau', 'GW', 'GW', 'GNB', '+245', 'XOF', id_af, '🇬🇼', true),
    ('Guyana', 'GY', 'GY', 'GUY', '+592', 'GYD', id_sa, '🇬🇾', true),
    ('Haiti', 'HT', 'HT', 'HTI', '+509', 'HTG', id_na, '🇭🇹', true),
    ('Heard Island and McDonald Islands', 'HM', 'HM', 'HMD', '', 'AUD', id_an, '🇭🇲', true),
    ('Holy See (Vatican City State)', 'VA', 'VA', 'VAT', '+379', 'EUR', id_eu, '🇻🇦', true),
    ('Honduras', 'HN', 'HN', 'HND', '+504', 'HNL', id_na, '🇭🇳', true),
    ('Hong Kong', 'HK', 'HK', 'HKG', '+852', 'HKD', id_as, '🇭🇰', true),
    ('Hungary', 'HU', 'HU', 'HUN', '+36', 'HUF', id_eu, '🇭🇺', true),
    ('Iceland', 'IS', 'IS', 'ISL', '+354', 'ISK', id_eu, '🇮🇸', true),
    ('India', 'IN', 'IN', 'IND', '+91', 'INR', id_as, '🇮🇳', true),
    ('Indonesia', 'ID', 'ID', 'IDN', '+62', 'IDR', id_as, '🇮🇩', true),
    ('Iran', 'IR', 'IR', 'IRN', '+98', 'IRR', id_as, '🇮🇷', true),
    ('Iraq', 'IQ', 'IQ', 'IRQ', '+964', 'IQD', id_as, '🇮🇶', true),
    ('Ireland', 'IE', 'IE', 'IRL', '+353', 'EUR', id_eu, '🇮🇪', true),
    ('Isle of Man', 'IM', 'IM', 'IMN', '+44-1624', 'GBP', id_eu, '🇮🇲', true),
    ('Israel', 'IL', 'IL', 'ISR', '+972', 'ILS', id_as, '🇮🇱', true),
    ('Italy', 'IT', 'IT', 'ITA', '+39', 'EUR', id_eu, '🇮🇹', true),
    ('Jamaica', 'JM', 'JM', 'JAM', '+1-876', 'JMD', id_na, '🇯🇲', true),
    ('Japan', 'JP', 'JP', 'JPN', '+81', 'JPY', id_as, '🇯🇵', true),
    ('Jersey', 'JE', 'JE', 'JEY', '+44-1534', 'GBP', id_eu, '🇯🇪', true),
    ('Jordan', 'JO', 'JO', 'JOR', '+962', 'JOD', id_as, '🇯🇴', true),
    ('Kazakhstan', 'KZ', 'KZ', 'KAZ', '+7', 'KZT', id_as, '🇰🇿', true),
    ('Kenya', 'KE', 'KE', 'KEN', '+254', 'KES', id_af, '🇰🇪', true),
    ('Kiribati', 'KI', 'KI', 'KIR', '+686', 'AUD', id_oc, '🇰🇮', true),
    ('Korea, Democratic People''s Republic of', 'KP', 'KP', 'PRK', '+850', 'KPW', id_as, '🇰🇵', true),
    ('Korea, Republic of', 'KR', 'KR', 'KOR', '+82', 'KRW', id_as, '🇰🇷', true),
    ('Kuwait', 'KW', 'KW', 'KWT', '+965', 'KWD', id_as, '🇰🇼', true),
    ('Kyrgyzstan', 'KG', 'KG', 'KGZ', '+996', 'KGS', id_as, '🇰🇬', true),
    ('Lao People''s Democratic Republic', 'LA', 'LA', 'LAO', '+856', 'LAK', id_as, '🇱🇦', true),
    ('Latvia', 'LV', 'LV', 'LVA', '+371', 'EUR', id_eu, '🇱🇻', true),
    ('Lebanon', 'LB', 'LB', 'LBN', '+961', 'LBP', id_as, '🇱🇧', true),
    ('Lesotho', 'LS', 'LS', 'LSO', '+266', 'LSL', id_af, '🇱🇸', true),
    ('Liberia', 'LR', 'LR', 'LBR', '+231', 'LRD', id_af, '🇱🇷', true),
    ('Libya', 'LY', 'LY', 'LBY', '+218', 'LYD', id_af, '🇱🇾', true),
    ('Liechtenstein', 'LI', 'LI', 'LIE', '+423', 'CHF', id_eu, '🇱🇮', true),
    ('Lithuania', 'LT', 'LT', 'LTU', '+370', 'EUR', id_eu, '🇱🇹', true),
    ('Luxembourg', 'LU', 'LU', 'LUX', '+352', 'EUR', id_eu, '🇱🇺', true),
    ('Macao', 'MO', 'MO', 'MAC', '+853', 'MOP', id_as, '🇲🇴', true),
    ('Madagascar', 'MG', 'MG', 'MDG', '+261', 'MGA', id_af, '🇲🇬', true),
    ('Malawi', 'MW', 'MW', 'MWI', '+265', 'MWK', id_af, '🇲🇼', true),
    ('Malaysia', 'MY', 'MY', 'MYS', '+60', 'MYR', id_as, '🇲🇾', true),
    ('Maldives', 'MV', 'MV', 'MDV', '+960', 'MVR', id_as, '🇲🇻', true),
    ('Mali', 'ML', 'ML', 'MLI', '+223', 'XOF', id_af, '🇲🇱', true),
    ('Malta', 'MT', 'MT', 'MLT', '+356', 'EUR', id_eu, '🇲🇹', true),
    ('Marshall Islands', 'MH', 'MH', 'MHL', '+692', 'USD', id_oc, '🇲🇭', true),
    ('Martinique', 'MQ', 'MQ', 'MTQ', '+596', 'EUR', id_na, '🇲🇶', true),
    ('Mauritania', 'MR', 'MR', 'MRT', '+222', 'MRU', id_af, '🇲🇷', true),
    ('Mauritius', 'MU', 'MU', 'MUS', '+230', 'MUR', id_af, '🇲🇺', true),
    ('Mayotte', 'YT', 'YT', 'MYT', '+262', 'EUR', id_af, '🇾🇹', true),
    ('Mexico', 'MX', 'MX', 'MEX', '+52', 'MXN', id_na, '🇲🇽', true),
    ('Micronesia, Federated States of', 'FM', 'FM', 'FSM', '+691', 'USD', id_oc, '🇫🇲', true),
    ('Moldova', 'MD', 'MD', 'MDA', '+373', 'MDL', id_eu, '🇲🇩', true),
    ('Monaco', 'MC', 'MC', 'MCO', '+377', 'EUR', id_eu, '🇲🇨', true),
    ('Mongolia', 'MN', 'MN', 'MNG', '+976', 'MNT', id_as, '🇲🇳', true),
    ('Montenegro', 'ME', 'ME', 'MNE', '+382', 'EUR', id_eu, '🇲🇪', true),
    ('Montserrat', 'MS', 'MS', 'MSR', '+1-664', 'XCD', id_na, '🇲🇸', true),
    ('Morocco', 'MA', 'MA', 'MAR', '+212', 'MAD', id_af, '🇲🇦', true),
    ('Mozambique', 'MZ', 'MZ', 'MOZ', '+258', 'MZN', id_af, '🇲🇿', true),
    ('Myanmar', 'MM', 'MM', 'MMR', '+95', 'MMK', id_as, '🇲🇲', true),
    ('Namibia', 'NA', 'NA', 'NAM', '+264', 'NAD', id_af, '🇳🇦', true),
    ('Nauru', 'NR', 'NR', 'NRU', '+674', 'AUD', id_oc, '🇳🇷', true),
    ('Nepal', 'NP', 'NP', 'NPL', '+977', 'NPR', id_as, '🇳🇵', true),
    ('Netherlands', 'NL', 'NL', 'NLD', '+31', 'EUR', id_eu, '🇳🇱', true),
    ('New Caledonia', 'NC', 'NC', 'NCL', '+687', 'XPF', id_oc, '🇳🇨', true),
    ('New Zealand', 'NZ', 'NZ', 'NZL', '+64', 'NZD', id_oc, '🇳🇿', true),
    ('Nicaragua', 'NI', 'NI', 'NIC', '+505', 'NIO', id_na, '🇳🇮', true),
    ('Niger', 'NE', 'NE', 'NER', '+227', 'XOF', id_af, '🇳🇪', true),
    ('Nigeria', 'NG', 'NG', 'NGA', '+234', 'NGN', id_af, '🇳🇬', true),
    ('Niue', 'NU', 'NU', 'NIU', '+683', 'NZD', id_oc, '🇳🇺', true),
    ('Norfolk Island', 'NF', 'NF', 'NFK', '+672', 'AUD', id_oc, '🇳🇫', true),
    ('North Macedonia', 'MK', 'MK', 'MKD', '+389', 'MKD', id_eu, '🇲🇰', true),
    ('Northern Mariana Islands', 'MP', 'MP', 'MNP', '+1-670', 'USD', id_oc, '🇲🇵', true),
    ('Norway', 'NO', 'NO', 'NOR', '+47', 'NOK', id_eu, '🇳🇴', true),
    ('Oman', 'OM', 'OM', 'OMN', '+968', 'OMR', id_as, '🇴🇲', true),
    ('Pakistan', 'PK', 'PK', 'PAK', '+92', 'PKR', id_as, '🇵🇰', true),
    ('Palau', 'PW', 'PW', 'PLW', '+680', 'USD', id_oc, '🇵🇼', true),
    ('Palestine, State of', 'PS', 'PS', 'PSE', '+970', 'ILS', id_as, '🇵🇸', true),
    ('Panama', 'PA', 'PA', 'PAN', '+507', 'PAB', id_na, '🇵🇦', true),
    ('Papua New Guinea', 'PG', 'PG', 'PNG', '+675', 'PGK', id_oc, '🇵🇬', true),
    ('Paraguay', 'PY', 'PY', 'PRY', '+595', 'PYG', id_sa, '🇵🇾', true),
    ('Peru', 'PE', 'PE', 'PER', '+51', 'PEN', id_sa, '🇵🇪', true),
    ('Philippines', 'PH', 'PH', 'PHL', '+63', 'PHP', id_as, '🇵🇭', true),
    ('Pitcairn', 'PN', 'PN', 'PCN', '+64', 'NZD', id_oc, '🇵🇳', true),
    ('Poland', 'PL', 'PL', 'POL', '+48', 'PLN', id_eu, '🇵🇱', true),
    ('Portugal', 'PT', 'PT', 'PRT', '+351', 'EUR', id_eu, '🇵🇹', true),
    ('Puerto Rico', 'PR', 'PR', 'PRI', '+1-787', 'USD', id_na, '🇵🇷', true),
    ('Qatar', 'QA', 'QA', 'QAT', '+974', 'QAR', id_as, '🇶🇦', true),
    ('Réunion', 'RE', 'RE', 'REU', '+262', 'EUR', id_af, '🇷🇪', true),
    ('Romania', 'RO', 'RO', 'ROU', '+40', 'RON', id_eu, '🇷🇴', true),
    ('Russian Federation', 'RU', 'RU', 'RUS', '+7', 'RUB', id_eu, '🇷🇺', true),
    ('Rwanda', 'RW', 'RW', 'RWA', '+250', 'RWF', id_af, '🇷🇼', true),
    ('Saint Barthélemy', 'BL', 'BL', 'BLM', '+590', 'EUR', id_na, '🇧🇱', true),
    ('Saint Helena, Ascension and Tristan da Cunha', 'SH', 'SH', 'SHN', '+290', 'SHP', id_af, '🇸🇭', true),
    ('Saint Kitts and Nevis', 'KN', 'KN', 'KNA', '+1-869', 'XCD', id_na, '🇰🇳', true),
    ('Saint Lucia', 'LC', 'LC', 'LCA', '+1-758', 'XCD', id_na, '🇱🇨', true),
    ('Saint Martin (French part)', 'MF', 'MF', 'MAF', '+590', 'EUR', id_na, '🇲🇫', true),
    ('Saint Pierre and Miquelon', 'PM', 'PM', 'SPM', '+508', 'EUR', id_na, '🇵🇲', true),
    ('Saint Vincent and the Grenadines', 'VC', 'VC', 'VCT', '+1-784', 'XCD', id_na, '🇻🇨', true),
    ('Samoa', 'WS', 'WS', 'WSM', '+685', 'WST', id_oc, '🇼🇸', true),
    ('San Marino', 'SM', 'SM', 'SMR', '+378', 'EUR', id_eu, '🇸🇲', true),
    ('Sao Tome and Principe', 'ST', 'ST', 'STP', '+239', 'STN', id_af, '🇸🇹', true),
    ('Saudi Arabia', 'SA', 'SA', 'SAU', '+966', 'SAR', id_as, '🇸🇦', true),
    ('Senegal', 'SN', 'SN', 'SEN', '+221', 'XOF', id_af, '🇸🇳', true),
    ('Serbia', 'RS', 'RS', 'SRB', '+381', 'RSD', id_eu, '🇷🇸', true),
    ('Seychelles', 'SC', 'SC', 'SYC', '+248', 'SCR', id_af, '🇸🇨', true),
    ('Sierra Leone', 'SL', 'SL', 'SLE', '+232', 'SLL', id_af, '🇸🇱', true),
    ('Singapore', 'SG', 'SG', 'SGP', '+65', 'SGD', id_as, '🇸🇬', true),
    ('Sint Maarten (Dutch part)', 'SX', 'SX', 'SXM', '+1-721', 'ANG', id_na, '🇸🇽', true),
    ('Slovakia', 'SK', 'SK', 'SVK', '+421', 'EUR', id_eu, '🇸🇰', true),
    ('Slovenia', 'SI', 'SI', 'SVN', '+386', 'EUR', id_eu, '🇸🇮', true),
    ('Solomon Islands', 'SB', 'SB', 'SLB', '+677', 'SBD', id_oc, '🇸🇧', true),
    ('Somalia', 'SO', 'SO', 'SOM', '+252', 'SOS', id_af, '🇸🇴', true),
    ('South Africa', 'ZA', 'ZA', 'ZAF', '+27', 'ZAR', id_af, '🇿🇦', true),
    ('South Georgia and the South Sandwich Islands', 'GS', 'GS', 'SGS', '+500', 'GBP', id_an, '🇬🇸', true),
    ('South Sudan', 'SS', 'SS', 'SSD', '+211', 'SSP', id_af, '🇸🇸', true),
    ('Spain', 'ES', 'ES', 'ESP', '+34', 'EUR', id_eu, '🇪🇸', true),
    ('Sri Lanka', 'LK', 'LK', 'LKA', '+94', 'LKR', id_as, '🇱🇰', true),
    ('Sudan', 'SD', 'SD', 'SDN', '+249', 'SDG', id_af, '🇸🇩', true),
    ('Suriname', 'SR', 'SR', 'SUR', '+597', 'SRD', id_sa, '🇸🇷', true),
    ('Svalbard and Jan Mayen', 'SJ', 'SJ', 'SJM', '+47', 'NOK', id_eu, '🇸🇯', true),
    ('Sweden', 'SE', 'SE', 'SWE', '+46', 'SEK', id_eu, '🇸🇪', true),
    ('Switzerland', 'CH', 'CH', 'CHE', '+41', 'CHF', id_eu, '🇨🇭', true),
    ('Syrian Arab Republic', 'SY', 'SY', 'SYR', '+963', 'SYP', id_as, '🇸🇾', true),
    ('Taiwan', 'TW', 'TW', 'TWN', '+886', 'TWD', id_as, '🇹🇼', true),
    ('Tajikistan', 'TJ', 'TJ', 'TJK', '+992', 'TJS', id_as, '🇹🇯', true),
    ('Tanzania, United Republic of', 'TZ', 'TZ', 'TZA', '+255', 'TZS', id_af, '🇹🇿', true),
    ('Thailand', 'TH', 'TH', 'THA', '+66', 'THB', id_as, '🇹🇭', true),
    ('Timor-Leste', 'TL', 'TL', 'TLS', '+670', 'USD', id_as, '🇹🇱', true),
    ('Togo', 'TG', 'TG', 'TGO', '+228', 'XOF', id_af, '🇹🇬', true),
    ('Tokelau', 'TK', 'TK', 'TKL', '+690', 'NZD', id_oc, '🇹🇰', true),
    ('Tonga', 'TO', 'TO', 'TON', '+676', 'TOP', id_oc, '🇹🇴', true),
    ('Trinidad and Tobago', 'TT', 'TT', 'TTO', '+1-868', 'TTD', id_na, '🇹🇹', true),
    ('Tunisia', 'TN', 'TN', 'TUN', '+216', 'TND', id_af, '🇹🇳', true),
    ('Turkey', 'TR', 'TR', 'TUR', '+90', 'TRY', id_as, '🇹🇷', true),
    ('Turkmenistan', 'TM', 'TM', 'TKM', '+993', 'TMT', id_as, '🇹🇲', true),
    ('Turks and Caicos Islands', 'TC', 'TC', 'TCA', '+1-649', 'USD', id_na, '🇹🇨', true),
    ('Tuvalu', 'TV', 'TV', 'TUV', '+688', 'AUD', id_oc, '🇹🇻', true),
    ('Uganda', 'UG', 'UG', 'UGA', '+256', 'UGX', id_af, '🇺🇬', true),
    ('Ukraine', 'UA', 'UA', 'UKR', '+380', 'UAH', id_eu, '🇺🇦', true),
    ('United Arab Emirates', 'AE', 'AE', 'ARE', '+971', 'AED', id_as, '🇦🇪', true),
    ('United Kingdom', 'GB', 'GB', 'GBR', '+44', 'GBP', id_eu, '🇬🇧', true),
    ('United States', 'US', 'US', 'USA', '+1', 'USD', id_na, '🇺🇸', true),
    ('United States Minor Outlying Islands', 'UM', 'UM', 'UMI', '+1', 'USD', id_oc, '🇺🇲', true),
    ('Uruguay', 'UY', 'UY', 'URY', '+598', 'UYU', id_sa, '🇺🇾', true),
    ('Uzbekistan', 'UZ', 'UZ', 'UZB', '+998', 'UZS', id_as, '🇺🇿', true),
    ('Vanuatu', 'VU', 'VU', 'VUT', '+678', 'VUV', id_oc, '🇻🇺', true),
    ('Venezuela', 'VE', 'VE', 'VEN', '+58', 'VES', id_sa, '🇻🇪', true),
    ('Viet Nam', 'VN', 'VN', 'VNM', '+84', 'VND', id_as, '🇻🇳', true),
    ('Virgin Islands, British', 'VG', 'VG', 'VGB', '+1-284', 'USD', id_na, '🇻🇬', true),
    ('Virgin Islands, U.S.', 'VI', 'VI', 'VIR', '+1-340', 'USD', id_na, '🇻6', true),
    ('Wallis and Futuna', 'WF', 'WF', 'WLF', '+681', 'XPF', id_oc, '🇼🇫', true),
    ('Western Sahara', 'EH', 'EH', 'ESH', '+212', 'MAD', id_af, '🇪🇭', true),
    ('Yemen', 'YE', 'YE', 'YEM', '+967', 'YER', id_as, '🇾🇪', true),
    ('Zambia', 'ZM', 'ZM', 'ZMB', '+260', 'ZMW', id_af, '🇿🇲', true),
    ('Zimbabwe', 'ZW', 'ZW', 'ZWE', '+263', 'ZWL', id_af, '🇿🇼', true)
    ON CONFLICT (iso_code_2) DO UPDATE SET 
        name = EXCLUDED.name, code = EXCLUDED.code, iso_code_3 = EXCLUDED.iso_code_3, phone_code = EXCLUDED.phone_code, 
        currency_code = EXCLUDED.currency_code, continent_id = EXCLUDED.continent_id, flag_emoji = EXCLUDED.flag_emoji, is_active = true;

    -- MEMBERSHIPS (EU, ASEAN, etc.)
    SELECT id INTO block_eu_id FROM public.regional_blocks WHERE code = 'EU';
    SELECT id INTO block_asean_id FROM public.regional_blocks WHERE code = 'ASEAN';
    SELECT id INTO block_au_id FROM public.regional_blocks WHERE code = 'AU';
    SELECT id INTO block_mercosur_id FROM public.regional_blocks WHERE code = 'MERCOSUR';
    SELECT id INTO block_usmca_id FROM public.regional_blocks WHERE code = 'USMCA';

    -- 1. EU MEMBERS (Using 'full' membership type)
    INSERT INTO public.country_regional_blocks (country_id, regional_block_id, membership_type, is_active)
    SELECT id, block_eu_id, 'full', true
    FROM public.countries
    WHERE iso_code_2 IN ('AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE')
    ON CONFLICT DO NOTHING;

    -- 2. USMCA
    INSERT INTO public.country_regional_blocks (country_id, regional_block_id, membership_type, is_active)
    SELECT id, block_usmca_id, 'full', true
    FROM public.countries
    WHERE iso_code_2 IN ('US', 'MX', 'CA')
    ON CONFLICT DO NOTHING;

    -- 3. MERCOSUR
    INSERT INTO public.country_regional_blocks (country_id, regional_block_id, membership_type, is_active)
    SELECT id, block_mercosur_id, 'full', true
    FROM public.countries
    WHERE iso_code_2 IN ('AR', 'BR', 'PY', 'UY')
    ON CONFLICT DO NOTHING;

    -- 4. ASEAN
    INSERT INTO public.country_regional_blocks (country_id, regional_block_id, membership_type, is_active)
    SELECT id, block_asean_id, 'full', true
    FROM public.countries
    WHERE iso_code_2 IN ('BN', 'KH', 'ID', 'LA', 'MY', 'MM', 'PH', 'SG', 'TH', 'VN')
    ON CONFLICT DO NOTHING;

    -- 5. AU (Approximate African List)
    INSERT INTO public.country_regional_blocks (country_id, regional_block_id, membership_type, is_active)
    SELECT id, block_au_id, 'full', true
    FROM public.countries
    WHERE continent_id = id_af
    ON CONFLICT DO NOTHING;
    
END $$;
