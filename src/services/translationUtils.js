/**
 * Translation Utilities
 * Auto-generates English translations from database column names
 */

import { adminService } from './adminService';

/**
 * Convert snake_case or camelCase to Title Case
 * Examples:
 *   first_name -> "First name"
 *   lastName -> "Last name"
 *   email_address -> "Email address"
 *   createdAt -> "Created at"
 */
export const columnToLabel = (columnName) => {
    if (!columnName) return '';

    // Handle snake_case
    let label = columnName.replace(/_/g, ' ');

    // Handle camelCase (insert space before uppercase letters)
    label = label.replace(/([a-z])([A-Z])/g, '$1 $2');

    // Capitalize first letter only, lowercase the rest
    label = label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();

    return label;
};

/**
 * Generate default English translations for a list of table columns
 * Returns an array of translation objects ready to upsert
 */
export const generateColumnTranslations = (tableName, columns, sourceType = 'database') => {
    const translations = [];
    const locales = ['en-US', 'en-GB'];

    columns.forEach(column => {
        const label = columnToLabel(column);

        locales.forEach(locale => {
            translations.push({
                translation_key: `${tableName}.${column}`,
                locale_code: locale,
                translated_text: label,
                status: 'draft',
                category: 'database',
                source_type: sourceType,
                source_table: tableName,
                source_column: column,
            });
        });
    });

    return translations;
};

/**
 * Auto-generate and save English translations for a table's columns
 * This creates draft translations for en-US and en-GB that can be edited in admin
 */
export const autoGenerateTableTranslations = async (tableName, columns) => {
    const translations = generateColumnTranslations(tableName, columns);

    const results = [];
    for (const translation of translations) {
        try {
            const result = await adminService.saveUITranslation(translation);
            results.push({ success: true, translation, result });
        } catch (error) {
            // Skip if translation already exists
            if (error.message?.includes('duplicate')) {
                results.push({ success: false, translation, error: 'Already exists' });
            } else {
                results.push({ success: false, translation, error: error.message });
            }
        }
    }

    return results;
};

/**
 * Generate common UI translations for forms
 * Creates translations for common form labels, buttons, validation messages
 */
export const generateCommonUITranslations = () => {
    const locales = ['en-US', 'en-GB'];
    const commonTerms = {
        // Form labels
        'form.first_name': 'First name',
        'form.last_name': 'Last name',
        'form.email': 'Email',
        'form.phone': 'Phone',
        'form.address': 'Address',
        'form.city': 'City',
        'form.country': 'Country',
        'form.zip_code': 'ZIP code',
        'form.postal_code': 'Postal code', // UK variant
        'form.password': 'Password',
        'form.confirm_password': 'Confirm password',

        // Buttons
        'button.save': 'Save',
        'button.cancel': 'Cancel',
        'button.delete': 'Delete',
        'button.edit': 'Edit',
        'button.create': 'Create',
        'button.submit': 'Submit',

        // Validation
        'validation.required': 'This field is required',
        'validation.email_invalid': 'Please enter a valid email',
        'validation.min_length': 'Must be at least {min} characters',
        'validation.max_length': 'Must be at most {max} characters',
    };

    const translations = [];

    Object.entries(commonTerms).forEach(([key, text]) => {
        locales.forEach(locale => {
            translations.push({
                translation_key: key,
                locale_code: locale,
                translated_text: text,
                status: 'draft',
                category: 'common',
                source_type: 'ui',
            });
        });
    });

    return translations;
};

export default {
    columnToLabel,
    generateColumnTranslations,
    autoGenerateTableTranslations,
    generateCommonUITranslations,
};
