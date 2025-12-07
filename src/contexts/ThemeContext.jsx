import React, { createContext, useContext, useEffect, useState } from 'react';
import { profileService } from '../services';

const ThemeContext = createContext();

import { useAuth } from './AuthContext';

export const ThemeProvider = ({ children, user: propUser }) => {
    // Try to get user from AuthContext, fallback to prop (for migration)
    let authUser = null;
    try {
        const auth = useAuth();
        authUser = auth.user;
    } catch (e) {
        // Ignored: AuthProvider might not be present yet
    }

    const user = propUser || authUser;

    // 'system', 'light', 'dark'
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme-preference') || 'system';
    });

    // Apply theme to document
    useEffect(() => {
        const root = document.documentElement;

        if (theme === 'system') {
            root.removeAttribute('data-theme');
        } else {
            root.setAttribute('data-theme', theme);
        }
        localStorage.setItem('theme-preference', theme);
    }, [theme]);

    // Fetch user preference on login
    useEffect(() => {
        if (!user) return;

        const fetchPreference = async () => {
            try {
                const profile = await profileService.getByAuthId(user.id);
                if (profile) {
                    const preferences = await profileService.getPreferences(profile.id);
                    if (preferences && preferences.theme) {
                        setTheme(preferences.theme);
                    }
                }
            } catch (error) {
                console.error('Error fetching theme preference:', error);
            }
        };

        fetchPreference();
    }, [user]);

    const updateTheme = async (newTheme) => {
        setTheme(newTheme);

        if (user) {
            try {
                const profile = await profileService.getByAuthId(user.id);
                if (profile) {
                    const orgId = await profileService.getOrganizationId(profile.id);
                    await profileService.upsertPreferences(profile.id, { theme: newTheme }, orgId);
                }
            } catch (error) {
                console.error('Error saving theme preference:', error);
            }
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, updateTheme, applyTheme: setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
