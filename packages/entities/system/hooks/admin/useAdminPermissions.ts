import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { systemKeys } from '../../keys';
import { adminService } from '../../services';

export const useAllPermissions = () => {
    return useQuery({
        queryKey: systemKeys.admin.permissions.all,
        queryFn: () => adminService.getAllPermissions(),
        staleTime: 300000,
    });
};

export const useAdminPermissions = () => {
    return useQuery({
        queryKey: systemKeys.admin.permissions.list,
        queryFn: () => adminService.getPermissions(),
    });
};

export const useRolePermissions = (roleId?: string) => {
    return useQuery({
        queryKey: systemKeys.admin.permissions.role(roleId),
        queryFn: () => adminService.getRolePermissions(roleId!),
        staleTime: 300000,
        enabled: !!roleId,
    });
};

export const useAllUserPermissions = (userId: string) => {
    return useQuery({
        queryKey: systemKeys.admin.permissions.user(userId), // Assuming keys support this
        queryFn: () => adminService.getAllUserPermissions(userId),
        staleTime: 300000,
        enabled: !!userId,
    });
};

export const useUserPermissionGrants = (userId: string) => {
    return useQuery({
        queryKey: systemKeys.admin.permissions.userGrants(userId),
        queryFn: () => adminService.getUserPermissionGrants(userId),
        enabled: !!userId,
    });
};

export const useGrantUserPermission = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (variables: { userId: string; permissionId: string; grantedBy: string; reason: string; expiresAt?: string }) =>
            adminService.grantUserPermission(variables.userId, variables.permissionId, variables.grantedBy, variables.reason, variables.expiresAt || ''),
        onSuccess: (_, { userId }) => {
            queryClient.invalidateQueries({ queryKey: systemKeys.admin.permissions.userSpecific(userId) });
            queryClient.invalidateQueries({ queryKey: systemKeys.admin.permissions.userGrants(userId) });
            queryClient.invalidateQueries({ queryKey: systemKeys.admin.permissions.userCheck });
        },
    });
};

export const useRevokeUserPermission = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (variables: { userId: string; permissionId: string }) =>
            adminService.revokeUserPermission(variables.userId, variables.permissionId),
        onSuccess: (_, { userId }) => {
            queryClient.invalidateQueries({ queryKey: systemKeys.admin.permissions.userSpecific(userId) });
            queryClient.invalidateQueries({ queryKey: systemKeys.admin.permissions.userGrants(userId) });
            queryClient.invalidateQueries({ queryKey: systemKeys.admin.permissions.userCheck });
        },
    });
};
