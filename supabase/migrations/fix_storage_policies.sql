-- ============================================================================
-- MIGRATION 005d: Fix Storage Policies
-- ============================================================================
-- Description: Updates storage.objects policies to use profile_id instead of user_id.
-- This fixes the remaining dependencies preventing the drop of user_id.
-- ============================================================================

BEGIN;

-- 1. Property Images
DROP POLICY IF EXISTS "Org members can upload property images" ON storage.objects;
CREATE POLICY "Org members can upload property images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'property-images' AND 
  EXISTS (
    SELECT 1 FROM organization_members om
    JOIN profiles p ON p.id = om.profile_id
    WHERE p.auth_user_id = auth.uid()
    AND om.organization_id::text = (storage.foldername(name))[1]
    AND om.is_active = true
  )
);

DROP POLICY IF EXISTS "Org members can manage property images" ON storage.objects;
CREATE POLICY "Org members can manage property images" ON storage.objects FOR UPDATE USING (
  bucket_id = 'property-images' AND 
  EXISTS (
    SELECT 1 FROM organization_members om
    JOIN profiles p ON p.id = om.profile_id
    WHERE p.auth_user_id = auth.uid()
    AND om.organization_id::text = (storage.foldername(name))[1]
    AND om.is_active = true
  )
);

DROP POLICY IF EXISTS "Org members can delete property images" ON storage.objects;
CREATE POLICY "Org members can delete property images" ON storage.objects FOR DELETE USING (
  bucket_id = 'property-images' AND 
  EXISTS (
    SELECT 1 FROM organization_members om
    JOIN profiles p ON p.id = om.profile_id
    WHERE p.auth_user_id = auth.uid()
    AND om.organization_id::text = (storage.foldername(name))[1]
    AND om.role IN ('owner', 'admin', 'manager')
  )
);

-- 2. Property Videos
DROP POLICY IF EXISTS "Org members can upload property videos" ON storage.objects;
CREATE POLICY "Org members can upload property videos" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'property-videos' AND 
  EXISTS (
    SELECT 1 FROM organization_members om
    JOIN profiles p ON p.id = om.profile_id
    WHERE p.auth_user_id = auth.uid()
    AND om.organization_id::text = (storage.foldername(name))[1]
    AND om.is_active = true
  )
);

-- 3. Documents
DROP POLICY IF EXISTS "Org members can upload documents" ON storage.objects;
CREATE POLICY "Org members can upload documents" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'documents' AND 
  EXISTS (
    SELECT 1 FROM organization_members om
    JOIN profiles p ON p.id = om.profile_id
    WHERE p.auth_user_id = auth.uid()
    AND om.organization_id::text = (storage.foldername(name))[1]
    AND om.is_active = true
  )
);

DROP POLICY IF EXISTS "Org members can view their org documents" ON storage.objects;
CREATE POLICY "Org members can view their org documents" ON storage.objects FOR SELECT USING (
  bucket_id = 'documents' AND 
  EXISTS (
    SELECT 1 FROM organization_members om
    JOIN profiles p ON p.id = om.profile_id
    WHERE p.auth_user_id = auth.uid()
    AND om.organization_id::text = (storage.foldername(name))[1]
    AND om.is_active = true
  )
);

DROP POLICY IF EXISTS "Org admins can manage documents" ON storage.objects;
CREATE POLICY "Org admins can manage documents" ON storage.objects FOR UPDATE USING (
  bucket_id = 'documents' AND 
  EXISTS (
    SELECT 1 FROM organization_members om
    JOIN profiles p ON p.id = om.profile_id
    WHERE p.auth_user_id = auth.uid()
    AND om.organization_id::text = (storage.foldername(name))[1]
    AND om.role IN ('owner', 'admin')
  )
);

DROP POLICY IF EXISTS "Org admins can delete documents" ON storage.objects;
CREATE POLICY "Org admins can delete documents" ON storage.objects FOR DELETE USING (
  bucket_id = 'documents' AND 
  EXISTS (
    SELECT 1 FROM organization_members om
    JOIN profiles p ON p.id = om.profile_id
    WHERE p.auth_user_id = auth.uid()
    AND om.organization_id::text = (storage.foldername(name))[1]
    AND om.role IN ('owner', 'admin')
  )
);

-- 4. Lease Documents
DROP POLICY IF EXISTS "Org members can upload lease documents" ON storage.objects;
CREATE POLICY "Org members can upload lease documents" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'lease-documents' AND 
  EXISTS (
    SELECT 1 FROM organization_members om
    JOIN profiles p ON p.id = om.profile_id
    WHERE p.auth_user_id = auth.uid()
    AND om.organization_id::text = (storage.foldername(name))[1]
    AND om.is_active = true
  )
);

DROP POLICY IF EXISTS "Landlords and tenants can view lease documents" ON storage.objects;
CREATE POLICY "Landlords and tenants can view lease documents" ON storage.objects FOR SELECT USING (
  bucket_id = 'lease-documents' AND (
    EXISTS (
      SELECT 1 FROM organization_members om
      JOIN profiles p ON p.id = om.profile_id
      WHERE p.auth_user_id = auth.uid()
      AND om.organization_id::text = (storage.foldername(name))[1]
    ) OR 
    EXISTS (
      SELECT 1 FROM tenants t
      JOIN lease_tenants lt ON t.id = lt.tenant_id
      WHERE t.profile_id = auth.uid()
      AND lt.lease_id::text = (storage.foldername(name))[2]
    )
  )
);

-- 5. Receipts
DROP POLICY IF EXISTS "Org members can upload receipts" ON storage.objects;
CREATE POLICY "Org members can upload receipts" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'receipts' AND 
  EXISTS (
    SELECT 1 FROM organization_members om
    JOIN profiles p ON p.id = om.profile_id
    WHERE p.auth_user_id = auth.uid()
    AND om.organization_id::text = (storage.foldername(name))[1]
    AND om.is_active = true
  )
);

DROP POLICY IF EXISTS "Org members can view receipts" ON storage.objects;
CREATE POLICY "Org members can view receipts" ON storage.objects FOR SELECT USING (
  bucket_id = 'receipts' AND 
  EXISTS (
    SELECT 1 FROM organization_members om
    JOIN profiles p ON p.id = om.profile_id
    WHERE p.auth_user_id = auth.uid()
    AND om.organization_id::text = (storage.foldername(name))[1]
  )
);

-- 6. Maintenance Photos
DROP POLICY IF EXISTS "Org members and tenants can view maintenance photos" ON storage.objects;
CREATE POLICY "Org members and tenants can view maintenance photos" ON storage.objects FOR SELECT USING (
  bucket_id = 'maintenance-photos' AND (
    EXISTS (
      SELECT 1 FROM organization_members om
      JOIN profiles p ON p.id = om.profile_id
      WHERE p.auth_user_id = auth.uid()
      AND om.organization_id::text = (storage.foldername(name))[1]
    ) OR 
    EXISTS (
      SELECT 1 FROM tenants
      WHERE tenants.profile_id = auth.uid()
    )
  )
);

-- 7. Organization Assets
DROP POLICY IF EXISTS "Org admins can upload organization assets" ON storage.objects;
CREATE POLICY "Org admins can upload organization assets" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'organization-assets' AND 
  EXISTS (
    SELECT 1 FROM organization_members om
    JOIN profiles p ON p.id = om.profile_id
    WHERE p.auth_user_id = auth.uid()
    AND om.organization_id::text = (storage.foldername(name))[1]
    AND om.role IN ('owner', 'admin')
  )
);

COMMIT;
