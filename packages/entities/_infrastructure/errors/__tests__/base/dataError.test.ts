/**
 * Error Layer Tests - Complete Coverage
 */
import { describe, it, expect } from 'vitest';
import {
    DataError,
    DataErrorCode,
    NotFoundError,
    ValidationError,
    UnauthorizedError,
    ForbiddenError,
    mapSupabaseError,
    withErrorHandling,
    isDataError,
} from '../..';

describe('DataError', () => {
    describe('constructor', () => {
        it('should create error with default code', () => {
            const error = new DataError('Something went wrong');
            expect(error.message).toBe('Something went wrong');
            expect(error.code).toBe(DataErrorCode.UNKNOWN);
            expect(error.name).toBe('DataError');
        });

        it('should create error with custom code', () => {
            const error = new DataError('Not found', DataErrorCode.NOT_FOUND);
            expect(error.code).toBe(DataErrorCode.NOT_FOUND);
        });

        it('should create error with details', () => {
            const error = new DataError(
                'Validation failed',
                DataErrorCode.VALIDATION_FAILED,
                { field: 'email' }
            );
            expect(error.details).toEqual({ field: 'email' });
        });

        it('should store original error', () => {
            const originalError = new Error('Original');
            const error = new DataError(
                'Wrapped',
                DataErrorCode.PROVIDER_ERROR,
                null,
                originalError
            );
            expect(error.originalError).toBe(originalError);
        });

        it('should be instanceof Error', () => {
            const error = new DataError('test');
            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(DataError);
        });
    });

    describe('toJSON', () => {
        it('should serialize to JSON', () => {
            const error = new DataError('Test', DataErrorCode.NOT_FOUND, { id: '123' });
            const json = error.toJSON();

            expect(json).toEqual({
                name: 'DataError',
                message: 'Test',
                code: DataErrorCode.NOT_FOUND,
                details: { id: '123' },
            });
        });

        it('should not include originalError in JSON', () => {
            const error = new DataError('Test', DataErrorCode.UNKNOWN, null, new Error('Inner'));
            const json = error.toJSON();
            expect(json).not.toHaveProperty('originalError');
        });
    });
});

describe('NotFoundError', () => {
    it('should create with resource and id', () => {
        const error = new NotFoundError('User', '123');
        expect(error.message).toBe("User with id '123' not found");
        expect(error.code).toBe(DataErrorCode.NOT_FOUND);
        expect(error.name).toBe('NotFoundError');
        expect(error.details).toEqual({ resource: 'User', id: '123' });
    });

    it('should create with resource only', () => {
        const error = new NotFoundError('Profile');
        expect(error.message).toBe('Profile not found');
        expect(error.details).toEqual({ resource: 'Profile', id: undefined });
    });

    it('should be instanceof DataError', () => {
        const error = new NotFoundError('User');
        expect(error).toBeInstanceOf(DataError);
        expect(error).toBeInstanceOf(NotFoundError);
    });
});

describe('ValidationError', () => {
    it('should create with message only', () => {
        const error = new ValidationError('Invalid input');
        expect(error.message).toBe('Invalid input');
        expect(error.code).toBe(DataErrorCode.VALIDATION_FAILED);
        expect(error.name).toBe('ValidationError');
    });

    it('should include field details', () => {
        const error = new ValidationError('Invalid input', {
            email: ['Invalid format'],
            password: ['Too short', 'Must contain number'],
        });
        expect(error.details).toEqual({
            fields: {
                email: ['Invalid format'],
                password: ['Too short', 'Must contain number'],
            },
        });
    });

    it('should be instanceof DataError', () => {
        const error = new ValidationError('Invalid');
        expect(error).toBeInstanceOf(DataError);
        expect(error).toBeInstanceOf(ValidationError);
    });
});

describe('UnauthorizedError', () => {
    it('should create with default message', () => {
        const error = new UnauthorizedError();
        expect(error.message).toBe('Authentication required');
        expect(error.code).toBe(DataErrorCode.UNAUTHORIZED);
        expect(error.name).toBe('UnauthorizedError');
    });

    it('should create with custom message', () => {
        const error = new UnauthorizedError('Token expired');
        expect(error.message).toBe('Token expired');
    });

    it('should be instanceof DataError', () => {
        const error = new UnauthorizedError();
        expect(error).toBeInstanceOf(DataError);
        expect(error).toBeInstanceOf(UnauthorizedError);
    });
});

describe('ForbiddenError', () => {
    it('should create with default message', () => {
        const error = new ForbiddenError();
        expect(error.message).toBe('Access denied');
        expect(error.code).toBe(DataErrorCode.FORBIDDEN);
        expect(error.name).toBe('ForbiddenError');
    });

    it('should create with custom message', () => {
        const error = new ForbiddenError('Insufficient permissions');
        expect(error.message).toBe('Insufficient permissions');
    });

    it('should be instanceof DataError', () => {
        const error = new ForbiddenError();
        expect(error).toBeInstanceOf(DataError);
        expect(error).toBeInstanceOf(ForbiddenError);
    });
});

describe('DataErrorCode', () => {
    it('should have all expected error codes', () => {
        expect(DataErrorCode.CONNECTION_FAILED).toBe('CONNECTION_FAILED');
        expect(DataErrorCode.TIMEOUT).toBe('TIMEOUT');
        expect(DataErrorCode.NOT_FOUND).toBe('NOT_FOUND');
        expect(DataErrorCode.ALREADY_EXISTS).toBe('ALREADY_EXISTS');
        expect(DataErrorCode.VALIDATION_FAILED).toBe('VALIDATION_FAILED');
        expect(DataErrorCode.UNAUTHORIZED).toBe('UNAUTHORIZED');
        expect(DataErrorCode.FORBIDDEN).toBe('FORBIDDEN');
        expect(DataErrorCode.FOREIGN_KEY_VIOLATION).toBe('FOREIGN_KEY_VIOLATION');
        expect(DataErrorCode.UNIQUE_VIOLATION).toBe('UNIQUE_VIOLATION');
        expect(DataErrorCode.UNKNOWN).toBe('UNKNOWN');
        expect(DataErrorCode.PROVIDER_ERROR).toBe('PROVIDER_ERROR');
    });
});

describe('mapSupabaseError', () => {
    describe('PostgreSQL error codes', () => {
        it('should map unique violation (23505)', () => {
            const supabaseError = { code: '23505', message: 'Duplicate key' };
            const error = mapSupabaseError(supabaseError);
            expect(error.code).toBe(DataErrorCode.UNIQUE_VIOLATION);
            expect(error.message).toBe('Duplicate key');
        });

        it('should map foreign key violation (23503)', () => {
            const supabaseError = { code: '23503', message: 'FK constraint' };
            const error = mapSupabaseError(supabaseError);
            expect(error.code).toBe(DataErrorCode.FOREIGN_KEY_VIOLATION);
        });

        it('should map permission denied (42501)', () => {
            const supabaseError = { code: '42501', message: 'Permission denied' };
            const error = mapSupabaseError(supabaseError);
            expect(error).toBeInstanceOf(ForbiddenError);
        });
    });

    describe('PostgREST error codes', () => {
        it('should map PGRST116 to unique violation', () => {
            const supabaseError = { code: 'PGRST116', message: 'Unique' };
            const error = mapSupabaseError(supabaseError);
            expect(error.code).toBe(DataErrorCode.UNIQUE_VIOLATION);
        });

        it('should map PGRST301 to forbidden', () => {
            const supabaseError = { code: 'PGRST301', message: 'Forbidden' };
            const error = mapSupabaseError(supabaseError);
            expect(error).toBeInstanceOf(ForbiddenError);
        });

        it('should map PGRST204 to not found', () => {
            const supabaseError = { code: 'PGRST204', message: 'No rows' };
            const error = mapSupabaseError(supabaseError);
            expect(error.code).toBe(DataErrorCode.NOT_FOUND);
        });
    });

    describe('HTTP status codes', () => {
        it('should map 401 to unauthorized', () => {
            const supabaseError = { status: 401, message: 'Not authenticated' };
            const error = mapSupabaseError(supabaseError);
            expect(error).toBeInstanceOf(UnauthorizedError);
            expect(error.code).toBe(DataErrorCode.UNAUTHORIZED);
        });

        it('should map 403 to forbidden', () => {
            const supabaseError = { status: 403, message: 'Access denied' };
            const error = mapSupabaseError(supabaseError);
            expect(error).toBeInstanceOf(ForbiddenError);
            expect(error.code).toBe(DataErrorCode.FORBIDDEN);
        });
    });

    describe('edge cases', () => {
        it('should handle null error', () => {
            const error = mapSupabaseError(null);
            expect(error.code).toBe(DataErrorCode.UNKNOWN);
            expect(error.message).toBe('Unknown error occurred');
        });

        it('should handle undefined error', () => {
            const error = mapSupabaseError(undefined);
            expect(error.code).toBe(DataErrorCode.UNKNOWN);
        });

        it('should use error_description if message missing', () => {
            const error = mapSupabaseError({ error_description: 'OAuth error' });
            expect(error.message).toBe('OAuth error');
        });

        it('should map "not found" in message to NOT_FOUND', () => {
            const error = mapSupabaseError({ message: 'Resource not found' });
            expect(error.code).toBe(DataErrorCode.NOT_FOUND);
        });

        it('should default to PROVIDER_ERROR for unknown errors', () => {
            const error = mapSupabaseError({ message: 'Some random error' });
            expect(error.code).toBe(DataErrorCode.PROVIDER_ERROR);
        });
    });
});

describe('withErrorHandling', () => {
    it('should pass through successful results', async () => {
        const result = await withErrorHandling(async () => ({ data: 'test' }));
        expect(result).toEqual({ data: 'test' });
    });

    it('should pass through null results', async () => {
        const result = await withErrorHandling(async () => null);
        expect(result).toBeNull();
    });

    it('should convert errors to DataError', async () => {
        await expect(
            withErrorHandling(async () => {
                throw { code: '23505', message: 'Duplicate' };
            })
        ).rejects.toBeInstanceOf(DataError);
    });

    it('should not wrap existing DataErrors', async () => {
        const originalError = new NotFoundError('User', '123');
        await expect(
            withErrorHandling(async () => {
                throw originalError;
            })
        ).rejects.toBe(originalError);
    });

    it('should preserve error code for DataErrors', async () => {
        const error = new ValidationError('Invalid');
        try {
            await withErrorHandling(async () => { throw error; });
        } catch (e) {
            expect((e as DataError).code).toBe(DataErrorCode.VALIDATION_FAILED);
        }
    });
});

describe('isDataError', () => {
    it('should return true for DataError', () => {
        expect(isDataError(new DataError('test'))).toBe(true);
    });

    it('should return true for NotFoundError', () => {
        expect(isDataError(new NotFoundError('User'))).toBe(true);
    });

    it('should return true for ValidationError', () => {
        expect(isDataError(new ValidationError('Invalid'))).toBe(true);
    });

    it('should return true for UnauthorizedError', () => {
        expect(isDataError(new UnauthorizedError())).toBe(true);
    });

    it('should return true for ForbiddenError', () => {
        expect(isDataError(new ForbiddenError())).toBe(true);
    });

    it('should return false for regular Error', () => {
        expect(isDataError(new Error('test'))).toBe(false);
    });

    it('should return false for string', () => {
        expect(isDataError('error message')).toBe(false);
    });

    it('should return false for null', () => {
        expect(isDataError(null)).toBe(false);
    });

    it('should return false for undefined', () => {
        expect(isDataError(undefined)).toBe(false);
    });

    it('should return false for plain object', () => {
        expect(isDataError({ message: 'error' })).toBe(false);
    });
});

