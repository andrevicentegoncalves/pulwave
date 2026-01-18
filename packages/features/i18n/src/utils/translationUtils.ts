/**
 * Translation Utilities
 * Pure helper functions for the translation system
 * 
 * @package @foundation
 */

// Cache key prefixes
const CACHE_PREFIX = 'pulwave_translations';
const CACHE_HASHES_PREFIX = 'pulwave_translations_hashes';
const CACHE_TIMESTAMP_PREFIX = 'pulwave_translations_timestamp';

// Default TTL: 24 hours
const DEFAULT_CACHE_TTL = 24 * 60 * 60 * 1000;

// RTL locales
const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur', 'yi', 'ps', 'sd', 'ku'];

export interface TranslationBundles {
    ui: Record<string, unknown>;
    schema: Record<string, unknown>;
    enum: Record<string, unknown>;
    master_data?: Record<string, unknown>;
    content?: Record<string, unknown>;
}

export interface BundleHashes {
    ui: string | null;
    schema: string | null;
    enum: string | null;
    master_data?: string | null;
    content?: string | null;
}

export function interpolate(template: string | null | undefined, params: Record<string, unknown> = {}): string {
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

export function getLanguageBase(locale: string | null | undefined): string {
    if (!locale || typeof locale !== 'string') {
        return 'en';
    }
    return locale.split('-')[0].toLowerCase();
}

export function isRTLLocale(locale: string | null | undefined, isRTLFromDB: boolean | null = null): boolean {
    if (typeof isRTLFromDB === 'boolean') {
        return isRTLFromDB;
    }

    if (!locale || typeof locale !== 'string') {
        return false;
    }

    const languageBase = getLanguageBase(locale);
    return RTL_LANGUAGES.includes(languageBase);
}

export function getCacheKey(type: string, locale: string): string {
    return `${CACHE_PREFIX}_${type}_${locale}`;
}

export function getHashesCacheKey(locale: string): string {
    return `${CACHE_HASHES_PREFIX}_${locale}`;
}

export function getTimestampCacheKey(locale: string): string {
    return `${CACHE_TIMESTAMP_PREFIX}_${locale}`;
}

export function getCachedBundles(locale: string): TranslationBundles | null {
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

export function setCachedBundles(locale: string, bundles: TranslationBundles, hashes: Partial<BundleHashes> = {}): void {
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

        if (Object.keys(hashes).length > 0) {
            localStorage.setItem(getHashesCacheKey(locale), JSON.stringify(hashes));
        }

        localStorage.setItem(getTimestampCacheKey(locale), Date.now().toString());
    } catch {
        // If localStorage is full, try to clear old translations
        clearOldCaches(locale);
    }
}

export function getCachedHashes(locale: string): BundleHashes | null {
    try {
        const hashes = localStorage.getItem(getHashesCacheKey(locale));
        return hashes ? JSON.parse(hashes) : null;
    } catch {
        // Silent error handling for hash retrieval
        return null;
    }
}

export function getCacheTimestamp(locale: string): number | null {
    try {
        const timestamp = localStorage.getItem(getTimestampCacheKey(locale));
        return timestamp ? parseInt(timestamp, 10) : null;
    } catch {
        return null;
    }
}

export function isCacheValid(locale: string, ttl: number = DEFAULT_CACHE_TTL): boolean {
    const timestamp = getCacheTimestamp(locale);
    if (!timestamp) {
        return false;
    }

    const now = Date.now();
    return (now - timestamp) < ttl;
}

export function hashesMatch(serverHashes: BundleHashes | null, cachedHashes: BundleHashes | null): boolean {
    if (!serverHashes || !cachedHashes) {
        return false;
    }

    return (
        serverHashes.ui === cachedHashes.ui &&
        serverHashes.schema === cachedHashes.schema &&
        serverHashes.enum === cachedHashes.enum
    );
}

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

export function buildFallbackChain(locale: string | null | undefined): string[] {
    const chain: string[] = [];

    if (locale) {
        chain.push(locale);

        const base = getLanguageBase(locale);
        if (base !== locale) {
            chain.push(base);
        }
    }

    if (!chain.includes('en-US')) {
        chain.push('en-US');
    }

    if (!chain.includes('en') && chain.includes('en-US')) {
        chain.splice(chain.indexOf('en-US'), 0, 'en');
    }

    return chain;
}

export function getNestedValue(obj: Record<string, unknown> | null | undefined, path: string): unknown {
    if (!obj || !path) {
        return undefined;
    }

    if (obj[path] !== undefined) {
        return obj[path];
    }

    return path.split('.').reduce((current: unknown, key: string) => {
        return current && typeof current === 'object' ? (current as Record<string, unknown>)[key] : undefined;
    }, obj);
}

export function selectPluralForm(translations: Record<string, string> | null, count: number, locale: string = 'en'): string {
    if (!translations || typeof translations !== 'object') {
        return '';
    }

    if (count === 0 && translations.zero !== undefined) {
        return translations.zero;
    }

    if (count === 1 && translations.one !== undefined) {
        return translations.one;
    }

    if (count === 2 && translations.two !== undefined) {
        return translations.two;
    }

    try {
        const rules = new Intl.PluralRules(locale);
        const form = rules.select(count);

        if (translations[form] !== undefined) {
            return translations[form];
        }
    } catch {
        // Fall back to simple logic if Intl.PluralRules not supported
    }

    return translations.other !== undefined ? translations.other : '';
}

export function normalizeLocale(locale: string | null | undefined): string {
    if (!locale || typeof locale !== 'string') {
        return 'en-US';
    }

    const trimmed = locale.trim();
    const normalized = trimmed.replace('_', '-');
    const parts = normalized.split('-');

    if (parts.length === 1) {
        return parts[0].toLowerCase();
    }

    if (parts.length >= 2) {
        return `${parts[0].toLowerCase()}-${parts[1].toUpperCase()}`;
    }

    return normalized;
}

export interface LocaleInfo {
    native_name?: string;
    name?: string;
    code?: string;
    is_rtl?: boolean;
}

export function formatLocaleDisplayName(locale: LocaleInfo | null): string {
    if (!locale) return '';

    const { native_name, name } = locale;

    if (native_name === name) {
        return native_name || '';
    }

    return native_name ? `${native_name} (${name})` : name || '';
}

export const translationUtils = {
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

export default translationUtils;
