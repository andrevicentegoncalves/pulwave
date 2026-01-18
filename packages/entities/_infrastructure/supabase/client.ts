/**
 * Internal Supabase Client
 *
 * This client is used internally by the data layer.
 * Uses @pulwave/internal-env for type-safe environment validation.
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { clientEnv } from '@pulwave/internal-env';

let supabaseInstance: SupabaseClient | null = null;

/**
 * Check if "Remember Me" is enabled
 */
const getRememberMe = (): boolean => {
    if (typeof localStorage !== 'undefined') {
        return localStorage.getItem('rememberMe') === 'true';
    }
    return false;
};

/**
 * Get appropriate storage based on "Remember Me" preference
 */
const getStorage = (): Storage | undefined => {
    if (typeof localStorage !== 'undefined' && getRememberMe()) {
        return localStorage;
    }
    if (typeof sessionStorage !== 'undefined') {
        return sessionStorage;
    }
    return undefined;
};

/**
 * Initialize Supabase client with validated environment variables
 */
const initializeSupabase = (): SupabaseClient => {
    const storage = getStorage();
    const storageOptions = storage ? { storage } : {};

    return createClient(clientEnv.VITE_SUPABASE_URL, clientEnv.VITE_SUPABASE_ANON_KEY, {
        auth: {
            ...storageOptions,
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: typeof window !== 'undefined',
        },
    });
};

/**
 * Get the Supabase client instance (singleton pattern)
 *
 * @throws Error if environment variables are invalid
 */
export const getSupabase = (): SupabaseClient => {
    if (!supabaseInstance) {
        supabaseInstance = initializeSupabase();
    }
    return supabaseInstance;
};

/**
 * Reset the Supabase client (useful for testing)
 */
export const resetSupabase = (): void => {
    supabaseInstance = null;
};

