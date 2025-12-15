/**
 * Centralized Database Schema Definitions
 * 
 * This file contains hardcoded lists of tables and columns to avoid
 * repeated information_schema queries and to provide a single source of truth
 * for UI field generation and whitelist validation.
 */

// All public schema tables relevant to the application
export const DATABASE_TABLES = [
    'profiles', 'addresses', 'buildings', 'units', 'documents',
    'countries', 'administrative_divisions', 'localities', 'regional_blocks',
    'subscription_plans', 'payment_method_icons', 'locales', 'timezones',
    'system_settings', 'notification_templates', 'email_templates',
    'activity_log', 'feature_flags', 'data_retention_policies',
    'ui_translations', 'master_data_types', 'master_data_values',
];

// Columns per table for UI generation and whitelisting
export const TABLE_COLUMNS = {
    profiles: ['first_name', 'last_name', 'bio', 'about_me', 'professional_title', 'company_name'],
    addresses: ['street', 'city', 'state', 'zip_code', 'country', 'address_type', 'label'],
    buildings: ['name', 'description', 'address', 'building_type', 'notes'],
    units: ['name', 'description', 'unit_number', 'unit_type', 'status', 'notes'],
    documents: ['name', 'description', 'document_type', 'notes'],
    countries: ['name', 'official_name'],
    administrative_divisions: ['name', 'division_type'],
    localities: ['name', 'place_type'],
    regional_blocks: ['name', 'block_type'],
    subscription_plans: ['plan_name', 'description', 'features'],
    payment_method_icons: ['display_name', 'method_type'],
    locales: ['name', 'native_name'],
    timezones: ['display_name', 'utc_offset', 'tz_identifier'],
    notification_templates: ['title', 'content'],
    email_templates: ['subject', 'body'],
};

// Tables that are allowed to be edited via the generic Master Data / Table Config interface
export const ALLOWED_LOOKUP_TABLES = [
    'countries', 'administrative_divisions', 'localities', 'regional_blocks',
    'locales', 'timezones', 'subscription_plans', 'payment_method_icons'
];

// Configuration for generic table data fetching (sorting, filtering)
export const LOOKUP_TABLE_CONFIG = {
    countries: { orderBy: 'name', selectActive: false },
    administrative_divisions: { orderBy: 'name', selectActive: true },
    localities: { orderBy: 'name', selectActive: true },
    regional_blocks: { orderBy: 'name', selectActive: true },
    locales: { orderBy: 'code', selectActive: true },
    timezones: { orderBy: 'display_order', selectActive: true },
    subscription_plans: { orderBy: 'display_order', selectActive: true },
    payment_method_icons: { orderBy: 'display_name', selectActive: true },
};

// Human-readable labels for tables
export const TABLE_LABELS = {
    profiles: 'User Profiles',
    subscription_plans: 'Subscription Plans',
    countries: 'Countries',
    administrative_divisions: 'Regions/States',
    localities: 'Cities/Towns',
    system_settings: 'System Settings',
    notification_templates: 'Notification Templates',
    email_templates: 'Email Templates',
};
