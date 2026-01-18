/**
 * System Services
 * Admin and lookup services composed from atomic modules.
 */
import {
    userService,
    dashboardService,
} from './users';
import {
    permissionsService,
} from './permissions';
import {
    systemTranslationService,
} from './translations';
import {
    settingsService,
    timezoneLookupService,
} from './configurations';
import {
    masterDataService,
    countryLookupService,
    divisionLookupService,
    relationshipLookupService,
    RELATIONSHIP_OPTIONS
} from './master-data';

// Re-export atomic services
export * from './users';
export * from './permissions';
export * from './translations';
export * from './configurations';
// export * from './master-data'; // Removed to avoid Country type collision
export {
    masterDataService,
    countryLookupService,
    divisionLookupService,
    relationshipLookupService,
    RELATIONSHIP_OPTIONS
} from './master-data';


export const adminService = {
    // User Management
    getUsers: userService.getUsers.bind(userService),
    getUserById: userService.getUserById.bind(userService),
    createUser: userService.createUser.bind(userService),
    updateUser: userService.updateUser.bind(userService),
    deleteUser: userService.deleteUser.bind(userService),
    suspendUser: userService.suspendUser.bind(userService),
    activateUser: userService.activateUser.bind(userService),

    // Permissions
    getUserPermissions: permissionsService.getUserPermissions.bind(permissionsService),
    checkUserHasPermission: permissionsService.checkUserHasPermission.bind(permissionsService),
    getUserPermissionGrants: permissionsService.getUserPermissionGrants.bind(permissionsService),
    grantUserPermission: permissionsService.grantUserPermission.bind(permissionsService),
    revokeUserPermission: permissionsService.revokeUserPermission.bind(permissionsService),
    getAllPermissions: permissionsService.getAllPermissions.bind(permissionsService),
    getPermissions: permissionsService.getPermissions.bind(permissionsService),
    getRolePermissions: permissionsService.getRolePermissions.bind(permissionsService),
    getAllUserPermissions: permissionsService.getAllUserPermissions.bind(permissionsService),

    // Dashboard
    getDashboardData: dashboardService.getDashboardData.bind(dashboardService),
    getActivityLogs: dashboardService.getActivityLogs.bind(dashboardService),

    // Translations
    getUITranslations: systemTranslationService.getUITranslations.bind(systemTranslationService),
    upsertBatchUITranslations: systemTranslationService.upsertBatchUITranslations.bind(systemTranslationService),
    saveUITranslation: systemTranslationService.saveUITranslation.bind(systemTranslationService),
    deleteUITranslation: systemTranslationService.deleteUITranslation.bind(systemTranslationService),
    getSchemaTranslations: systemTranslationService.getSchemaTranslations.bind(systemTranslationService),
    saveSchemaTranslation: systemTranslationService.saveSchemaTranslation.bind(systemTranslationService),
    getEnumTranslations: systemTranslationService.getEnumTranslations.bind(systemTranslationService),
    saveEnumTranslation: systemTranslationService.saveEnumTranslation.bind(systemTranslationService),
    getContentTranslations: systemTranslationService.getContentTranslations.bind(systemTranslationService),
    saveContentTranslation: systemTranslationService.saveContentTranslation.bind(systemTranslationService),
    getMasterDataTranslations: systemTranslationService.getMasterDataTranslations.bind(systemTranslationService),
    saveMasterDataTranslation: systemTranslationService.saveMasterDataTranslation.bind(systemTranslationService),
    generateTranslationBundles: systemTranslationService.generateTranslationBundles.bind(systemTranslationService),
    syncAllTranslations: systemTranslationService.syncAllTranslations.bind(systemTranslationService),
    getTranslationBundles: systemTranslationService.getTranslationBundles.bind(systemTranslationService),
    getSupportedLocales: systemTranslationService.getSupportedLocales.bind(systemTranslationService),
    getDatabaseTables: systemTranslationService.getDatabaseTables.bind(systemTranslationService),
    getTableColumns: systemTranslationService.getTableColumns.bind(systemTranslationService),
    getDatabaseEnums: systemTranslationService.getDatabaseEnums.bind(systemTranslationService),
    getTableRecords: systemTranslationService.getTableRecords.bind(systemTranslationService),

    // Settings
    getSystemSettings: settingsService.getSystemSettings.bind(settingsService),
    updateSystemSetting: settingsService.updateSystemSetting.bind(settingsService),
    upsertSystemSetting: settingsService.upsertSystemSetting.bind(settingsService),
    getFeatureFlags: settingsService.getFeatureFlags.bind(settingsService),
    toggleFeatureFlag: settingsService.toggleFeatureFlag.bind(settingsService),
    createFeatureFlag: settingsService.createFeatureFlag.bind(settingsService),
    deleteFeatureFlag: settingsService.deleteFeatureFlag.bind(settingsService),
    getRetentionPolicies: settingsService.getRetentionPolicies.bind(settingsService),
    updateRetentionPolicy: settingsService.updateRetentionPolicy.bind(settingsService),

    // Master Data
    getMasterDataTypes: masterDataService.getMasterDataTypes.bind(masterDataService),
    saveMasterDataType: masterDataService.saveMasterDataType.bind(masterDataService),
    deleteMasterDataType: masterDataService.deleteMasterDataType.bind(masterDataService),
    getMasterDataValues: masterDataService.getMasterDataValues.bind(masterDataService),
    saveMasterDataValue: masterDataService.saveMasterDataValue.bind(masterDataService),
    deleteMasterDataValue: masterDataService.deleteMasterDataValue.bind(masterDataService),
    getTranslatableTables: masterDataService.getTranslatableTables.bind(masterDataService),
    getTranslatableEnums: masterDataService.getTranslatableEnums.bind(masterDataService),
    getCommonTranslatableColumns: masterDataService.getCommonTranslatableColumns.bind(masterDataService),
    getTableData: masterDataService.getTableData.bind(masterDataService),
    saveTableRecord: masterDataService.saveTableRecord.bind(masterDataService),
    deleteTableRecord: masterDataService.deleteTableRecord.bind(masterDataService),
    getCountries: masterDataService.getCountries.bind(masterDataService),
};

/**
 * Composed Lookup Service Facade
 * Maintains backward compatibility.
 */
export const lookupService = {
    fetchTimezones: timezoneLookupService.fetchTimezones.bind(timezoneLookupService),
    getRelationshipOptions: relationshipLookupService.getRelationshipOptions.bind(relationshipLookupService),
    fetchAdministrativeDivisions: divisionLookupService.fetchAdministrativeDivisions.bind(divisionLookupService),
    fetchPortugalDistricts: divisionLookupService.fetchPortugalDistricts.bind(divisionLookupService),
    fetchLocalities: divisionLookupService.fetchLocalities.bind(divisionLookupService),
    fetchCountries: countryLookupService.fetchCountries.bind(countryLookupService),
    getCountryById: countryLookupService.getCountryById.bind(countryLookupService),
    getCountriesWithPhoneCodes: countryLookupService.getCountriesWithPhoneCodes.bind(countryLookupService),
    clearLookupCache(): void {
        timezoneLookupService.clearCache();
        countryLookupService.clearCache();
        divisionLookupService.clearCache();
    },
    async preloadLookups(): Promise<void> {
        await Promise.all([
            timezoneLookupService.fetchTimezones(),
        ]);
    },
    RELATIONSHIP_OPTIONS,
};

export default { adminService, lookupService };


