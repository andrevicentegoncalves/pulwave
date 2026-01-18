import { useQuery } from '@tanstack/react-query';
import { useAdminContext } from '../core/AdminContext';

interface ActivityLogsOptions {
    page?: number;
    limit?: number;
    action?: string;
    entityType?: string;
}

export const useAdminActivityLogs = (options: ActivityLogsOptions = {}) => {
    const { service } = useAdminContext();
    const { page = 1, limit = 50, action = '', entityType = '' } = options;

    return useQuery({
        queryKey: ['admin', 'activity-logs', { page, limit, action, entityType }],
        queryFn: () => service.getActivityLogs({ page, limit, action, entityType }),
        placeholderData: (previousData: any) => previousData,
    });
};

// Alias for compatibility
export const useAdminActivity = useAdminActivityLogs;
