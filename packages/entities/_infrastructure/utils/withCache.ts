/**
 * Cache Wrapper Utility
 * Easily add caching to any async function.
 */
import type { ICacheProvider } from '../../cache/interfaces/ICacheProvider';
import { CACHE_TTL } from '../constants';
import { CacheManager } from '../CacheManager';

/**
 * Get the cache instance
 */
export function getCache(): ICacheProvider {
    return CacheManager.getInstance();
}

/**
 * Replace the cache provider (useful for testing or custom implementations)
 */
export function setCacheProvider(provider: ICacheProvider): void {
    CacheManager.setInstance(provider);
}

/**
 * Cache wrapper for repository methods
 * Use this to easily add caching to any async function
 */
export async function withCache<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl = CACHE_TTL.LOOKUP
): Promise<T> {
    const cache = getCache();

    // Try to get from cache first
    const cached = await cache.get<T>(key);
    if (cached !== null) {
        return cached;
    }

    // Fetch fresh data
    const data = await fetcher();

    // Store in cache
    await cache.set(key, data, ttl);

    return data;
}

