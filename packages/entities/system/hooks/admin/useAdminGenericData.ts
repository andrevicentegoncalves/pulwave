import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { systemKeys } from '../../keys';
import { adminService } from '../../services';

/**
 * Hook for saving master data value
 */
export const useSaveAdminMasterDataValue = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => adminService.saveMasterDataValue(data),
        onSuccess: (_data, variables) => {
            // Invalidate specific type key query if available in variables
            if (variables.type_key) {
                queryClient.invalidateQueries({ queryKey: systemKeys.admin.masterData.values(variables.type_key) });
            }
            queryClient.invalidateQueries({ queryKey: systemKeys.admin.masterData.values() });
        },
    });
};

/**
 * Hook for saving master data type
 */
export const useSaveAdminMasterDataType = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => adminService.saveMasterDataType(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: systemKeys.admin.masterData.types });
        },
    });
};

/**
 * Hook for saving generic table record
 */
export const useSaveAdminTableRecord = (tableName?: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ table, data }: { table: string, data: any }) => adminService.saveTableRecord(table, data),
        onSuccess: (_data, variables) => {
            const table = tableName || variables.table;
            if (table) {
                queryClient.invalidateQueries({ queryKey: systemKeys.admin.tables.records(table) });
                // Also invalidate the generic key used by MasterData manager if possible
                queryClient.invalidateQueries({ queryKey: systemKeys.admin.tables.generic(table) });
            }
        },
    });
};

/**
 * Hook for deleting master data value
 */
export const useDeleteAdminMasterDataValue = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => adminService.deleteMasterDataValue(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: systemKeys.admin.masterData.values() });
        },
    });
};

/**
 * Hook for deleting master data type
 */
export const useDeleteAdminMasterDataType = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => adminService.deleteMasterDataType(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: systemKeys.admin.masterData.types });
        },
    });
};

/**
* Hook for deleting generic table record
*/
export const useDeleteAdminTableRecord = (tableName?: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ table, id }: { table: string, id: string }) => adminService.deleteTableRecord(table, id),
        onSuccess: (_data, variables) => {
            const table = tableName || variables.table;
            if (table) {
                queryClient.invalidateQueries({ queryKey: systemKeys.admin.tables.records(table) });
                queryClient.invalidateQueries({ queryKey: systemKeys.admin.tables.generic(table) });
            }
        },
    });
};

/**
 * Hook for master data types
 */
export const useAdminMasterDataTypes = () => {
    return useQuery({
        queryKey: systemKeys.admin.masterData.types,
        queryFn: () => adminService.getMasterDataTypes(),
        staleTime: 300000,
    });
};

/**
 * Hook for master data values
 */
export const useAdminMasterDataValues = (typeId: string) => {
    return useQuery({
        queryKey: systemKeys.admin.masterData.values(typeId),
        queryFn: () => adminService.getMasterDataValues(typeId),
        enabled: !!typeId,
        staleTime: 300000,
    });
};

