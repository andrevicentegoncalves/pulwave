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
 */
export function interpolate(template: string, params: Record<string, any> = {}): string {
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
 */
export function getLanguageBase(locale: string): string {
    if (!locale || typeof locale !== 'string') {
        return 'en';
    }
    return locale.split('-')[0].toLowerCase();
}

/**
 * Check if a locale is RTL (right-to-left)
 */
export function isRTLLocale(locale: string, isRTLFromDB: boolean | null = null): boolean {
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
 */
export function getCacheKey(type: string, locale: string): string {
    return `${CACHE_PREFIX}_${type}_${locale}`;
}

/**
 * Get cache key for bundle hashes
 */
export function getHashesCacheKey(locale: string): string {
    return `${CACHE_HASHES_PREFIX}_${locale}`;
}

/**
 * Get cache key for timestamp
 */
export function getTimestampCacheKey(locale: string): string {
    return `${CACHE_TIMESTAMP_PREFIX}_${locale}`;
}

/**
 * Get cached bundles for a locale
 */
export function getCachedBundles(locale: string): { ui: any; schema: any; enum: any } | null {
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
    } catch {
        // Silent error handling for cache retrieval
        return null;
    }
}

/**
 * Set cached bundles for a locale
 */
export function setCachedBundles(locale: string, bundles: { ui?: any; schema?: any; enum?: any }, hashes: Record<string, string> = {}): void {
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
    } catch {
        // If localStorage is full, try to clear old translations
        clearOldCaches(locale);
    }
}

/**
 * Get cached content hashes for a locale
 */
export function getCachedHashes(locale: string): Record<string, string> | null {
    try {
        const hashes = localStorage.getItem(getHashesCacheKey(locale));
        return hashes ? JSON.parse(hashes) : null;
    } catch {
        // Silent error handling for hash retrieval
        return null;
    }
}

/**
 * Get cache timestamp for a locale
 */
export function getCacheTimestamp(locale: string): number | null {
    try {
        const timestamp = localStorage.getItem(getTimestampCacheKey(locale));
        return timestamp ? parseInt(timestamp, 10) : null;
    } catch (error) {
        return null;
    }
}

/**
 * Check if cache is still valid based on TTL
 */
export function isCacheValid(locale: string, ttl: number = DEFAULT_CACHE_TTL): boolean {
    const timestamp = getCacheTimestamp(locale);
    if (!timestamp) {
        return false;
    }

    const now = Date.now();
    return (now - timestamp) < ttl;
}

/**
 * Compare server hashes with cached hashes to determine if revalidation is needed
 */
export function hashesMatch(serverHashes: any, cachedHashes: any): boolean {
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
 */
export function clearCachedBundles(locale: string): void {
    try {
        localStorage.removeItem(getCacheKey('ui', locale));
        localStorage.removeItem(getCacheKey('schema', locale));
        localStorage.removeItem(getCacheKey('enum', locale));
        localStorage.removeItem(getHashesCacheKey(locale));
        localStorage.removeItem(getTimestampCacheKey(locale));
    } catch {
        // Silent error handling for cache clearing
    }
}

/**
 * Clear all cached translations except for the current locale
 * Used when localStorage is full
 */
export function clearOldCaches(keepLocale: string): void {
    try {
        const keysToRemove: string[] = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(CACHE_PREFIX) && !key.includes(keepLocale)) {
                keysToRemove.push(key);
            }
        }

        keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch {
        // Silent error handling for old cache clearing
    }
}

/**
 * Build a fallback chain for locale lookups
 */
export function buildFallbackChain(locale: string): string[] {
    const chain: string[] = [];

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
 */
export function getNestedValue(obj: any, path: string): any {
    if (!obj || !path) {
        return undefined;
    }

    // Try direct lookup first (supporting flat keys like "common.personal_information")
    if (obj[path] !== undefined) {
        return obj[path];
    }

    return path.split('.').reduce((current, key) => {
        return current && typeof current === 'object' ? current[key] : undefined;
    }, obj);
}

/**
 * Select the correct plural form based on count
 */
export function selectPluralForm(translations: any, count: number, locale: string = 'en'): string {
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
    } catch {
        // Fall back to simple logic if Intl.PluralRules not supported
    }

    // Fallback to 'other' form
    return translations.other !== undefined ? translations.other : '';
}

/**
 * Normalize a locale code to standard format
 */
export function normalizeLocale(locale: string): string {
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
 */
export function formatLocaleDisplayName(locale: { native_name: string; name: string } | null): string {
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
