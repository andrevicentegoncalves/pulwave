/**
 * Locales Service
 * Retrieves available system locales.
 */
import { translationRepository } from '../../repositories/translationRepository';
import { Locale } from '../../interfaces';

export type { Locale };

export const localesService = {
    async getAvailableLocales(): Promise<Locale[]> {
        return translationRepository.getSupportedLocales();
    },

    async getAllLocales(): Promise<Locale[]> {
        // Fallback or specific method in repository
        return translationRepository.getSupportedLocales();
    },

    async getLocaleByCode(localeCode: string): Promise<Locale | null> {
        const locales = await translationRepository.getSupportedLocales();
        return locales.find(l => l.code === localeCode) || null;
    },
};

