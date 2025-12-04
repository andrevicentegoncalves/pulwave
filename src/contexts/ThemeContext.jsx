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
        console.log('ThemeContext: applied theme to root', theme);

        localStorage.setItem('theme-preference', theme);
    }, [theme]);

    // Fetch user preference on login
    useEffect(() => {
        if (!user) return;

        const fetchPreference = async () => {
            try {
                // Get profile ID
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('id')
                    .eq('auth_user_id', user.id)
                    .single();

                if (profileData) {
                    const { data: prefData } = await supabase
                        .from('profile_preferences')
                        .select('theme')
                        .eq('profile_id', profileData.id)
                        .maybeSingle();

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
        console.log('ThemeContext: updateTheme called with', newTheme);
        setTheme(newTheme);

        if (user) {
            try {
                // Get profile ID
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('id')
                    .eq('auth_user_id', user.id)
                    .single();

                if (profileData) {
                    // Check if preferences exist
                    const { data: existingPref } = await supabase
                        .from('profile_preferences')
                        .select('id')
                        .eq('profile_id', profileData.id)
                        .maybeSingle();

                    if (existingPref) {
                        // Update existing preference
                        const { error } = await supabase
                            .from('profile_preferences')
                            .update({
                                theme: newTheme,
                                updated_at: new Date().toISOString()
                            })
                            .eq('profile_id', profileData.id);
                        if (error) throw error;
                    } else {
                        // Insert new preference - get organization_id first
                        const { data: orgMember } = await supabase
                            .from('organization_members')
                            .select('organization_id')
                            .eq('profile_id', profileData.id)
                            .eq('is_primary', true)
                            .maybeSingle();

                        const { error } = await supabase
                            .from('profile_preferences')
                            .insert({
                                profile_id: profileData.id,
                                organization_id: orgMember?.organization_id,
                                theme: newTheme,
                                created_at: new Date().toISOString(),
                                updated_at: new Date().toISOString()
                            });
                        if (error) throw error;
                    }
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
