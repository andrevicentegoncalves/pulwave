import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAdminContext } from '../core/AdminContext';

/**
 * Hook for fetching feature flags
 */
export const useAdminFeatureFlags = () => {
    const { service } = useAdminContext();
    return useQuery({
        queryKey: ['admin', 'feature-flags'],
        queryFn: () => service.getTableRecords('feature_flags'),
        staleTime: 60000,
    });
};

/**
 * Hook for toggling a feature flag
 */
export const useToggleFeatureFlag = () => {
    const { service } = useAdminContext();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) =>
            service.saveTableRecord('feature_flags', { id, is_enabled: enabled }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'feature-flags'] });
        },
    });
};

/**
 * Hook for creating a feature flag
 */
export const useCreateFeatureFlag = () => {
    const { service } = useAdminContext();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { key: string; name: string; description?: string; is_enabled?: boolean }) =>
            service.saveTableRecord('feature_flags', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'feature-flags'] });
        },
    });
};

/**
 * Hook for deleting a feature flag
 */
export const useDeleteFeatureFlag = () => {
    const { service } = useAdminContext();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => service.deleteTableRecord('feature_flags', id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'feature-flags'] });
        },
    });
};
