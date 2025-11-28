import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const ThemeContext = createContext();

export const ThemeProvider = ({ children, user }) => {
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
                // Get profile ID first
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('id')
                    .eq('auth_user_id', user.id)
                    .single();

                if (profileData) {
                    const { data: prefData } = await supabase
                        .from('user_preferences')
                        .select('theme')
                        .eq('profile_id', profileData.id)
                        .single();

                    if (prefData && prefData.theme) {
                        setTheme(prefData.theme);
                    }
                }
            } catch (error) {
                console.error('Error fetching theme preference:', error);
            }
        };

        fetchPreference();
    }, [user]);

    // Update theme
    const updateTheme = async (newTheme) => {
        setTheme(newTheme);

        if (user) {
            try {
                // Get profile ID first
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('id')
                    .eq('auth_user_id', user.id)
                    .single();

                if (profileData) {
                    // Upsert preference
                    const { error } = await supabase
                        .from('user_preferences')
                        .upsert({
                            profile_id: profileData.id,
                            theme: newTheme,
                            updated_at: new Date().toISOString()
                        }, { onConflict: 'profile_id' });

                    if (error) throw error;
                }
            } catch (error) {
                console.error('Error saving theme preference:', error);
            }
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, updateTheme }}>
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
