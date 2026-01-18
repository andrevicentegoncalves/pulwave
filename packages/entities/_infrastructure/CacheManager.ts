/**
 * Cache Manager
 * Factory for creating/retrieving the configured cache provider.
 */
import { ICacheProvider } from '../cache/interfaces/ICacheProvider';
import { InMemoryCacheProvider } from '../providers/cache/memory/InMemoryCacheProvider';
import { RedisCacheProvider } from '../providers/cache/redis/RedisCacheProvider';

export class CacheManager {
    private static instance: ICacheProvider;

    /**
     * Get the singleton cache provider instance
     */
    static getInstance(): ICacheProvider {
        if (!CacheManager.instance) {
            CacheManager.instance = CacheManager.createProvider();
        }
        return CacheManager.instance;
    }

    /**
     * Override the singleton instance (For testing only)
     */
    static setInstance(provider: ICacheProvider): void {
        CacheManager.instance = provider;
    }

    /**
     * Create a new provider instance based on environment variables
     */
    private static createProvider(): ICacheProvider {
        // Force memory in browser environment
        if (typeof window !== 'undefined') {
            return new InMemoryCacheProvider();
        }

        // Check environment variables (Node.js)
        const useRedis = process.env.VITE_USE_REDIS === 'true' || process.env.USE_REDIS === 'true';

        if (useRedis) {
            const redisUrl = process.env.VITE_REDIS_URL || process.env.REDIS_URL;
            return new RedisCacheProvider(redisUrl);
        }

        return new InMemoryCacheProvider();
    }
}

// Default export for convenience
export const cache = CacheManager.getInstance();
