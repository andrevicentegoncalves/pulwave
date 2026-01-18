/**
 * Database Table Definitions
 */

// All public schema tables relevant to the application
export const DATABASE_TABLES = [
    'profiles', 'addresses', 'buildings', 'units', 'documents',
    'countries', 'administrative_divisions', 'localities', 'regional_blocks',
    'subscription_plans', 'payment_method_icons', 'locales', 'timezones',
    'system_settings', 'notification_templates', 'email_templates',
    'activity_log', 'feature_flags', 'data_retention_policies',
    'ui_translations', 'master_data_types', 'master_data_values',
] as const;

export type DatabaseTable = typeof DATABASE_TABLES[number];
