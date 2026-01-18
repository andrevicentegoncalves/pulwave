/**
 * Cache TTL Constants
 * Default time-to-live values for different data types.
 */

export const CACHE_TTL = {
    /** User session data: 5 minutes */
    SESSION: 5 * 60 * 1000,
    /** Profile data: 10 minutes */
    PROFILE: 10 * 60 * 1000,
    /** Lookup/reference data: 1 hour */
    LOOKUP: 60 * 60 * 1000,
    /** Static config: 24 hours */
    CONFIG: 24 * 60 * 60 * 1000,
    /** Translation bundles: 1 hour */
    TRANSLATIONS: 60 * 60 * 1000,
} as const;

export type CacheTTLType = typeof CACHE_TTL[keyof typeof CACHE_TTL];
