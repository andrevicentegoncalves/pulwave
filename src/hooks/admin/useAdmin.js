import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../services';

/**
 * Hook for admin dashboard data
 */
export const useAdminDashboard = () => {
    return useQuery({
        queryKey: ['admin', 'dashboard'],
        queryFn: () => adminService.getDashboardData(),
        staleTime: 30000, // 30 seconds
    });
};

/**
 * Hook for admin users list with pagination and filtering
 */
export const useAdminUsers = (options = {}) => {
    const { page = 1, limit = 20, search = '', role = '' } = options;

    return useQuery({
        queryKey: ['admin', 'users', { page, limit, search, role }],
        queryFn: () => adminService.getUsers({ page, limit, search, role }),
        keepPreviousData: true,
    });
};

/**
 * Hook for single user
 */
export const useAdminUser = (id) => {
    return useQuery({
        queryKey: ['admin', 'user', id],
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
        mutationFn: ({ id, updates }) => adminService.updateUser(id, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
        },
    });
};

/**
 * Hook for UI translations
 */
export const useAdminTranslations = (options = {}) => {
    const { page = 1, limit = 50, locale = '', search = '', source_type = '', category = '', table = '', enumName = '', key = '' } = options;

    return useQuery({
        queryKey: ['admin', 'translations', { page, limit, locale, search, source_type, category, table, enumName, key }],
        queryFn: async () => {
            let result = { data: [], count: 0 };
            let sourceTypeValue;

            if (source_type === 'database') {
                result = await adminService.getSchemaTranslations({ page, limit, locale, search, table });
                sourceTypeValue = 'database';
            } else if (source_type === 'enum') {
                result = await adminService.getEnumTranslations({ page, limit, locale, search, enumName });
                sourceTypeValue = 'enum';
            } else if (source_type === 'content') {
                result = await adminService.getContentTranslations({ page, limit, locale, search, table });
                sourceTypeValue = 'content';
            } else if (source_type === 'master_data') {
                result = await adminService.getMasterDataTranslations({ page, limit, locale, search });
                sourceTypeValue = 'master_data';
            } else if (source_type === 'ui') {
                // Explicit UI type
                result = await adminService.getUITranslations({ page, limit, locale, search, source_type, category, key });
                sourceTypeValue = null;
            } else {
                // ALL TYPES (source_type === '')
                // Fetch all in parallel
                const [ui, schema, enums, content, masterData] = await Promise.all([
                    adminService.getUITranslations({ page, limit, locale, search, source_type: 'ui', category, key }),
                    adminService.getSchemaTranslations({ page, limit, locale, search, table }),
                    adminService.getEnumTranslations({ page, limit, locale, search, enumName }),
                    adminService.getContentTranslations({ page, limit, locale, search, table }),
                    adminService.getMasterDataTranslations({ page, limit, locale, search })
                ]);

                // Combine data
                // Note: Pagination with combined data is tricky. 
                // Ideally backend should handle "all", but for now we combine on client.
                // We'll mark items with their source type.

                const uiItems = (ui.data || []).map(i => ({ ...i, source_type: i.source_type || 'ui' }));
                const schemaItems = (schema.data || []).map(i => ({ ...i, source_type: 'database' }));
                const enumItems = (enums.data || []).map(i => ({ ...i, source_type: 'enum' }));
                const contentItems = (content.data || []).map(i => ({ ...i, source_type: 'content' }));
                const masterDataItems = (masterData.data || []).map(i => ({ ...i, source_type: 'master_data' }));

                result = {
                    data: [...uiItems, ...schemaItems, ...enumItems, ...contentItems, ...masterDataItems],
                    count: (ui.count || 0) + (schema.count || 0) + (enums.count || 0) + (content.count || 0) + (masterData.count || 0)
                };
                sourceTypeValue = null; // Already set per item
            }

            // Add source_type to each item if not already present (for single-source fetches)
            if (result?.data && sourceTypeValue) {
                result.data = result.data.map(item => ({
                    ...item,
                    source_type: item.source_type || sourceTypeValue
                }));
            }

            return result;
        },
        keepPreviousData: true,
    });
};

/**
 * Hook for supported locales
 */
export const useAdminLocales = () => {
    return useQuery({
        queryKey: ['admin', 'locales'],
        queryFn: async () => {
            console.log('[useAdminLocales] Starting locale fetch...');
            try {
                const result = await adminService.getSupportedLocales();
                console.log('[useAdminLocales] ✅ Fetch successful:', result);
                return result;
            } catch (error) {
                console.error('[useAdminLocales] ❌ Fetch failed:', error);
                throw error;
            }
        },
        staleTime: 300000, // 5 minutes
        onError: (error) => {
            console.error('[useAdminLocales] React Query onError:', error);
        },
        onSuccess: (data) => {
            console.log('[useAdminLocales] React Query onSuccess:', data?.length, 'locales');
        }
    });
};

/**
 * Hook for activity logs
 */
export const useAdminActivityLogs = (options = {}) => {
    const { page = 1, limit = 50, action = '', entityType = '' } = options;

    return useQuery({
        queryKey: ['admin', 'activity-logs', { page, limit, action, entityType }],
        queryFn: () => adminService.getActivityLogs({ page, limit, action, entityType }),
        keepPreviousData: true,
    });
};

/**
 * Hook for system settings
 */
export const useAdminSettings = () => {
    return useQuery({
        queryKey: ['admin', 'settings'],
        queryFn: () => adminService.getSystemSettings(),
    });
};

/**
 * Hook for feature flags
 */
export const useAdminFeatureFlags = () => {
    return useQuery({
        queryKey: ['admin', 'feature-flags'],
        queryFn: () => adminService.getFeatureFlags(),
    });
};

/**
 * Hook for toggling feature flag
 */
export const useToggleFeatureFlag = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, enabled }) => adminService.toggleFeatureFlag(id, enabled),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'feature-flags'] });
        },
    });
};

/**
 * Hook for data retention policies
 */
export const useAdminRetentionPolicies = () => {
    return useQuery({
        queryKey: ['admin', 'retention-policies'],
        queryFn: () => adminService.getRetentionPolicies(),
    });
};

/**
 * Hook for permissions
 */
export const useAdminPermissions = () => {
    return useQuery({
        queryKey: ['admin', 'permissions'],
        queryFn: () => adminService.getPermissions(),
    });
};

// ==================== CRUD MUTATIONS ====================

/**
 * Hook for creating a user
 */
export const useCreateAdminUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userData) => adminService.createUser(userData),
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

    return useMutation({
        mutationFn: (userId) => adminService.deleteUser(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
        },
    });
};

/**
 * Hook for creating/updating a translation
 */
export const useSaveAdminTranslation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (translation) => adminService.saveUITranslation(translation),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'translations'] });
        },
    });
};

/**
 * Hook for batch saving translations
 */
export const useSaveBatchAdminTranslations = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (translations) => adminService.upsertBatchUITranslations(translations),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'translations'] });
        },
    });
};

export const useSaveAdminSchemaTranslation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (translation) => adminService.saveSchemaTranslation(translation),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'translations'] }),
    });
};

export const useSaveAdminEnumTranslation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (translation) => adminService.saveEnumTranslation(translation),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'translations'] }),
    });
};

export const useSaveAdminContentTranslation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (translation) => adminService.saveContentTranslation(translation),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'translations'] }),
    });
};

export const useSaveAdminMasterDataTranslation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (translation) => adminService.saveMasterDataTranslation(translation),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'translations'] }),
    });
};

export const useAdminMasterDataTypes = () => {
    return useQuery({
        queryKey: ['admin', 'master-data-types'],
        queryFn: () => adminService.getMasterDataTypes(),
        staleTime: 300000, // 5 minutes
    });
};

export const useAdminMasterDataValues = (typeId) => {
    return useQuery({
        queryKey: ['admin', 'master-data-values', typeId],
        queryFn: () => adminService.getMasterDataValues(typeId),
        enabled: !!typeId,
        staleTime: 300000, // 5 minutes
    });
};

export const useGenerateTranslationBundles = () => {
    return useMutation({
        mutationFn: (locale) => adminService.generateTranslationBundles(locale),
    });
};

/**
 * Hook for fetching translations by key (for pre-filling)
 */
export const useAdminTranslationsByKey = (key) => {
    return useQuery({
        queryKey: ['admin', 'translations', 'by-key', key],
        queryFn: () => adminService.getUITranslations({ key, limit: 100 }), // large limit to get all locales
        enabled: !!key && key.trim().length > 0,
    });
};

/**
 * Hook for deleting a translation
 */
export const useDeleteAdminTranslation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (translationId) => adminService.deleteUITranslation(translationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'translations'] });
        },
    });
};

/**
 * Hook for updating a system setting (supports both create and update via upsert)
 */
export const useUpdateAdminSetting = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (setting) => adminService.upsertSystemSetting(setting),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
        },
    });
};

/**
 * Hook for creating a feature flag
 */
export const useCreateFeatureFlag = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (flag) => adminService.createFeatureFlag(flag),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'feature-flags'] });
        },
    });
};

/**
 * Hook for deleting a feature flag
 */
export const useDeleteFeatureFlag = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (flagId) => adminService.deleteFeatureFlag(flagId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'feature-flags'] });
        },
    });
};

/**
 * Hook for updating retention policy
 */
export const useUpdateRetentionPolicy = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, updates }) => adminService.updateRetentionPolicy(id, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'retention-policies'] });
        },
    });
};

// Alias for Configuration page compatibility
export const useUpdateAdminSettings = useUpdateAdminSetting;

// ==================== SCHEMA INTROSPECTION ====================

/**
 * Hook for fetching all database tables (uses Supabase's information_schema)
 */
export const useAdminTables = () => {
    return useQuery({
        queryKey: ['admin', 'schema', 'tables'],
        queryFn: () => adminService.getDatabaseTables(),
        staleTime: 600000, // 10 minutes - schema doesn't change often
    });
};

/**
 * Hook for fetching columns of a specific table
 */
export const useAdminTableColumns = (tableName) => {
    return useQuery({
        queryKey: ['admin', 'schema', 'columns', tableName],
        queryFn: () => adminService.getTableColumns(tableName),
        enabled: !!tableName,
        staleTime: 600000, // 10 minutes
    });
};

/**
 * Hook for fetching generic table records (for Content Translations)
 */
export const useAdminTableRecords = (tableName, options = { limit: 100 }) => {
    return useQuery({
        queryKey: ['admin', 'table-records', tableName, options],
        queryFn: () => adminService.getTableRecords(tableName, options),
        enabled: !!tableName,
        staleTime: 60000, // 1 minute
    });
};
