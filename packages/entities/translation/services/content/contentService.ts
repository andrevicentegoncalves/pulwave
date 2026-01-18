/**
 * Content Translations Service
 * Fetches translations for dynamic content entities.
 */
import { translationRepository } from '../../repositories/translationRepository';

export const contentService = {
    async getContentTranslation(entityType: string, entityId: string, field: string, locale: string): Promise<string | null> {
        const translations = await translationRepository.getEntityTranslations(entityType, entityId, locale);
        return translations[field] || null;
    },

    async getEntityTranslations(entityType: string, entityId: string, locale: string): Promise<Record<string, string>> {
        return translationRepository.getEntityTranslations(entityType, entityId, locale);
    },
};

