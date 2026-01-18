/**
 * Social Profile Service
 * Manages social profile links (LinkedIn, Twitter, etc).
 */
import { profileRepository } from '../../repositories/profileRepository';
import { SocialProfile } from '../../interfaces/types/Social';
import { SocialData } from '../../interfaces/types/Profile';

export const socialService = {
    async getSocialProfiles(profileId: string): Promise<SocialProfile[]> {
        return profileRepository.findSocialProfiles(profileId);
    },

    async upsertSocialProfile(
        profileId: string,
        platform: string,
        profileUrl: string | undefined,
        organizationId: string | null = null
    ): Promise<SocialProfile | null> {
        if (!profileUrl) {
            await profileRepository.deleteSocialProfile(profileId, platform);
            return null;
        }

        return profileRepository.upsertSocialProfile({
            profile_id: profileId,
            platform: platform,
            url: profileUrl,
            organization_id: organizationId || undefined,
        } as SocialProfile);
    },

    async upsertSocialProfiles(
        profileId: string,
        socialData: SocialData,
        organizationId: string | null = null
    ): Promise<void> {
        const platforms = [
            { platform: 'website', url: socialData.website },
            { platform: 'linkedin', url: socialData.linkedin_url },
            { platform: 'twitter', url: socialData.twitter_url },
            { platform: 'facebook', url: socialData.facebook_url },
        ];

        await Promise.all(
            platforms.map(({ platform, url }) =>
                this.upsertSocialProfile(profileId, platform, url, organizationId)
            )
        );
    },
};



