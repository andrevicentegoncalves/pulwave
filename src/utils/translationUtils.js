/**
 * Translation Utilities
 * Pure helper functions for the translation system
 */

// Cache key prefixes
const CACHE_PREFIX = 'pulwave_translations';
const CACHE_HASHES_PREFIX = 'pulwave_translations_hashes';
const CACHE_TIMESTAMP_PREFIX = 'pulwave_translations_timestamp';

// Default TTL: 24 hours
const DEFAULT_CACHE_TTL = 24 * 60 * 60 * 1000;

// RTL locales - languages written right-to-left
const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur', 'yi', 'ps', 'sd', 'ku'];

/**
 * Interpolate variables into a template string
 * Replaces {variable} placeholders with provided values
 *
 * @param {string} template - Template string with {variable} placeholders
 * @param {Object} params - Key-value pairs for interpolation
 * @returns {string} - Interpolated string
 *
 * @example
 * interpolate('Hello, {name}!', { name: 'World' }) // 'Hello, World!'
 * interpolate('{count} items', { count: 5 }) // '5 items'
 */
export function interpolate(template, params = {}) {
    if (!template || typeof template !== 'string') {
        return template || '';
    }

    if (!params || typeof params !== 'object') {
        return template;
    }

    return template.replace(/\{(\w+)\}/g, (match, key) => {
        const value = params[key];
        return value !== undefined && value !== null ? String(value) : match;
    });
}

/**
 * Get the language base from a locale code
 * Extracts the language part from locale codes like 'pt-PT' -> 'pt'
 *
 * @param {string} locale - Full locale code (e.g., 'en-US', 'pt-PT')
 * @returns {string} - Language base (e.g., 'en', 'pt')
 */
export function getLanguageBase(locale) {
    if (!locale || typeof locale !== 'string') {
        return 'en';
    }
    return locale.split('-')[0].toLowerCase();
}

/**
 * Check if a locale is RTL (right-to-left)
 *
 * @param {string} locale - Locale code to check
 * @param {boolean} isRTLFromDB - Optional is_rtl value from database
 * @returns {boolean} - True if locale is RTL
 */
export function isRTLLocale(locale, isRTLFromDB = null) {
    // If we have the value from the database, use it
    if (typeof isRTLFromDB === 'boolean') {
        return isRTLFromDB;
    }

    if (!locale || typeof locale !== 'string') {
        return false;
    }

    const languageBase = getLanguageBase(locale);
    return RTL_LANGUAGES.includes(languageBase);
}

/**
 * Get cache key for bundles of a specific type and locale
 *
 * @param {string} type - Bundle type (ui, schema, enum)
 * @param {string} locale - Locale code
 * @returns {string} - Cache key
 */
export function getCacheKey(type, locale) {
    return `${CACHE_PREFIX}_${type}_${locale}`;
}

/**
 * Get cache key for bundle hashes
 *
 * @param {string} locale - Locale code
 * @returns {string} - Cache key for hashes
 */
export function getHashesCacheKey(locale) {
    return `${CACHE_HASHES_PREFIX}_${locale}`;
}

/**
 * Get cache key for timestamp
 *
 * @param {string} locale - Locale code
 * @returns {string} - Cache key for timestamp
 */
export function getTimestampCacheKey(locale) {
    return `${CACHE_TIMESTAMP_PREFIX}_${locale}`;
}

/**
 * Get cached bundles for a locale
 *
 * @param {string} locale - Locale code
 * @returns {Object|null} - Cached bundles { ui, schema, enum } or null
 */
export function getCachedBundles(locale) {
    try {
        const ui = localStorage.getItem(getCacheKey('ui', locale));
        const schema = localStorage.getItem(getCacheKey('schema', locale));
        const enumBundle = localStorage.getItem(getCacheKey('enum', locale));

        if (!ui && !schema && !enumBundle) {
            return null;
        }

        return {
            ui: ui ? JSON.parse(ui) : {},
            schema: schema ? JSON.parse(schema) : {},
            enum: enumBundle ? JSON.parse(enumBundle) : {}
        };
    } catch (error) {
        console.warn('Failed to get cached bundles:', error);
        return null;
    }
}

/**
 * Set cached bundles for a locale
 *
 * @param {string} locale - Locale code
 * @param {Object} bundles - Bundles to cache { ui, schema, enum }
 * @param {Object} hashes - Content hashes for validation { ui, schema, enum }
 */
export function setCachedBundles(locale, bundles, hashes = {}) {
    try {
        if (bundles.ui) {
            localStorage.setItem(getCacheKey('ui', locale), JSON.stringify(bundles.ui));
        }
        if (bundles.schema) {
            localStorage.setItem(getCacheKey('schema', locale), JSON.stringify(bundles.schema));
        }
        if (bundles.enum) {
            localStorage.setItem(getCacheKey('enum', locale), JSON.stringify(bundles.enum));
        }

        // Store hashes for validation
        if (Object.keys(hashes).length > 0) {
            localStorage.setItem(getHashesCacheKey(locale), JSON.stringify(hashes));
        }

        // Store timestamp
        localStorage.setItem(getTimestampCacheKey(locale), Date.now().toString());
    } catch (error) {
        console.warn('Failed to cache bundles:', error);
        // If localStorage is full, try to clear old translations
        clearOldCaches(locale);
    }
}

/**
 * Get cached content hashes for a locale
 *
 * @param {string} locale - Locale code
 * @returns {Object|null} - Cached hashes { ui, schema, enum } or null
 */
export function getCachedHashes(locale) {
    try {
        const hashes = localStorage.getItem(getHashesCacheKey(locale));
        return hashes ? JSON.parse(hashes) : null;
    } catch (error) {
        console.warn('Failed to get cached hashes:', error);
        return null;
    }
}

/**
 * Get cache timestamp for a locale
 *
 * @param {string} locale - Locale code
 * @returns {number|null} - Timestamp in milliseconds or null
 */
export function getCacheTimestamp(locale) {
    try {
        const timestamp = localStorage.getItem(getTimestampCacheKey(locale));
        return timestamp ? parseInt(timestamp, 10) : null;
    } catch (error) {
        return null;
    }
}

/**
 * Check if cache is still valid based on TTL
 *
 * @param {string} locale - Locale code
 * @param {number} ttl - Time to live in milliseconds (default 24h)
 * @returns {boolean} - True if cache is valid
 */
export function isCacheValid(locale, ttl = DEFAULT_CACHE_TTL) {
    const timestamp = getCacheTimestamp(locale);
    if (!timestamp) {
        return false;
    }

    const now = Date.now();
    return (now - timestamp) < ttl;
}

/**
 * Compare server hashes with cached hashes to determine if revalidation is needed
 *
 * @param {Object} serverHashes - Hashes from server { ui, schema, enum }
 * @param {Object} cachedHashes - Cached hashes { ui, schema, enum }
 * @returns {boolean} - True if hashes match and cache is valid
 */
export function hashesMatch(serverHashes, cachedHashes) {
    if (!serverHashes || !cachedHashes) {
        return false;
    }

    return (
        serverHashes.ui === cachedHashes.ui &&
        serverHashes.schema === cachedHashes.schema &&
        serverHashes.enum === cachedHashes.enum
    );
}

/**
 * Clear cached translations for a specific locale
 *
 * @param {string} locale - Locale code to clear
 */
export function clearCachedBundles(locale) {
    try {
        localStorage.removeItem(getCacheKey('ui', locale));
        localStorage.removeItem(getCacheKey('schema', locale));
        localStorage.removeItem(getCacheKey('enum', locale));
        localStorage.removeItem(getHashesCacheKey(locale));
        localStorage.removeItem(getTimestampCacheKey(locale));
    } catch (error) {
        console.warn('Failed to clear cached bundles:', error);
    }
}

/**
 * Clear all cached translations except for the current locale
 * Used when localStorage is full
 *
 * @param {string} keepLocale - Locale to keep in cache
 */
export function clearOldCaches(keepLocale) {
    try {
        const keysToRemove = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(CACHE_PREFIX) && !key.includes(keepLocale)) {
                keysToRemove.push(key);
            }
        }

        keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
        console.warn('Failed to clear old caches:', error);
    }
}

/**
 * Build a fallback chain for locale lookups
 * Returns an array of locales to try in order
 *
 * @param {string} locale - Primary locale
 * @returns {string[]} - Array of locales to try [exact, language-base, 'en-US']
 *
 * @example
 * buildFallbackChain('pt-BR') // ['pt-BR', 'pt', 'en-US']
 * buildFallbackChain('en-US') // ['en-US', 'en']
 */
export function buildFallbackChain(locale) {
    const chain = [];

    if (locale) {
        chain.push(locale);

        const base = getLanguageBase(locale);
        if (base !== locale) {
            chain.push(base);
        }
    }

    // Always have en-US as ultimate fallback
    if (!chain.includes('en-US')) {
        chain.push('en-US');
    }

    // Add 'en' as fallback before en-US if not already present
    if (!chain.includes('en') && chain.includes('en-US')) {
        chain.splice(chain.indexOf('en-US'), 0, 'en');
    }

    return chain;
}

/**
 * Get a nested value from an object using dot notation
 *
 * @param {Object} obj - Object to get value from
 * @param {string} path - Dot-notation path (e.g., 'dashboard.welcome')
 * @returns {*} - Value at path or undefined
 */
export function getNestedValue(obj, path) {
    if (!obj || !path) {
        return undefined;
    }

    return path.split('.').reduce((current, key) => {
        return current && typeof current === 'object' ? current[key] : undefined;
    }, obj);
}

/**
 * Select the correct plural form based on count
 * Supports zero, one, two, few, many, other forms
 *
 * @param {Object} translations - Object with plural forms { zero, one, two, few, many, other }
 * @param {number} count - Count to determine plural form
 * @param {string} locale - Locale for language-specific rules
 * @returns {string} - Selected translation form
 */
export function selectPluralForm(translations, count, locale = 'en') {
    if (!translations || typeof translations !== 'object') {
        return '';
    }

    // Special case: zero
    if (count === 0 && translations.zero !== undefined) {
        return translations.zero;
    }

    // Special case: one
    if (count === 1 && translations.one !== undefined) {
        return translations.one;
    }

    // Special case: two (for languages with dual forms)
    if (count === 2 && translations.two !== undefined) {
        return translations.two;
    }

    // Use Intl.PluralRules for proper locale-specific plural selection
    try {
        const rules = new Intl.PluralRules(locale);
        const form = rules.select(count);

        if (translations[form] !== undefined) {
            return translations[form];
        }
    } catch (error) {
        // Fall back to simple logic if Intl.PluralRules fails
        console.warn('Intl.PluralRules not supported:', error);
    }

    // Fallback to 'other' form
    return translations.other !== undefined ? translations.other : '';
}

/**
 * Normalize a locale code to standard format
 * Handles various input formats and returns standardized code
 *
 * @param {string} locale - Input locale code
 * @returns {string} - Normalized locale code (e.g., 'en-US')
 */
export function normalizeLocale(locale) {
    if (!locale || typeof locale !== 'string') {
        return 'en-US';
    }

    // Remove whitespace
    const trimmed = locale.trim();

    // Handle underscore separator (e.g., 'en_US' -> 'en-US')
    const normalized = trimmed.replace('_', '-');

    // Split into parts
    const parts = normalized.split('-');

    if (parts.length === 1) {
        // Just language code
        return parts[0].toLowerCase();
    }

    if (parts.length >= 2) {
        // Language and country/region
        return `${parts[0].toLowerCase()}-${parts[1].toUpperCase()}`;
    }

    return normalized;
}

/**
 * Format a locale display name
 * Combines native name with international name for display
 *
 * @param {Object} locale - Locale object from database
 * @returns {string} - Formatted display name
 */
export function formatLocaleDisplayName(locale) {
    if (!locale) return '';

    const { native_name, name } = locale;

    // If native name is the same as English name, just show one
    if (native_name === name) {
        return native_name;
    }

    // Show native name with English name in parentheses
    return native_name ? `${native_name} (${name})` : name;
}

export default {
    interpolate,
    getLanguageBase,
    isRTLLocale,
    getCachedBundles,
    setCachedBundles,
    getCachedHashes,
    getCacheTimestamp,
    isCacheValid,
    hashesMatch,
    clearCachedBundles,
    clearOldCaches,
    buildFallbackChain,
    getNestedValue,
    selectPluralForm,
    normalizeLocale,
    formatLocaleDisplayName
};
