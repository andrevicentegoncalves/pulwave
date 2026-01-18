/**
 * Lookup Table Configuration
 * Tables allowed for editing via Master Data interface
 */

// Tables that are allowed to be edited via the generic Master Data / Table Config interface
export const ALLOWED_LOOKUP_TABLES = [
    'countries', 'administrative_divisions', 'localities', 'regional_blocks',
    'locales', 'timezones', 'subscription_plans', 'payment_method_icons'
] as const;

export type AllowedLookupTable = typeof ALLOWED_LOOKUP_TABLES[number];

export interface LookupTableConfig {
    orderBy: string;
    selectActive: boolean;
}

// Configuration for generic table data fetching (sorting, filtering)
export const LOOKUP_TABLE_CONFIG: Record<string, LookupTableConfig> = {
    countries: { orderBy: 'name', selectActive: false },
    administrative_divisions: { orderBy: 'name', selectActive: true },
    localities: { orderBy: 'name', selectActive: true },
    regional_blocks: { orderBy: 'name', selectActive: true },
    locales: { orderBy: 'code', selectActive: true },
    timezones: { orderBy: 'display_order', selectActive: true },
    subscription_plans: { orderBy: 'display_order', selectActive: true },
    payment_method_icons: { orderBy: 'display_name', selectActive: true },
};
