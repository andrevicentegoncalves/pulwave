import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAdminService } from '../core/AdminContext';

export const useAllPermissions = () => {
    const service = useAdminService();
    return useQuery({
        queryKey: ['admin', 'all-permissions'],
        queryFn: () => service.getAllPermissions(),
        staleTime: 300000, // 5 minutes
    });
};

export const useUserPermissionGrants = (userId: string) => {
    const service = useAdminService();
    return useQuery({
        queryKey: ['admin', 'user-permission-grants', userId],
        queryFn: () => service.getUserPermissionGrants(userId),
        enabled: !!userId,
    });
};

export const useRolePermissions = (roleId?: string) => {
    const service = useAdminService();
    return useQuery({
        queryKey: ['admin', 'role-permissions', roleId],
        queryFn: () => service.getRolePermissions(roleId),
        staleTime: 300000,
        enabled: !!roleId, // Only fetch when roleId is defined
    });
};

export const useAdminAllUserPermissions = () => {
    const service = useAdminService();
    return useQuery({
        queryKey: ['admin', 'all-user-permissions'],
        queryFn: () => service.getAllUserPermissions(),
        staleTime: 300000,
    });
};

export const useGrantUserPermission = () => {
    const service = useAdminService();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (variables: { userId: string; permissionId: string; grantedBy: string; reason: string }) =>
            service.grantUserPermission(variables.userId, variables.permissionId, variables.grantedBy, variables.reason),
        onSuccess: (_, { userId }) => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'user-permissions', userId] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'user-permission-grants', userId] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'user-permission-check'] });
        },
    });
};

export const useRevokeUserPermission = () => {
    const service = useAdminService();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (variables: { userId: string; permissionId: string }) =>
            service.revokeUserPermission(variables.userId, variables.permissionId),
        onSuccess: (_, { userId }) => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'user-permissions', userId] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'user-permission-grants', userId] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'user-permission-check'] });
        },
    });
};
