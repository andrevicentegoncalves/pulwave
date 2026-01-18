/**
 * Professional Profile Service
 * Manages professional profile data.
 */
import { profileRepository } from '../../repositories/profileRepository';
import { ProfessionalProfile } from '../../interfaces/types/Professional';

export const professionalService = {
    async getProfessionalProfile(profileId: string): Promise<ProfessionalProfile | null> {
        return profileRepository.findProfessionalProfile(profileId);
    },

    async upsertProfessionalProfile(profileId: string, data: Partial<ProfessionalProfile>): Promise<ProfessionalProfile> {
        return profileRepository.upsertProfessionalProfile({
            profile_id: profileId,
            ...data
        } as ProfessionalProfile);
    },
};



