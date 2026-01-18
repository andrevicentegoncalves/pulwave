/**
 * Preferences Service
 * Manages user preferences.
 */
import { profileRepository } from '../../repositories/profileRepository';
import { UserPreferences } from '../../interfaces/types/Preferences';

export const preferencesService = {
    async getPreferences(profileId: string): Promise<UserPreferences | null> {
        return profileRepository.findPreferences(profileId);
    },

    async upsertPreferences(
        profileId: string,
        preferences: Partial<UserPreferences>,
        organizationId: string | null = null
    ): Promise<UserPreferences> {
        return profileRepository.upsertPreferences({
            profile_id: profileId,
            ...preferences,
            organization_id: organizationId || undefined,
        });
    },
};



