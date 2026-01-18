/**
 * Environment variable schema definitions
 */
import { z } from 'zod';

/**
 * Client-side environment variables (exposed to browser via Vite)
 * All VITE_ prefixed variables are included in the client bundle
 */
export const clientEnvSchema = z.object({
    // Supabase
    VITE_SUPABASE_URL: z
        .string()
        .url('VITE_SUPABASE_URL must be a valid URL')
        .min(1, 'VITE_SUPABASE_URL is required'),
    VITE_SUPABASE_ANON_KEY: z
        .string()
        .min(100, 'VITE_SUPABASE_ANON_KEY appears invalid (too short)')
        .regex(/^eyJ/, 'VITE_SUPABASE_ANON_KEY must be a valid JWT'),

    // Feature flags
    VITE_SKIP_ONBOARDING: z
        .string()
        .transform((val) => val === 'true')
        .default('false'),

    // Optional: Analytics
    VITE_ANALYTICS_ID: z.string().optional(),

    // Optional: Environment
    VITE_APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),
});

/**
 * Server-side environment variables (Node.js only)
 * These are never exposed to the client
 */
export const serverEnvSchema = z.object({
    // Node environment
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

    // Database (server-only secrets)
    SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

    // API keys (server-only)
    STRIPE_SECRET_KEY: z.string().optional(),
    RESEND_API_KEY: z.string().optional(),
});

/**
 * Combined schema for full-stack apps
 */
export const fullEnvSchema = clientEnvSchema.merge(serverEnvSchema);

// Type exports
export type ClientEnv = z.infer<typeof clientEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type FullEnv = z.infer<typeof fullEnvSchema>;
