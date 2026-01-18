/**
 * Full Profile Service Tests
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fullProfileService } from '../fullProfile/fullProfileService';
import { profileRepository } from '../../repositories/profileRepository';
import type {
    Profile,
    ProfessionalProfile,
    SocialProfile,
    UserPreferences,
    ProfileAuthState,
    OnboardingStatus,
} from '../../interfaces';
import type { Address } from '@pulwave/entity-address';
import type { Contact } from '../../interfaces/types/Contact';

// Mock repository
vi.mock('../../repositories/profileRepository', () => ({
    profileRepository: {
        findByAuthUserId: vi.fn(),
        create: vi.fn(),
        findProfessionalProfile: vi.fn(),
        findSocialProfiles: vi.fn(),
        findPreferences: vi.fn(),
        findAddress: vi.fn(),
        findPrimaryOrganization: vi.fn(),
        findContacts: vi.fn(),
        findAuthState: vi.fn(),
        findOnboardingStatus: vi.fn(),
    }
}));

describe('FullProfileService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should aggregate all profile data correctly', async () => {
        const mockProfile: Partial<Profile> = { id: 'p1', auth_user_id: 'a1', primary_address_id: 'ad1' };
        vi.mocked(profileRepository.findByAuthUserId).mockResolvedValue(mockProfile as Profile);
        vi.mocked(profileRepository.findProfessionalProfile).mockResolvedValue({ profile_id: 'p1', title: 'CEO' } as ProfessionalProfile);
        vi.mocked(profileRepository.findSocialProfiles).mockResolvedValue([{ profile_id: 'p1', platform: 'linkedin', url: 'https://linkedin.com' }] as SocialProfile[]);
        vi.mocked(profileRepository.findPreferences).mockResolvedValue({ profile_id: 'p1', theme: 'dark' } as UserPreferences);
        vi.mocked(profileRepository.findAddress).mockResolvedValue({ id: 'ad1', profile_id: 'p1', address_type: 'primary', street_name: 'Main St' } as Address);
        vi.mocked(profileRepository.findPrimaryOrganization).mockResolvedValue('org1');
        vi.mocked(profileRepository.findContacts).mockResolvedValue([{ id: 'c1', profile_id: 'p1', contact_type: 'email', contact_value: 'test@example.com', is_primary: true, is_active: true }] as Contact[]);
        vi.mocked(profileRepository.findAuthState).mockResolvedValue({ profile_id: 'p1', mfa_enabled: true } as ProfileAuthState);
        vi.mocked(profileRepository.findOnboardingStatus).mockResolvedValue({ profile_id: 'p1', completed: true, step: 'complete', updated_at: new Date().toISOString() } as OnboardingStatus);

        const result = await fullProfileService.getFullProfile('a1', 'test@example.com');

        expect(result?.id).toBe('p1');
        expect(result?.professional_profiles).toHaveLength(1);
        expect(result?.social_profiles).toHaveLength(1);
        expect(result?.primary_address?.street_name).toBe('Main St');
        expect(result?.organization_id).toBe('org1');
        expect(result?.auth_state?.mfa_enabled).toBe(true);
    });

    it('should create a new profile if not found', async () => {
        vi.mocked(profileRepository.findByAuthUserId).mockResolvedValue(null);
        const newProfile: Partial<Profile> = { id: 'p_new', auth_user_id: 'a_new' };
        vi.mocked(profileRepository.create).mockResolvedValue(newProfile as Profile);

        // Mock sub-calls for the new profile
        vi.mocked(profileRepository.findProfessionalProfile).mockResolvedValue(null);
        vi.mocked(profileRepository.findSocialProfiles).mockResolvedValue([]);
        vi.mocked(profileRepository.findPreferences).mockResolvedValue(null);
        vi.mocked(profileRepository.findAddress).mockResolvedValue(null);
        vi.mocked(profileRepository.findPrimaryOrganization).mockResolvedValue(null);
        vi.mocked(profileRepository.findContacts).mockResolvedValue([]);
        vi.mocked(profileRepository.findAuthState).mockResolvedValue(null);
        vi.mocked(profileRepository.findOnboardingStatus).mockResolvedValue(null);

        const result = await fullProfileService.getFullProfile('a_new', 'new@example.com');

        expect(profileRepository.create).toHaveBeenCalledWith(expect.objectContaining({
            auth_user_id: 'a_new',
            email: 'new@example.com'
        }));
        expect(result?.id).toBe('p_new');
    });
});

