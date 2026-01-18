import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { systemKeys } from '../../keys';
import { adminService } from '../../services';

interface UserOptions {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
}

/**
 * Hook for admin users list with pagination and filtering
 */
export const useAdminUsers = (options: UserOptions = {}) => {
    const { page = 1, limit = 20, search = '', role = '', status = '' } = options;

    return useQuery({
        queryKey: systemKeys.admin.users({ page, limit, search, role, status }),
        queryFn: () => adminService.getUsers({ page, limit, search, role, status }),
    });
};

/**
 * Hook for single user
 */
export const useAdminUser = (id: string) => {
    return useQuery({
        queryKey: systemKeys.admin.user(id),
        queryFn: () => adminService.getUserById(id),
        enabled: !!id,
    });
};

/**
 * Hook for updating user
 */
export const useUpdateAdminUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: any }) => adminService.updateUser(id, updates),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: systemKeys.admin.all });
            // Invalidate specific user as well
            queryClient.invalidateQueries({ queryKey: systemKeys.admin.user(variables.id) });
        },
    });
};

/**
 * Hook for creating a user
 */
export const useCreateAdminUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userData: any) => adminService.createUser(userData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: systemKeys.admin.usersBase });
            queryClient.invalidateQueries({ queryKey: systemKeys.admin.dashboard });
        },
    });
};

/**
 * Hook for deleting/suspending a user
 */
export const useDeleteAdminUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: string) => adminService.deleteUser(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: systemKeys.admin.usersBase });
            queryClient.invalidateQueries({ queryKey: systemKeys.admin.dashboard });
        },
    });
};
