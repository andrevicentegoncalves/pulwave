/**
 * In-Memory Cache Provider
 * Simple LRU-style cache with TTL support.
 */
import { CACHE_TTL, type ICacheProvider } from '@pulwave/entity-cache';

interface CacheEntry<T> {
    data: T;
    expiresAt: number;
    createdAt: number;
}

export class InMemoryCacheProvider implements ICacheProvider {
    private cache = new Map<string, CacheEntry<unknown>>();
    private maxSize: number;

    constructor(maxSize = 1000) {
        this.maxSize = maxSize;
    }

    async get<T>(key: string): Promise<T | null> {
        const entry = this.cache.get(key);

        if (!entry) {
            return null;
        }

        // Check expiration
        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            return null;
        }

        return entry.data as T;
    }

    async set<T>(key: string, value: T, ttl = CACHE_TTL.LOOKUP): Promise<void> {
        // Evict oldest entries if at capacity
        if (this.cache.size >= this.maxSize) {
            const oldestKey = this.cache.keys().next().value;
            if (oldestKey) {
                this.cache.delete(oldestKey);
            }
        }

        this.cache.set(key, {
            data: value,
            expiresAt: Date.now() + ttl,
            createdAt: Date.now(),
        });
    }

    async del(key: string): Promise<void> {
        this.cache.delete(key);
    }

    async invalidatePattern(pattern: string): Promise<void> {
        // Simple regex-like matching: "user:*" matches "user:123"
        // Convert wildcard * to regex .*
        const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');

        for (const key of this.cache.keys()) {
            if (regex.test(key)) {
                this.cache.delete(key);
            }
        }
    }

    async clear(): Promise<void> {
        this.cache.clear();
    }

    async has(key: string): Promise<boolean> {
        const entry = this.cache.get(key);
        if (!entry) return false;

        // Check expiration
        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            return false;
        }

        return true;
    }

    /** Get cache statistics */
    getStats(): { size: number; maxSize: number } {
        return {
            size: this.cache.size,
            maxSize: this.maxSize,
        };
    }
}

