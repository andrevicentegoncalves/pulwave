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
    const { page = 1, limit = 50, locale = '', search = '', source_type = '', category = '' } = options;

    return useQuery({
        queryKey: ['admin', 'translations', { page, limit, locale, search, source_type, category }],
        queryFn: () => adminService.getUITranslations({ page, limit, locale, search, source_type, category }),
        keepPreviousData: true,
    });
};

/**
 * Hook for supported locales
 */
export const useAdminLocales = () => {
    return useQuery({
        queryKey: ['admin', 'locales'],
        queryFn: () => adminService.getSupportedLocales(),
        staleTime: 300000, // 5 minutes
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
