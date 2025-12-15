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

            const isAdmin = ['admin', 'super_admin', 'dev'].includes(profile.app_role);
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
    },

    // =========================================================================
    // MULTI-AUTH METHODS
    // =========================================================================

    /**
     * Sign in with Email Link (passwordless)
     * Sends a clickable link to the email
     * @param {string} email
     * @param {object} options - { redirectTo }
     * @returns {Promise<{data, error}>}
     */
    async signInWithEmailLink(email, options = {}) {
        return supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: options.redirectTo || `${window.location.origin}/auth/callback`,
                ...options
            }
        });
    },

    /**
     * Send OTP code to email (user types code in app)
     * @param {string} email
     * @returns {Promise<{data, error}>}
     */
    async sendEmailOTP(email) {
        return supabase.auth.signInWithOtp({
            email,
            options: {
                shouldCreateUser: true,
            }
        });
    },

    /**
     * Verify OTP code entered by user
     * @param {string} email
     * @param {string} token - 6-digit code
     * @returns {Promise<{data, error}>}
     */
    async verifyEmailOTP(email, token) {
        return supabase.auth.verifyOtp({
            email,
            token,
            type: 'email'
        });
    },

    // Legacy alias
    async signInWithMagicLink(email, options = {}) {
        return this.signInWithEmailLink(email, options);
    },


    /**
     * Sign in with Passkey (WebAuthn)
     * TODO: Not natively supported by Supabase. Requires Corbado or custom implementation.
     * @returns {Promise<{data, error}>}
     */
    async signInWithPasskey() {
        // Placeholder - requires third-party passkey provider (e.g., Corbado)
        throw new Error('Passkey authentication not yet implemented. Coming soon!');
    },

    /**
     * Enroll a new passkey for the current user
     * TODO: Requires third-party integration
     * @returns {Promise<{data, error}>}
     */
    async enrollPasskey() {
        throw new Error('Passkey enrollment not yet implemented. Coming soon!');
    },

    /**
     * Sign in with Web3 Wallet (Ethereum/Solana)
     * Uses Supabase's native signInWithWeb3 API (EIP-4361 / SIWE)
     * @param {object} options - { chain: 'ethereum' | 'solana' }
     * @returns {Promise<{data, error}>}
     */
    async signInWithWallet(options = {}) {
        const chain = options.chain || 'ethereum';

        // Check for wallet provider
        if (chain === 'ethereum' && !window.ethereum) {
            return {
                data: null,
                error: { message: 'No Ethereum wallet found. Please install MetaMask or another Web3 wallet.' }
            };
        }

        try {
            return await supabase.auth.signInWithWeb3({
                chain,
                provider: chain === 'ethereum' ? window.ethereum : undefined
            });
        } catch (error) {
            return { data: null, error };
        }
    },

    /**
     * Sign up with email (no password required for magic link flow)
     * @param {string} email
     * @param {object} options
     * @returns {Promise<{data, error}>}
     */
    async signUp(email, options = {}) {
        // For magic link flow, signUp and signIn are the same
        return this.signInWithMagicLink(email, options);
    },

    /**
     * Check if passkey is supported in current browser
     * @returns {boolean}
     */
    isPasskeySupported() {
        return typeof window !== 'undefined' &&
            window.PublicKeyCredential !== undefined;
    },

    /**
     * Get available auth methods for the user
     * @param {string} profileId
     * @returns {Promise<string[]>}
     */
    async getEnabledAuthMethods(profileId) {
        const { data, error } = await supabase
            .from('profile_auth_state')
            .select('auth_methods, webauthn_enabled, wallet_address')
            .eq('profile_id', profileId)
            .maybeSingle();

        if (error || !data) return ['email']; // Default fallback

        const methods = [];
        if (data.auth_methods?.includes('email')) methods.push('email');
        if (data.webauthn_enabled) methods.push('passkey');
        if (data.wallet_address) methods.push('wallet');

        return methods.length > 0 ? methods : ['email'];
    }
};

export default authService;

