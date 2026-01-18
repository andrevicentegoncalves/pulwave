/**
 * Specialized Error Classes Tests
 */
import { describe, it, expect } from 'vitest';
import {
    DataError,
    DataErrorCode,
    NotFoundError,
    ValidationError,
    UnauthorizedError,
    ForbiddenError
} from '../..';

describe('NotFoundError', () => {
    it('should create with resource and id', () => {
        const error = new NotFoundError('User', '123');
        expect(error.message).toBe("User with id '123' not found");
        expect(error.code).toBe(DataErrorCode.NOT_FOUND);
        expect(error.name).toBe('NotFoundError');
    });

    it('should create with resource only', () => {
        const error = new NotFoundError('Profile');
        expect(error.message).toBe('Profile not found');
    });

    it('should be instanceof DataError', () => {
        expect(new NotFoundError('User')).toBeInstanceOf(DataError);
    });
});

describe('ValidationError', () => {
    it('should create with message only', () => {
        const error = new ValidationError('Invalid input');
        expect(error.code).toBe(DataErrorCode.VALIDATION_FAILED);
        expect(error.name).toBe('ValidationError');
    });

    it('should include field details', () => {
        const error = new ValidationError('Invalid input', {
            email: ['Invalid format'],
            password: ['Too short'],
        });
        expect(error.details).toEqual({
            fields: { email: ['Invalid format'], password: ['Too short'] },
        });
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
});
