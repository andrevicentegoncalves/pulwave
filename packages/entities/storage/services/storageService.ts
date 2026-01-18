/**
 * Storage Service
 *
 * Business logic for file storage operations.
 * @package @features/data/services/storage
 */
import { resizeImage, type ResizeOptions } from '../utils/imageUtils';
import { storageRepository } from '../repositories/storageRepository';
import type { UploadOptions } from '../interfaces/IStorageRepository';

/**
 * Storage Service Facade
 */
export const storageService = {
    /**
     * Upload a file to a specific bucket
     * @param bucket Storage bucket name
     * @param path File path
     * @param file File to upload
     * @param options Upload options
     */
    async uploadFile(bucket: string, path: string, file: File, options?: UploadOptions): Promise<string> {
        return storageRepository.upload(bucket, path, file, options);
    },

    /**
     * Delete a file from a specific bucket
     * @param bucket Storage bucket name
     * @param path File path
     */
    async deleteFile(bucket: string, path: string): Promise<void> {
        return storageRepository.delete(bucket, path);
    },

    /**
     * Delete multiple files
     */
    async deleteFiles(bucket: string, paths: string[]): Promise<void> {
        return storageRepository.deleteMany(bucket, paths);
    },

    /**
     * Get public URL for a file
     */
    getPublicUrl(bucket: string, path: string): string {
        return storageRepository.getPublicUrl(bucket, path);
    },

    /**
     * Upload user avatar
     * Handles naming convention and optional resizing
     */
    async uploadAvatar(
        userId: string,
        file: File,
        options?: UploadOptions & { resize?: ResizeOptions }
    ): Promise<string> {
        const fileExt = file.name.split('.').pop() || 'jpg';
        const fileName = `${userId}-${Date.now()}.${fileExt}`;
        const path = `avatars/${fileName}`;

        let fileToUpload = file;
        if (options?.resize) {
            try {
                fileToUpload = await resizeImage(file, options.resize);
            } catch {
                // Image resizing failed, using original file
            }
        }

        return storageRepository.upload('profile-images', path, fileToUpload, {
            cacheControl: '3600',
            upsert: false,
            ...options
        });
    },

    /**
     * Delete avatar by URL
     * Extracts path from URL and deletes from storage
     */
    async deleteAvatar(avatarUrl: string): Promise<void> {
        if (!avatarUrl) return;

        const parsed = storageRepository.parseStorageUrl(avatarUrl);
        if (parsed && parsed.bucket === 'profile-images') {
            await storageRepository.delete(parsed.bucket, parsed.path);
        }
    }
};

export default storageService;


