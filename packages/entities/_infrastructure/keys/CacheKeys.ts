/**
 * Cache Key Generators
 * Consistent key creation for cache entries.
 */

export const CacheKeys = {
    profile: (profileId: string) => `profile:${profileId}`,
    fullProfile: (authUserId: string) => `fullProfile:${authUserId}`,
    user: (userId: string) => `user:${userId}`,
    permissions: (userId: string) => `permissions:${userId}`,
    preferences: (profileId: string) => `preferences:${profileId}`,
    subscriptionPlans: () => 'subscriptionPlans',
    paymentMethods: (orgId: string) => `paymentMethods:${orgId}`,
    translations: (locale: string) => `translations:${locale}`,
    countries: () => 'countries',
    timezones: () => 'timezones',
    locales: () => 'locales',
} as const;

export type CacheKeyType = keyof typeof CacheKeys;
