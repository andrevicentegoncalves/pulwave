/**
 * String formatting utilities
 */

/**
 * Convert snake_case or kebab-case string to Title Case
 * @param {string} str - String to convert
 * @returns {string} Title cased string
 * 
 * @example
 * toTitleCase('hello_world') // => 'Hello World'
 * toTitleCase('administrative_divisions') // => 'Administrative Divisions'
 */
export const toTitleCase = (str) =>
    str?.replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || '';

/**
 * Format a table/column name for display (alias for toTitleCase)
 * @param {string} name - Database name to format
 * @returns {string} Formatted display name
 */
export const formatTableName = toTitleCase;

/**
 * Truncate string with ellipsis
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated string
 */
export const truncate = (str, maxLength = 30) => {
    if (!str || str.length <= maxLength) return str || '';
    return str.substring(0, maxLength) + '...';
};

/**
 * Format a JSON value for display
 * @param {any} value - Value to format
 * @returns {string} Formatted string
 */
export const formatJsonValue = (value) => {
    if (typeof value === 'object') {
        return JSON.stringify(value, null, 2);
    }
    return String(value);
};

/**
 * Get display label for a database record
 * Tries common text fields like name, title, label, etc.
 * @param {Object} record - Database record
 * @returns {string} Display label
 */
export const getRecordLabel = (record) => {
    const textFields = ['name', 'title', 'label', 'slug', 'email', 'username', 'code', 'description', 'full_name', 'first_name'];
    const field = textFields.find(f => record[f]);
    const shortId = record.id && typeof record.id === 'string' ? record.id.substring(0, 8) : record.id;

    if (field) {
        let val = record[field];
        if (typeof val === 'string' && val.length > 30) val = val.substring(0, 30) + '...';
        return `${val} (${shortId})`;
    }
    return `ID: ${shortId}`;
};
