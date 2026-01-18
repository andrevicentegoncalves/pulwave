/**
 * User Local Preferences Service
 * Manages user's preferred locale.
 */
import { translationRepository } from '../../repositories/translationRepository';
import { UserPreference } from '../../interfaces';

export const preferencesService = {
    async updateUserLocale(profileId: string, locale: string): Promise<UserPreference> {
        return translationRepository.updateUserLocale(profileId, locale);
    },

    async getUserLocale(authUserId: string): Promise<string> {
        const { profileRepository } = await import('../../../profile/repositories/profileRepository');
        const profile = await profileRepository.findByAuthUserId(authUserId);
        if (!profile) return 'en-US';

        const preference = await translationRepository.getUserPreference(profile.id);
        return preference?.locale || 'en-US';
    },

    async getUserProfileAndLocale(authUserId: string): Promise<{ profileId: string | null; locale: string }> {
        const { profileRepository } = await import('../../../profile/repositories/profileRepository');
        const profile = await profileRepository.findByAuthUserId(authUserId);
        if (!profile) return { profileId: null, locale: 'en-US' };

        const preference = await translationRepository.getUserPreference(profile.id);
        return { profileId: profile.id, locale: preference?.locale || 'en-US' };
    },
};

