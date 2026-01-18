/**
 * Social Service Tests
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { socialService } from '..//social/socialService';
import { profileRepository } from '../../repositories/profileRepository';
import type { SocialProfile } from '../../interfaces';

// Mock repository
vi.mock('../../repositories/profileRepository', () => ({
    profileRepository: {
        findSocialProfiles: vi.fn(),
        upsertSocialProfile: vi.fn(),
        deleteSocialProfile: vi.fn(),
    }
}));

describe('SocialService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should get social profiles', async () => {
        const mockSocial: SocialProfile[] = [{ profile_id: 'p1', platform: 'linkedin', url: 'https://linkedin.com/in/jdoe' }];
        vi.mocked(profileRepository.findSocialProfiles).mockResolvedValue(mockSocial);

        const result = await socialService.getSocialProfiles('p1');
        expect(result).toEqual(mockSocial);
        expect(profileRepository.findSocialProfiles).toHaveBeenCalledWith('p1');
    });

    it('should upsert social profile', async () => {
        const mockResult: SocialProfile = { profile_id: 'p1', platform: 'twitter', url: 'https://twitter.com/jdoe' };
        vi.mocked(profileRepository.upsertSocialProfile).mockResolvedValue(mockResult);

        const result = await socialService.upsertSocialProfile('p1', 'twitter', 'https://twitter.com/jdoe');
        expect(result).toEqual(mockResult);
        expect(profileRepository.upsertSocialProfile).toHaveBeenCalledWith({
            profile_id: 'p1',
            platform: 'twitter',
            url: 'https://twitter.com/jdoe',
            organization_id: undefined
        });
    });

    it('should delete social profile if URL is empty', async () => {
        const result = await socialService.upsertSocialProfile('p1', 'linkedin', '');
        expect(result).toBeNull();
        expect(profileRepository.deleteSocialProfile).toHaveBeenCalledWith('p1', 'linkedin');
    });

    it('should upsert multiple social profiles', async () => {
        const socialData = {
            website: 'https://jdoe.com',
            linkedin_url: 'https://linkedin.com/jdoe',
            twitter_url: '',
            facebook_url: ''
        };

        const upsertSpy = vi.spyOn(socialService, 'upsertSocialProfile');

        await socialService.upsertSocialProfiles('p1', socialData);

        expect(upsertSpy).toHaveBeenCalledTimes(4);
        expect(profileRepository.upsertSocialProfile).toHaveBeenCalledWith(expect.objectContaining({ platform: 'website', url: 'https://jdoe.com' }));
        expect(profileRepository.upsertSocialProfile).toHaveBeenCalledWith(expect.objectContaining({ platform: 'linkedin', url: 'https://linkedin.com/jdoe' }));
        expect(profileRepository.deleteSocialProfile).toHaveBeenCalledWith('p1', 'twitter');
        expect(profileRepository.deleteSocialProfile).toHaveBeenCalledWith('p1', 'facebook');
    });
});

