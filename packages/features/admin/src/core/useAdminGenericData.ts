import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAdminContext } from './AdminContext';

/**
 * Hook for saving master data value
 */
export const useSaveAdminMasterDataValue = () => {
    const { service } = useAdminContext();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => service.saveMasterDataValue(data),
        onSuccess: (_data, variables) => {
            // Invalidate specific type key query if available in variables
            if (variables.type_key) {
                queryClient.invalidateQueries({ queryKey: ['admin', 'master-data-values', variables.type_key] });
            }
            queryClient.invalidateQueries({ queryKey: ['admin', 'master-data-values'] });
        },
    });
};

/**
 * Hook for saving master data type
 */
export const useSaveAdminMasterDataType = () => {
    const { service } = useAdminContext();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => service.saveMasterDataType(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'master-data-types'] });
        },
    });
};

/**
 * Hook for saving generic table record
 */
export const useSaveAdminTableRecord = (tableName?: string) => {
    const { service } = useAdminContext();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ table, data }: { table: string, data: any }) => service.saveTableRecord(table, data),
        onSuccess: (_data, variables) => {
            const table = tableName || variables.table;
            if (table) {
                queryClient.invalidateQueries({ queryKey: ['admin', 'table-records', table] });
                // Also invalidate the generic key used by MasterData manager if possible
                queryClient.invalidateQueries({ queryKey: ['admin', table] });
            }
        },
    });
};

/**
 * Hook for deleting master data value
 */
export const useDeleteAdminMasterDataValue = () => {
    const { service } = useAdminContext();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => service.deleteMasterDataValue(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'master-data-values'] });
        },
    });
};

/**
 * Hook for deleting master data type
 */
export const useDeleteAdminMasterDataType = () => {
    const { service } = useAdminContext();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => service.deleteMasterDataType(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'master-data-types'] });
        },
    });
};

/**
* Hook for deleting generic table record
*/
export const useDeleteAdminTableRecord = (tableName?: string) => {
    const { service } = useAdminContext();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ table, id }: { table: string, id: string }) => service.deleteTableRecord(table, id),
        onSuccess: (_data, variables) => {
            const table = tableName || variables.table;
            if (table) {
                queryClient.invalidateQueries({ queryKey: ['admin', 'table-records', table] });
                queryClient.invalidateQueries({ queryKey: ['admin', table] });
            }
        },
    });
};
