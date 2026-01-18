import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileKeys } from '@pulwave/entity-profile';
import { storageService } from '../services/storageService';
import type { UploadOptions } from '../interfaces/IStorageRepository';

/**
 * Hook for file uploading
 */
export const useFileUpload = () => {
    return useMutation({
        mutationFn: ({ bucket, path, file, options }: { bucket: string; path: string; file: File; options?: UploadOptions }) =>
            storageService.uploadFile(bucket, path, file, options),
    });
};

/**
 * Hook for avatar upload (Generic storage version)
 */
export const useStorageAvatarUpload = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, file, options }: { userId: string; file: File; options?: UploadOptions }) =>
            storageService.uploadAvatar(userId, file, options),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: profileKeys.full(variables.userId) });
        },
    });
};

/**
 * Hook for file deletion
 */
export const useFileDelete = () => {
    return useMutation({
        mutationFn: ({ bucket, path }: { bucket: string; path: string }) =>
            storageService.deleteFile(bucket, path),
    });
};
