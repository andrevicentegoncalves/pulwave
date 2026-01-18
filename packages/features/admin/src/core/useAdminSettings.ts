import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAdminContext } from './AdminContext';

/**
 * Hook for system settings
 */
export const useAdminSettings = () => {
    const { service } = useAdminContext();
    return useQuery({
        queryKey: ['admin', 'settings'],
        queryFn: () => service.getSystemSettings(),
    });
};

/**
 * Hook for updating a system setting (supports both create and update via upsert)
 */
export const useUpdateAdminSetting = () => {
    const { service } = useAdminContext();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (setting: any) => service.upsertSystemSetting(setting),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
        },
    });
};

// Alias for compatibility
export const useUpdateAdminSettings = useUpdateAdminSetting;
