/**
 * Translation Repository Interface
 */
import {
    TranslationParams,
    UITranslation,
    SchemaTranslation,
    ContentTranslation,
    EnumTranslation,
    MasterDataTranslation,
    Locale,
    TranslationBundle,
    UserPreference
} from './types/Translation';

import type { IVersionedRepository } from '../../_infrastructure/interfaces';
export interface ITranslationRepository extends IVersionedRepository {
    readonly version: '1.0.0';
    // UI
    getUITranslations(params: TranslationParams): Promise<UITranslation[]>;
    saveUITranslation(translation: Partial<UITranslation>): Promise<UITranslation>;
    upsertBatchUITranslations(translations: Partial<UITranslation>[]): Promise<UITranslation[]>;
    deleteUITranslation(id: string): Promise<void>;

    // Schema
    getSchemaTableList(params: TranslationParams): Promise<any[]>;
    getSchemaTableTranslations(tableName: string, options?: TranslationParams): Promise<SchemaTranslation[]>;
    getSchemaTranslations(params: { tableName?: string } & TranslationParams): Promise<SchemaTranslation[]>;
    saveSchemaTranslation(translation: Partial<SchemaTranslation>): Promise<SchemaTranslation>;

    // Content
    getContentTranslations(params: TranslationParams): Promise<ContentTranslation[]>;
    saveContentTranslation(translation: Partial<ContentTranslation>): Promise<ContentTranslation>;
    getEntityTranslations(entityType: string, entityId: string, locale: string): Promise<Record<string, string>>;

    // Enum
    getEnumList(params: TranslationParams): Promise<any[]>;
    getEnumTranslationsByName(enumName: string, options?: TranslationParams): Promise<EnumTranslation[]>;
    getEnumTranslations(params: TranslationParams): Promise<EnumTranslation[]>;
    saveEnumTranslation(translation: Partial<EnumTranslation>): Promise<EnumTranslation>;

    // Master Data
    getMasterDataList(params: TranslationParams): Promise<any[]>;
    getMasterDataTranslationsByValue(valueId: string, options?: TranslationParams): Promise<MasterDataTranslation[]>;
    getMasterDataTranslationsByType(typeId: string, options?: TranslationParams): Promise<MasterDataTranslation[]>;
    getMasterDataTranslations(params: TranslationParams): Promise<MasterDataTranslation[]>;
    saveMasterDataTranslation(translation: Partial<MasterDataTranslation>): Promise<MasterDataTranslation>;

    // Locales & Bundles
    getSupportedLocales(): Promise<Locale[]>;
    generateTranslationBundles(locale: string): Promise<void>;
    syncAllTranslations(): Promise<void>;
    getTranslationBundles(locale: string): Promise<TranslationBundle[]>;

    // Introspection
    getDatabaseTables(): Promise<import('./types/Translation').DbTable[]>;
    getTableColumns(tableName: string): Promise<import('./types/Translation').DbColumn[]>;
    getDatabaseEnums(): Promise<import('./types/Translation').DbEnum[]>;

    // Preferences
    updateUserLocale(profileId: string, locale: string): Promise<UserPreference>;
    getUserPreference(profileId: string): Promise<UserPreference | null>;
}

