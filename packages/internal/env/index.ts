/**
 * @pulwave/internal-env
 *
 * Type-safe environment variable validation using Zod.
 * This package is INTERNAL ONLY - never publish to npm.
 *
 * Usage:
 * ```ts
 * import { clientEnv } from '@pulwave/internal-env';
 *
 * // Type-safe access (client-safe)
 * const url = clientEnv.VITE_SUPABASE_URL;
 * ```
 *
 * For server-only code:
 * ```ts
 * import { parseServerEnv } from '@pulwave/internal-env/server';
 * ```
 */

export * from './src/schema';
export * from './src/client';
// Server exports removed - use '@pulwave/internal-env/server' instead
