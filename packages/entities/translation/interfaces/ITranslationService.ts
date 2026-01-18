import { Locale, UserPreference } from './types/Translation';
import type { TranslationBundles, BundleHashes } from '@pulwave/types';

export interface TranslationService {
    // Bundle methods
    fetchBundles(locale: string): Promise<{ bundles: TranslationBundles; hashes: BundleHashes }>;
    fetchBundleHashes(locale: string): Promise<BundleHashes>;

    // Locale methods
    getAvailableLocales(): Promise<Locale[]>;
    getAllLocales(): Promise<Locale[]>;
    getLocaleByCode(code: string): Promise<Locale | null>;

    // User preference methods
    getUserLocale(authUserId: string): Promise<string>;
    getUserProfileAndLocale(userId: string): Promise<{ profileId: string | null; locale: string }>;
    updateUserLocale(profileId: string, locale: string): Promise<UserPreference>;

    // Content translation methods
    getContentTranslation(entityType: string, entityId: string, field: string, locale: string): Promise<string | null>;
    getEntityTranslations(entityType: string, entityId: string, locale: string): Promise<Record<string, string>>;
}
