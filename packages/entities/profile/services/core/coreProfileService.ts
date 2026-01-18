/**
 * Core Profile Service
 * Basic profile CRUD operations.
 */
import { profileRepository } from '../../repositories/profileRepository';
import { Profile, OnboardingStatus } from '../../interfaces/types/Profile';

export const coreProfileService = {
    async getById(userId: string): Promise<Profile | null> {
        return profileRepository.findById(userId);
    },

    async getByAuthId(authUserId: string): Promise<Profile | null> {
        return profileRepository.findByAuthUserId(authUserId);
    },

    async update(userId: string, updates: Partial<Profile>): Promise<Profile> {
        return profileRepository.update(userId, updates);
    },

    /**
     * Update user avatar
     * Handles old avatar deletion and profile update
     */
    async updateAvatar(
        userId: string,
        profileId: string,
        file: File,
        oldAvatarUrl?: string,
        resizeOptions?: any // Use any to avoid direct import from storage domain if possible, or import ResizeOptions
    ): Promise<string> {
        const { storageService } = await import('@pulwave/entity-storage');

        // Delete old avatar if exists
        if (oldAvatarUrl) {
            try {
                await storageService.deleteAvatar(oldAvatarUrl);
            } catch {
                // Failed to delete old avatar - continue with upload
            }
        }

        // Upload new avatar
        const publicUrl = await storageService.uploadAvatar(userId, file, { resize: resizeOptions });

        // Update profile
        await this.update(profileId, {
            avatar_url: publicUrl,
            updated_at: new Date().toISOString()
        } as Partial<Profile>);

        return publicUrl;
    },

    async updateProfile(userId: string, updates: Partial<Profile>): Promise<{ data: Profile | null; error: any | null }> {
        try {
            const data = await this.update(userId, updates);
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    async getOnboardingStatus(profileId: string): Promise<OnboardingStatus | null> {
        return profileRepository.findOnboardingStatus(profileId);
    },

    async getOrganizationId(profileId: string): Promise<string | null> {
        return profileRepository.findPrimaryOrganization(profileId);
    },
};



