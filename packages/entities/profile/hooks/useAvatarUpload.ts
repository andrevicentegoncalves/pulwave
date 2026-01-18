/**
 * useAvatarUpload Hook
 * Manages avatar upload, resize, and storage operations.
 */
import { useState, useCallback } from 'react';
import { coreProfileService } from '../services/core/coreProfileService';

export interface UseAvatarUploadOptions {
    user: { id: string };
    profile?: { id: string; avatar_url?: string };
    onProfileUpdate?: (profile: any) => void;
    onSuccess?: (message: string) => void;
    onError?: (message: string) => void;
}

export interface UseAvatarUploadReturn {
    uploading: boolean;
    error: string | null;
    handleAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    resizeImage: (file: File, maxWidth?: number, maxHeight?: number) => Promise<File>;
}

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
     * Resize image to max dimensions while maintaining aspect ratio
     */
    const resizeImage = (file: File, maxWidth = 800, maxHeight = 800): Promise<File> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > maxWidth) {
                            height *= maxWidth / width;
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width *= maxHeight / height;
                            height = maxHeight;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        reject(new Error('Failed to get canvas context'));
                        return;
                    }

                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, width, height);
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        if (blob) {
                            resolve(new File([blob], file.name, {
                                type: 'image/jpeg',
                                lastModified: Date.now(),
                            }));
                        } else {
                            reject(new Error('Failed to create image blob'));
                        }
                    }, 'image/jpeg', 0.85);
                };
                img.onerror = () => reject(new Error('Failed to load image'));
                img.src = e.target?.result as string;
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    };

    /**
     * Handle avatar file upload
     */
    const handleAvatarUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        try {
            setUploading(true);
            setError(null);

            const file = e.target.files?.[0];
            if (!file || !profile?.id) return;

            // Validate file
            if (!file.type.startsWith('image/')) {
                throw new Error('Please upload an image file');
            }
            if (file.size > 1 * 1024 * 1024) {
                throw new Error('Image size must be less than 1MB');
            }

            // Resize image
            let fileToUpload = file;
            try {
                fileToUpload = await resizeImage(file);
            } catch {
                // Image resizing failed, falling back to original file
            }

            // Perform atomic avatar update via service
            const publicUrl = await coreProfileService.updateAvatar(
                user.id,
                profile.id,
                fileToUpload,
                profile?.avatar_url
            );

            // Notify parent of update
            onProfileUpdate?.({ ...profile, avatar_url: publicUrl });
            onSuccess?.('Avatar updated successfully!');

        } catch (err: any) {
            const message = err.message || 'Upload failed';
            setError(message);
            onError?.(message);
        } finally {
            setUploading(false);
            if (e.target) e.target.value = '';
        }
    }, [user, profile, onProfileUpdate, onSuccess, onError]);

    return {
        uploading,
        error,
        handleAvatarUpload,
        resizeImage,
    };
};

export default useAvatarUpload;

