/**
 * String formatting utilities
 * 
 * @package @foundation
 */

/**
 * Convert snake_case or kebab-case string to Title Case
 * 
 * @example
 * toTitleCase('hello_world') // => 'Hello World'
 * toTitleCase('administrative_divisions') // => 'Administrative Divisions'
 */
export const toTitleCase = (str: string | null | undefined): string =>
    str?.replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || '';

/**
 * Format a table/column name for display (alias for toTitleCase)
 */
export const formatTableName = toTitleCase;

/**
 * Truncate string with ellipsis
 */
export const truncate = (str: string | null | undefined, maxLength: number = 30): string => {
    if (!str || str.length <= maxLength) return str || '';
    return str.substring(0, maxLength) + '...';
};

/**
 * Format a JSON value for display
 */
export const formatJsonValue = (value: unknown): string => {
    if (typeof value === 'object') {
        return JSON.stringify(value, null, 2);
    }
    return String(value);
};

/**
 * Get display label for a database record
 * Tries common text fields like name, title, label, etc.
 */
export const getRecordLabel = (record: Record<string, unknown>): string => {
    const textFields = ['name', 'title', 'label', 'slug', 'email', 'username', 'code', 'description', 'full_name', 'first_name'];
    const field = textFields.find(f => record[f]);
    const id = record.id;
    const shortId = id && typeof id === 'string' ? id.substring(0, 8) : String(id);

    if (field) {
        let val = String(record[field]);
        if (val.length > 30) val = val.substring(0, 30) + '...';
        return `${val} (${shortId})`;
    }
    return `ID: ${shortId}`;
};
