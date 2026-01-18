/**
 * Translation Service Facade
 * Unified translation service composed from atomic modules.
 */
import { bundlesService } from './bundles';
import { preferencesService } from './preferences';
import { localesService, Locale } from './locales';
import { contentService } from './content';

// Re-export types
export type { Locale };

// Re-export atomic services
export * from './bundles';
export { preferencesService as translationPreferencesService } from './preferences';
export * from './locales';
export * from './content';
import { TranslationService } from '../interfaces';

/**
 * Unified Translation Service Facade
 * Maintains backward compatibility.
 */
export const translationService: TranslationService = {
    // Bundles
    fetchBundles: bundlesService.fetchBundles.bind(bundlesService),
    fetchBundleHashes: bundlesService.fetchBundleHashes.bind(bundlesService),

    // Preferences
    updateUserLocale: preferencesService.updateUserLocale.bind(preferencesService),
    getUserLocale: preferencesService.getUserLocale.bind(preferencesService),
    getUserProfileAndLocale: preferencesService.getUserProfileAndLocale.bind(preferencesService),

    // Locales
    getAvailableLocales: localesService.getAvailableLocales.bind(localesService),
    getAllLocales: localesService.getAllLocales.bind(localesService),
    getLocaleByCode: localesService.getLocaleByCode.bind(localesService),

    // Content
    getContentTranslation: contentService.getContentTranslation.bind(contentService),
    getEntityTranslations: contentService.getEntityTranslations.bind(contentService),
};

export default translationService;

