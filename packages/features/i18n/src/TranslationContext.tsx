/**
 * Translation Context
 * Main provider for the internationalization system
 * 
 * @package @foundation/shared
 */
import React, { createContext, useContext, useEffect, useState, useCallback, useRef, ReactNode } from 'react';

import type { Locale, TranslationService } from '@pulwave/entity-translation';
import type { TranslationBundles, BundleHashes } from '@pulwave/types';

export interface CacheUtils {
    getCachedBundles(locale: string): TranslationBundles | null;
    setCachedBundles(locale: string, bundles: TranslationBundles, hashes: BundleHashes): void;
    getCachedHashes(locale: string): BundleHashes | null;
    isCacheValid(locale: string, ttl: number): boolean;
    hashesMatch(a: BundleHashes, b: BundleHashes | null): boolean;
    clearCachedBundles(locale: string): void;
    isRTLLocale(locale: string): boolean;
    getLanguageBase(locale: string): string;
    buildFallbackChain(locale: string): string[];
}

export interface TranslationContextValue {
    locale: string;
    bundles: TranslationBundles;
    isLoading: boolean;
    error: Error | null;
    isRTL: boolean;
    direction: 'ltr' | 'rtl';
    availableLocales: Locale[];
    setLocale: (locale: string) => Promise<void>;
    refreshBundles: () => Promise<void>;
    fallbackChain: string[];
    languageBase: string;
}

const TranslationContext = createContext<TranslationContextValue | null>(null);

const DEFAULT_LOCALE = 'en-US';
const CACHE_TTL = 24 * 60 * 60 * 1000;

interface TranslationProviderProps {
    children: ReactNode;
    translationService: TranslationService;
    cacheUtils: CacheUtils;
    userId?: string | null;
}

/**
 * Translation Provider Component
 */
export function TranslationProvider({ children, translationService, cacheUtils, userId }: TranslationProviderProps) {
    const [locale, setLocaleState] = useState(() => {
        return localStorage.getItem('pulwave_current_locale') || DEFAULT_LOCALE;
    });
    const [bundles, setBundles] = useState<TranslationBundles>({
        ui: {}, schema: {}, enum: {}, master_data: {}, content: {}
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [availableLocales, setAvailableLocales] = useState<Locale[]>([]);
    const [localeInfo, setLocaleInfo] = useState<Locale | null>(null);

    const profileIdRef = useRef<string | null>(null);
    const isMountedRef = useRef(true);

    // Defensive fallbacks for when cacheUtils is not provided
    const safeIsRTLLocale = (loc: string) => {
        if (cacheUtils?.isRTLLocale) return cacheUtils.isRTLLocale(loc);
        const rtlLocales = ['ar', 'he', 'fa', 'ur'];
        return rtlLocales.some(rtl => loc.startsWith(rtl));
    };

    const isRTL = localeInfo?.is_rtl ?? safeIsRTLLocale(locale);
    const direction = isRTL ? 'rtl' : 'ltr';

    const loadBundles = useCallback(async (loc: string, forceRefresh = false) => {
        // Skip if translationService is not provided
        if (!translationService) {
            setIsLoading(false);
            return;
        }

        try {
            if (!forceRefresh && cacheUtils) {
                const cachedBundles = cacheUtils.getCachedBundles?.(loc);
                const cacheIsValid = cacheUtils.isCacheValid?.(loc, CACHE_TTL) ?? false;

                if (cachedBundles && cacheIsValid) {
                    setBundles(cachedBundles);
                    setIsLoading(false);
                    return;
                }

                if (cachedBundles) {
                    setBundles(cachedBundles);
                }
            }

            setIsLoading(true);
            const { bundles: freshBundles, hashes } = await translationService.fetchBundles(loc);

            if (isMountedRef.current) {
                setBundles(freshBundles);
                cacheUtils?.setCachedBundles?.(loc, freshBundles, hashes);
                setError(null);
            }
        } catch (err) {
            const cachedBundles = cacheUtils?.getCachedBundles?.(loc);
            if (cachedBundles) {
                setBundles(cachedBundles);
                setError(new Error('Using cached translations. Network error occurred.'));
            } else {
                setError(err as Error);
            }
        } finally {
            if (isMountedRef.current) {
                setIsLoading(false);
            }
        }
    }, [translationService, cacheUtils]);

    const setLocale = useCallback(async (newLocale: string) => {
        if (newLocale === locale) return;

        setLocaleState(newLocale);
        localStorage.setItem('pulwave_current_locale', newLocale);

        // Parallelize independent operations for faster locale switch
        const promises: Promise<void>[] = [loadBundles(newLocale)];

        if (translationService?.getLocaleByCode) {
            promises.push(
                translationService.getLocaleByCode(newLocale).then(info => {
                    if (isMountedRef.current) {
                        setLocaleInfo(info);
                        document.documentElement.lang = newLocale;
                        document.documentElement.dir = info?.is_rtl ? 'rtl' : 'ltr';
                    }
                })
            );
        }

        // Background task - fire and forget (don't block UI)
        if (profileIdRef.current && translationService?.updateUserLocale) {
            translationService.updateUserLocale(profileIdRef.current, newLocale).catch(() => {
                // Silently handle failure - user can still use app with localStorage locale
            });
        }

        await Promise.all(promises);
    }, [locale, loadBundles, translationService]);

    const refreshBundles = useCallback(async () => {
        cacheUtils?.clearCachedBundles?.(locale);
        await loadBundles(locale, true);
    }, [locale, loadBundles, cacheUtils]);

    useEffect(() => {
        isMountedRef.current = true;

        const init = async () => {
            // Parallelize independent operations for faster init
            const promises: Promise<void>[] = [loadBundles(locale)];

            if (translationService?.getAvailableLocales) {
                promises.push(
                    translationService.getAvailableLocales().then(locales => {
                        if (isMountedRef.current) {
                            setAvailableLocales(locales);
                        }
                    })
                );
            }

            await Promise.all(promises);
        };

        init();

        return () => {
            isMountedRef.current = false;
        };
    }, [translationService, loadBundles, locale]);

    const value: TranslationContextValue = {
        locale,
        bundles,
        isLoading,
        error,
        isRTL,
        direction,
        availableLocales,
        setLocale,
        refreshBundles,
        fallbackChain: cacheUtils?.buildFallbackChain ? cacheUtils.buildFallbackChain(locale) : [locale, locale.split('-')[0], 'en'],
        languageBase: cacheUtils?.getLanguageBase ? cacheUtils.getLanguageBase(locale) : locale.split('-')[0]
    };

    return (
        <TranslationContext.Provider value={value}>
            {children}
        </TranslationContext.Provider>
    );
}

/**
 * Hook to access translation context
 */
export function useTranslationContext(): TranslationContextValue {
    const context = useContext(TranslationContext);
    if (!context) {
        throw new Error('useTranslationContext must be used within a TranslationProvider');
    }
    return context;
}

export { TranslationContext };
