/**
 * Theme Context Provider
 *
 * Manages theme state with system preference support.
 * Persists theme to localStorage and optionally syncs with user preferences.
 *
 * @package @foundation/shared
 */
import { createContext, useContext, useEffect, useState, useCallback, useMemo, type ReactNode } from 'react';

// Types
export type ThemeMode = 'system' | 'light' | 'dark';

export interface ThemeContextValue {
    theme: ThemeMode;
    updateTheme: (theme: ThemeMode) => Promise<void>;
    applyTheme: (theme: ThemeMode) => void;
    resolvedTheme: 'light' | 'dark';
}

export interface ThemeService {
    getPreferences: (profileId: string) => Promise<{ theme?: string } | null>;
    upsertPreferences: (profileId: string, prefs: { theme: string }, orgId?: string | null) => Promise<unknown>;
    getOrganizationId: (profileId: string) => Promise<string | null>;
}

export interface ProfileFetcher {
    getProfileId: (userId: string) => Promise<string | null>;
}

export interface ThemeProviderProps {
    children: ReactNode;
    /** Current authenticated user */
    user?: { id: string } | null;
    /** Profile service for persistence */
    themeService?: ThemeService;
    /** Profile fetcher for getting profile ID */
    profileFetcher?: ProfileFetcher;
    /** Storage key for localStorage */
    storageKey?: string;
    /** Default theme */
    defaultTheme?: ThemeMode;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Get system color scheme preference
 */
function getSystemTheme(): 'light' | 'dark' {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Theme Provider component
 */
export const ThemeProvider = ({
    children,
    user,
    themeService,
    profileFetcher,
    storageKey = 'theme-preference',
    defaultTheme = 'system',
}: ThemeProviderProps) => {
    const [theme, setTheme] = useState<ThemeMode>(() => {
        if (typeof window === 'undefined') return defaultTheme;
        return (localStorage.getItem(storageKey) as ThemeMode) || defaultTheme;
    });

    const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
        if (theme === 'system') return getSystemTheme();
        return theme;
    });

    // Apply theme to document
    useEffect(() => {
        const root = document.documentElement;
        const actualTheme = theme === 'system' ? getSystemTheme() : theme;

        if (theme === 'system') {
            root.removeAttribute('data-theme');
        } else {
            root.setAttribute('data-theme', theme);
        }

        setResolvedTheme(actualTheme);
        localStorage.setItem(storageKey, theme);
    }, [theme, storageKey]);

    // Listen for system theme changes
    useEffect(() => {
        if (theme !== 'system') return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => setResolvedTheme(getSystemTheme());

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);

    // Fetch user preference on login
    // Note: Narrowed dependency from [user] to [user?.id] to prevent re-runs when user object changes
    const userId = user?.id;
    useEffect(() => {
        if (!userId || !themeService || !profileFetcher) return;

        const fetchPreference = async () => {
            try {
                const profileId = await profileFetcher.getProfileId(userId);
                if (profileId) {
                    const preferences = await themeService.getPreferences(profileId);
                    if (preferences?.theme) {
                        setTheme(preferences.theme as ThemeMode);
                    }
                }
            } catch {
                // Silent error handling for theme preference fetch
            }
        };

        fetchPreference();
    }, [userId, themeService, profileFetcher]);

    // Update theme and persist to backend
    // Note: Narrowed dependency from [user] to [userId] to prevent recreating callback when user object changes
    const updateTheme = useCallback(async (newTheme: ThemeMode) => {
        setTheme(newTheme);

        if (userId && themeService && profileFetcher) {
            try {
                const profileId = await profileFetcher.getProfileId(userId);
                if (profileId) {
                    const orgId = await themeService.getOrganizationId(profileId);
                    await themeService.upsertPreferences(profileId, { theme: newTheme }, orgId);
                }
            } catch {
                // Silent error handling for theme preference save
            }
        }
    }, [userId, themeService, profileFetcher]);

    const value = useMemo<ThemeContextValue>(() => ({
        theme,
        updateTheme,
        applyTheme: setTheme,
        resolvedTheme,
    }), [theme, updateTheme, resolvedTheme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

/**
 * Hook to access theme context
 */
export const useTheme = (): ThemeContextValue => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export default ThemeProvider;
