import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { translationService } from '../services/translationService';
import { translationKeys } from '../keys';

/**
 * Hook to fetch available locales
 */
export const useLocales = () => {
    return useQuery({
        queryKey: translationKeys.locales,
        queryFn: () => translationService.getAllLocales(),
        staleTime: 3600000,
    });
};

/**
 * Hook to update user locale
 */
export const useUpdateUserLocale = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ profileId, locale }: { profileId: string; locale: string }) =>
            translationService.updateUserLocale(profileId, locale),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
        },
    });
};

/**
 * Hook to fetch content translations for an entity
 */
export const useEntityTranslations = (entityType: string, entityId: string, locale = 'en-US') => {
    return useQuery({
        queryKey: translationKeys.entity(entityType, entityId, locale),
        queryFn: () => translationService.getEntityTranslations(entityType, entityId, locale),
        enabled: !!entityType && !!entityId && !!locale,
    });
};
