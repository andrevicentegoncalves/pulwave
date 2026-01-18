/**
 * Supabase Translation Repository
 * ITranslationRepository implementation.
 * Composed from atomic provider modules.
 */
import type { ITranslationRepository } from '@pulwave/entity-translation';
import { SupabaseUITranslationProvider } from './ui';
import { SupabaseSchemaTranslationProvider } from './schema';
import { SupabaseContentTranslationProvider } from './content';
import { SupabaseEnumTranslationProvider } from './enum';
import { SupabaseMasterTranslationProvider } from './master';
import { SupabaseBundlesProvider } from './bundles';
import { SupabaseIntrospectionProvider } from './introspection';
import { SupabasePreferencesProvider } from './preferences';

export const SupabaseTranslationRepository: ITranslationRepository = {
    version: '1.0.0',
    // UI
    getUITranslations: SupabaseUITranslationProvider.getUITranslations,
    saveUITranslation: SupabaseUITranslationProvider.saveUITranslation,
    upsertBatchUITranslations: SupabaseUITranslationProvider.upsertBatchUITranslations,
    deleteUITranslation: SupabaseUITranslationProvider.deleteUITranslation,

    // Schema
    getSchemaTableList: SupabaseSchemaTranslationProvider.getSchemaTableList,
    getSchemaTableTranslations: SupabaseSchemaTranslationProvider.getSchemaTableTranslations,
    getSchemaTranslations: SupabaseSchemaTranslationProvider.getSchemaTranslations,
    saveSchemaTranslation: SupabaseSchemaTranslationProvider.saveSchemaTranslation,

    // Content
    getContentTranslations: SupabaseContentTranslationProvider.getContentTranslations,
    saveContentTranslation: SupabaseContentTranslationProvider.saveContentTranslation,
    getEntityTranslations: SupabaseContentTranslationProvider.getEntityTranslations,

    // Enum
    getEnumList: SupabaseEnumTranslationProvider.getEnumList,
    getEnumTranslationsByName: SupabaseEnumTranslationProvider.getEnumTranslationsByName,
    getEnumTranslations: SupabaseEnumTranslationProvider.getEnumTranslations,
    saveEnumTranslation: SupabaseEnumTranslationProvider.saveEnumTranslation,

    // Master
    getMasterDataList: SupabaseMasterTranslationProvider.getMasterDataList,
    getMasterDataTranslationsByValue: SupabaseMasterTranslationProvider.getMasterDataTranslationsByValue,
    getMasterDataTranslationsByType: SupabaseMasterTranslationProvider.getMasterDataTranslationsByType,
    getMasterDataTranslations: SupabaseMasterTranslationProvider.getMasterDataTranslations,
    saveMasterDataTranslation: SupabaseMasterTranslationProvider.saveMasterDataTranslation,

    // Locales & Bundles
    getSupportedLocales: SupabaseBundlesProvider.getSupportedLocales,
    generateTranslationBundles: SupabaseBundlesProvider.generateTranslationBundles,
    syncAllTranslations: SupabaseBundlesProvider.syncAllTranslations,
    getTranslationBundles: SupabaseBundlesProvider.getTranslationBundles,

    // Introspection
    getDatabaseTables: SupabaseIntrospectionProvider.getDatabaseTables,
    getTableColumns: SupabaseIntrospectionProvider.getTableColumns,
    getDatabaseEnums: SupabaseIntrospectionProvider.getDatabaseEnums,

    // Preferences
    updateUserLocale: SupabasePreferencesProvider.updateUserLocale,
    getUserPreference: SupabasePreferencesProvider.getUserPreference,
};



