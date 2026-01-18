/**
 * useAvatarUpload Hook
 * 
 * Manages avatar upload, resize, and storage operations.
 * 
 * @package @pulwave/experience-settings
 */
import { useState, useCallback } from 'react';
import { storageService } from '@pulwave/entity-storage';
import { profileService, coreProfileService, type Profile } from '@pulwave/entity-profile';
import { type User } from '@pulwave/features-auth';

export interface UseAvatarUploadOptions {
    user: User;
    profile: Profile;
    onProfileUpdate?: (profile: Profile) => void;
    onSuccess?: (message: string) => void;
    onError?: (message: string) => void;
}

export interface UseAvatarUploadReturn {
    uploading: boolean;
    error: string | null;
    handleAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    resizeImage: (file: File, maxWidth?: number, maxHeight?: number) => Promise<File>;
}

/**
 * useAvatarUpload Hook
 * Handles avatar file upload with resize and storage
 */
export const useAvatarUpload = ({
    user,
    profile,
    onProfileUpdate,
    onSuccess,
    onError
}: UseAvatarUploadOptions): UseAvatarUploadReturn => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Handle avatar file upload
     */
    const handleAvatarUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            setError(null);

            const file = e.target.files?.[0];
            if (!file) return;

            // Validate file
            if (!file.type.startsWith('image/')) {
                throw new Error('Please upload an image file');
            }
            if (file.size > 5 * 1024 * 1024) {
                throw new Error('Image size must be less than 5MB');
            }

            // Perform atomic avatar update via service
            // Resizing is now handled by the service layer
            const publicUrl = await coreProfileService.updateAvatar(
                user.id,
                profile.id,
                file,
                profile?.avatar_url,
                { maxWidth: 800, maxHeight: 800, quality: 0.85 }
            );

            // Notify parent of update
            onProfileUpdate?.({ ...profile, avatar_url: publicUrl });
            onSuccess?.('Avatar updated successfully!');

        } catch (err: any) {
            setError(err.message);
            onError?.(err.message);
            // Error reported via callback and state
        } finally {
            setUploading(false);
            if (e.target) e.target.value = '';
        }
    }, [user, profile, onProfileUpdate, onSuccess, onError]);

    return {
        uploading,
        error,
        handleAvatarUpload,
        resizeImage: () => { throw new Error('Client-side resizeImage is deprecated. Use service-level resizing.'); },
    };
};

export default useAvatarUpload;
