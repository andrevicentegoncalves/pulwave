/**
 * CacheInvalidation Tests
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { CacheInvalidation } from '..';
import { InMemoryCacheProvider } from '../../providers/cache/memory/InMemoryCacheProvider';

describe('CacheInvalidation', () => {
    let cache: InMemoryCacheProvider;

    beforeEach(() => {
        cache = new InMemoryCacheProvider();
    });

    describe('profile', () => {
        it('should invalidate profile and preferences', async () => {
            await cache.set('profile:123', 'profile-data');
            await cache.set('preferences:123', 'pref-data');
            await cache.set('other:123', 'other-data');

            await CacheInvalidation.profile(cache, '123');

            expect(await cache.get('profile:123')).toBeNull();
            expect(await cache.get('preferences:123')).toBeNull();
            expect(await cache.get('other:123')).toBe('other-data');
        });
    });

    describe('user', () => {
        it('should invalidate user and permissions', async () => {
            await cache.set('user:456', 'user-data');
            await cache.set('permissions:456', 'perm-data');
            await cache.set('other:456', 'other-data');

            await CacheInvalidation.user(cache, '456');

            expect(await cache.get('user:456')).toBeNull();
            expect(await cache.get('permissions:456')).toBeNull();
            expect(await cache.get('other:456')).toBe('other-data');
        });
    });

    describe('lookups', () => {
        it('should invalidate all lookup data', async () => {
            await cache.set('countries', 'country-data');
            await cache.set('timezones', 'tz-data');
            await cache.set('locales', 'locale-data');
            await cache.set('profile:123', 'profile-data');

            await CacheInvalidation.lookups(cache);

            expect(await cache.get('countries')).toBeNull();
            expect(await cache.get('timezones')).toBeNull();
            expect(await cache.get('locales')).toBeNull();
            expect(await cache.get('profile:123')).toBe('profile-data');
        });
    });
});
