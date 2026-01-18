/**
 * Specialized Error Classes
 */
import { DataErrorCode } from '../codes';
import { DataError } from '../base';

/**
 * Error for when a resource is not found
 */
export class NotFoundError extends DataError {
    constructor(resource: string, id?: string) {
        super(
            id ? `${resource} with id '${id}' not found` : `${resource} not found`,
            DataErrorCode.NOT_FOUND,
            { resource, id }
        );
        this.name = 'NotFoundError';
    }
}

/**
 * Error for validation failures
 */
export class ValidationError extends DataError {
    constructor(message: string, fields?: Record<string, string[]>) {
        super(message, DataErrorCode.VALIDATION_FAILED, { fields });
        this.name = 'ValidationError';
    }
}

/**
 * Error for permission/authorization failures
 */
export class UnauthorizedError extends DataError {
    constructor(message = 'Authentication required') {
        super(message, DataErrorCode.UNAUTHORIZED);
        this.name = 'UnauthorizedError';
    }
}

export class ForbiddenError extends DataError {
    constructor(message = 'Access denied') {
        super(message, DataErrorCode.FORBIDDEN);
        this.name = 'ForbiddenError';
    }
}
