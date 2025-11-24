-- Fix search_path security issue for get_primary_building_owner function
-- This ensures the function uses a stable search_path to prevent security vulnerabilities

-- Drop the existing function
DROP FUNCTION IF EXISTS public.get_primary_building_owner(uuid);

-- Recreate with SET search_path to fix the security warning
CREATE OR REPLACE FUNCTION public.get_primary_building_owner(building_uuid uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    result json;
BEGIN
    SELECT json_build_object(
        'id', p.id,
        'first_name', p.first_name,
        'last_name', p.last_name,
        'email', p.email,
        'phone', p.phone
    )
    INTO result
    FROM profiles p
    INNER JOIN building_ownership bo ON p.id = bo.owner_id
    WHERE bo.building_id = building_uuid
      AND bo.is_primary = true
    LIMIT 1;

    RETURN result;
END;
$$;

-- Add comment
COMMENT ON FUNCTION public.get_primary_building_owner(uuid) IS 'Returns the primary owner details for a given building';
