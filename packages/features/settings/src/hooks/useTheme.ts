/**
 * useTheme Hook
 * 
 * Simple theme management hook for settings page.
 * Manages theme state via document attributes.
 * TODO: Replace with proper theme system from @ui when available.
 * 
 * @package @pulwave/experience-settings
 */
import { useState, useCallback, useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'system';

export interface UseThemeReturn {
    theme: Theme;
    updateTheme: (newTheme: Theme) => void;
    applyTheme: (newTheme: Theme) => void;
}

const getStoredTheme = (): Theme => {
    if (typeof window === 'undefined') return 'light';
    return (localStorage.getItem('theme') as Theme) || 'light';
};

const applyThemeToDocument = (theme: Theme) => {
    if (typeof document === 'undefined') return;

    let effectiveTheme = theme;
    if (theme === 'system') {
        effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    document.documentElement.setAttribute('data-theme', effectiveTheme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(effectiveTheme);
};

/**
 * useTheme - Theme management hook
 */
export const useTheme = (): UseThemeReturn => {
    const [theme, setTheme] = useState<Theme>(getStoredTheme);

    useEffect(() => {
        applyThemeToDocument(theme);
    }, [theme]);

    const updateTheme = useCallback((newTheme: Theme) => {
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        applyThemeToDocument(newTheme);
    }, []);

    const applyTheme = useCallback((newTheme: Theme) => {
        applyThemeToDocument(newTheme);
    }, []);

    return { theme, updateTheme, applyTheme };
};

export default useTheme;
