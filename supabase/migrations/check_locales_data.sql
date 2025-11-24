-- Check what country codes exist in locales
SELECT DISTINCT country_code 
FROM locales 
WHERE country_code IS NOT NULL
ORDER BY country_code;
