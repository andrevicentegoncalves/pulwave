import { Languages, Type, Database, Layers, FileText, Table } from '@pulwave/ui';

/**
 * Shared configuration for translation source types
 * Used across TranslationsEditor, TranslationFormModal, and list components
 */
export const SOURCE_TYPES = [
    { value: '', label: 'All', icon: Languages, description: 'Show all translation types' },
    { value: 'ui', label: 'UI Strings', icon: Type, description: 'Static text in the interface – buttons, labels, messages, and placeholders' },
    { value: 'database', label: 'Schema', icon: Database, description: 'Database table and column display names for data grids and forms' },
    { value: 'enum', label: 'Enums', icon: Layers, description: 'Dropdown values, status options, and predefined choices' },
    { value: 'content', label: 'Content', icon: FileText, description: 'Dynamic CMS content and user-facing copy that changes over time' },
    { value: 'master_data', label: 'Master Data', icon: Table, description: 'Configurable types and values managed in admin settings' },
];

/**
 * Tooltip content explaining translation types
 */
export const TRANSLATION_TYPES_TOOLTIP = `
**Translation Types:**

• **UI Strings** – Static interface text (buttons, labels, messages)
• **Schema** – Database table and column display names
• **Enums** – Dropdown values and status options
• **Content** – Dynamic CMS content and user-facing copy
• **Master Data** – Configurable types and values from admin
`.trim();

/**
 * Get source type configuration by value
 * @param {string} value - Source type value
 * @returns {Object|undefined} Source type config
 */
export const getSourceTypeConfig = (value: string) =>
    SOURCE_TYPES.find(t => t.value === value);

/**
 * Status options for translations
 */
export const STATUS_OPTIONS = [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'needs_review', label: 'Needs Review' },
];

/**
 * Page size options for pagination
 */
export const PAGE_SIZE_OPTIONS = [
    { value: 10, label: '10 per page' },
    { value: 25, label: '25 per page' },
    { value: 50, label: '50 per page' },
    { value: 100, label: '100 per page' },
];

/**
 * Default page size
 */
export const DEFAULT_PAGE_SIZE = 10;

/**
 * Category groups for UI string translations
 * Used in the grouped category dropdown
 */
export const CATEGORY_GROUPS = [
    {
        label: 'System',
        categories: ['common', 'auth', 'navigation', 'forms', 'errors', 'validation', 'notifications', 'accessibility']
    },
    {
        label: 'Real Estate',
        categories: ['properties', 'units', 'tenants', 'leases', 'contracts', 'maintenance', 'inspections', 'documents']
    },
    {
        label: 'Features',
        categories: ['dashboard', 'reports', 'settings', 'billing', 'payments', 'calendar', 'messages', 'search']
    },
    {
        label: 'Admin',
        categories: ['users', 'roles', 'permissions', 'organizations', 'integrations', 'translations', 'logs', 'config']
    }
];

/**
 * Get category group for a given category
 * @param {string} category - Category key
 * @returns {string|null} Group label or null if not found
 */
export const getCategoryGroup = (category: string): string | null => {
    for (const group of CATEGORY_GROUPS) {
        if (group.categories.includes(category)) {
            return group.label;
        }
    }
    return null;
};
