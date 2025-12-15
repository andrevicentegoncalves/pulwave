-- Fix is_rtl field for RTL locales
-- Arabic (Saudi Arabia) should be RTL
UPDATE supported_locales
SET is_rtl = true
WHERE code = 'ar-SA' AND is_rtl = false;

-- Verify all Arabic locales are set to RTL
UPDATE supported_locales
SET is_rtl = true
WHERE language_code = 'ar' AND is_rtl = false;

-- Verify all Hebrew locales are set to RTL
UPDATE supported_locales
SET is_rtl = true
WHERE language_code = 'he' AND is_rtl = false;

-- Verify all Persian/Farsi locales are set to RTL
UPDATE supported_locales
SET is_rtl = true
WHERE language_code = 'fa' AND is_rtl = false;

-- Verify all Urdu locales are set to RTL (if any)
UPDATE supported_locales
SET is_rtl = true
WHERE language_code = 'ur' AND is_rtl = false;

-- Verify all Yiddish locales are set to RTL (if any)
UPDATE supported_locales
SET is_rtl = true
WHERE language_code = 'yi' AND is_rtl = false;

-- Add display_order if not set (order by language, then country)
UPDATE supported_locales
SET display_order =
    CASE
        WHEN code = 'en-US' THEN 1
        WHEN code = 'en-GB' THEN 2
        WHEN code = 'en-CA' THEN 3
        WHEN code = 'es-ES' THEN 10
        WHEN code = 'es-MX' THEN 11
        WHEN code = 'fr-FR' THEN 20
        WHEN code = 'de-DE' THEN 30
        WHEN code = 'pt-PT' THEN 40
        WHEN code = 'pt-BR' THEN 41
        ELSE ROW_NUMBER() OVER (ORDER BY language_code, country_code) + 100
    END
WHERE display_order IS NULL;
