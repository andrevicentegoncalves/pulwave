import { translationRepository } from '@pulwave/entity-translation';
import type { ITranslationRepository } from '@pulwave/entity-translation';
import type {
    TranslationParams,
    UITranslation,
    SchemaTranslation,
    EnumTranslation,
    ContentTranslation,
    MasterDataTranslation,
    Locale,
    TranslationBundle,
    DbTable,
    DbColumn,
    DbEnum
} from '@pulwave/entity-translation';

interface ExtendedTranslationRepository extends ITranslationRepository {
    getTableRecords?(tableName: string, options?: TranslationParams): Promise<Record<string, unknown>[]>;
}

export const systemTranslationService = {
    // UI Translations
    async getUITranslations(options: TranslationParams = {}): Promise<UITranslation[]> {
        return translationRepository.getUITranslations(options);
    },

    async upsertBatchUITranslations(translations: Partial<UITranslation>[]): Promise<UITranslation[]> {
        return translationRepository.upsertBatchUITranslations(translations);
    },

    async saveUITranslation(translation: Partial<UITranslation>): Promise<UITranslation> {
        return translationRepository.saveUITranslation(translation);
    },

    async deleteUITranslation(id: string): Promise<void> {
        return translationRepository.deleteUITranslation(id);
    },

    // Schema Translations
    async getSchemaTranslations(options: { tableName?: string } & TranslationParams = {}): Promise<SchemaTranslation[]> {
        return translationRepository.getSchemaTranslations(options);
    },

    async saveSchemaTranslation(translation: Partial<SchemaTranslation>): Promise<SchemaTranslation> {
        return translationRepository.saveSchemaTranslation(translation);
    },

    // Enum Translations
    async getEnumTranslations(options: TranslationParams = {}): Promise<EnumTranslation[]> {
        return translationRepository.getEnumTranslations(options);
    },

    async saveEnumTranslation(translation: Partial<EnumTranslation>): Promise<EnumTranslation> {
        return translationRepository.saveEnumTranslation(translation);
    },

    // Content Translations
    async getContentTranslations(options: TranslationParams = {}): Promise<ContentTranslation[]> {
        return translationRepository.getContentTranslations(options);
    },

    async saveContentTranslation(translation: Partial<ContentTranslation>): Promise<ContentTranslation> {
        return translationRepository.saveContentTranslation(translation);
    },

    async getMasterDataTranslations(options: TranslationParams = {}): Promise<MasterDataTranslation[]> {
        return translationRepository.getMasterDataTranslations(options);
    },

    async saveMasterDataTranslation(translation: Partial<MasterDataTranslation>): Promise<MasterDataTranslation> {
        return translationRepository.saveMasterDataTranslation(translation);
    },

    // Bundles
    async generateTranslationBundles(locale: string): Promise<void> {
        return translationRepository.generateTranslationBundles(locale);
    },

    async syncAllTranslations(): Promise<void> {
        return translationRepository.syncAllTranslations();
    },

    async getTranslationBundles(locale: string): Promise<TranslationBundle[]> {
        return translationRepository.getTranslationBundles(locale);
    },

    async getSupportedLocales(): Promise<Locale[]> {
        return translationRepository.getSupportedLocales();
    },

    // Schema Introspection
    async getDatabaseTables(): Promise<DbTable[]> {
        return translationRepository.getDatabaseTables();
    },

    async getTableColumns(tableName: string): Promise<DbColumn[]> {
        return translationRepository.getTableColumns(tableName);
    },

    async getDatabaseEnums(): Promise<DbEnum[]> {
        return translationRepository.getDatabaseEnums();
    },

    async getTableRecords(tableName: string, options: TranslationParams = {}): Promise<Record<string, unknown>[]> {
        const extendedRepo = translationRepository as ExtendedTranslationRepository;
        return extendedRepo.getTableRecords?.(tableName, options) ?? [];
    },
};




