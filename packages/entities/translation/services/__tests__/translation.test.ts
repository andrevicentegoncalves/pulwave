/**
 * Translation Service Tests
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { translationService } from '../translationService';
import type { Locale, TranslationBundle, UserPreference } from '../../interfaces';

// Mock the infrastructure/dataProvider
vi.mock('../../../../../infrastructure', () => {
    const mockDataProvider = {
        translation: {
            getTranslationBundles: vi.fn(),
            getSupportedLocales: vi.fn(),
            getAllLocales: vi.fn(),
            getLocaleByCode: vi.fn(),
            updateUserLocale: vi.fn(),
            getContentTranslation: vi.fn(),
            getEntityTranslations: vi.fn(),
        }
    };
    return {
        dataProvider: mockDataProvider
    };
});

// Import after mock to get the mocked version
import { dataProvider } from '@pulwave/entity-infrastructure';


describe('Translation Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getSupportedLocales', () => {
        it('should return all available locales', async () => {
            const mockLocales: Locale[] = [
                { code: 'en-US', name: 'English (US)', is_default: false, is_enabled: true },
                { code: 'pt-PT', name: 'Portuguese', is_default: false, is_enabled: true }
            ];
            vi.mocked(dataProvider.translation.getSupportedLocales).mockResolvedValue(mockLocales);

            const result = await translationService.getAllLocales();

            expect(result).toEqual(mockLocales);
            expect(dataProvider.translation.getSupportedLocales).toHaveBeenCalledTimes(1);
        });
    });

    describe('updateUserLocale', () => {
        it('should update user locale preference', async () => {
            const mockPreference: UserPreference = {
                id: 'pref-1',
                profile_id: 'profile-123',
                locale: 'pt-PT'
            };
            vi.mocked(dataProvider.translation.updateUserLocale).mockResolvedValue(mockPreference);

            await translationService.updateUserLocale('profile-123', 'pt-PT');

            expect(dataProvider.translation.updateUserLocale).toHaveBeenCalledWith('profile-123', 'pt-PT');
        });
    });

    describe('getEntityTranslations', () => {
        it('should fetch entity translations for given type and locale', async () => {
            const mockTranslations: Record<string, string> = { title: 'Casa', description: 'Uma casa bonita' };
            vi.mocked(dataProvider.translation.getEntityTranslations).mockResolvedValue(mockTranslations);

            const result = await translationService.getEntityTranslations('property', 'prop-123', 'pt-PT');

            expect(result).toEqual(mockTranslations);
            expect(dataProvider.translation.getEntityTranslations).toHaveBeenCalledWith('property', 'prop-123', 'pt-PT');
        });
    });

    describe('fetchBundles', () => {
        it('should fetch and organize translation bundles by namespace', async () => {
            const mockBundles: TranslationBundle[] = [
                { id: '1', locale: 'en-US', namespace: 'ui', content: { 'welcome': 'Welcome' }, hash: 'hash1' },
                { id: '2', locale: 'en-US', namespace: 'schema', content: { 'user': 'User' }, hash: 'hash2' }
            ];
            vi.mocked(dataProvider.translation.getTranslationBundles).mockResolvedValue(mockBundles);

            const result = await translationService.fetchBundles('en-US');

            expect(result.bundles.ui).toEqual({ 'welcome': 'Welcome' });
            expect(result.bundles.schema).toEqual({ 'user': 'User' });
            expect(result.hashes.ui).toBe('hash1');
            expect(result.hashes.schema).toBe('hash2');
            expect(dataProvider.translation.getTranslationBundles).toHaveBeenCalledWith('en-US');
        });
    });

    describe('fetchBundleHashes', () => {
        it('should fetch only translation bundle hashes', async () => {
            const mockBundles: TranslationBundle[] = [
                { id: '1', locale: 'en-US', namespace: 'ui', content: {}, hash: 'hash1' },
                { id: '2', locale: 'en-US', namespace: 'schema', content: {}, hash: 'hash2' }
            ];
            vi.mocked(dataProvider.translation.getTranslationBundles).mockResolvedValue(mockBundles);

            const result = await translationService.fetchBundleHashes('en-US');

            expect(result.ui).toBe('hash1');
            expect(result.schema).toBe('hash2');
            expect(dataProvider.translation.getTranslationBundles).toHaveBeenCalledWith('en-US');
        });
    });
});

