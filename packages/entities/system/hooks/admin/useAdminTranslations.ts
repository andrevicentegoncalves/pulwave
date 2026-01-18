import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { systemKeys } from '../../keys';
import { adminService } from '../../services';

export const useAdminTranslations = (options: Record<string, unknown> = {}) => {
    const { page = 1, limit = 50, locale = '', search = '', source_type = '' } = options as {
        page?: number; limit?: number; locale?: string; search?: string; source_type?: string
    };
    return useQuery({
        queryKey: systemKeys.admin.translations({ page, limit, locale, search, source_type }),
        queryFn: () => adminService.getUITranslations({ page, limit, locale, search, source_type }),
    });
};

export const useSaveAdminTranslation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (translation: Record<string, unknown>) => adminService.saveUITranslation(translation),
        onSuccess: () => {
            // Invalidate strictly the generic translations key or specific logic?
            // systemKeys.admin.translations() returns specific key.
            // We need a base key for validation.
            // Assuming invalidation of all translations is safe for now.
            // But systemKeys.admin.translations is a function.
            // I'll use ['admin', 'translations'] manually or upgrade keys.
            queryClient.invalidateQueries({ queryKey: ['admin', 'translations'] });
        },
    });
};
