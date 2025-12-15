/**
 * Translation Context
 * Main provider for the internationalization system
 * Manages locale state, translation bundles, and caching
 */
import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from './AuthContext';
import { translationService } from '../services/translationService';
import {
    getCachedBundles,
    setCachedBundles,
    getCachedHashes,
    isCacheValid,
    hashesMatch,
    clearCachedBundles,
    isRTLLocale,
    getLanguageBase,
    buildFallbackChain
} from '../utils/translationUtils';

// Default locale
const DEFAULT_LOCALE = 'en-US';

// Cache TTL: 24 hours
const CACHE_TTL = 24 * 60 * 60 * 1000;

// Background revalidation interval: 1 hour
const REVALIDATION_INTERVAL = 60 * 60 * 1000;

/**
 * @typedef {Object} TranslationContextValue
 * @property {string} locale - Current locale code
 * @property {Object} bundles - Translation bundles { ui, schema, enum }
 * @property {boolean} isLoading - Loading state
 * @property {Error|null} error - Error state
 * @property {boolean} isRTL - Right-to-left direction
 * @property {string} direction - 'rtl' or 'ltr'
 * @property {Object[]} availableLocales - List of available locales
 * @property {Function} setLocale - Function to change locale
 * @property {Function} refreshBundles - Function to force refresh bundles
 */

const TranslationContext = createContext(null);

/**
 * Translation Provider Component
 * Wraps the application to provide translation functionality
 */
export function TranslationProvider({ children }) {
    // Get user from AuthContext
    const { user } = useAuth();

    // State
    const [locale, setLocaleState] = useState(() => {
        // Try to get from localStorage first (for quick initial render)
        return localStorage.getItem('pulwave_current_locale') || DEFAULT_LOCALE;
    });
    const [bundles, setBundles] = useState({ ui: {}, schema: {}, enum: {} });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [availableLocales, setAvailableLocales] = useState([]);
    const [localeInfo, setLocaleInfo] = useState(null);

    // Refs for tracking
    const profileIdRef = useRef(null);
    const revalidationTimerRef = useRef(null);
    const isMountedRef = useRef(true);

    // Computed values
    const isRTL = localeInfo?.is_rtl ?? isRTLLocale(locale);
    const direction = isRTL ? 'rtl' : 'ltr';

    /**
     * Apply document attributes for locale/direction
     */
    const applyDocumentAttributes = useCallback((loc, dir) => {
        document.documentElement.lang = loc;
        document.documentElement.dir = dir;
    }, []);

    /**
     * Load bundles with cache-first strategy
     */
    const loadBundles = useCallback(async (loc, forceRefresh = false) => {
        try {
            // Check cache first (unless forcing refresh)
            if (!forceRefresh) {
                const cachedBundles = getCachedBundles(loc);
                const cacheIsValid = isCacheValid(loc, CACHE_TTL);

                if (cachedBundles && cacheIsValid) {
                    setBundles(cachedBundles);
                    setIsLoading(false);

                    // Background revalidation - check hashes
                    backgroundRevalidate(loc, cachedBundles);
                    return;
                }

                // Cache exists but expired - use it while fetching fresh
                if (cachedBundles) {
                    setBundles(cachedBundles);
                }
            }

            // Fetch from server
            setIsLoading(true);
            const { bundles: freshBundles, hashes } = await translationService.fetchBundles(loc);

            if (isMountedRef.current) {
                setBundles(freshBundles);
                setCachedBundles(loc, freshBundles, hashes);
                setError(null);
            }
        } catch (err) {
            console.error('Failed to load translation bundles:', err);

            // Try to use cached version on error
            const cachedBundles = getCachedBundles(loc);
            if (cachedBundles) {
                setBundles(cachedBundles);
                setError(new Error('Using cached translations. Network error occurred.'));
            } else {
                setError(err);
            }
        } finally {
            if (isMountedRef.current) {
                setIsLoading(false);
            }
        }
    }, []);

    /**
     * Background revalidation - check if cache is stale
     */
    const backgroundRevalidate = useCallback(async (loc, currentBundles) => {
        try {
            const serverHashes = await translationService.fetchBundleHashes(loc);
            const cachedHashes = getCachedHashes(loc);

            if (!hashesMatch(serverHashes, cachedHashes)) {
                // Cache is stale, fetch fresh bundles
                console.log('Translation bundles outdated, refreshing...');
                const { bundles: freshBundles, hashes } = await translationService.fetchBundles(loc);

                if (isMountedRef.current) {
                    setBundles(freshBundles);
                    setCachedBundles(loc, freshBundles, hashes);
                }
            }
        } catch (err) {
            // Silent fail for background revalidation
            console.warn('Background revalidation failed:', err);
        }
    }, []);

    /**
     * Set locale and persist to profile
     */
    const setLocale = useCallback(async (newLocale) => {
        if (newLocale === locale) return;

        // Update local state immediately
        setLocaleState(newLocale);
        localStorage.setItem('pulwave_current_locale', newLocale);

        // Load bundles for new locale
        await loadBundles(newLocale);

        // Get locale info for RTL
        const info = await translationService.getLocaleByCode(newLocale);
        if (isMountedRef.current) {
            setLocaleInfo(info);
            applyDocumentAttributes(newLocale, info?.is_rtl ? 'rtl' : 'ltr');
        }

        // Persist to user profile if logged in
        if (profileIdRef.current) {
            try {
                await translationService.updateUserLocale(profileIdRef.current, newLocale);
            } catch (err) {
                console.warn('Failed to save locale to profile:', err);
            }
        }
    }, [locale, loadBundles, applyDocumentAttributes]);

    /**
     * Force refresh bundles from server
     */
    const refreshBundles = useCallback(async () => {
        clearCachedBundles(locale);
        await loadBundles(locale, true);
    }, [locale, loadBundles]);

    /**
     * Load available locales
     */
    const loadAvailableLocales = useCallback(async () => {
        try {
            const locales = await translationService.getAvailableLocales();
            if (isMountedRef.current) {
                setAvailableLocales(locales);
            }
        } catch (err) {
            console.error('Failed to load available locales:', err);
        }
    }, []);

    /**
     * Initialize locale from user profile
     */
    const initializeUserLocale = useCallback(async () => {
        if (!user?.id) {
            // No user, use stored or default locale
            const storedLocale = localStorage.getItem('pulwave_current_locale') || DEFAULT_LOCALE;
            setLocaleState(storedLocale);
            await loadBundles(storedLocale);

            const info = await translationService.getLocaleByCode(storedLocale);
            if (isMountedRef.current) {
                setLocaleInfo(info);
                applyDocumentAttributes(storedLocale, info?.is_rtl ? 'rtl' : 'ltr');
            }
            return;
        }

        try {
            // Get user's locale from profile
            const { profileId, locale: userLocale } = await translationService.getUserProfileAndLocale(user.id);

            if (isMountedRef.current) {
                profileIdRef.current = profileId;
                const localeToUse = userLocale || DEFAULT_LOCALE;

                setLocaleState(localeToUse);
                localStorage.setItem('pulwave_current_locale', localeToUse);

                await loadBundles(localeToUse);

                const info = await translationService.getLocaleByCode(localeToUse);
                if (isMountedRef.current) {
                    setLocaleInfo(info);
                    applyDocumentAttributes(localeToUse, info?.is_rtl ? 'rtl' : 'ltr');
                }
            }
        } catch (err) {
            console.error('Failed to initialize user locale:', err);
            // Fall back to default
            await loadBundles(DEFAULT_LOCALE);
            applyDocumentAttributes(DEFAULT_LOCALE, 'ltr');
        }
    }, [user, loadBundles, applyDocumentAttributes]);

    /**
     * Setup window focus revalidation
     */
    useEffect(() => {
        const handleFocus = () => {
            // Revalidate on focus if cache exists
            const cachedBundles = getCachedBundles(locale);
            if (cachedBundles) {
                backgroundRevalidate(locale, cachedBundles);
            }
        };

        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [locale, backgroundRevalidate]);

    /**
     * Setup periodic revalidation
     */
    useEffect(() => {
        revalidationTimerRef.current = setInterval(() => {
            const cachedBundles = getCachedBundles(locale);
            if (cachedBundles) {
                backgroundRevalidate(locale, cachedBundles);
            }
        }, REVALIDATION_INTERVAL);

        return () => {
            if (revalidationTimerRef.current) {
                clearInterval(revalidationTimerRef.current);
            }
        };
    }, [locale, backgroundRevalidate]);

    /**
     * Initialize on mount
     */
    useEffect(() => {
        isMountedRef.current = true;

        const init = async () => {
            await Promise.all([
                initializeUserLocale(),
                loadAvailableLocales()
            ]);
        };

        init();

        return () => {
            isMountedRef.current = false;
        };
    }, [initializeUserLocale, loadAvailableLocales]);

    /**
     * Re-initialize when user changes
     */
    useEffect(() => {
        if (user?.id) {
            initializeUserLocale();
        }
    }, [user?.id, initializeUserLocale]);

    // Context value
    const value = {
        locale,
        bundles,
        isLoading,
        error,
        isRTL,
        direction,
        availableLocales,
        setLocale,
        refreshBundles,
        // Expose fallback chain for advanced use cases
        fallbackChain: buildFallbackChain(locale),
        // Expose language base
        languageBase: getLanguageBase(locale)
    };

    return (
        <TranslationContext.Provider value={value}>
            {children}
        </TranslationContext.Provider>
    );
}

TranslationProvider.propTypes = {
    children: PropTypes.node.isRequired
};

/**
 * Hook to access translation context
 * Must be used within TranslationProvider
 *
 * @returns {TranslationContextValue}
 */
export function useTranslationContext() {
    const context = useContext(TranslationContext);
    if (!context) {
        throw new Error('useTranslationContext must be used within a TranslationProvider');
    }
    return context;
}

export default TranslationContext;
