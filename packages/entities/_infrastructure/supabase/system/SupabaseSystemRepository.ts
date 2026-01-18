/**
 * Supabase System Repository
 * Implementation of ISystemRepository.
 * Composed from atomic provider modules.
 */
import type { ISystemRepository } from '@pulwave/entity-system';
import { SupabaseSettingsProvider } from './settings';
import { SupabaseActivityProvider } from './activity';
import { SupabasePermissionsProvider } from './permissions';
import { SupabaseMasterDataProvider } from './master';
import { SupabaseDashboardProvider } from './dashboard';

export const SupabaseSystemRepository: ISystemRepository = {
    version: '1.0.0',
    // Settings & Feature Flags
    getSystemSettings: SupabaseSettingsProvider.getSystemSettings,
    updateSystemSetting: SupabaseSettingsProvider.updateSystemSetting,
    upsertSystemSetting: SupabaseSettingsProvider.upsertSystemSetting,
    getFeatureFlags: SupabaseSettingsProvider.getFeatureFlags,
    updateFeatureFlag: SupabaseSettingsProvider.updateFeatureFlag,
    createFeatureFlag: SupabaseSettingsProvider.createFeatureFlag,
    deleteFeatureFlag: SupabaseSettingsProvider.deleteFeatureFlag,
    getRetentionPolicies: SupabaseSettingsProvider.getRetentionPolicies,
    updateRetentionPolicy: SupabaseSettingsProvider.updateRetentionPolicy,

    // Activity
    getActivityLogs: SupabaseActivityProvider.getActivityLogs,

    // Permissions
    getPermissions: SupabasePermissionsProvider.getPermissions,
    getRolePermissions: SupabasePermissionsProvider.getRolePermissions,
    getAllUserPermissions: SupabasePermissionsProvider.getAllUserPermissions,

    // Master Data
    getMasterDataTypes: SupabaseMasterDataProvider.getMasterDataTypes,
    upsertMasterDataType: SupabaseMasterDataProvider.upsertMasterDataType,
    deleteMasterDataType: SupabaseMasterDataProvider.deleteMasterDataType,
    getMasterDataValues: SupabaseMasterDataProvider.getMasterDataValues,
    upsertMasterDataValue: SupabaseMasterDataProvider.upsertMasterDataValue,
    deleteMasterDataValue: SupabaseMasterDataProvider.deleteMasterDataValue,
    getTranslatableTables: SupabaseMasterDataProvider.getTranslatableTables,
    getTranslatableEnums: SupabaseMasterDataProvider.getTranslatableEnums,
    getTableData: SupabaseMasterDataProvider.getTableData,
    saveTableRecord: SupabaseMasterDataProvider.saveTableRecord,
    deleteTableRecord: SupabaseMasterDataProvider.deleteTableRecord,
    getCountries: SupabaseMasterDataProvider.getCountries,
    getCountryById: SupabaseMasterDataProvider.getCountryById,
    getCountryByCode: SupabaseMasterDataProvider.getCountryByCode,
    getCountriesWithPhoneCodes: SupabaseMasterDataProvider.getCountriesWithPhoneCodes,
    getAdministrativeDivisions: SupabaseMasterDataProvider.getAdministrativeDivisions,
    getLocalities: SupabaseMasterDataProvider.getLocalities,

    // Dashboard
    getDashboardStats: SupabaseDashboardProvider.getDashboardStats,
    getTranslationStats: SupabaseDashboardProvider.getTranslationStats,

    // Lookups
    getTimezones: SupabaseMasterDataProvider.getTimezones,
    getCommonTranslatableColumns: SupabaseMasterDataProvider.getCommonTranslatableColumns,
};



