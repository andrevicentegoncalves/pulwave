import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAdminContext } from '../core/AdminContext';

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
    const { service } = useAdminContext();
    const { page = 1, limit = 20, search = '', role = '', status = '' } = options;

    return useQuery({
        queryKey: ['admin', 'users', { page, limit, search, role, status }],
        queryFn: () => service.getUsers({ page, limit, search, role, status }),
    });
};

/**
 * Hook for single user
 */
export const useAdminUser = (id: string) => {
    const { service } = useAdminContext();
    return useQuery({
        queryKey: ['admin', 'user', id],
        queryFn: () => service.getUserById(id),
        enabled: !!id,
    });
};

/**
 * Hook for updating user
 */
export const useUpdateAdminUser = () => {
    const queryClient = useQueryClient();
    const { service } = useAdminContext();

    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: any }) => service.updateUser(id, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
        },
    });
};

/**
 * Hook for creating a user
 */
export const useCreateAdminUser = () => {
    const queryClient = useQueryClient();
    const { service } = useAdminContext();

    return useMutation({
        mutationFn: (userData: any) => service.createUser(userData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
        },
    });
};

/**
 * Hook for deleting/suspending a user
 */
export const useDeleteAdminUser = () => {
    const queryClient = useQueryClient();
    const { service } = useAdminContext();

    return useMutation({
        mutationFn: (userId: string) => service.deleteUser(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
        },
    });
};
