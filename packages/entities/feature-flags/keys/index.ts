/**
 * Feature Flag Query Keys
 * React Query keys for feature flags.
 */
export const featureFlagKeys = {
    all: ['feature-flags'] as const,
    list: () => [...featureFlagKeys.all, 'list'] as const,
    byKey: (key: string) => [...featureFlagKeys.all, 'key', key] as const,
    evaluation: (key: string, userId?: string) =>
        [...featureFlagKeys.all, 'eval', key, userId ?? 'anonymous'] as const,
};
