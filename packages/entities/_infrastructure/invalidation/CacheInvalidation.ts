/**
 * Cache Invalidation Helpers
 * Utilities for invalidating related cache entries.
 */
import type { ICacheProvider } from '../../cache/interfaces/ICacheProvider';
import { CacheKeys } from '../keys';

export const CacheInvalidation = {
    /** Invalidate all profile-related cache entries */
    async profile(cache: ICacheProvider, profileId: string): Promise<void> {
        await cache.del(CacheKeys.profile(profileId));
        await cache.del(CacheKeys.preferences(profileId));
    },

    /** Invalidate user-related cache entries */
    async user(cache: ICacheProvider, userId: string): Promise<void> {
        await cache.del(CacheKeys.user(userId));
        await cache.del(CacheKeys.permissions(userId));
    },

    /** Invalidate all lookup data */
    async lookups(cache: ICacheProvider): Promise<void> {
        await cache.del('countries');
        await cache.del('timezones');
        await cache.del('locales');
    },
};

