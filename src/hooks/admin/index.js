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
    useAdminTableRecords,
    // Master Data
    useAdminMasterDataTypes,
    useAdminMasterDataValues,
    // Mutations
    useUpdateAdminUser,
    useCreateAdminUser,
    useDeleteAdminUser,
    useSaveAdminTranslation,
    useSaveBatchAdminTranslations,
    useSaveAdminSchemaTranslation,
    useSaveAdminEnumTranslation,
    useSaveAdminContentTranslation,
    useSaveAdminMasterDataTranslation,
    useGenerateTranslationBundles,
    useDeleteAdminTranslation,
    useUpdateAdminSetting,
    useUpdateAdminSettings, // Alias for Configuration
    useToggleFeatureFlag,
    useCreateFeatureFlag,
    useDeleteFeatureFlag,
    useUpdateRetentionPolicy,
} from './useAdmin';

// Helper hooks for common admin patterns
export {
    useModalState,
    usePaginatedList,
    useDebouncedSearch,
} from './useAdminHelpers';
