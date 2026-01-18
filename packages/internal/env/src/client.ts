/**
 * Client-side environment access
 *
 * Safe to use in browser code. Only VITE_ prefixed variables are available.
 */
import { clientEnvSchema, type ClientEnv } from './schema';

/**
 * Vite import.meta type extension
 */
interface ViteImportMeta {
    env?: Record<string, string | undefined>;
}

/**
 * Get raw environment object (Vite's import.meta.env)
 *
 * IMPORTANT: We explicitly reference each env var so Vite's `define`
 * replacements work correctly in monorepo setups.
 */
const getRawEnv = (): Record<string, string | undefined> => {
    // Vite environment - explicitly access each var for define replacement to work
    const meta = import.meta as unknown as ViteImportMeta;
    if (typeof import.meta !== 'undefined' && meta.env) {
        return {
            VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
            VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
            VITE_SKIP_ONBOARDING: import.meta.env.VITE_SKIP_ONBOARDING,
            VITE_APP_ENV: import.meta.env.VITE_APP_ENV,
            VITE_ANALYTICS_ID: import.meta.env.VITE_ANALYTICS_ID,
        };
    }

    // Fallback for Node.js (testing)
    if (typeof process !== 'undefined' && process.env) {
        return process.env as Record<string, string | undefined>;
    }

    return {};
};

/**
 * Parse and validate client environment variables
 */
const parseClientEnv = (): ClientEnv => {
    const raw = getRawEnv();

    const result = clientEnvSchema.safeParse(raw);

    if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        const errorMessages = Object.entries(errors)
            .map(([key, messages]) => `  ${key}: ${messages?.join(', ')}`)
            .join('\n');

        console.error(
            `\n❌ Invalid environment variables:\n${errorMessages}\n\n` +
                'Please check your .env.local file.\n'
        );

        // In development, throw to catch errors early
        if (raw.VITE_APP_ENV !== 'production') {
            throw new Error('Invalid environment variables');
        }
    }

    return result.data as ClientEnv;
};

/**
 * Type-safe client environment variables
 *
 * @example
 * ```ts
 * import { clientEnv } from '@pulwave/internal-env';
 *
 * const supabaseUrl = clientEnv.VITE_SUPABASE_URL;
 * const skipOnboarding = clientEnv.VITE_SKIP_ONBOARDING; // boolean
 * ```
 */
export const clientEnv = parseClientEnv();

/**
 * Check if running in production
 */
export const isProduction = clientEnv.VITE_APP_ENV === 'production';

/**
 * Check if running in development
 */
export const isDevelopment = clientEnv.VITE_APP_ENV === 'development';
