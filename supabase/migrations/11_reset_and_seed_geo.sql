-- ============================================================================
-- MASTER RESET & SEED SCRIPT (SAFE FOR LOCALES)
-- ============================================================================

-- 0. ENSURE TABLES EXIST
CREATE TABLE IF NOT EXISTS languages (
    iso_code CHAR(2) PRIMARY KEY,
    name TEXT NOT NULL,
    native_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS country_languages (
    country_id UUID REFERENCES countries(id) ON DELETE CASCADE,
    language_code CHAR(2) REFERENCES languages(iso_code) ON DELETE CASCADE,
    is_official BOOLEAN DEFAULT false,
    is_primary BOOLEAN DEFAULT false,
    PRIMARY KEY (country_id, language_code)
);

-- 1. CLEANUP (Remove all geo data including locales for consistency)
TRUNCATE TABLE countries, regions, cities, languages, country_languages, locales CASCADE;

-- 2. SEED CONTINENTS
DO $$
DECLARE
    default_continent_id UUID;
BEGIN
    -- Ensure a default continent exists
    INSERT INTO continents (name, code) 
    VALUES ('Global', 'GL')
    ON CONFLICT DO NOTHING;
    
    SELECT id INTO default_continent_id FROM continents WHERE code = 'GL' LIMIT 1;

    -- 3. SEED COUNTRIES
    INSERT INTO countries (name, code, iso_code_2, iso_code_3, continent_id, flag_url) VALUES
    ('Afghanistan', 'AF', 'AF', 'AFG', default_continent_id, 'https://flagcdn.com/w320/af.png'),
    ('Albania', 'AL', 'AL', 'ALB', default_continent_id, 'https://flagcdn.com/w320/al.png'),
    ('Algeria', 'DZ', 'DZ', 'DZA', default_continent_id, 'https://flagcdn.com/w320/dz.png'),
    ('Andorra', 'AD', 'AD', 'AND', default_continent_id, 'https://flagcdn.com/w320/ad.png'),
    ('Angola', 'AO', 'AO', 'AGO', default_continent_id, 'https://flagcdn.com/w320/ao.png'),
    ('Antigua and Barbuda', 'AG', 'AG', 'ATG', default_continent_id, 'https://flagcdn.com/w320/ag.png'),
    ('Argentina', 'AR', 'AR', 'ARG', default_continent_id, 'https://flagcdn.com/w320/ar.png'),
    ('Armenia', 'AM', 'AM', 'ARM', default_continent_id, 'https://flagcdn.com/w320/am.png'),
    ('Australia', 'AU', 'AU', 'AUS', default_continent_id, 'https://flagcdn.com/w320/au.png'),
    ('Austria', 'AT', 'AT', 'AUT', default_continent_id, 'https://flagcdn.com/w320/at.png'),
    ('Azerbaijan', 'AZ', 'AZ', 'AZE', default_continent_id, 'https://flagcdn.com/w320/az.png'),
    ('Bahamas', 'BS', 'BS', 'BHS', default_continent_id, 'https://flagcdn.com/w320/bs.png'),
    ('Bahrain', 'BH', 'BH', 'BHR', default_continent_id, 'https://flagcdn.com/w320/bh.png'),
    ('Bangladesh', 'BD', 'BD', 'BGD', default_continent_id, 'https://flagcdn.com/w320/bd.png'),
    ('Barbados', 'BB', 'BB', 'BRB', default_continent_id, 'https://flagcdn.com/w320/bb.png'),
    ('Belarus', 'BY', 'BY', 'BLR', default_continent_id, 'https://flagcdn.com/w320/by.png'),
    ('Belgium', 'BE', 'BE', 'BEL', default_continent_id, 'https://flagcdn.com/w320/be.png'),
    ('Belize', 'BZ', 'BZ', 'BLZ', default_continent_id, 'https://flagcdn.com/w320/bz.png'),
    ('Benin', 'BJ', 'BJ', 'BEN', default_continent_id, 'https://flagcdn.com/w320/bj.png'),
    ('Bhutan', 'BT', 'BT', 'BTN', default_continent_id, 'https://flagcdn.com/w320/bt.png'),
    ('Bolivia', 'BO', 'BO', 'BOL', default_continent_id, 'https://flagcdn.com/w320/bo.png'),
    ('Bosnia and Herzegovina', 'BA', 'BA', 'BIH', default_continent_id, 'https://flagcdn.com/w320/ba.png'),
    ('Botswana', 'BW', 'BW', 'BWA', default_continent_id, 'https://flagcdn.com/w320/bw.png'),
    ('Brazil', 'BR', 'BR', 'BRA', default_continent_id, 'https://flagcdn.com/w320/br.png'),
    ('Brunei', 'BN', 'BN', 'BRN', default_continent_id, 'https://flagcdn.com/w320/bn.png'),
    ('Bulgaria', 'BG', 'BG', 'BGR', default_continent_id, 'https://flagcdn.com/w320/bg.png'),
    ('Burkina Faso', 'BF', 'BF', 'BFA', default_continent_id, 'https://flagcdn.com/w320/bf.png'),
    ('Burundi', 'BI', 'BI', 'BDI', default_continent_id, 'https://flagcdn.com/w320/bi.png'),
    ('Cabo Verde', 'CV', 'CV', 'CPV', default_continent_id, 'https://flagcdn.com/w320/cv.png'),
    ('Cambodia', 'KH', 'KH', 'KHM', default_continent_id, 'https://flagcdn.com/w320/kh.png'),
    ('Cameroon', 'CM', 'CM', 'CMR', default_continent_id, 'https://flagcdn.com/w320/cm.png'),
    ('Canada', 'CA', 'CA', 'CAN', default_continent_id, 'https://flagcdn.com/w320/ca.png'),
    ('Central African Republic', 'CF', 'CF', 'CAF', default_continent_id, 'https://flagcdn.com/w320/cf.png'),
    ('Chad', 'TD', 'TD', 'TCD', default_continent_id, 'https://flagcdn.com/w320/td.png'),
    ('Chile', 'CL', 'CL', 'CHL', default_continent_id, 'https://flagcdn.com/w320/cl.png'),
    ('China', 'CN', 'CN', 'CHN', default_continent_id, 'https://flagcdn.com/w320/cn.png'),
    ('Colombia', 'CO', 'CO', 'COL', default_continent_id, 'https://flagcdn.com/w320/co.png'),
    ('Comoros', 'KM', 'KM', 'COM', default_continent_id, 'https://flagcdn.com/w320/km.png'),
    ('Congo (Congo-Brazzaville)', 'CG', 'CG', 'COG', default_continent_id, 'https://flagcdn.com/w320/cg.png'),
    ('Costa Rica', 'CR', 'CR', 'CRI', default_continent_id, 'https://flagcdn.com/w320/cr.png'),
    ('Croatia', 'HR', 'HR', 'HRV', default_continent_id, 'https://flagcdn.com/w320/hr.png'),
    ('Cuba', 'CU', 'CU', 'CUB', default_continent_id, 'https://flagcdn.com/w320/cu.png'),
    ('Cyprus', 'CY', 'CY', 'CYP', default_continent_id, 'https://flagcdn.com/w320/cy.png'),
    ('Czechia (Czech Republic)', 'CZ', 'CZ', 'CZE', default_continent_id, 'https://flagcdn.com/w320/cz.png'),
    ('Democratic Republic of the Congo', 'CD', 'CD', 'COD', default_continent_id, 'https://flagcdn.com/w320/cd.png'),
    ('Denmark', 'DK', 'DK', 'DNK', default_continent_id, 'https://flagcdn.com/w320/dk.png'),
    ('Djibouti', 'DJ', 'DJ', 'DJI', default_continent_id, 'https://flagcdn.com/w320/dj.png'),
    ('Dominica', 'DM', 'DM', 'DMA', default_continent_id, 'https://flagcdn.com/w320/dm.png'),
    ('Dominican Republic', 'DO', 'DO', 'DOM', default_continent_id, 'https://flagcdn.com/w320/do.png'),
    ('Ecuador', 'EC', 'EC', 'ECU', default_continent_id, 'https://flagcdn.com/w320/ec.png'),
    ('Egypt', 'EG', 'EG', 'EGY', default_continent_id, 'https://flagcdn.com/w320/eg.png'),
    ('El Salvador', 'SV', 'SV', 'SLV', default_continent_id, 'https://flagcdn.com/w320/sv.png'),
    ('Equatorial Guinea', 'GQ', 'GQ', 'GNQ', default_continent_id, 'https://flagcdn.com/w320/gq.png'),
    ('Eritrea', 'ER', 'ER', 'ERI', default_continent_id, 'https://flagcdn.com/w320/er.png'),
    ('Estonia', 'EE', 'EE', 'EST', default_continent_id, 'https://flagcdn.com/w320/ee.png'),
    ('Eswatini (fmr. "Swaziland")', 'SZ', 'SZ', 'SWZ', default_continent_id, 'https://flagcdn.com/w320/sz.png'),
    ('Ethiopia', 'ET', 'ET', 'ETH', default_continent_id, 'https://flagcdn.com/w320/et.png'),
    ('Fiji', 'FJ', 'FJ', 'FJI', default_continent_id, 'https://flagcdn.com/w320/fj.png'),
    ('Finland', 'FI', 'FI', 'FIN', default_continent_id, 'https://flagcdn.com/w320/fi.png'),
    ('France', 'FR', 'FR', 'FRA', default_continent_id, 'https://flagcdn.com/w320/fr.png'),
    ('Gabon', 'GA', 'GA', 'GAB', default_continent_id, 'https://flagcdn.com/w320/ga.png'),
    ('Gambia', 'GM', 'GM', 'GMB', default_continent_id, 'https://flagcdn.com/w320/gm.png'),
    ('Georgia', 'GE', 'GE', 'GEO', default_continent_id, 'https://flagcdn.com/w320/ge.png'),
    ('Germany', 'DE', 'DE', 'DEU', default_continent_id, 'https://flagcdn.com/w320/de.png'),
    ('Ghana', 'GH', 'GH', 'GHA', default_continent_id, 'https://flagcdn.com/w320/gh.png'),
    ('Greece', 'GR', 'GR', 'GRC', default_continent_id, 'https://flagcdn.com/w320/gr.png'),
    ('Grenada', 'GD', 'GD', 'GRD', default_continent_id, 'https://flagcdn.com/w320/gd.png'),
    ('Guatemala', 'GT', 'GT', 'GTM', default_continent_id, 'https://flagcdn.com/w320/gt.png'),
    ('Guinea', 'GN', 'GN', 'GIN', default_continent_id, 'https://flagcdn.com/w320/gn.png'),
    ('Guinea-Bissau', 'GW', 'GW', 'GNB', default_continent_id, 'https://flagcdn.com/w320/gw.png'),
    ('Guyana', 'GY', 'GY', 'GUY', default_continent_id, 'https://flagcdn.com/w320/gy.png'),
    ('Haiti', 'HT', 'HT', 'HTI', default_continent_id, 'https://flagcdn.com/w320/ht.png'),
    ('Holy See', 'VA', 'VA', 'VAT', default_continent_id, 'https://flagcdn.com/w320/va.png'),
    ('Honduras', 'HN', 'HN', 'HND', default_continent_id, 'https://flagcdn.com/w320/hn.png'),
    ('Hungary', 'HU', 'HU', 'HUN', default_continent_id, 'https://flagcdn.com/w320/hu.png'),
    ('Iceland', 'IS', 'IS', 'ISL', default_continent_id, 'https://flagcdn.com/w320/is.png'),
    ('India', 'IN', 'IN', 'IND', default_continent_id, 'https://flagcdn.com/w320/in.png'),
    ('Indonesia', 'ID', 'ID', 'IDN', default_continent_id, 'https://flagcdn.com/w320/id.png'),
    ('Iran', 'IR', 'IR', 'IRN', default_continent_id, 'https://flagcdn.com/w320/ir.png'),
    ('Iraq', 'IQ', 'IQ', 'IRQ', default_continent_id, 'https://flagcdn.com/w320/iq.png'),
    ('Ireland', 'IE', 'IE', 'IRL', default_continent_id, 'https://flagcdn.com/w320/ie.png'),
    ('Israel', 'IL', 'IL', 'ISR', default_continent_id, 'https://flagcdn.com/w320/il.png'),
    ('Italy', 'IT', 'IT', 'ITA', default_continent_id, 'https://flagcdn.com/w320/it.png'),
    ('Jamaica', 'JM', 'JM', 'JAM', default_continent_id, 'https://flagcdn.com/w320/jm.png'),
    ('Japan', 'JP', 'JP', 'JPN', default_continent_id, 'https://flagcdn.com/w320/jp.png'),
    ('Jordan', 'JO', 'JO', 'JOR', default_continent_id, 'https://flagcdn.com/w320/jo.png'),
    ('Kazakhstan', 'KZ', 'KZ', 'KAZ', default_continent_id, 'https://flagcdn.com/w320/kz.png'),
    ('Kenya', 'KE', 'KE', 'KEN', default_continent_id, 'https://flagcdn.com/w320/ke.png'),
    ('Kiribati', 'KI', 'KI', 'KIR', default_continent_id, 'https://flagcdn.com/w320/ki.png'),
    ('Kuwait', 'KW', 'KW', 'KWT', default_continent_id, 'https://flagcdn.com/w320/kw.png'),
    ('Kyrgyzstan', 'KG', 'KG', 'KGZ', default_continent_id, 'https://flagcdn.com/w320/kg.png'),
    ('Laos', 'LA', 'LA', 'LAO', default_continent_id, 'https://flagcdn.com/w320/la.png'),
    ('Latvia', 'LV', 'LV', 'LVA', default_continent_id, 'https://flagcdn.com/w320/lv.png'),
    ('Lebanon', 'LB', 'LB', 'LBN', default_continent_id, 'https://flagcdn.com/w320/lb.png'),
    ('Lesotho', 'LS', 'LS', 'LSO', default_continent_id, 'https://flagcdn.com/w320/ls.png'),
    ('Liberia', 'LR', 'LR', 'LBR', default_continent_id, 'https://flagcdn.com/w320/lr.png'),
    ('Libya', 'LY', 'LY', 'LBY', default_continent_id, 'https://flagcdn.com/w320/ly.png'),
    ('Liechtenstein', 'LI', 'LI', 'LIE', default_continent_id, 'https://flagcdn.com/w320/li.png'),
    ('Lithuania', 'LT', 'LT', 'LTU', default_continent_id, 'https://flagcdn.com/w320/lt.png'),
    ('Luxembourg', 'LU', 'LU', 'LUX', default_continent_id, 'https://flagcdn.com/w320/lu.png'),
    ('Madagascar', 'MG', 'MG', 'MDG', default_continent_id, 'https://flagcdn.com/w320/mg.png'),
    ('Malawi', 'MW', 'MW', 'MWI', default_continent_id, 'https://flagcdn.com/w320/mw.png'),
    ('Malaysia', 'MY', 'MY', 'MYS', default_continent_id, 'https://flagcdn.com/w320/my.png'),
    ('Maldives', 'MV', 'MV', 'MDV', default_continent_id, 'https://flagcdn.com/w320/mv.png'),
    ('Mali', 'ML', 'ML', 'MLI', default_continent_id, 'https://flagcdn.com/w320/ml.png'),
    ('Malta', 'MT', 'MT', 'MLT', default_continent_id, 'https://flagcdn.com/w320/mt.png'),
    ('Marshall Islands', 'MH', 'MH', 'MHL', default_continent_id, 'https://flagcdn.com/w320/mh.png'),
    ('Mauritania', 'MR', 'MR', 'MRT', default_continent_id, 'https://flagcdn.com/w320/mr.png'),
    ('Mauritius', 'MU', 'MU', 'MUS', default_continent_id, 'https://flagcdn.com/w320/mu.png'),
    ('Mexico', 'MX', 'MX', 'MEX', default_continent_id, 'https://flagcdn.com/w320/mx.png'),
    ('Micronesia', 'FM', 'FM', 'FSM', default_continent_id, 'https://flagcdn.com/w320/fm.png'),
    ('Moldova', 'MD', 'MD', 'MDA', default_continent_id, 'https://flagcdn.com/w320/md.png'),
    ('Monaco', 'MC', 'MC', 'MCO', default_continent_id, 'https://flagcdn.com/w320/mc.png'),
    ('Mongolia', 'MN', 'MN', 'MNG', default_continent_id, 'https://flagcdn.com/w320/mn.png'),
    ('Montenegro', 'ME', 'ME', 'MNE', default_continent_id, 'https://flagcdn.com/w320/me.png'),
    ('Morocco', 'MA', 'MA', 'MAR', default_continent_id, 'https://flagcdn.com/w320/ma.png'),
    ('Mozambique', 'MZ', 'MZ', 'MOZ', default_continent_id, 'https://flagcdn.com/w320/moz.png'),
    ('Myanmar (formerly Burma)', 'MM', 'MM', 'MMR', default_continent_id, 'https://flagcdn.com/w320/mm.png'),
    ('Namibia', 'NA', 'NA', 'NAM', default_continent_id, 'https://flagcdn.com/w320/na.png'),
    ('Nauru', 'NR', 'NR', 'NRU', default_continent_id, 'https://flagcdn.com/w320/nr.png'),
    ('Nepal', 'NP', 'NP', 'NPL', default_continent_id, 'https://flagcdn.com/w320/np.png'),
    ('Netherlands', 'NL', 'NL', 'NLD', default_continent_id, 'https://flagcdn.com/w320/nl.png'),
    ('New Zealand', 'NZ', 'NZ', 'NZL', default_continent_id, 'https://flagcdn.com/w320/nz.png'),
    ('Nicaragua', 'NI', 'NI', 'NIC', default_continent_id, 'https://flagcdn.com/w320/ni.png'),
    ('Niger', 'NE', 'NE', 'NER', default_continent_id, 'https://flagcdn.com/w320/ne.png'),
    ('Nigeria', 'NG', 'NG', 'NGA', default_continent_id, 'https://flagcdn.com/w320/ng.png'),
    ('North Korea', 'KP', 'KP', 'PRK', default_continent_id, 'https://flagcdn.com/w320/kp.png'),
    ('North Macedonia', 'MK', 'MK', 'MKD', default_continent_id, 'https://flagcdn.com/w320/mk.png'),
    ('Norway', 'NO', 'NO', 'NOR', default_continent_id, 'https://flagcdn.com/w320/no.png'),
    ('Oman', 'OM', 'OM', 'OMN', default_continent_id, 'https://flagcdn.com/w320/om.png'),
    ('Pakistan', 'PK', 'PK', 'PAK', default_continent_id, 'https://flagcdn.com/w320/pk.png'),
    ('Palau', 'PW', 'PW', 'PLW', default_continent_id, 'https://flagcdn.com/w320/pw.png'),
    ('Palestine State', 'PS', 'PS', 'PSE', default_continent_id, 'https://flagcdn.com/w320/ps.png'),
    ('Panama', 'PA', 'PA', 'PAN', default_continent_id, 'https://flagcdn.com/w320/pa.png'),
    ('Papua New Guinea', 'PG', 'PG', 'PNG', default_continent_id, 'https://flagcdn.com/w320/pg.png'),
    ('Paraguay', 'PY', 'PY', 'PRY', default_continent_id, 'https://flagcdn.com/w320/py.png'),
    ('Peru', 'PE', 'PE', 'PER', default_continent_id, 'https://flagcdn.com/w320/pe.png'),
    ('Philippines', 'PH', 'PH', 'PHL', default_continent_id, 'https://flagcdn.com/w320/ph.png'),
    ('Poland', 'PL', 'PL', 'POL', default_continent_id, 'https://flagcdn.com/w320/pl.png'),
    ('Portugal', 'PT', 'PT', 'PRT', default_continent_id, 'https://flagcdn.com/w320/pt.png'),
    ('Qatar', 'QA', 'QA', 'QAT', default_continent_id, 'https://flagcdn.com/w320/qa.png'),
    ('Romania', 'RO', 'RO', 'ROU', default_continent_id, 'https://flagcdn.com/w320/ro.png'),
    ('Russia', 'RU', 'RU', 'RUS', default_continent_id, 'https://flagcdn.com/w320/ru.png'),
    ('Rwanda', 'RW', 'RW', 'RWA', default_continent_id, 'https://flagcdn.com/w320/rw.png'),
    ('Saint Kitts and Nevis', 'KN', 'KN', 'KNA', default_continent_id, 'https://flagcdn.com/w320/kn.png'),
    ('Saint Lucia', 'LC', 'LC', 'LCA', default_continent_id, 'https://flagcdn.com/w320/lc.png'),
    ('Saint Vincent and the Grenadines', 'VC', 'VC', 'VCT', default_continent_id, 'https://flagcdn.com/w320/vc.png'),
    ('Samoa', 'WS', 'WS', 'WSM', default_continent_id, 'https://flagcdn.com/w320/ws.png'),
    ('San Marino', 'SM', 'SM', 'SMR', default_continent_id, 'https://flagcdn.com/w320/sm.png'),
    ('Sao Tome and Principe', 'ST', 'ST', 'STP', default_continent_id, 'https://flagcdn.com/w320/st.png'),
    ('Saudi Arabia', 'SA', 'SA', 'SAU', default_continent_id, 'https://flagcdn.com/w320/sa.png'),
    ('Senegal', 'SN', 'SN', 'SEN', default_continent_id, 'https://flagcdn.com/w320/sn.png'),
    ('Serbia', 'RS', 'RS', 'SRB', default_continent_id, 'https://flagcdn.com/w320/rs.png'),
    ('Seychelles', 'SC', 'SC', 'SYC', default_continent_id, 'https://flagcdn.com/w320/sc.png'),
    ('Sierra Leone', 'SL', 'SL', 'SLE', default_continent_id, 'https://flagcdn.com/w320/sl.png'),
    ('Singapore', 'SG', 'SG', 'SGP', default_continent_id, 'https://flagcdn.com/w320/sg.png'),
    ('Slovakia', 'SK', 'SK', 'SVK', default_continent_id, 'https://flagcdn.com/w320/sk.png'),
    ('Slovenia', 'SI', 'SI', 'SVN', default_continent_id, 'https://flagcdn.com/w320/si.png'),
    ('Solomon Islands', 'SB', 'SB', 'SLB', default_continent_id, 'https://flagcdn.com/w320/sb.png'),
    ('Somalia', 'SO', 'SO', 'SOM', default_continent_id, 'https://flagcdn.com/w320/so.png'),
    ('South Africa', 'ZA', 'ZA', 'ZAF', default_continent_id, 'https://flagcdn.com/w320/za.png'),
    ('South Korea', 'KR', 'KR', 'KOR', default_continent_id, 'https://flagcdn.com/w320/kr.png'),
    ('South Sudan', 'SS', 'SS', 'SSD', default_continent_id, 'https://flagcdn.com/w320/ss.png'),
    ('Spain', 'ES', 'ES', 'ESP', default_continent_id, 'https://flagcdn.com/w320/es.png'),
    ('Sri Lanka', 'LK', 'LK', 'LKA', default_continent_id, 'https://flagcdn.com/w320/lk.png'),
    ('Sudan', 'SD', 'SD', 'SDN', default_continent_id, 'https://flagcdn.com/w320/sd.png'),
    ('Suriname', 'SR', 'SR', 'SUR', default_continent_id, 'https://flagcdn.com/w320/sr.png'),
    ('Sweden', 'SE', 'SE', 'SWE', default_continent_id, 'https://flagcdn.com/w320/se.png'),
    ('Switzerland', 'CH', 'CH', 'CHE', default_continent_id, 'https://flagcdn.com/w320/ch.png'),
    ('Syria', 'SY', 'SY', 'SYR', default_continent_id, 'https://flagcdn.com/w320/sy.png'),
    ('Tajikistan', 'TJ', 'TJ', 'TJK', default_continent_id, 'https://flagcdn.com/w320/tj.png'),
    ('Tanzania', 'TZ', 'TZ', 'TZA', default_continent_id, 'https://flagcdn.com/w320/tz.png'),
    ('Thailand', 'TH', 'TH', 'THA', default_continent_id, 'https://flagcdn.com/w320/th.png'),
    ('Timor-Leste', 'TL', 'TL', 'TLS', default_continent_id, 'https://flagcdn.com/w320/tl.png'),
    ('Togo', 'TG', 'TG', 'TGO', default_continent_id, 'https://flagcdn.com/w320/tg.png'),
    ('Tonga', 'TO', 'TO', 'TON', default_continent_id, 'https://flagcdn.com/w320/to.png'),
    ('Trinidad and Tobago', 'TT', 'TT', 'TTO', default_continent_id, 'https://flagcdn.com/w320/tt.png'),
    ('Tunisia', 'TN', 'TN', 'TUN', default_continent_id, 'https://flagcdn.com/w320/tn.png'),
    ('Turkey', 'TR', 'TR', 'TUR', default_continent_id, 'https://flagcdn.com/w320/tr.png'),
    ('Turkmenistan', 'TM', 'TM', 'TKM', default_continent_id, 'https://flagcdn.com/w320/tm.png'),
    ('Tuvalu', 'TV', 'TV', 'TUV', default_continent_id, 'https://flagcdn.com/w320/tv.png'),
    ('Uganda', 'UG', 'UG', 'UGA', default_continent_id, 'https://flagcdn.com/w320/ug.png'),
    ('Ukraine', 'UA', 'UA', 'UKR', default_continent_id, 'https://flagcdn.com/w320/ua.png'),
    ('United Arab Emirates', 'AE', 'AE', 'ARE', default_continent_id, 'https://flagcdn.com/w320/ae.png'),
    ('United Kingdom', 'GB', 'GB', 'GBR', default_continent_id, 'https://flagcdn.com/w320/gb.png'),
    ('United States of America', 'US', 'US', 'USA', default_continent_id, 'https://flagcdn.com/w320/us.png'),
    ('Uruguay', 'UY', 'UY', 'URY', default_continent_id, 'https://flagcdn.com/w320/uy.png'),
    ('Uzbekistan', 'UZ', 'UZ', 'UZB', default_continent_id, 'https://flagcdn.com/w320/uz.png'),
    ('Vanuatu', 'VU', 'VU', 'VUT', default_continent_id, 'https://flagcdn.com/w320/vu.png'),
    ('Venezuela', 'VE', 'VE', 'VEN', default_continent_id, 'https://flagcdn.com/w320/ve.png'),
    ('Vietnam', 'VN', 'VN', 'VNM', default_continent_id, 'https://flagcdn.com/w320/vn.png'),
    ('Yemen', 'YE', 'YE', 'YEM', default_continent_id, 'https://flagcdn.com/w320/ye.png'),
    ('Zambia', 'ZM', 'ZM', 'ZMB', default_continent_id, 'https://flagcdn.com/w320/zm.png'),
    ('Zimbabwe', 'ZW', 'ZW', 'ZWE', default_continent_id, 'https://flagcdn.com/w320/zw.png')
    ON CONFLICT (name) DO NOTHING;
END $$;

-- 4. SEED REGIONS (US Example)
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

-- 5. SEED CITIES (US Major Cities)
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

-- 6. SEED LANGUAGES
INSERT INTO languages (iso_code, name, native_name) VALUES
('aa', 'Afar', 'Afaraf'),
('ab', 'Abkhazian', 'аҧсуа бызшәа'),
('ae', 'Avestan', 'avesta'),
('af', 'Afrikaans', 'Afrikaans'),
('ak', 'Akan', 'Akan'),
('am', 'Amharic', 'አማርኛ'),
('an', 'Aragonese', 'aragonés'),
('ar', 'Arabic', 'العربية'),
('as', 'Assamese', 'অসমীয়া'),
('av', 'Avaric', 'авар мацӀ'),
('ay', 'Aymara', 'aymar aru'),
('az', 'Azerbaijani', 'azərbaycan dili'),
('ba', 'Bashkir', 'башҡорт теле'),
('be', 'Belarusian', 'беларуская мова'),
('bg', 'Bulgarian', 'български език'),
('bh', 'Bihari', 'भोजपुरी'),
('bi', 'Bislama', 'Bislama'),
('bm', 'Bambara', 'bamanankan'),
('bn', 'Bengali', 'বাংলা'),
('bo', 'Tibetan', 'བོད་ཡིག'),
('br', 'Breton', 'brezhoneg'),
('bs', 'Bosnian', 'bosanski jezik'),
('ca', 'Catalan', 'català'),
('ce', 'Chechen', 'нохчийн мотт'),
('ch', 'Chamorro', 'Chamoru'),
('co', 'Corsican', 'corsu'),
('cr', 'Cree', 'ᓀᐦᐃᔭᏪ운'),
('cs', 'Czech', 'čeština'),
('cu', 'Church Slavic', 'сѣвѣрьнословѣньскъ ѩꙁꙑкъ'),
('cv', 'Chuvash', 'чӑваш чӗлхи'),
('cy', 'Welsh', 'Cymraeg'),
('da', 'Danish', 'dansk'),
('de', 'German', 'Deutsch'),
('dv', 'Divehi', 'ދިވެހި'),
('dz', 'Dzongkha', 'རྫོང་ཁ'),
('ee', 'Ewe', 'Eʋegbe'),
('el', 'Greek', 'ελληνικά'),
('en', 'English', 'English'),
('eo', 'Esperanto', 'Esperanto'),
('es', 'Spanish', 'Español'),
('et', 'Estonian', 'eesti'),
('eu', 'Basque', 'euskara'),
('fa', 'Persian', 'فارسی'),
('ff', 'Fulah', 'Fulfulde'),
('fi', 'Finnish', 'suomi'),
('fj', 'Fijian', 'vosa Vakaviti'),
('fo', 'Faroese', 'føroyskt'),
('fr', 'French', 'Français'),
('fy', 'Western Frisian', 'Frysk'),
('ga', 'Irish', 'Gaeilge'),
('gd', 'Gaelic', 'Gàidhlig'),
('gl', 'Galician', 'galego'),
('gn', 'Guarani', 'Avañe''ẽ'),
('gu', 'Gujarati', 'ગુજરાતી'),
('gv', 'Manx', 'Gaelg'),
('ha', 'Hausa', 'Hausa'),
('he', 'Hebrew', 'עברית'),
('hi', 'Hindi', 'हिन्दी'),
('ho', 'Hiri Motu', 'Hiri Motu'),
('hr', 'Croatian', 'hrvatski jezik'),
('ht', 'Haitian', 'Kreyòl ayisyen'),
('hu', 'Hungarian', 'magyar'),
('hy', 'Armenian', 'Հայերեն'),
('hz', 'Herero', 'Otjiherero'),
('ia', 'Interlingua', 'Interlingua'),
('id', 'Indonesian', 'Bahasa Indonesia'),
('ie', 'Interlingue', 'Interlingue'),
('ig', 'Igbo', 'Asụsụ Igbo'),
('ii', 'Sichuan Yi', 'ꆈꌠ꒿ Nuosuhxop'),
('ik', 'Inupiaq', 'Iñupiaq'),
('io', 'Ido', 'Ido'),
('is', 'Icelandic', 'Íslenska'),
('it', 'Italian', 'Italiano'),
('iu', 'Inuktitut', 'ᐃᓄᒃᑎᑐᑦ'),
('ja', 'Japanese', '日本語'),
('jv', 'Javanese', 'Basa Jawa'),
('ka', 'Georgian', 'ქართული'),
('kg', 'Kongo', 'Kikongo'),
('ki', 'Kikuyu', 'Gĩkũyũ'),
('kj', 'Kuanyama', 'Kuanyama'),
('kk', 'Kazakh', 'қазақ тілі'),
('kl', 'Kalaallisut', 'kalaallisut'),
('km', 'Central Khmer', 'ខ្មែរ'),
('kn', 'Kannada', 'ಕನ್ನಡ'),
('ko', 'Korean', '한국어'),
('kr', 'Kanuri', 'Kanuri'),
('ks', 'Kashmiri', 'कश्मीरी'),
('ku', 'Kurdish', 'Kurdî'),
('kv', 'Komi', 'коми кыв'),
('kw', 'Cornish', 'Kernowek'),
('ky', 'Kirghiz', 'Кыргызча'),
('la', 'Latin', 'latine'),
('lb', 'Luxembourgish', 'Lëtzebuergesch'),
('lg', 'Ganda', 'Luganda'),
('li', 'Limburgan', 'Limburgs'),
('ln', 'Lingala', 'Lingála'),
('lo', 'Lao', 'ພາສາລາວ'),
('lt', 'Lithuanian', 'lietuvių kalba'),
('lu', 'Luba-Katanga', 'Kiluba'),
('lv', 'Latvian', 'latviešu valoda'),
('mg', 'Malagasy', 'fiteny malagasy'),
('mh', 'Marshallese', 'Kajin M̧ajeļ'),
('mi', 'Maori', 'te reo Māori'),
('mk', 'Macedonian', 'македонски јазик'),
('ml', 'Malayalam', 'മലയാളം'),
('mn', 'Mongolian', 'Монгол хэл'),
('mr', 'Marathi', 'मराठी'),
('ms', 'Malay', 'Bahasa Melayu'),
('mt', 'Maltese', 'Malti'),
('my', 'Burmese', 'ဗမာစာ'),
('na', 'Nauru', 'Dorerin Naoero'),
('nb', 'Norwegian Bokmål', 'Norsk bokmål'),
('nd', 'North Ndebele', 'isiNdebele'),
('ne', 'Nepali', 'नेपाली'),
('ng', 'Ndonga', 'Owambo'),
('nl', 'Dutch', 'Nederlands'),
('nn', 'Norwegian Nynorsk', 'Norsk nynorsk'),
('no', 'Norwegian', 'Norsk'),
('nr', 'South Ndebele', 'isiNdebele'),
('nv', 'Navajo', 'Diné bizaad'),
('ny', 'Chichewa', 'chiCheŵa'),
('oc', 'Occitan', 'occitan'),
('oj', 'Ojibwa', 'ᐊᓂᔑᓈᐯᒧᐎᓐ'),
('om', 'Oromo', 'Afaan Oromoo'),
('or', 'Oriya', 'ଓଡ଼ିଆ'),
('os', 'Ossetian', 'ирон ӕвзаг'),
('pa', 'Punjabi', 'ਪੰਜਾਬੀ'),
('pi', 'Pali', 'Pāli'),
('pl', 'Polish', 'język polski'),
('ps', 'Pashto', 'پښتو'),
('pt', 'Portuguese', 'Português'),
('qu', 'Quechua', 'Runa Simi'),
('rm', 'Romansh', 'rumantsch grischun'),
('rn', 'Rundi', 'Ikirundi'),
('ro', 'Romanian', 'Română'),
('ru', 'Russian', 'Русский'),
('rw', 'Kinyarwanda', 'Ikinyarwanda'),
('sa', 'Sanskrit', 'संस्कृतम्'),
('sc', 'Sardinian', 'sardu'),
('sd', 'Sindhi', 'सिन्धी'),
('se', 'Northern Sami', 'Davvisámegiella'),
('sg', 'Sango', 'yângâ tî sängö'),
('si', 'Sinhala', 'සිංහල'),
('sk', 'Slovak', 'slovenčina'),
('sl', 'Slovenian', 'slovenščina'),
('sm', 'Samoan', 'gagana fa''a Samoa'),
('sn', 'Shona', 'chiShona'),
('so', 'Somali', 'Soomaaliga'),
('sq', 'Albanian', 'Shqip'),
('sr', 'Serbian', 'српски језик'),
('ss', 'Swati', 'SiSwati'),
('st', 'Southern Sotho', 'Sesotho'),
('su', 'Sundanese', 'Basa Sunda'),
('sv', 'Swedish', 'Svenska'),
('sw', 'Swahili', 'Kiswahili'),
('ta', 'Tamil', 'தமிழ்'),
('te', 'Telugu', 'తెలుగు'),
('tg', 'Tajik', 'тоҷикӣ'),
('th', 'Thai', 'ไทย'),
('ti', 'Tigrinya', 'ትግርኛ'),
('tk', 'Turkmen', 'Türkmen'),
('tl', 'Tagalog', 'Wikang Tagalog'),
('tn', 'Tswana', 'Setswana'),
('to', 'Tonga', 'faka Tonga'),
('tr', 'Turkish', 'Türkçe'),
('ts', 'Tsonga', 'Xitsonga'),
('tt', 'Tatar', 'татар теле'),
('tw', 'Twi', 'Twi'),
('ty', 'Tahitian', 'Reo Tahiti'),
('ug', 'Uighur', 'Uyƣurqə'),
('uk', 'Ukrainian', 'українська мова'),
('ur', 'Urdu', 'اردو'),
('uz', 'Uzbek', 'Oʻzbek'),
('ve', 'Venda', 'Tshivenḓa'),
('vi', 'Vietnamese', 'Tiếng Việt'),
('vo', 'Volapük', 'Volapük'),
('wa', 'Walloon', 'walon'),
('wo', 'Wolof', 'Wollof'),
('xh', 'Xhosa', 'isiXhosa'),
('yi', 'Yiddish', 'ייִדיש'),
('yo', 'Yoruba', 'Yorùbá'),
('za', 'Zhuang', 'Saɯ cueŋƅ'),
('zh', 'Chinese', '中文'),
('zu', 'Zulu', 'isiZulu')
ON CONFLICT (iso_code) DO NOTHING;

-- 7. LINK LOCALES
DO $$ BEGIN
    -- Ensure countries.iso_code_2 is unique for FK target
    ALTER TABLE countries ADD CONSTRAINT countries_iso_code_2_key UNIQUE (iso_code_2);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE locales 
    ADD CONSTRAINT locales_country_code_fkey 
    FOREIGN KEY (country_code) REFERENCES countries(iso_code_2) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE locales 
    ADD CONSTRAINT locales_language_code_fkey 
    FOREIGN KEY (language_code) REFERENCES languages(iso_code) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 8. SEED DEFAULT LOCALES
INSERT INTO locales (code, language_code, country_code, name, native_name) VALUES
('en-US', 'en', 'US', 'English (United States)', 'English (United States)'),
('en-GB', 'en', 'GB', 'English (United Kingdom)', 'English (United Kingdom)'),
('es-ES', 'es', 'ES', 'Spanish (Spain)', 'Español (España)'),
('es-MX', 'es', 'MX', 'Spanish (Mexico)', 'Español (México)'),
('fr-FR', 'fr', 'FR', 'French (France)', 'Français (France)'),
('de-DE', 'de', 'DE', 'German (Germany)', 'Deutsch (Deutschland)'),
('it-IT', 'it', 'IT', 'Italian (Italy)', 'Italiano (Italia)'),
('pt-PT', 'pt', 'PT', 'Portuguese (Portugal)', 'Português (Portugal)'),
('pt-BR', 'pt', 'BR', 'Portuguese (Brazil)', 'Português (Brasil)'),
('ja-JP', 'ja', 'JP', 'Japanese (Japan)', '日本語 (日本)'),
('zh-CN', 'zh', 'CN', 'Chinese (China)', '中文 (中国)'),
('ko-KR', 'ko', 'KR', 'Korean (South Korea)', '한국어 (대한민국)'),
('ru-RU', 'ru', 'RU', 'Russian (Russia)', 'Русский (Россия)'),
('ar-SA', 'ar', 'SA', 'Arabic (Saudi Arabia)', 'العربية (المملكة العربية السعودية)'),
('hi-IN', 'hi', 'IN', 'Hindi (India)', 'हिन्दी (भारत)'),
('nl-NL', 'nl', 'NL', 'Dutch (Netherlands)', 'Nederlands (Nederland)'),
('sv-SE', 'sv', 'SE', 'Swedish (Sweden)', 'Svenska (Sverige)'),
('pl-PL', 'pl', 'PL', 'Polish (Poland)', 'Polski (Polska)'),
('tr-TR', 'tr', 'TR', 'Turkish (Turkey)', 'Türkçe (Türkiye)'),
('vi-VN', 'vi', 'VN', 'Vietnamese (Vietnam)', 'Tiếng Việt (Việt Nam)')
ON CONFLICT (code) DO NOTHING;

