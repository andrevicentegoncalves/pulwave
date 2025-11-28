-- ============================================================================
-- MIGRATION 005b: Update RLS policies to use profile_id
-- ============================================================================
-- Description: Updates all RLS policies that reference organization_members.user_id
-- to instead use organization_members.profile_id (via profiles table).
-- This is required before dropping the user_id column.
-- ============================================================================

BEGIN;

-- 1. land_parcels
DROP POLICY IF EXISTS "Users view accessible land parcels" ON land_parcels;
CREATE POLICY "Users view accessible land parcels" ON land_parcels FOR SELECT USING (
  (created_by = auth.uid()) OR 
  (organization_id IN (
    SELECT om.organization_id 
    FROM organization_members om
    JOIN profiles p ON p.id = om.profile_id
    WHERE p.auth_user_id = auth.uid()
    AND om.is_active = true
  )) OR 
  (id IN (
    SELECT lpo.land_parcel_id 
    FROM land_parcel_owners lpo 
    WHERE lpo.owner_id = auth.uid()
  ))
);

-- 2. media_library
DROP POLICY IF EXISTS "Org admins delete media" ON media_library;
CREATE POLICY "Org admins delete media" ON media_library FOR DELETE USING (
  is_org_member(organization_id) AND 
  EXISTS (
    SELECT 1 
    FROM organization_members om
    JOIN profiles p ON p.id = om.profile_id
    WHERE om.organization_id = media_library.organization_id
    AND p.auth_user_id = auth.uid()
    AND om.role IN ('owner', 'admin')
  )
);

-- 3. organizations
DROP POLICY IF EXISTS "Users view accessible orgs" ON organizations;
CREATE POLICY "Users view accessible orgs" ON organizations FOR SELECT USING (
  id IN (
    SELECT om.organization_id 
    FROM organization_members om
    JOIN profiles p ON p.id = om.profile_id
    WHERE p.auth_user_id = auth.uid()
    AND om.is_active = true
  )
);

DROP POLICY IF EXISTS "Org owners update orgs" ON organizations;
CREATE POLICY "Org owners update orgs" ON organizations FOR UPDATE USING (
  id IN (
    SELECT om.organization_id 
    FROM organization_members om
    JOIN profiles p ON p.id = om.profile_id
    WHERE p.auth_user_id = auth.uid()
    AND om.role IN ('owner', 'admin')
    AND om.is_active = true
  )
);

-- 4. units
DROP POLICY IF EXISTS "Org members view units" ON units;
CREATE POLICY "Org members view units" ON units FOR SELECT USING (
  (organization_id IN (
    SELECT om.organization_id 
    FROM organization_members om
    JOIN profiles p ON p.id = om.profile_id
    WHERE p.auth_user_id = auth.uid()
    AND om.is_active = true
  )) OR 
  (id IN (
    SELECT uo.unit_id 
    FROM unit_owners uo 
    WHERE uo.owner_id = auth.uid()
  ))
);

DROP POLICY IF EXISTS "Org managers create units" ON units;
CREATE POLICY "Org managers create units" ON units FOR INSERT WITH CHECK (
  organization_id IN (
    SELECT om.organization_id 
    FROM organization_members om
    JOIN profiles p ON p.id = om.profile_id
    WHERE p.auth_user_id = auth.uid()
    AND om.role IN ('owner', 'admin', 'manager')
    AND om.is_active = true
  )
);

DROP POLICY IF EXISTS "Org managers update units" ON units;
CREATE POLICY "Org managers update units" ON units FOR UPDATE USING (
  organization_id IN (
    SELECT om.organization_id 
    FROM organization_members om
    JOIN profiles p ON p.id = om.profile_id
    WHERE p.auth_user_id = auth.uid()
    AND om.role IN ('owner', 'admin', 'manager')
    AND om.is_active = true
  )
);

-- 5. unit_owners
DROP POLICY IF EXISTS "View accessible unit owners" ON unit_owners;
CREATE POLICY "View accessible unit owners" ON unit_owners FOR SELECT USING (
  (owner_id = auth.uid()) OR 
  (unit_id IN (
    SELECT u.id 
    FROM units u
    WHERE u.organization_id IN (
      SELECT om.organization_id 
      FROM organization_members om
      JOIN profiles p ON p.id = om.profile_id
      WHERE p.auth_user_id = auth.uid()
      AND om.is_active = true
    )
  ))
);

-- 6. tenants
DROP POLICY IF EXISTS "Org members view tenants" ON tenants;
CREATE POLICY "Org members view tenants" ON tenants FOR SELECT USING (
  (organization_id IN (
    SELECT om.organization_id 
    FROM organization_members om
    JOIN profiles p ON p.id = om.profile_id
    WHERE p.auth_user_id = auth.uid()
    AND om.is_active = true
  )) OR 
  (profile_id = auth.uid())
);

DROP POLICY IF EXISTS "Org managers create tenants" ON tenants;
CREATE POLICY "Org managers create tenants" ON tenants FOR INSERT WITH CHECK (
  organization_id IN (
    SELECT om.organization_id 
    FROM organization_members om
    JOIN profiles p ON p.id = om.profile_id
    WHERE p.auth_user_id = auth.uid()
    AND om.role IN ('owner', 'admin', 'manager')
    AND om.is_active = true
  )
);

DROP POLICY IF EXISTS "Org managers update tenants" ON tenants;
CREATE POLICY "Org managers update tenants" ON tenants FOR UPDATE USING (
  organization_id IN (
    SELECT om.organization_id 
    FROM organization_members om
    JOIN profiles p ON p.id = om.profile_id
    WHERE p.auth_user_id = auth.uid()
    AND om.role IN ('owner', 'admin', 'manager')
    AND om.is_active = true
  )
);

-- 7. leases
DROP POLICY IF EXISTS "Org members view leases" ON leases;
CREATE POLICY "Org members view leases" ON leases FOR SELECT USING (
  (organization_id IN (
    SELECT om.organization_id 
    FROM organization_members om
    JOIN profiles p ON p.id = om.profile_id
    WHERE p.auth_user_id = auth.uid()
    AND om.is_active = true
  )) OR 
  (id IN (
    SELECT lt.lease_id 
    FROM lease_tenants lt
    WHERE lt.tenant_id IN (
      SELECT t.id 
      FROM tenants t
      WHERE t.profile_id = auth.uid()
    )
  ))
);

DROP POLICY IF EXISTS "Org managers create leases" ON leases;
CREATE POLICY "Org managers create leases" ON leases FOR INSERT WITH CHECK (
  organization_id IN (
    SELECT om.organization_id 
    FROM organization_members om
    JOIN profiles p ON p.id = om.profile_id
    WHERE p.auth_user_id = auth.uid()
    AND om.role IN ('owner', 'admin', 'manager')
    AND om.is_active = true
  )
);

DROP POLICY IF EXISTS "Org managers update leases" ON leases;
CREATE POLICY "Org managers update leases" ON leases FOR UPDATE USING (
  organization_id IN (
    SELECT om.organization_id 
    FROM organization_members om
    JOIN profiles p ON p.id = om.profile_id
    WHERE p.auth_user_id = auth.uid()
    AND om.role IN ('owner', 'admin', 'manager')
    AND om.is_active = true
  )
);

-- 8. vendors
DROP POLICY IF EXISTS "Org members view vendors" ON vendors;
CREATE POLICY "Org members view vendors" ON vendors FOR SELECT USING (
  organization_id IN (
    SELECT om.organization_id 
    FROM organization_members om
    JOIN profiles p ON p.id = om.profile_id
    WHERE p.auth_user_id = auth.uid()
    AND om.is_active = true
  )
);

DROP POLICY IF EXISTS "Org managers manage vendors" ON vendors;
CREATE POLICY "Org managers manage vendors" ON vendors FOR ALL USING (
  organization_id IN (
    SELECT om.organization_id 
    FROM organization_members om
    JOIN profiles p ON p.id = om.profile_id
    WHERE p.auth_user_id = auth.uid()
    AND om.role IN ('owner', 'admin', 'manager')
    AND om.is_active = true
  )
);

-- 9. maintenance_requests
DROP POLICY IF EXISTS "Users view accessible requests" ON maintenance_requests;
CREATE POLICY "Users view accessible requests" ON maintenance_requests FOR SELECT USING (
  (organization_id IN (
    SELECT om.organization_id 
    FROM organization_members om
    JOIN profiles p ON p.id = om.profile_id
    WHERE p.auth_user_id = auth.uid()
    AND om.is_active = true
  )) OR 
  (reported_by = auth.uid())
);

DROP POLICY IF EXISTS "Org members create requests" ON maintenance_requests;
CREATE POLICY "Org members create requests" ON maintenance_requests FOR INSERT WITH CHECK (
  (organization_id IN (
    SELECT om.organization_id 
    FROM organization_members om
    JOIN profiles p ON p.id = om.profile_id
    WHERE p.auth_user_id = auth.uid()
    AND om.is_active = true
  )) AND 
  (reported_by = auth.uid())
);

DROP POLICY IF EXISTS "Org managers update requests" ON maintenance_requests;
CREATE POLICY "Org managers update requests" ON maintenance_requests FOR UPDATE USING (
  organization_id IN (
    SELECT om.organization_id 
    FROM organization_members om
    JOIN profiles p ON p.id = om.profile_id
    WHERE p.auth_user_id = auth.uid()
    AND om.is_active = true
  )
);

-- 10. building_owners
DROP POLICY IF EXISTS "Org members view building owners" ON building_owners;
CREATE POLICY "Org members view building owners" ON building_owners FOR SELECT USING (
  EXISTS (
    SELECT 1 
    FROM organization_members om
    JOIN profiles p ON p.id = om.profile_id
    WHERE om.organization_id = building_owners.organization_id
    AND p.auth_user_id = auth.uid()
    AND om.is_active = true
  )
);

DROP POLICY IF EXISTS "Org admins insert building owners" ON building_owners;
CREATE POLICY "Org admins insert building owners" ON building_owners FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM organization_members om
    JOIN profiles p ON p.id = om.profile_id
    WHERE om.organization_id = building_owners.organization_id
    AND p.auth_user_id = auth.uid()
    AND om.role IN ('owner', 'admin')
    AND om.is_active = true
  )
);

DROP POLICY IF EXISTS "Org admins update building owners" ON building_owners;
CREATE POLICY "Org admins update building owners" ON building_owners FOR UPDATE USING (
  EXISTS (
    SELECT 1 
    FROM organization_members om
    JOIN profiles p ON p.id = om.profile_id
    WHERE om.organization_id = building_owners.organization_id
    AND p.auth_user_id = auth.uid()
    AND om.role IN ('owner', 'admin')
    AND om.is_active = true
  )
);

DROP POLICY IF EXISTS "Org owners delete building owners" ON building_owners;
CREATE POLICY "Org owners delete building owners" ON building_owners FOR DELETE USING (
  EXISTS (
    SELECT 1 
    FROM organization_members om
    JOIN profiles p ON p.id = om.profile_id
    WHERE om.organization_id = building_owners.organization_id
    AND p.auth_user_id = auth.uid()
    AND om.role = 'owner'
    AND om.is_active = true
  )
);

-- 11. property_systems
DROP POLICY IF EXISTS "Org members view property_systems" ON property_systems;
CREATE POLICY "Org members view property_systems" ON property_systems FOR SELECT USING (
  EXISTS (
    SELECT 1 
    FROM organization_members om
    JOIN profiles p ON p.id = om.profile_id
    WHERE om.organization_id = property_systems.organization_id
    AND p.auth_user_id = auth.uid()
    AND om.is_active = true
  )
);

DROP POLICY IF EXISTS "Org admins manage property_systems" ON property_systems;
CREATE POLICY "Org admins manage property_systems" ON property_systems FOR ALL USING (
  EXISTS (
    SELECT 1 
    FROM organization_members om
    JOIN profiles p ON p.id = om.profile_id
    WHERE om.organization_id = property_systems.organization_id
    AND p.auth_user_id = auth.uid()
    AND om.role IN ('owner', 'admin', 'manager', 'maintenance-supervisor')
    AND om.is_active = true
  )
);

-- 12. insurance_policies
DROP POLICY IF EXISTS "Org members view insurance" ON insurance_policies;
CREATE POLICY "Org members view insurance" ON insurance_policies FOR SELECT USING (
  EXISTS (
    SELECT 1 
    FROM organization_members om
    JOIN profiles p ON p.id = om.profile_id
    WHERE om.organization_id = insurance_policies.organization_id
    AND p.auth_user_id = auth.uid()
    AND om.is_active = true
  )
);

DROP POLICY IF EXISTS "Org admins manage insurance" ON insurance_policies;
CREATE POLICY "Org admins manage insurance" ON insurance_policies FOR ALL USING (
  EXISTS (
    SELECT 1 
    FROM organization_members om
    JOIN profiles p ON p.id = om.profile_id
    WHERE om.organization_id = insurance_policies.organization_id
    AND p.auth_user_id = auth.uid()
    AND om.role IN ('owner', 'admin', 'accountant')
    AND om.is_active = true
  )
);

-- 13. inspections
DROP POLICY IF EXISTS "Org members view inspections" ON inspections;
CREATE POLICY "Org members view inspections" ON inspections FOR SELECT USING (
  EXISTS (
    SELECT 1 
    FROM organization_members om
    JOIN profiles p ON p.id = om.profile_id
    WHERE om.organization_id = inspections.organization_id
    AND p.auth_user_id = auth.uid()
    AND om.is_active = true
  )
);

DROP POLICY IF EXISTS "Org staff manage inspections" ON inspections;
CREATE POLICY "Org staff manage inspections" ON inspections FOR ALL USING (
  EXISTS (
    SELECT 1 
    FROM organization_members om
    JOIN profiles p ON p.id = om.profile_id
    WHERE om.organization_id = inspections.organization_id
    AND p.auth_user_id = auth.uid()
    AND om.role IN ('owner', 'admin', 'manager', 'maintenance-supervisor', 'property-inspector')
    AND om.is_active = true
  )
);

-- 14. certifications
DROP POLICY IF EXISTS "Org members view all certifications" ON certifications;
CREATE POLICY "Org members view all certifications" ON certifications FOR SELECT USING (
  EXISTS (
    SELECT 1 
    FROM organization_members om
    JOIN profiles p ON p.id = om.profile_id
    WHERE om.organization_id = certifications.organization_id
    AND p.auth_user_id = auth.uid()
    AND om.is_active = true
  )
);

DROP POLICY IF EXISTS "Org admins manage certifications" ON certifications;
CREATE POLICY "Org admins manage certifications" ON certifications FOR ALL USING (
  EXISTS (
    SELECT 1 
    FROM organization_members om
    JOIN profiles p ON p.id = om.profile_id
    WHERE om.organization_id = certifications.organization_id
    AND p.auth_user_id = auth.uid()
    AND om.role IN ('owner', 'admin', 'manager')
    AND om.is_active = true
  )
);

-- 15. environmental_data
DROP POLICY IF EXISTS "Org members view environmental" ON environmental_data;
CREATE POLICY "Org members view environmental" ON environmental_data FOR SELECT USING (
  EXISTS (
    SELECT 1 
    FROM organization_members om
    JOIN profiles p ON p.id = om.profile_id
    WHERE om.organization_id = environmental_data.organization_id
    AND p.auth_user_id = auth.uid()
    AND om.is_active = true
  )
);

DROP POLICY IF EXISTS "Org admins manage environmental" ON environmental_data;
CREATE POLICY "Org admins manage environmental" ON environmental_data FOR ALL USING (
  EXISTS (
    SELECT 1 
    FROM organization_members om
    JOIN profiles p ON p.id = om.profile_id
    WHERE om.organization_id = environmental_data.organization_id
    AND p.auth_user_id = auth.uid()
    AND om.role IN ('owner', 'admin', 'manager')
    AND om.is_active = true
  )
);

-- 16. parking_spaces
DROP POLICY IF EXISTS "Org members view parking" ON parking_spaces;
CREATE POLICY "Org members view parking" ON parking_spaces FOR SELECT USING (
  EXISTS (
    SELECT 1 
    FROM organization_members om
    JOIN profiles p ON p.id = om.profile_id
    WHERE om.organization_id = parking_spaces.organization_id
    AND p.auth_user_id = auth.uid()
    AND om.is_active = true
  )
);

DROP POLICY IF EXISTS "Org staff manage parking" ON parking_spaces;
CREATE POLICY "Org staff manage parking" ON parking_spaces FOR ALL USING (
  EXISTS (
    SELECT 1 
    FROM organization_members om
    JOIN profiles p ON p.id = om.profile_id
    WHERE om.organization_id = parking_spaces.organization_id
    AND p.auth_user_id = auth.uid()
    AND om.role IN ('owner', 'admin', 'manager')
    AND om.is_active = true
  )
);

-- 17. buildings
DROP POLICY IF EXISTS "Org members view buildings" ON buildings;
CREATE POLICY "Org members view buildings" ON buildings FOR SELECT USING (
  EXISTS (
    SELECT 1 
    FROM organization_members om
    JOIN profiles p ON p.id = om.profile_id
    WHERE om.organization_id = buildings.organization_id
    AND p.auth_user_id = auth.uid()
    AND om.is_active = true
  )
);

DROP POLICY IF EXISTS "Org admins insert buildings" ON buildings;
CREATE POLICY "Org admins insert buildings" ON buildings FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM organization_members om
    JOIN profiles p ON p.id = om.profile_id
    WHERE om.organization_id = buildings.organization_id
    AND p.auth_user_id = auth.uid()
    AND om.role IN ('owner', 'admin', 'manager')
    AND om.is_active = true
  )
);

DROP POLICY IF EXISTS "Org admins update buildings" ON buildings;
CREATE POLICY "Org admins update buildings" ON buildings FOR UPDATE USING (
  EXISTS (
    SELECT 1 
    FROM organization_members om
    JOIN profiles p ON p.id = om.profile_id
    WHERE om.organization_id = buildings.organization_id
    AND p.auth_user_id = auth.uid()
    AND om.role IN ('owner', 'admin', 'manager')
    AND om.is_active = true
  )
);

DROP POLICY IF EXISTS "Owners delete buildings" ON buildings;
CREATE POLICY "Owners delete buildings" ON buildings FOR DELETE USING (
  EXISTS (
    SELECT 1 
    FROM organization_members om
    JOIN profiles p ON p.id = om.profile_id
    WHERE om.organization_id = buildings.organization_id
    AND p.auth_user_id = auth.uid()
    AND om.role = 'owner'
    AND om.is_active = true
  )
);

COMMIT;
