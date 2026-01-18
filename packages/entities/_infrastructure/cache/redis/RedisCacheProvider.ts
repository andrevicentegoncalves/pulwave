/**
 * Redis Cache Provider (Skeleton)
 * Placeholder for future Redis implementation.
 */
import type { ICacheProvider } from '@pulwave/entity-cache';

export class RedisCacheProvider implements ICacheProvider {
    constructor(connectionString?: string) {
        // In the future, initialize Redis client here
        // If used unexpectedly, we should log a warning
        if (connectionString) {
            // console.log('[RedisCacheProvider] Future Redis connection initialized with:', connectionString); // Removed debug log
        }
    }

    private warnNotImplemented(_method: string) {
        // Redis not implemented yet - silently no-op
    }

    async get<T>(key: string): Promise<T | null> {
        this.warnNotImplemented(`get(${key})`);
        return null;
    }

    async set<T>(key: string, value: T, ttl?: number): Promise<void> {
        this.warnNotImplemented(`set(${key})`);
    }

    async del(key: string): Promise<void> {
        this.warnNotImplemented(`del(${key})`);
    }

    async invalidatePattern(pattern: string): Promise<void> {
        this.warnNotImplemented(`invalidatePattern(${pattern})`);
    }

    async clear(): Promise<void> {
        this.warnNotImplemented('clear()');
    }

    async has(key: string): Promise<boolean> {
        this.warnNotImplemented(`has(${key})`);
        return false;
    }
}
