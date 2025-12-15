-- =============================================================================
-- MIGRATION: Add Category Groups to Translation Categories
-- Date: 2024-12-15
-- Purpose: Add group metadata to translation categories for grouped dropdown
-- =============================================================================

-- Update translation categories with group information in value_data
UPDATE master_data_values
SET value_data = jsonb_build_object('group', 'System')
WHERE type_key = 'translation_categories'
  AND value_key IN ('common', 'auth', 'navigation', 'forms', 'errors', 'validation', 'messages', 'tables', 'actions');

UPDATE master_data_values
SET value_data = jsonb_build_object('group', 'Features')
WHERE type_key = 'translation_categories'
  AND value_key IN ('dashboard', 'settings', 'billing', 'profile');

UPDATE master_data_values
SET value_data = jsonb_build_object('group', 'Real Estate')
WHERE type_key = 'translation_categories'
  AND value_key IN ('building', 'properties', 'units', 'tenants', 'leases', 'contracts', 'maintenance');

UPDATE master_data_values
SET value_data = jsonb_build_object('group', 'Admin')
WHERE type_key = 'translation_categories'
  AND value_key IN ('admin');

-- Add any new categories that don't exist yet with their groups
INSERT INTO master_data_values (type_key, value_key, value_label, display_order, is_active, value_data)
VALUES
    -- Real Estate categories
    ('translation_categories', 'properties', 'Properties', 200, true, '{"group": "Real Estate"}'),
    ('translation_categories', 'units', 'Units', 210, true, '{"group": "Real Estate"}'),
    ('translation_categories', 'tenants', 'Tenants', 220, true, '{"group": "Real Estate"}'),
    ('translation_categories', 'leases', 'Leases', 230, true, '{"group": "Real Estate"}'),
    ('translation_categories', 'contracts', 'Contracts', 240, true, '{"group": "Real Estate"}'),
    ('translation_categories', 'maintenance', 'Maintenance', 250, true, '{"group": "Real Estate"}'),
    
    -- Features categories
    ('translation_categories', 'notifications', 'Notifications', 160, true, '{"group": "Features"}'),
    ('translation_categories', 'calendar', 'Calendar', 170, true, '{"group": "Features"}'),
    
    -- System categories
    ('translation_categories', 'accessibility', 'Accessibility', 180, true, '{"group": "System"}')
ON CONFLICT (type_key, value_key) DO UPDATE SET
    value_data = COALESCE(master_data_values.value_data, '{}') || EXCLUDED.value_data,
    updated_at = NOW();

-- Verify the update
SELECT value_key, value_label, value_data->>'group' as group_name, display_order
FROM master_data_values
WHERE type_key = 'translation_categories'
ORDER BY value_data->>'group', display_order;
