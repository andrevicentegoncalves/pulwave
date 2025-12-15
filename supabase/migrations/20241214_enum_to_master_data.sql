-- ============================================================================
-- Migration: Create Master Data for Enum Conversion
-- Date: 2024-12-14
-- Description: Add master_data_types and master_data_values for enums that
--              need to be translatable via Admin Dashboard
-- ============================================================================

BEGIN;

-- ============================================================================
-- PHASE 1: CREATE MASTER DATA TYPES FOR ENUMS
-- ============================================================================

INSERT INTO master_data_types (type_key, type_name, description, display_order, is_active)
VALUES 
    ('contact_type', 'Contact Type', 'Types of contact information (phone, email, etc.)', 10, true),
    ('relationship', 'Relationship', 'Relationship types for emergency contacts', 20, true),
    ('address_type', 'Address Type', 'Types of addresses (home, work, billing, etc.)', 30, true),
    ('user_type', 'User Type', 'Professional user classification', 40, true),
    ('gender_type', 'Gender', 'Gender options for profiles', 50, true)
ON CONFLICT (type_key) DO NOTHING;

-- ============================================================================
-- PHASE 2: CONTACT TYPE VALUES
-- ============================================================================

INSERT INTO master_data_values (type_key, value_key, value_label, display_order, is_active)
VALUES
    ('contact_type', 'phone-primary', 'Primary Phone', 1, true),
    ('contact_type', 'phone-secondary', 'Secondary Phone', 2, true),
    ('contact_type', 'phone-mobile', 'Mobile Phone', 3, true),
    ('contact_type', 'phone-work', 'Work Phone', 4, true),
    ('contact_type', 'phone-emergency', 'Emergency Phone', 5, true),
    ('contact_type', 'email-primary', 'Primary Email', 10, true),
    ('contact_type', 'email-work', 'Work Email', 11, true),
    ('contact_type', 'whatsapp', 'WhatsApp', 20, true),
    ('contact_type', 'telegram', 'Telegram', 21, true)
ON CONFLICT (type_key, value_key) DO NOTHING;

-- ============================================================================
-- PHASE 3: RELATIONSHIP VALUES
-- ============================================================================

INSERT INTO master_data_values (type_key, value_key, value_label, display_order, is_active)
VALUES
    ('relationship', 'spouse', 'Spouse', 1, true),
    ('relationship', 'partner', 'Partner', 2, true),
    ('relationship', 'parent', 'Parent', 3, true),
    ('relationship', 'child', 'Child', 4, true),
    ('relationship', 'sibling', 'Sibling', 5, true),
    ('relationship', 'friend', 'Friend', 10, true),
    ('relationship', 'colleague', 'Colleague', 11, true),
    ('relationship', 'neighbor', 'Neighbor', 12, true),
    ('relationship', 'caregiver', 'Caregiver', 13, true),
    ('relationship', 'legal-guardian', 'Legal Guardian', 14, true),
    ('relationship', 'other', 'Other', 99, true)
ON CONFLICT (type_key, value_key) DO NOTHING;

-- ============================================================================
-- PHASE 4: ADDRESS TYPE VALUES
-- ============================================================================

INSERT INTO master_data_values (type_key, value_key, value_label, display_order, is_active)
VALUES
    ('address_type', 'home', 'Home', 1, true),
    ('address_type', 'work', 'Work', 2, true),
    ('address_type', 'billing', 'Billing', 3, true),
    ('address_type', 'shipping', 'Shipping', 4, true),
    ('address_type', 'property', 'Property', 5, true),
    ('address_type', 'mailing', 'Mailing', 6, true),
    ('address_type', 'other', 'Other', 99, true)
ON CONFLICT (type_key, value_key) DO NOTHING;

-- ============================================================================
-- PHASE 5: USER TYPE VALUES
-- ============================================================================

INSERT INTO master_data_values (type_key, value_key, value_label, display_order, is_active)
VALUES
    ('user_type', 'homeowner', 'Homeowner', 1, true),
    ('user_type', 'tenant', 'Tenant', 2, true),
    ('user_type', 'landlord', 'Landlord', 3, true),
    ('user_type', 'property-manager', 'Property Manager', 4, true),
    ('user_type', 'real-estate-agent', 'Real Estate Agent', 5, true),
    ('user_type', 'contractor', 'Contractor', 6, true),
    ('user_type', 'vendor', 'Vendor', 7, true)
ON CONFLICT (type_key, value_key) DO NOTHING;

-- ============================================================================
-- PHASE 6: GENDER TYPE VALUES
-- ============================================================================

INSERT INTO master_data_values (type_key, value_key, value_label, display_order, is_active)
VALUES
    ('gender_type', 'male', 'Male', 1, true),
    ('gender_type', 'female', 'Female', 2, true),
    ('gender_type', 'non-binary', 'Non-Binary', 3, true),
    ('gender_type', 'prefer-not-to-say', 'Prefer not to say', 4, true),
    ('gender_type', 'other', 'Other', 99, true)
ON CONFLICT (type_key, value_key) DO NOTHING;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- SELECT type_key, COUNT(*) as value_count 
-- FROM master_data_values 
-- WHERE type_key IN ('contact_type', 'relationship', 'address_type', 'user_type', 'gender_type')
-- GROUP BY type_key
-- ORDER BY type_key;

COMMIT;
