/**
 * DataErrorCode Tests
 */
import { describe, it, expect } from 'vitest';
import { DataErrorCode } from '../..';

describe('DataErrorCode', () => {
    it('should have connection error codes', () => {
        expect(DataErrorCode.CONNECTION_FAILED).toBe('CONNECTION_FAILED');
        expect(DataErrorCode.TIMEOUT).toBe('TIMEOUT');
    });

    it('should have CRUD error codes', () => {
        expect(DataErrorCode.NOT_FOUND).toBe('NOT_FOUND');
        expect(DataErrorCode.ALREADY_EXISTS).toBe('ALREADY_EXISTS');
        expect(DataErrorCode.VALIDATION_FAILED).toBe('VALIDATION_FAILED');
    });

    it('should have permission error codes', () => {
        expect(DataErrorCode.UNAUTHORIZED).toBe('UNAUTHORIZED');
        expect(DataErrorCode.FORBIDDEN).toBe('FORBIDDEN');
    });

    it('should have constraint error codes', () => {
        expect(DataErrorCode.FOREIGN_KEY_VIOLATION).toBe('FOREIGN_KEY_VIOLATION');
        expect(DataErrorCode.UNIQUE_VIOLATION).toBe('UNIQUE_VIOLATION');
    });

    it('should have general error codes', () => {
        expect(DataErrorCode.UNKNOWN).toBe('UNKNOWN');
        expect(DataErrorCode.PROVIDER_ERROR).toBe('PROVIDER_ERROR');
    });
});
