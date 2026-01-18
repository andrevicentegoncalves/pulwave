/**
 * Server-side environment access
 *
 * Only use in Node.js environments (API routes, scripts, SSR).
 * NEVER import this in client-side code.
 */
import { serverEnvSchema, fullEnvSchema, type ServerEnv, type FullEnv } from './schema';

/**
 * Parse and validate server environment variables
 */
const parseServerEnv = (): ServerEnv => {
    if (typeof process === 'undefined' || !process.env) {
        throw new Error('Server environment is only available in Node.js');
    }

    const result = serverEnvSchema.safeParse(process.env);

    if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        const errorMessages = Object.entries(errors)
            .map(([key, messages]) => `  ${key}: ${messages?.join(', ')}`)
            .join('\n');

        console.error(`\n❌ Invalid server environment variables:\n${errorMessages}\n`);

        if (process.env.NODE_ENV !== 'production') {
            throw new Error('Invalid server environment variables');
        }
    }

    return result.data as ServerEnv;
};

/**
 * Parse full environment (client + server)
 */
const parseFullEnv = (): FullEnv => {
    if (typeof process === 'undefined' || !process.env) {
        throw new Error('Full environment is only available in Node.js');
    }

    const result = fullEnvSchema.safeParse(process.env);

    if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        console.error('❌ Invalid environment variables:', errors);
        throw new Error('Invalid environment variables');
    }

    return result.data;
};

/**
 * Type-safe server environment variables
 * Only available in Node.js
 */
export const serverEnv = parseServerEnv();

/**
 * Full environment (client + server combined)
 * Only available in Node.js
 */
export const fullEnv = parseFullEnv();

/**
 * Check if running in production (server-side)
 */
export const isProductionServer = serverEnv.NODE_ENV === 'production';
