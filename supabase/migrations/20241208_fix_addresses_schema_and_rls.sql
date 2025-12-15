-- 1. Add profile_id column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'addresses' AND column_name = 'profile_id') THEN
        ALTER TABLE public.addresses ADD COLUMN profile_id UUID;
    END IF;
END $$;

-- 2. Backfill profile_id from created_by (if available)
UPDATE public.addresses 
SET profile_id = created_by 
WHERE profile_id IS NULL AND created_by IS NOT NULL;

-- 3. Add FK constraint addresses_profile_id_fkey
DO $$
BEGIN
    ALTER TABLE public.addresses DROP CONSTRAINT IF EXISTS addresses_profile_id_fkey;
    
    ALTER TABLE public.addresses 
    ADD CONSTRAINT addresses_profile_id_fkey 
    FOREIGN KEY (profile_id) 
    REFERENCES public.profiles(id) 
    ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN
    NULL;
END $$;

-- 4. Enable RLS
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

-- 5. Drop existing policies to be safe
DROP POLICY IF EXISTS "Users can view their own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Users can insert their own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Users can update their own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Users can delete their own addresses" ON public.addresses;

-- 6. Create RLS Policies using profile_id
CREATE POLICY "Users can view their own addresses"
ON public.addresses FOR SELECT
USING (
    profile_id IN (
        SELECT id FROM public.profiles WHERE auth_user_id = auth.uid()
    )
);

CREATE POLICY "Users can insert their own addresses"
ON public.addresses FOR INSERT
WITH CHECK (
    profile_id IN (
        SELECT id FROM public.profiles WHERE auth_user_id = auth.uid()
    )
);

CREATE POLICY "Users can update their own addresses"
ON public.addresses FOR UPDATE
USING (
    profile_id IN (
        SELECT id FROM public.profiles WHERE auth_user_id = auth.uid()
    )
);

CREATE POLICY "Users can delete their own addresses"
ON public.addresses FOR DELETE
USING (
    profile_id IN (
        SELECT id FROM public.profiles WHERE auth_user_id = auth.uid()
    )
);
