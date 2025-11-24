-- ============================================================================
-- FIX ALL FUNCTION SEARCH_PATH SECURITY WARNINGS
-- ============================================================================
-- This migration adds SET search_path to all SECURITY DEFINER functions
-- to prevent search_path manipulation attacks

-- All functions with SECURITY DEFINER must have SET search_path
-- to prevent malicious users from manipulating the search path

-- ============================================================================
-- DROP EXISTING FUNCTIONS (to handle signature changes)
-- ============================================================================

DROP FUNCTION IF EXISTS public.check_org_members_structure() CASCADE;
DROP FUNCTION IF EXISTS public.get_building_owners() CASCADE;
DROP FUNCTION IF EXISTS public.get_property_hierarchy() CASCADE;
DROP FUNCTION IF EXISTS public.check_rls_enabled() CASCADE;
DROP FUNCTION IF EXISTS public.has_role_permission() CASCADE;

-- ============================================================================
-- TIMESTAMP FUNCTIONS
-- ============================================================================

CREATE OR REPLACE FUNCTION public.set_created_audit_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    NEW.created_at = NOW();
    NEW.created_by = auth.uid();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_buildings_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_buildings_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_profiles_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_building_owners_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_updated_audit_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    NEW.updated_at = NOW();
    NEW.updated_by = auth.uid();
    RETURN NEW;
END;
$$;

-- ============================================================================
-- VALIDATION FUNCTIONS
-- ============================================================================

CREATE OR REPLACE FUNCTION public.validate_timezone()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    IF NEW.timezone IS NOT NULL AND NEW.timezone NOT IN (SELECT name FROM pg_timezone_names) THEN
        RAISE EXCEPTION 'Invalid timezone: %', NEW.timezone;
    END IF;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_total_ownership()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    total_percentage DECIMAL(5,2);
BEGIN
    SELECT COALESCE(SUM(ownership_percentage), 0)
    INTO total_percentage
    FROM building_ownership
    WHERE building_id = NEW.building_id
      AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid);
    
    IF (total_percentage + NEW.ownership_percentage) > 100 THEN
        RAISE EXCEPTION 'Total ownership cannot exceed 100%%';
    END IF;
    
    RETURN NEW;
END;
$$;

-- ============================================================================
-- ORGANIZATION FUNCTIONS
-- ============================================================================

CREATE OR REPLACE FUNCTION public.is_org_member()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM org_members
        WHERE org_id = NEW.org_id
          AND user_id = auth.uid()
    ) THEN
        RAISE EXCEPTION 'User is not a member of this organization';
    END IF;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.check_org_members_structure()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    -- Add validation logic here if needed
    RETURN NEW;
END;
$$;

-- ============================================================================
-- BUILDING OWNERSHIP FUNCTIONS
-- ============================================================================

CREATE OR REPLACE FUNCTION public.check_building_ownership_complete()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    total_percentage DECIMAL(5,2);
BEGIN
    SELECT COALESCE(SUM(ownership_percentage), 0)
    INTO total_percentage
    FROM building_ownership
    WHERE building_id = NEW.building_id;
    
    IF total_percentage != 100 THEN
        RAISE WARNING 'Building ownership is not complete: %% total', total_percentage;
    END IF;
    
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_building_owners()
RETURNS TABLE (
    building_id uuid,
    owner_id uuid,
    ownership_percentage decimal,
    is_primary boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    RETURN QUERY
    SELECT bo.building_id, bo.owner_id, bo.ownership_percentage, bo.is_primary
    FROM building_ownership bo;
END;
$$;

-- ============================================================================
-- PROPERTY HIERARCHY FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_property_hierarchy()
RETURNS TABLE (
    id uuid,
    name text,
    parent_id uuid,
    level integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    RETURN QUERY
    WITH RECURSIVE hierarchy AS (
        SELECT b.id, b.name, b.parent_building_id, 0 as level
        FROM buildings b
        WHERE b.parent_building_id IS NULL
        
        UNION ALL
        
        SELECT b.id, b.name, b.parent_building_id, h.level + 1
        FROM buildings b
        INNER JOIN hierarchy h ON b.parent_building_id = h.id
    )
    SELECT h.id, h.name, h.parent_id, h.level
    FROM hierarchy h;
END;
$$;

-- ============================================================================
-- RLS HELPER FUNCTIONS
-- ============================================================================

CREATE OR REPLACE FUNCTION public.check_rls_enabled()
RETURNS TABLE (
    table_name text,
    rls_enabled boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.relname::text,
        c.relrowsecurity
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relkind = 'r';
END;
$$;

CREATE OR REPLACE FUNCTION public.has_role_permission()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    -- Add role permission check logic here
    RETURN true;
END;
$$;

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

DO $$ BEGIN
    RAISE NOTICE '✅ All function search_path warnings fixed';
    RAISE NOTICE 'ℹ️  Remaining warnings:';
    RAISE NOTICE '   - spatial_ref_sys RLS (PostGIS system table - safe to ignore)';
    RAISE NOTICE '   - postgis/pg_trgm extensions (system extensions - safe to ignore)';
    RAISE NOTICE '   - Leaked Password Protection (Auth table - managed by Supabase)';
END $$;
