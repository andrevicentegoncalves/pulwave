-- Enable RLS
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT SELECT ON public.countries TO anon, authenticated, service_role;

-- Allow public read access
DROP POLICY IF EXISTS "Allow public read access to countries" ON public.countries;
CREATE POLICY "Allow public read access to countries"
ON public.countries FOR SELECT
USING (true);
