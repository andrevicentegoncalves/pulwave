/**
 * useFeatureFlag Hook
 * React hook for feature flag evaluation with caching.
 */
import { useQuery } from '@tanstack/react-query';
import { featureFlagService } from '../services/featureFlagService';
import { featureFlagKeys } from '../keys';
import type { FeatureFlagEvaluation } from '../interfaces';

export interface UseFeatureFlagOptions {
    userId?: string;
    userRoles?: string[];
    enabled?: boolean;
}

/**
 * Hook for evaluating a feature flag with full details
 */
export const useFeatureFlag = (
    flagKey: string,
    options: UseFeatureFlagOptions = {}
) => {
    const { userId, userRoles, enabled = true } = options;

    return useQuery({
        queryKey: featureFlagKeys.evaluation(flagKey, userId),
        queryFn: () => featureFlagService.evaluate(flagKey, userId, userRoles),
        enabled: enabled && !!flagKey,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });
};

/**
 * Simple boolean hook for feature flag checks
 * Returns false while loading, then the actual flag value
 */
export const useIsFeatureEnabled = (
    flagKey: string,
    options: UseFeatureFlagOptions = {}
): boolean => {
    const { data, isLoading } = useFeatureFlag(flagKey, options);

    // Default to false while loading or if no data
    if (isLoading || !data) return false;

    return data.enabled;
};

/**
 * Hook for getting multiple feature flags at once
 */
export const useFeatureFlags = (
    flagKeys: string[],
    options: UseFeatureFlagOptions = {}
) => {
    const { userId, userRoles, enabled = true } = options;

    return useQuery({
        queryKey: [...featureFlagKeys.all, 'multi', ...flagKeys],
        queryFn: async () => {
            const results = await Promise.all(
                flagKeys.map((key) =>
                    featureFlagService.evaluate(key, userId, userRoles)
                )
            );
            return results.reduce((acc, result) => {
                acc[result.flagKey] = result.enabled;
                return acc;
            }, {} as Record<string, boolean>);
        },
        enabled: enabled && flagKeys.length > 0,
        staleTime: 5 * 60 * 1000,
    });
};
