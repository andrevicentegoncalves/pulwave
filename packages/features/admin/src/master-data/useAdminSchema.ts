import { useQuery } from '@tanstack/react-query';
import { useAdminContext } from '../core/AdminContext';

/**
 * Hook to get all database tables (raw schema)
 */
export const useAdminAllTables = () => {
    const { service } = useAdminContext();
    return useQuery({
        queryKey: ['admin', 'all-database-tables'],
        queryFn: () => service.getAllDatabaseTables(),
    });
};

/**
 * Hook to get columns for a specific table
 */
export const useAdminAllTableColumns = (tableName: string) => {
    const { service } = useAdminContext();
    return useQuery({
        queryKey: ['admin', 'all-table-columns', tableName],
        queryFn: () => service.getAllTableColumns(tableName),
        enabled: !!tableName,
    });
};

/**
 * Hook to get all database enums
 */
export const useAdminDatabaseEnums = () => {
    const { service } = useAdminContext();
    return useQuery({
        queryKey: ['admin', 'all-database-enums'],
        queryFn: () => service.getDatabaseEnums(),
    });
};
