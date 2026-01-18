/**
 * Core Profile Service Tests
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { coreProfileService } from '../core/coreProfileService';
import { profileRepository } from '../../repositories/profileRepository';
import type { Profile, OnboardingStatus } from '../../interfaces';

// Mock repository
vi.mock('../../repositories/profileRepository', () => ({
    profileRepository: {
        findById: vi.fn(),
        findByAuthUserId: vi.fn(),
        update: vi.fn(),
        findOnboardingStatus: vi.fn(),
        findPrimaryOrganization: vi.fn(),
    }
}));

describe('CoreProfileService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should get profile by ID', async () => {
        const mockProfile: Partial<Profile> = { id: 'p1', first_name: 'John' };
        vi.mocked(profileRepository.findById).mockResolvedValue(mockProfile as Profile);

        const result = await coreProfileService.getById('p1');
        expect(result).toEqual(mockProfile);
        expect(profileRepository.findById).toHaveBeenCalledWith('p1');
    });

    it('should get profile by Auth ID', async () => {
        const mockProfile: Partial<Profile> = { id: 'p1', auth_user_id: 'a1' };
        vi.mocked(profileRepository.findByAuthUserId).mockResolvedValue(mockProfile as Profile);

        const result = await coreProfileService.getByAuthId('a1');
        expect(result).toEqual(mockProfile);
        expect(profileRepository.findByAuthUserId).toHaveBeenCalledWith('a1');
    });

    it('should update profile', async () => {
        const updates: Partial<Profile> = { first_name: 'Jane' };
        const mockUpdated: Partial<Profile> = { id: 'p1', ...updates };
        vi.mocked(profileRepository.update).mockResolvedValue(mockUpdated as Profile);

        const result = await coreProfileService.update('p1', updates);
        expect(result).toEqual(mockUpdated);
        expect(profileRepository.update).toHaveBeenCalledWith('p1', updates);
    });

    it('should return error object on updateProfile failure', async () => {
        const error = new Error('Database Error');
        vi.mocked(profileRepository.update).mockRejectedValue(error);

        const result = await coreProfileService.updateProfile('p1', { first_name: 'Jane' });
        expect(result.data).toBeNull();
        expect(result.error).toBe(error);
    });

    it('should get onboarding status', async () => {
        const mockStatus: Partial<OnboardingStatus> = { profile_id: 'p1', completed: true };
        vi.mocked(profileRepository.findOnboardingStatus).mockResolvedValue(mockStatus as OnboardingStatus);

        const result = await coreProfileService.getOnboardingStatus('p1');
        expect(result).toEqual(mockStatus);
    });

    it('should get organization ID', async () => {
        const mockOrgId = 'org1';
        vi.mocked(profileRepository.findPrimaryOrganization).mockResolvedValue(mockOrgId);

        const result = await coreProfileService.getOrganizationId('p1');
        expect(result).toBe('org1');
    });
});

