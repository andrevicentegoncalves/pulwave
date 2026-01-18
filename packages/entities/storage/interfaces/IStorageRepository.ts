/**
 * Storage Repository Interface
 * Standard contract for file storage operations.
 */
import type { IVersionedRepository } from '@pulwave/entity-infrastructure';

export interface UploadOptions {
    /** Cache control header value */
    cacheControl?: string;
    /** Whether to overwrite existing file */
    upsert?: boolean;
    /** Content type of the file */
    contentType?: string;
}

export interface IStorageRepository extends IVersionedRepository {
    readonly version: '1.0.0';
    /**
     * Upload a file to storage
     * @param bucket Storage bucket name
     * @param path File path within the bucket
     * @param file File to upload
     * @param options Upload options
     * @returns Public URL of the uploaded file
     */
    upload(bucket: string, path: string, file: File, options?: UploadOptions): Promise<string>;

    /**
     * Delete a file from storage
     * @param bucket Storage bucket name
     * @param path File path to delete
     */
    delete(bucket: string, path: string): Promise<void>;

    /**
     * Delete multiple files from storage
     * @param bucket Storage bucket name
     * @param paths Array of file paths to delete
     */
    deleteMany(bucket: string, paths: string[]): Promise<void>;

    /**
     * Get the public URL of a file
     * @param bucket Storage bucket name
     * @param path File path
     */
    getPublicUrl(bucket: string, path: string): string;

    /**
     * Extract bucket and path from a full storage URL
     * @param url Full storage URL
     * @returns Object containing bucket and path
     */
    parseStorageUrl(url: string): { bucket: string; path: string } | null;
}

