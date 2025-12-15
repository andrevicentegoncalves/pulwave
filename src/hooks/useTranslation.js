/**
 * useTranslation Hook
 * Main hook for accessing translations in components
 * Provides the t() function and related translation utilities
 */
import { useCallback, useMemo } from 'react';
import { useTranslationContext } from '../contexts/TranslationContext';
import {
    interpolate,
    getNestedValue,
    selectPluralForm,
    buildFallbackChain
} from '../utils/translationUtils';

/**
 * @typedef {Object} TranslationHookReturn
 * @property {Function} t - Main translation function
 * @property {Function} ts - Schema translation function
 * @property {Function} te - Enum translation function
 * @property {string} locale - Current locale code
 * @property {boolean} isRTL - Right-to-left flag
 * @property {string} direction - 'rtl' or 'ltr'
 * @property {boolean} isLoading - Loading state
 * @property {Object[]} availableLocales - Available locales
 * @property {Function} setLocale - Change locale function
 */

/**
 * Main translation hook
 * Provides translation functions and locale utilities
 *
 * @param {string} [namespace] - Optional namespace to scope translations
 * @returns {TranslationHookReturn}
 *
 * @example
 * // Basic usage
 * const { t } = useTranslation();
 * t('dashboard.welcome'); // "Welcome"
 *
 * @example
 * // With namespace
 * const { t } = useTranslation('dashboard');
 * t('welcome'); // Same as t('dashboard.welcome')
 *
 * @example
 * // With interpolation
 * t('greeting', { name: 'John' }); // "Hello, John!"
 *
 * @example
 * // With pluralization
 * t('items', { count: 5 }); // "5 items"
 */
export function useTranslation(namespace = '') {
    const {
        locale,
        bundles,
        isLoading,
        error,
        isRTL,
        direction,
        availableLocales,
        setLocale,
        refreshBundles,
        fallbackChain,
        languageBase
    } = useTranslationContext();

    /**
     * Get translation from a specific bundle type
     * Handles fallback chain and interpolation
     */
    const getTranslation = useCallback((bundleType, key, params = {}, defaultValue = null) => {
        const bundle = bundles[bundleType] || {};

        // Build full key with namespace
        const fullKey = namespace && !key.startsWith(namespace)
            ? `${namespace}.${key}`
            : key;

        // Try to get value
        let value = getNestedValue(bundle, fullKey);

        // If not found, try without namespace (for shared keys)
        if (value === undefined && namespace) {
            value = getNestedValue(bundle, key);
        }

        // Handle pluralization
        if (value && typeof value === 'object' && 'count' in params) {
            value = selectPluralForm(value, params.count, locale);
        }

        // If still not found, use default or key
        if (value === undefined || value === null) {
            // Return default value or the key itself
            return defaultValue !== null ? defaultValue : key;
        }

        // Interpolate variables
        if (typeof value === 'string' && params && Object.keys(params).length > 0) {
            return interpolate(value, params);
        }

        return value;
    }, [bundles, namespace, locale]);

    /**
     * Main translation function (t)
     * Translates UI strings from the ui bundle
     *
     * @param {string} key - Translation key (dot notation)
     * @param {Object} [params] - Interpolation parameters
     * @param {string} [defaultValue] - Default value if key not found
     * @returns {string} - Translated string
     */
    const t = useCallback((key, params = {}, defaultValue = null) => {
        return getTranslation('ui', key, params, defaultValue);
    }, [getTranslation]);

    /**
     * Schema translation function (ts)
     * Translates schema-related strings (table names, column labels)
     *
     * @param {string} key - Translation key (e.g., 'profiles.first_name')
     * @param {Object} [params] - Interpolation parameters
     * @param {string} [defaultValue] - Default value if key not found
     * @returns {string} - Translated string
     */
    const ts = useCallback((key, params = {}, defaultValue = null) => {
        return getTranslation('schema', key, params, defaultValue);
    }, [getTranslation]);

    /**
     * Enum translation function (te)
     * Translates enum values
     *
     * @param {string} key - Translation key (e.g., 'status.active')
     * @param {Object} [params] - Interpolation parameters
     * @param {string} [defaultValue] - Default value if key not found
     * @returns {string} - Translated string
     */
    const te = useCallback((key, params = {}, defaultValue = null) => {
        return getTranslation('enum', key, params, defaultValue);
    }, [getTranslation]);

    /**
     * Check if a translation key exists
     *
     * @param {string} key - Translation key
     * @param {string} [bundleType='ui'] - Bundle to check
     * @returns {boolean}
     */
    const exists = useCallback((key, bundleType = 'ui') => {
        const bundle = bundles[bundleType] || {};
        const fullKey = namespace ? `${namespace}.${key}` : key;
        return getNestedValue(bundle, fullKey) !== undefined;
    }, [bundles, namespace]);

    /**
     * Get all translations for a given prefix
     * Useful for getting all items in a group
     *
     * @param {string} prefix - Key prefix (e.g., 'nav')
     * @param {string} [bundleType='ui'] - Bundle to search
     * @returns {Object} - Object with all matching translations
     */
    const getGroup = useCallback((prefix, bundleType = 'ui') => {
        const bundle = bundles[bundleType] || {};
        const fullPrefix = namespace ? `${namespace}.${prefix}` : prefix;
        return getNestedValue(bundle, fullPrefix) || {};
    }, [bundles, namespace]);

    /**
     * Format a number according to locale
     *
     * @param {number} value - Number to format
     * @param {Object} [options] - Intl.NumberFormat options
     * @returns {string}
     */
    const formatNumber = useCallback((value, options = {}) => {
        try {
            return new Intl.NumberFormat(locale, options).format(value);
        } catch (e) {
            return String(value);
        }
    }, [locale]);

    /**
     * Format a date according to locale
     *
     * @param {Date|string|number} value - Date to format
     * @param {Object} [options] - Intl.DateTimeFormat options
     * @returns {string}
     */
    const formatDate = useCallback((value, options = {}) => {
        try {
            const date = value instanceof Date ? value : new Date(value);
            return new Intl.DateTimeFormat(locale, options).format(date);
        } catch (e) {
            return String(value);
        }
    }, [locale]);

    /**
     * Format currency according to locale
     *
     * @param {number} value - Amount to format
     * @param {string} [currency='USD'] - Currency code
     * @param {Object} [options] - Additional Intl.NumberFormat options
     * @returns {string}
     */
    const formatCurrency = useCallback((value, currency = 'USD', options = {}) => {
        try {
            return new Intl.NumberFormat(locale, {
                style: 'currency',
                currency,
                ...options
            }).format(value);
        } catch (e) {
            return `${currency} ${value}`;
        }
    }, [locale]);

    /**
     * Format relative time (e.g., "2 days ago")
     *
     * @param {Date|string|number} value - Date to compare
     * @param {Object} [options] - Intl.RelativeTimeFormat options
     * @returns {string}
     */
    const formatRelativeTime = useCallback((value, options = {}) => {
        try {
            const date = value instanceof Date ? value : new Date(value);
            const now = new Date();
            const diffMs = date.getTime() - now.getTime();
            const diffSecs = Math.round(diffMs / 1000);
            const diffMins = Math.round(diffSecs / 60);
            const diffHours = Math.round(diffMins / 60);
            const diffDays = Math.round(diffHours / 24);

            const rtf = new Intl.RelativeTimeFormat(locale, {
                numeric: 'auto',
                ...options
            });

            if (Math.abs(diffSecs) < 60) {
                return rtf.format(diffSecs, 'second');
            } else if (Math.abs(diffMins) < 60) {
                return rtf.format(diffMins, 'minute');
            } else if (Math.abs(diffHours) < 24) {
                return rtf.format(diffHours, 'hour');
            } else {
                return rtf.format(diffDays, 'day');
            }
        } catch (e) {
            return String(value);
        }
    }, [locale]);

    // Memoize return object to prevent unnecessary re-renders
    return useMemo(() => ({
        // Translation functions
        t,
        ts,
        te,
        exists,
        getGroup,

        // Formatting functions
        formatNumber,
        formatDate,
        formatCurrency,
        formatRelativeTime,

        // Locale info
        locale,
        languageBase,
        isRTL,
        direction,
        fallbackChain,

        // State
        isLoading,
        error,

        // Locale management
        availableLocales,
        setLocale,
        refreshBundles,

        // Raw bundles for advanced use
        bundles
    }), [
        t, ts, te, exists, getGroup,
        formatNumber, formatDate, formatCurrency, formatRelativeTime,
        locale, languageBase, isRTL, direction, fallbackChain,
        isLoading, error,
        availableLocales, setLocale, refreshBundles,
        bundles
    ]);
}

/**
 * Hook for schema translations only
 * Lighter weight if you only need schema translations
 *
 * @returns {Object} - { ts, locale, isLoading }
 */
export function useSchemaTranslation() {
    const { t, ts, locale, isLoading, bundles } = useTranslation();

    return useMemo(() => ({
        ts,
        // Also provide t for fallback to ui bundle
        t,
        locale,
        isLoading,
        schemaBundle: bundles.schema
    }), [ts, t, locale, isLoading, bundles.schema]);
}

/**
 * Hook for enum translations only
 * Lighter weight if you only need enum translations
 *
 * @returns {Object} - { te, locale, isLoading }
 */
export function useEnumTranslation() {
    const { te, locale, isLoading, bundles } = useTranslation();

    return useMemo(() => ({
        te,
        locale,
        isLoading,
        enumBundle: bundles.enum
    }), [te, locale, isLoading, bundles.enum]);
}

export default useTranslation;
