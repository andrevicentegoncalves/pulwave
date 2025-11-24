
-- Check if countries table has data
SELECT 'countries_count' as check_name, count(*) as value FROM countries
UNION ALL
-- Check if 'US' exists
SELECT 'us_exists', count(*) FROM countries WHERE iso_code_2 = 'US'
UNION ALL
-- Check if locales has 'US'
SELECT 'locales_us_count', count(*) FROM locales WHERE country_code = 'US';
