import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryCacheProvider } from '../InMemoryCacheProvider';

describe('InMemoryCache', () => {
    let cache: InMemoryCacheProvider;

    beforeEach(() => {
        cache = new InMemoryCacheProvider();
    });

    describe('get/set', () => {
        it('should set and get a value', async () => {
            await cache.set('test-key', { foo: 'bar' });
            const result = await cache.get('test-key');
            expect(result).toEqual({ foo: 'bar' });
        });

        it('should return null for non-existent key', async () => {
            const result = await cache.get('non-existent');
            expect(result).toBeNull();
        });

        it('should handle different data types', async () => {
            await cache.set('string', 'hello');
            await cache.set('number', 42);
            await cache.set('array', [1, 2, 3]);
            await cache.set('object', { nested: { value: true } });

            expect(await cache.get('string')).toBe('hello');
            expect(await cache.get('number')).toBe(42);
            expect(await cache.get('array')).toEqual([1, 2, 3]);
            expect(await cache.get('object')).toEqual({ nested: { value: true } });
        });
    });

    describe('delete', () => {
        it('should delete a key', async () => {
            await cache.set('to-delete', 'value');
            await cache.del('to-delete');
            expect(await cache.get('to-delete')).toBeNull();
        });
    });

    describe('has', () => {
        it('should check if key exists', async () => {
            await cache.set('exists', 'value');
            expect(await cache.has('exists')).toBe(true);
            expect(await cache.has('not-exists')).toBe(false);
        });
    });

    describe('clear', () => {
        it('should clear all entries', async () => {
            await cache.set('key1', 'value1');
            await cache.set('key2', 'value2');
            await cache.clear();
            expect(await cache.get('key1')).toBeNull();
            expect(await cache.get('key2')).toBeNull();
        });

        it('should clear entries by prefix', async () => {
            await cache.set('profile:1', 'data1');
            await cache.set('profile:2', 'data2');
            await cache.set('user:1', 'userData');
            await cache.invalidatePattern('profile:*');
            expect(await cache.get('profile:1')).toBeNull();
            expect(await cache.get('profile:2')).toBeNull();
            expect(await cache.get('user:1')).toEqual('userData');
        });
    });

    describe('TTL', () => {
        it('should expire entries after TTL', async () => {
            await cache.set('expires', 'value', 1);
            await new Promise(resolve => setTimeout(resolve, 1500));
            expect(await cache.get('expires')).toBeNull();
        });

        it('should not expire entries before TTL', async () => {
            await cache.set('not-expired', 'value', 1000);
            expect(await cache.get('not-expired')).toBe('value');
        });
    });

    describe('getStats', () => {
        it('should return cache statistics', () => {
            const stats = cache.getStats();
            expect(stats.size).toBe(0);
            expect(stats.maxSize).toBe(1000);
        });

        it('should track cache size', async () => {
            await cache.set('key1', 'value1');
            await cache.set('key2', 'value2');
            expect(cache.getStats().size).toBe(2);
        });
    });

    describe('maxSize eviction', () => {
        it('should evict oldest entry when at capacity', async () => {
            const smallCache = new InMemoryCacheProvider(3);
            await smallCache.set('key1', 'value1');
            await smallCache.set('key2', 'value2');
            await smallCache.set('key3', 'value3');
            await smallCache.set('key4', 'value4');
            expect(await smallCache.get('key1')).toBeNull();
            expect(await smallCache.get('key4')).toBe('value4');
        });
    });
});

