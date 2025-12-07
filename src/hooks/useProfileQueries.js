/**
 * Profile Query Hooks
 * React Query hooks for profile data fetching and mutations
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../services';
import { queryKeys } from './queryKeys';

/**
 * Fetch user profile
 */
export function useProfile(userId, options = {}) {
    return useQuery({
        queryKey: queryKeys.profile.detail(userId),
        queryFn: () => profileService.getById(userId),
        enabled: !!userId,
        ...options,
    });
}

/**
 * Fetch professional profile
 */
export function useProfessionalProfile(profileId, options = {}) {
    return useQuery({
        queryKey: queryKeys.profile.professional(profileId),
        queryFn: () => profileService.getProfessionalProfile(profileId),
        enabled: !!profileId,
        ...options,
    });
}

/**
 * Fetch social profiles
 */
export function useSocialProfiles(profileId, options = {}) {
    return useQuery({
        queryKey: queryKeys.profile.social(profileId),
        queryFn: () => profileService.getSocialProfiles(profileId),
        enabled: !!profileId,
        ...options,
    });
}

/**
 * Fetch user preferences
 */
export function usePreferences(profileId, options = {}) {
    return useQuery({
        queryKey: queryKeys.profile.preferences(profileId),
        queryFn: () => profileService.getPreferences(profileId),
        enabled: !!profileId,
        ...options,
    });
}

/**
 * Update profile mutation
 */
export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, updates }) => profileService.update(userId, updates),
        onSuccess: (data, variables) => {
            // Invalidate and refetch profile queries
            queryClient.invalidateQueries({
                queryKey: queryKeys.profile.detail(variables.userId)
            });
        },
    });
}

/**
 * Update professional profile mutation
 */
export function useUpdateProfessionalProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ profileId, data }) =>
            profileService.upsertProfessionalProfile(profileId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.profile.professional(variables.profileId)
            });
        },
    });
}

/**
 * Update preferences mutation
 */
export function useUpdatePreferences() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ profileId, preferences }) =>
            profileService.upsertPreferences(profileId, preferences),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.profile.preferences(variables.profileId)
            });
        },
    });
}
