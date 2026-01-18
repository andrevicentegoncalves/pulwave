import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAdminContext } from '../core/AdminContext';

export const useAdminRetentionPolicies = () => {
    const { service } = useAdminContext();
    return useQuery({
        queryKey: ['admin', 'retention-policies'],
        queryFn: () => service.getRetentionPolicies(),
    });
};

export const useUpdateRetentionPolicy = () => {
    const { service } = useAdminContext();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (variables: { id: string; updates: any }) =>
            service.updateRetentionPolicy(variables.id, variables.updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'retention-policies'] });
        },
    });
};
