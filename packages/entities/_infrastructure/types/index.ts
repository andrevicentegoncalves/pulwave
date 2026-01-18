/**
 * Cache Types
 * Type definitions for the caching layer.
 */

export interface CacheOptions {
    /** Time-to-live in milliseconds */
    ttl?: number;
    /** Cache key prefix for namespacing */
    prefix?: string;
}

export interface CacheEntry<T> {
    data: T;
    expiresAt: number;
    createdAt: number;
}

// Re-export specific interfaces from the interfaces directory
// for backward compatibility
export type { ICacheProvider } from '../interfaces/ICacheProvider';

// Legacy export alias
export type { ICacheProvider as CacheProvider } from '../interfaces/ICacheProvider';

