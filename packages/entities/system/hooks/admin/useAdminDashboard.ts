import { useQuery } from '@tanstack/react-query';
import { systemKeys } from '../../keys';
import { adminService } from '../../services';

export const useAdminDashboard = () => {
    return useQuery({
        queryKey: systemKeys.admin.dashboard,
        queryFn: () => adminService.getDashboardData(),
        staleTime: 30000,
    });
};

export const useAdminLocales = () => {
    return useQuery({
        queryKey: systemKeys.admin.locales,
        queryFn: () => adminService.getSupportedLocales(),
        staleTime: 300000,
    });
};
