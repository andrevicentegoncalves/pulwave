/**
 * Profile Auth State Service
 */
import { profileRepository } from '../../repositories/profileRepository';
import { ProfileAuthState } from '../../interfaces/types/Profile';

export const profileAuthStateService = {
    async getAuthState(profileId: string): Promise<ProfileAuthState | null> {
        return profileRepository.findAuthState(profileId);
    },

    async upsertAuthState(profileId: string, data: Partial<ProfileAuthState>): Promise<ProfileAuthState> {
        return profileRepository.upsertAuthState(profileId, data);
    },
};


