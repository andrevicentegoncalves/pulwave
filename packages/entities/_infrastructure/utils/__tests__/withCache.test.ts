/**
 * Cache Helper Functions Tests
 */
import { describe, it, expect, beforeEach } from 'vitest';
import {
    CACHE_TTL,
    withCache,
    getCache,
    setCacheProvider
} from '..';
import { InMemoryCacheProvider } from '../../providers/cache/memory/InMemoryCacheProvider';

describe('CACHE_TTL', () => {
    it('should have correct SESSION TTL (5 minutes)', () => {
        expect(CACHE_TTL.SESSION).toBe(5 * 60 * 1000);
    });

    it('should have correct PROFILE TTL (10 minutes)', () => {
        expect(CACHE_TTL.PROFILE).toBe(10 * 60 * 1000);
    });

    it('should have correct LOOKUP TTL (1 hour)', () => {
        expect(CACHE_TTL.LOOKUP).toBe(60 * 60 * 1000);
    });

    it('should have correct CONFIG TTL (24 hours)', () => {
        expect(CACHE_TTL.CONFIG).toBe(24 * 60 * 60 * 1000);
    });

    it('should have correct TRANSLATIONS TTL (1 hour)', () => {
        expect(CACHE_TTL.TRANSLATIONS).toBe(60 * 60 * 1000);
    });
});

describe('getCache', () => {
    beforeEach(() => {
        setCacheProvider(new InMemoryCacheProvider());
    });

    it('should return the same instance', () => {
        const cache1 = getCache();
        const cache2 = getCache();
        expect(cache1).toBe(cache2);
    });
});

describe('setCacheProvider', () => {
    it('should replace the cache instance', async () => {
        const customCache = new InMemoryCacheProvider(10);
        setCacheProvider(customCache);
        const cache = getCache();
        await cache.set('test', 'value');
        expect(await customCache.get('test')).toBe('value');
    });
});

describe('withCache', () => {
    beforeEach(() => {
        setCacheProvider(new InMemoryCacheProvider());
    });

    it('should cache the result of fetcher', async () => {
        let fetchCount = 0;
        const fetcher = async () => {
            fetchCount++;
            return { data: 'test' };
        };

        const result1 = await withCache('test-key', fetcher);
        const result2 = await withCache('test-key', fetcher);

        expect(result1).toEqual({ data: 'test' });
        expect(result2).toEqual({ data: 'test' });
        expect(fetchCount).toBe(1);
    });

    it('should use custom TTL', async () => {
        let fetchCount = 0;
        const fetcher = async () => {
            fetchCount++;
            return 'data';
        };

        await withCache('short-ttl', fetcher, 1);
        await new Promise(resolve => setTimeout(resolve, 10));
        await withCache('short-ttl', fetcher, 1);

        expect(fetchCount).toBe(2);
    });

    it('should handle fetcher errors', async () => {
        const fetcher = async () => {
            throw new Error('Fetch failed');
        };
        await expect(withCache('error-key', fetcher)).rejects.toThrow('Fetch failed');
    });
});
