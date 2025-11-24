-- ============================================================================
-- CREATE LANGUAGES & LINK TO LOCALES/COUNTRIES
-- ============================================================================

-- 1. Create Languages Table
CREATE TABLE IF NOT EXISTS languages (
    iso_code CHAR(2) PRIMARY KEY, -- 'en', 'fr', 'es'
    name TEXT NOT NULL,           -- 'English', 'French'
    native_name TEXT,             -- 'English', 'Français'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Country-Languages Junction Table (Many-to-Many)
--    A country has many languages (e.g. Switzerland: de, fr, it, rm)
--    A language is spoken in many countries (e.g. French: fr, be, ch, ca)
CREATE TABLE IF NOT EXISTS country_languages (
    country_id UUID REFERENCES countries(id) ON DELETE CASCADE,
    language_code CHAR(2) REFERENCES languages(iso_code) ON DELETE CASCADE,
    is_official BOOLEAN DEFAULT false,
    is_primary BOOLEAN DEFAULT false,
    PRIMARY KEY (country_id, language_code)
);

-- 3. Seed Common Languages
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

-- 4. Link Locales to Languages & Countries (Foreign Keys)
--    This enforces referential integrity.

-- Link locales.language_code -> languages.iso_code
DO $$ BEGIN
    ALTER TABLE locales 
    ADD CONSTRAINT locales_language_code_fkey 
    FOREIGN KEY (language_code) REFERENCES languages(iso_code) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Link locales.country_code -> countries.iso_code_2
-- Note: countries.iso_code_2 is TEXT, locales.country_code is TEXT.
DO $$ BEGIN
    -- Ensure countries.iso_code_2 is unique for FK target
    ALTER TABLE countries ADD CONSTRAINT countries_iso_code_2_key UNIQUE (iso_code_2);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE locales 
    ADD CONSTRAINT locales_country_code_fkey 
    FOREIGN KEY (country_code) REFERENCES countries(iso_code_2) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 5. Enable RLS on new tables
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE country_languages ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
DO $$ BEGIN
    CREATE POLICY "Public read access for languages" ON languages FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY "Public read access for country_languages" ON country_languages FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
