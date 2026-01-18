/**
 * Translation Repository Tests
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type {
    UITranslation,
    SchemaTranslation,
    ContentTranslation,
    EnumTranslation,
    MasterDataTranslation,
    Locale,
    TranslationBundle,
    UserPreference,
    DbTable,
    DbColumn,
    DbEnum,
} from '../../interfaces';

// Mock the infrastructure module
vi.mock('../../../../../infrastructure', () => ({
    dataProvider: {
        translation: {
            getUITranslations: vi.fn(),
            saveUITranslation: vi.fn(),
            upsertBatchUITranslations: vi.fn(),
            deleteUITranslation: vi.fn(),
            getSchemaTableList: vi.fn(),
            getSchemaTableTranslations: vi.fn(),
            getSchemaTranslations: vi.fn(),
            saveSchemaTranslation: vi.fn(),
            getContentTranslations: vi.fn(),
            saveContentTranslation: vi.fn(),
            getEntityTranslations: vi.fn(),
            getEnumList: vi.fn(),
            getEnumTranslationsByName: vi.fn(),
            getEnumTranslations: vi.fn(),
            saveEnumTranslation: vi.fn(),
            getMasterDataList: vi.fn(),
            getMasterDataTranslationsByValue: vi.fn(),
            getMasterDataTranslationsByType: vi.fn(),
            getMasterDataTranslations: vi.fn(),
            saveMasterDataTranslation: vi.fn(),
            getSupportedLocales: vi.fn(),
            generateTranslationBundles: vi.fn(),
            syncAllTranslations: vi.fn(),
            getTranslationBundles: vi.fn(),
            getDatabaseEnums: vi.fn(),
            getDatabaseTables: vi.fn(),
            getTableColumns: vi.fn(),
            updateUserLocale: vi.fn(),
            getUserPreference: vi.fn(),
        },
    },
}));


import { dataProvider } from '@pulwave/entity-infrastructure';

describe('Translation Repository', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('UI Translations', () => {
        it('should fetch UI translations with params', async () => {
            const mockTranslations: UITranslation[] = [
                { id: '1', key: 'common.save', value: 'Save', locale: 'en', namespace: 'common', is_active: true },
                { id: '2', key: 'common.cancel', value: 'Cancel', locale: 'en', namespace: 'common', is_active: true },
            ];
            vi.mocked(dataProvider.translation.getUITranslations).mockResolvedValue(mockTranslations);

            const result = await dataProvider.translation.getUITranslations({ locale: 'en' });
            expect(result).toHaveLength(2);
            expect(dataProvider.translation.getUITranslations).toHaveBeenCalledWith({ locale: 'en' });
        });

        it('should save UI translation', async () => {
            const translation: Partial<UITranslation> = { key: 'common.new', value: 'New', locale: 'en' };
            const savedTranslation: UITranslation = { id: '3', key: 'common.new', value: 'New', locale: 'en', namespace: 'common', is_active: true };
            vi.mocked(dataProvider.translation.saveUITranslation).mockResolvedValue(savedTranslation);

            const result = await dataProvider.translation.saveUITranslation(translation);
            expect(result.id).toBe('3');
        });

        it('should upsert batch UI translations', async () => {
            const translations: UITranslation[] = [
                { id: '1', key: 'common.a', value: 'A', locale: 'en', namespace: 'common', is_active: true },
                { id: '2', key: 'common.b', value: 'B', locale: 'en', namespace: 'common', is_active: true },
            ];
            vi.mocked(dataProvider.translation.upsertBatchUITranslations).mockResolvedValue(translations);

            const result = await dataProvider.translation.upsertBatchUITranslations(translations);
            expect(result).toHaveLength(2);
        });

        it('should delete UI translation', async () => {
            vi.mocked(dataProvider.translation.deleteUITranslation).mockResolvedValue(undefined);

            await dataProvider.translation.deleteUITranslation('1');
            expect(dataProvider.translation.deleteUITranslation).toHaveBeenCalledWith('1');
        });
    });

    describe('Schema Translations', () => {
        it('should get schema table list', async () => {
            const mockTables = [{ name: 'users' }, { name: 'profiles' }];
            vi.mocked(dataProvider.translation.getSchemaTableList).mockResolvedValue(mockTables);

            const result = await dataProvider.translation.getSchemaTableList({});
            expect(result).toHaveLength(2);
        });

        it('should get schema table translations', async () => {
            const mockTranslations: SchemaTranslation[] = [
                { id: '1', table_name: 'users', column_name: 'email', translation: 'E-mail', locale: 'en', is_active: true }
            ];
            vi.mocked(dataProvider.translation.getSchemaTableTranslations).mockResolvedValue(mockTranslations);

            const result = await dataProvider.translation.getSchemaTableTranslations('users');
            expect(result).toHaveLength(1);
        });

        it('should save schema translation', async () => {
            const translation: Partial<SchemaTranslation> = { table_name: 'users', column_name: 'name', translation: 'Name', locale: 'en' };
            const savedTranslation: SchemaTranslation = { id: '1', table_name: 'users', column_name: 'name', translation: 'Name', locale: 'en', is_active: true };
            vi.mocked(dataProvider.translation.saveSchemaTranslation).mockResolvedValue(savedTranslation);

            const result = await dataProvider.translation.saveSchemaTranslation(translation);
            expect(result.table_name).toBe('users');
        });
    });

    describe('Content Translations', () => {
        it('should get content translations', async () => {
            const mockContent: ContentTranslation[] = [
                { id: '1', entity_type: 'post', entity_id: '123', field_name: 'title', translated_content: 'Hello', locale: 'en', is_active: true }
            ];
            vi.mocked(dataProvider.translation.getContentTranslations).mockResolvedValue(mockContent);

            const result = await dataProvider.translation.getContentTranslations({});
            expect(result).toHaveLength(1);
        });

        it('should get entity translations', async () => {
            const mockEntityTranslations: Record<string, string> = { title: 'Hello', description: 'World' };
            vi.mocked(dataProvider.translation.getEntityTranslations).mockResolvedValue(mockEntityTranslations);

            const result = await dataProvider.translation.getEntityTranslations('post', '123', 'en');
            expect(result.title).toBe('Hello');
        });
    });

    describe('Enum Translations', () => {
        it('should get enum list', async () => {
            const mockEnums = [{ name: 'status' }, { name: 'priority' }];
            vi.mocked(dataProvider.translation.getEnumList).mockResolvedValue(mockEnums);

            const result = await dataProvider.translation.getEnumList({});
            expect(result).toHaveLength(2);
        });

        it('should get enum translations by name', async () => {
            const mockTranslations: EnumTranslation[] = [
                { id: '1', enum_name: 'status', enum_value: 'active', translation: 'Active', locale: 'en', is_active: true }
            ];
            vi.mocked(dataProvider.translation.getEnumTranslationsByName).mockResolvedValue(mockTranslations);

            const result = await dataProvider.translation.getEnumTranslationsByName('status');
            expect(result).toHaveLength(1);
        });
    });

    describe('Master Data Translations', () => {
        it('should get master data list', async () => {
            const mockMasterData = [{ id: '1', type: 'country' }];
            vi.mocked(dataProvider.translation.getMasterDataList).mockResolvedValue(mockMasterData);

            const result = await dataProvider.translation.getMasterDataList({});
            expect(result).toHaveLength(1);
        });

        it('should get master data translations by type', async () => {
            const mockTranslations: MasterDataTranslation[] = [
                { id: '1', value_id: 'us', translation: 'United States', locale: 'en', is_active: true }
            ];
            vi.mocked(dataProvider.translation.getMasterDataTranslationsByType).mockResolvedValue(mockTranslations);

            const result = await dataProvider.translation.getMasterDataTranslationsByType('country');
            expect(result).toHaveLength(1);
        });
    });

    describe('Locales & Bundles', () => {
        it('should get supported locales', async () => {
            const mockLocales: Locale[] = [
                { code: 'en', name: 'English', is_default: true, is_enabled: true },
                { code: 'pt', name: 'Portuguese', is_default: false, is_enabled: true }
            ];
            vi.mocked(dataProvider.translation.getSupportedLocales).mockResolvedValue(mockLocales);

            const result = await dataProvider.translation.getSupportedLocales();
            expect(result).toHaveLength(2);
        });

        it('should get translation bundles', async () => {
            const mockBundles: TranslationBundle[] = [
                { id: '1', locale: 'en', namespace: 'common', content: {}, hash: 'abc123' }
            ];
            vi.mocked(dataProvider.translation.getTranslationBundles).mockResolvedValue(mockBundles);

            const result = await dataProvider.translation.getTranslationBundles('en');
            expect(result).toHaveLength(1);
        });

        it('should generate translation bundles', async () => {
            vi.mocked(dataProvider.translation.generateTranslationBundles).mockResolvedValue(undefined);

            await dataProvider.translation.generateTranslationBundles('en');
            expect(dataProvider.translation.generateTranslationBundles).toHaveBeenCalledWith('en');
        });
    });

    describe('Database Introspection', () => {
        it('should get database tables', async () => {
            const mockTables: DbTable[] = [
                { name: 'users', schema: 'public' },
                { name: 'profiles', schema: 'public' }
            ];
            vi.mocked(dataProvider.translation.getDatabaseTables).mockResolvedValue(mockTables);

            const result = await dataProvider.translation.getDatabaseTables();
            expect(result).toHaveLength(2);
        });

        it('should get table columns', async () => {
            const mockColumns: DbColumn[] = [
                { name: 'id', type: 'uuid', is_nullable: false },
                { name: 'email', type: 'text', is_nullable: true }
            ];
            vi.mocked(dataProvider.translation.getTableColumns).mockResolvedValue(mockColumns);

            const result = await dataProvider.translation.getTableColumns('users');
            expect(result).toHaveLength(2);
        });

        it('should get database enums', async () => {
            const mockEnums: DbEnum[] = [
                { name: 'app_role', values: ['admin', 'user'], schema: 'public' }
            ];
            vi.mocked(dataProvider.translation.getDatabaseEnums).mockResolvedValue(mockEnums);

            const result = await dataProvider.translation.getDatabaseEnums();
            expect(result).toHaveLength(1);
        });
    });

    describe('User Preferences', () => {
        it('should update user locale', async () => {
            const mockPreference: UserPreference = { id: 'pref-1', profile_id: '123', locale: 'pt' };
            vi.mocked(dataProvider.translation.updateUserLocale).mockResolvedValue(mockPreference);

            const result = await dataProvider.translation.updateUserLocale('123', 'pt');
            expect(result.locale).toBe('pt');
        });

        it('should get user locale', async () => {
            const mockPreference: UserPreference = { id: 'pref-1', profile_id: '123', locale: 'en' };
            vi.mocked(dataProvider.translation.getUserPreference).mockResolvedValue(mockPreference);

            const result = await dataProvider.translation.getUserPreference('123');
            expect(result?.locale).toBe('en');
        });
    });
});

