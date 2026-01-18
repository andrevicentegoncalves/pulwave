/**
 * useTranslation Hook
 * Main hook for accessing translations in components
 * 
 * @package @foundation
 */
import { useCallback, useMemo } from 'react';
import { useTranslationContext } from './TranslationContext';
import {
    interpolate,
    getNestedValue,
    selectPluralForm,
} from './utils/translationUtils';

export interface TranslationHookOptions {
    namespace?: string;
}

export interface UseTranslationReturn {
    // Translation functions
    t: (key: string, params?: Record<string, unknown>, defaultValue?: string | null) => string;
    ts: (key: string, params?: Record<string, unknown>, defaultValue?: string | null) => string;
    te: (key: string, params?: Record<string, unknown> | string, defaultValue?: string | null) => string;
    exists: (key: string, bundleType?: 'ui' | 'schema' | 'enum' | 'master_data' | 'content') => boolean;
    getGroup: (prefix: string, bundleType?: 'ui' | 'schema' | 'enum' | 'master_data' | 'content') => Record<string, unknown>;

    // Formatting functions
    formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
    formatDate: (value: Date | string | number, options?: Intl.DateTimeFormatOptions) => string;
    formatCurrency: (value: number, currency?: string, options?: Intl.NumberFormatOptions) => string;
    formatRelativeTime: (value: Date | string | number, options?: Intl.RelativeTimeFormatOptions) => string;

    // Locale info
    locale: string;
    languageBase: string;
    isRTL: boolean;
    direction: 'ltr' | 'rtl';
    fallbackChain: string[];

    // State
    isLoading: boolean;
    error: Error | null;

    // Locale management
    availableLocales: any[]; // Typed in context but keeping simple here
    setLocale: (locale: string) => Promise<void>;
    refreshBundles: () => Promise<void>;

    // Raw bundles
    bundles: Record<string, any>;
}

export function useTranslation(namespace: string = ''): UseTranslationReturn {
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

    const keyToLabel = useCallback((key: string): string => {
        const parts = key.split('.');
        const lastPart = parts[parts.length - 1];

        return lastPart
            .replace(/_/g, ' ')
            .replace(/-/g, ' ')
            .replace(/\b\w/g, char => char.toUpperCase());
    }, []);

    const getTranslation = useCallback((
        bundleType: 'ui' | 'schema' | 'enum' | 'master_data' | 'content',
        key: string,
        params: Record<string, unknown> = {},
        defaultValue: string | null = null
    ): string => {
        const bundle = bundles[bundleType] || {};

        const fullKey = namespace && !key.startsWith(namespace)
            ? `${namespace}.${key}`
            : key;

        let value = getNestedValue(bundle, fullKey);

        if (value === undefined && namespace) {
            value = getNestedValue(bundle, key);
        }

        if (value && typeof value === 'object' && params && typeof params === 'object' && 'count' in params) {
            value = selectPluralForm(value as Record<string, string>, Number(params.count), locale);
        }

        if (value === undefined || value === null) {
            return defaultValue !== null ? defaultValue : keyToLabel(key);
        }

        if (typeof value === 'string' && params && Object.keys(params).length > 0) {
            return interpolate(value, params);
        }

        return String(value);
    }, [bundles, namespace, locale, keyToLabel]);

    const t = useCallback((key: string, params: Record<string, unknown> = {}, defaultValue: string | null = null) => {
        return getTranslation('ui', key, params, defaultValue);
    }, [getTranslation]);

    const ts = useCallback((key: string, params: Record<string, unknown> = {}, defaultValue: string | null = null) => {
        return getTranslation('schema', key, params, defaultValue);
    }, [getTranslation]);

    const te = useCallback((key: string, params: Record<string, unknown> | string = {}, defaultValue: string | null = null) => {
        if (typeof params === 'string') {
            return getTranslation('enum', `${key}.${params}`, {}, defaultValue);
        }
        return getTranslation('enum', key, params, defaultValue);
    }, [getTranslation]);

    const exists = useCallback((key: string, bundleType: 'ui' | 'schema' | 'enum' | 'master_data' | 'content' = 'ui') => {
        const bundle = bundles[bundleType] || {};
        const fullKey = namespace ? `${namespace}.${key}` : key;
        return getNestedValue(bundle, fullKey) !== undefined;
    }, [bundles, namespace]);

    const getGroup = useCallback((prefix: string, bundleType: 'ui' | 'schema' | 'enum' | 'master_data' | 'content' = 'ui') => {
        const bundle = bundles[bundleType] || {};
        const fullPrefix = namespace ? `${namespace}.${prefix}` : prefix;
        return (getNestedValue(bundle, fullPrefix) as Record<string, unknown>) || {};
    }, [bundles, namespace]);

    const formatNumber = useCallback((value: number, options: Intl.NumberFormatOptions = {}) => {
        try {
            return new Intl.NumberFormat(locale, options).format(value);
        } catch (e) {
            return String(value);
        }
    }, [locale]);

    const formatDate = useCallback((value: Date | string | number, options: Intl.DateTimeFormatOptions = {}) => {
        try {
            const date = value instanceof Date ? value : new Date(value);
            return new Intl.DateTimeFormat(locale, options).format(date);
        } catch (e) {
            return String(value);
        }
    }, [locale]);

    const formatCurrency = useCallback((value: number, currency = 'USD', options: Intl.NumberFormatOptions = {}) => {
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

    const formatRelativeTime = useCallback((value: Date | string | number, options: Intl.RelativeTimeFormatOptions = {}) => {
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

    return useMemo(() => ({
        t,
        ts,
        te,
        exists,
        getGroup,
        formatNumber,
        formatDate,
        formatCurrency,
        formatRelativeTime,
        locale,
        languageBase,
        isRTL,
        direction,
        fallbackChain,
        isLoading,
        error,
        availableLocales,
        setLocale,
        refreshBundles,
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

export function useSchemaTranslation() {
    const { t, ts, locale, isLoading, bundles } = useTranslation();

    return useMemo(() => ({
        ts,
        t,
        locale,
        isLoading,
        schemaBundle: bundles.schema
    }), [ts, t, locale, isLoading, bundles.schema]);
}

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
