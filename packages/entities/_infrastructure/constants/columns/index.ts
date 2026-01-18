/**
 * Table Column Definitions
 * Columns per table for UI generation and whitelisting
 */

export const TABLE_COLUMNS: Record<string, string[]> = {
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
