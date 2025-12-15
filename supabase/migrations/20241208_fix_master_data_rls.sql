-- Fix RLS policies for master data tables
-- Ensure public read access for all lookup tables

-- Timezones
ALTER TABLE IF EXISTS public.timezones ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access" ON public.timezones;
CREATE POLICY "Allow public read access" ON public.timezones FOR SELECT USING (true);

-- Countries
ALTER TABLE IF EXISTS public.countries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access" ON public.countries;
CREATE POLICY "Allow public read access" ON public.countries FOR SELECT USING (true);

-- Administrative Divisions
ALTER TABLE IF EXISTS public.administrative_divisions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access" ON public.administrative_divisions;
CREATE POLICY "Allow public read access" ON public.administrative_divisions FOR SELECT USING (true);

-- Localities
ALTER TABLE IF EXISTS public.localities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access" ON public.localities;
CREATE POLICY "Allow public read access" ON public.localities FOR SELECT USING (true);

-- Master Data Types & Values
ALTER TABLE IF EXISTS public.master_data_types ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access" ON public.master_data_types;
CREATE POLICY "Allow public read access" ON public.master_data_types FOR SELECT USING (true);

ALTER TABLE IF EXISTS public.master_data_values ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access" ON public.master_data_values;
CREATE POLICY "Allow public read access" ON public.master_data_values FOR SELECT USING (true);


