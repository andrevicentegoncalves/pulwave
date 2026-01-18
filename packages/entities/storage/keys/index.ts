/**
 * Storage Domain Query Keys
 * Used for React Query cache management.
 */

export const storageKeys = {
    all: ['storage'] as const,
    file: (path: string) => [...storageKeys.all, 'file', path] as const,
    bucket: (bucketName: string) => [...storageKeys.all, 'bucket', bucketName] as const,
    publicUrl: (path: string) => [...storageKeys.all, 'publicUrl', path] as const,
};
