/**
 * Supabase Storage Repository
 * Implements IStorageRepository for Supabase Storage.
 */
import type { IStorageRepository, UploadOptions } from '@pulwave/entity-storage';

import { getSupabase } from '../client';

class SupabaseStorageRepositoryImpl implements IStorageRepository {
    readonly version = '1.0.0';
    /**
     * Upload a file to Supabase Storage
     */
    async upload(bucket: string, path: string, file: File, options?: UploadOptions): Promise<string> {
        const { error } = await getSupabase().storage
            .from(bucket)
            .upload(path, file, {
                cacheControl: options?.cacheControl ?? '3600',
                upsert: options?.upsert ?? false,
                contentType: options?.contentType,
            });

        if (error) {
            throw error;
        }

        return this.getPublicUrl(bucket, path);
    }

    /**
     * Delete a file from Supabase Storage
     */
    async delete(bucket: string, path: string): Promise<void> {
        const { error } = await getSupabase().storage
            .from(bucket)
            .remove([path]);

        if (error) {
            throw error;
        }
    }

    /**
     * Delete multiple files from Supabase Storage
     */
    async deleteMany(bucket: string, paths: string[]): Promise<void> {
        if (paths.length === 0) return;

        const { error } = await getSupabase().storage
            .from(bucket)
            .remove(paths);

        if (error) {
            throw error;
        }
    }

    /**
     * Get the public URL of a file
     */
    getPublicUrl(bucket: string, path: string): string {
        const { data } = getSupabase().storage
            .from(bucket)
            .getPublicUrl(path);

        return data.publicUrl;
    }

    /**
     * Parse a Supabase storage URL to extract bucket and path
     * Format: .../storage/v1/object/public/{bucket}/{path}
     */
    parseStorageUrl(url: string): { bucket: string; path: string } | null {
        try {
            const regex = /\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/;
            const match = url.match(regex);

            if (!match) return null;

            return {
                bucket: match[1],
                path: match[2],
            };
        } catch {
            return null;
        }
    }
}

export const SupabaseStorageRepository = new SupabaseStorageRepositoryImpl();




