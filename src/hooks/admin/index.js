export {
    // Read hooks
    useAdminDashboard,
    useAdminUsers,
    useAdminUser,
    useAdminTranslations,
    useAdminTranslationsByKey,
    useAdminLocales,
    useAdminActivityLogs,
    useAdminActivityLogs as useAdminActivity, // Alias
    useAdminSettings,
    useAdminFeatureFlags,
    useAdminRetentionPolicies,
    useAdminPermissions,
    // Schema introspection
    useAdminTables,
    useAdminTableColumns,
    // Mutations
    useUpdateAdminUser,
    useCreateAdminUser,
    useDeleteAdminUser,
    useSaveAdminTranslation,
    useSaveBatchAdminTranslations,
    useDeleteAdminTranslation,
    useUpdateAdminSetting,
    useUpdateAdminSettings, // Alias for Configuration
    useToggleFeatureFlag,
    useCreateFeatureFlag,
    useDeleteFeatureFlag,
    useUpdateRetentionPolicy,
} from './useAdmin';
