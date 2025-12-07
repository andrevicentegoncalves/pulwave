/**
 * Auth Service
 * 
 * Abstraction layer for Authentication.
 * Wraps Supabase Auth to prevent direct dependency in UI components.
 */

import { supabase } from '../lib/supabaseClient';

export const authService = {
    /**
     * Get the current session
     * @returns {Promise<{ session: object|null, user: object|null }>}
     */
    async getSession() {
        // Check for dev bypass
        const devBypass = localStorage.getItem('dev_bypass');
        if (devBypass) {
            return {
                session: { user: { id: 'dev', email: 'dev@example.com' } },
                user: { id: 'dev', email: 'dev@example.com' }
            };
        }

        try {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) throw error;
            return { session, user: session?.user ?? null };
        } catch (error) {
            console.error('AuthService: Error fetching session:', error);
            return { session: null, user: null };
        }
    },

    /**
     * Get the current user
     * @returns {Promise<object|null>}
     */
    async getUser() {
        const { session, user } = await this.getSession();
        return user;
    },

    /**
     * Verify admin access and get profile
     * @returns {Promise<{ hasAccess: boolean, profile: object|null }>}
     */
    async verifyAdminAccess() {
        // Check for dev bypass
        const devBypass = localStorage.getItem('dev_bypass');
        if (devBypass) {
            return {
                hasAccess: true,
                profile: {
                    id: 'dev-user',
                    first_name: 'Dev',
                    last_name: 'Admin',
                    email: 'dev@example.com',
                    app_role: 'super_admin',
                }
            };
        }

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return { hasAccess: false, profile: null };

            const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('auth_user_id', user.id)
                .single();

            if (error || !profile) {
                console.error('AuthService: Profile fetch error:', error);
                return { hasAccess: false, profile: null };
            }

            const isAdmin = profile.app_role === 'admin' || profile.app_role === 'super_admin';
            return { hasAccess: isAdmin, profile };

        } catch (error) {
            console.error('AuthService: Admin access check failed:', error);
            return { hasAccess: false, profile: null };
        }
    },

    /**
     * Subscribe to auth state changes
     * @param {function} callback - Function called with (event, session)
     * @returns {object} Subscription object with unsubscribe method
     */
    onAuthStateChange(callback) {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
        return subscription;
    },

    /**
     * Send password reset email
     * @param {string} email 
     * @param {object} options - including redirectTo
     * @returns {Promise<{data, error}>}
     */
    async resetPasswordForEmail(email, options = {}) {
        return supabase.auth.resetPasswordForEmail(email, options);
    },

    /**
     * Sign out the current user
     */
    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    }
};

export default authService;
