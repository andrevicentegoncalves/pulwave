import { useQuery } from '@tanstack/react-query';
import { useAdminContext } from '../core/AdminContext';

/**
 * Hook for admin dashboard data
 */
export const useAdminDashboard = () => {
    const { service } = useAdminContext();

    return useQuery({
        queryKey: ['admin', 'dashboard'],
        queryFn: () => service.getDashboardData(),
        staleTime: 30000, // 30 seconds
        enabled: false, // Temporarily disabled - RPC functions not available
        retry: false, // Don't retry on failure
    });
};
