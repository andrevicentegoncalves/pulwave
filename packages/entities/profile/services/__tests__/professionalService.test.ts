/**
 * Professional Service Tests
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { professionalService } from '..//professional/professionalService';
import { profileRepository } from '../../repositories/profileRepository';
import type { ProfessionalProfile } from '../../interfaces';

// Mock repository
vi.mock('../../repositories/profileRepository', () => ({
    profileRepository: {
        findProfessionalProfile: vi.fn(),
        upsertProfessionalProfile: vi.fn(),
    }
}));

describe('ProfessionalService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should get professional profile', async () => {
        const mockProf: ProfessionalProfile = { profile_id: 'p1', company_name: 'Pulwave' };
        vi.mocked(profileRepository.findProfessionalProfile).mockResolvedValue(mockProf);

        const result = await professionalService.getProfessionalProfile('p1');
        expect(result).toEqual(mockProf);
        expect(profileRepository.findProfessionalProfile).toHaveBeenCalledWith('p1');
    });

    it('should upsert professional profile', async () => {
        const data: Partial<ProfessionalProfile> = { company_name: 'New Co' };
        const mockResult: ProfessionalProfile = { profile_id: 'p1', ...data };
        vi.mocked(profileRepository.upsertProfessionalProfile).mockResolvedValue(mockResult);

        const result = await professionalService.upsertProfessionalProfile('p1', data);
        expect(result).toEqual(mockResult);
        expect(profileRepository.upsertProfessionalProfile).toHaveBeenCalledWith({
            profile_id: 'p1',
            ...data
        });
    });
});

