/**
 * Error Mappers Tests
 */
import { describe, it, expect } from 'vitest';
import {
    mapSupabaseError,
    withErrorHandling,
    DataErrorCode,
    DataError,
} from '../..';

describe('mapSupabaseError', () => {
    describe('PostgreSQL error codes', () => {
        it('should map 23505 to UNIQUE_VIOLATION', () => {
            const error = { code: '23505', message: 'Duplicate key' };
            const result = mapSupabaseError(error);
            expect(result.code).toBe(DataErrorCode.UNIQUE_VIOLATION);
        });

        it('should map 23503 to FOREIGN_KEY_VIOLATION', () => {
            const error = { code: '23503', message: 'FK violation' };
            const result = mapSupabaseError(error);
            expect(result.code).toBe(DataErrorCode.FOREIGN_KEY_VIOLATION);
        });

        it('should map 42501 to FORBIDDEN', () => {
            const error = { code: '42501', message: 'Permission denied' };
            const result = mapSupabaseError(error);
            expect(result.code).toBe(DataErrorCode.FORBIDDEN);
        });
    });

    describe('PostgREST error codes', () => {
        it('should map PGRST116 to UNIQUE_VIOLATION', () => {
            const error = { code: 'PGRST116', message: 'Unique violation' };
            const result = mapSupabaseError(error);
            expect(result.code).toBe(DataErrorCode.UNIQUE_VIOLATION);
        });

        it('should map PGRST301 to FORBIDDEN', () => {
            const error = { code: 'PGRST301', message: 'Forbidden' };
            const result = mapSupabaseError(error);
            expect(result.code).toBe(DataErrorCode.FORBIDDEN);
        });

        it('should map PGRST204 to NOT_FOUND', () => {
            const error = { code: 'PGRST204', message: 'No rows' };
            const result = mapSupabaseError(error);
            expect(result.code).toBe(DataErrorCode.NOT_FOUND);
        });
    });

    describe('HTTP status codes', () => {
        it('should map 401 to UNAUTHORIZED', () => {
            const error = { status: 401, message: 'Not authenticated' };
            const result = mapSupabaseError(error);
            expect(result.code).toBe(DataErrorCode.UNAUTHORIZED);
        });

        it('should map 403 to FORBIDDEN', () => {
            const error = { status: 403, message: 'Access denied' };
            const result = mapSupabaseError(error);
            expect(result.code).toBe(DataErrorCode.FORBIDDEN);
        });
    });

    describe('edge cases', () => {
        it('should handle null error', () => {
            const result = mapSupabaseError(null);
            expect(result.code).toBe(DataErrorCode.UNKNOWN);
        });

        it('should handle error with only message', () => {
            const error = { message: 'Something went wrong' };
            const result = mapSupabaseError(error);
            expect(result.message).toBe('Something went wrong');
        });

        it('should map "not found" message to NOT_FOUND', () => {
            const error = { message: 'Resource not found' };
            const result = mapSupabaseError(error);
            expect(result.code).toBe(DataErrorCode.NOT_FOUND);
        });
    });
});

describe('withErrorHandling', () => {
    it('should pass through successful results', async () => {
        const result = await withErrorHandling(async () => ({ data: 'success' }));
        expect(result).toEqual({ data: 'success' });
    });

    it('should convert unknown errors to DataError', async () => {
        await expect(
            withErrorHandling(async () => {
                throw { code: '23505', message: 'Duplicate' };
            })
        ).rejects.toBeInstanceOf(DataError);
    });

    it('should preserve existing DataErrors', async () => {
        const originalError = new DataError('Custom error', DataErrorCode.VALIDATION_FAILED);

        await expect(
            withErrorHandling(async () => {
                throw originalError;
            })
        ).rejects.toBe(originalError);
    });
});
