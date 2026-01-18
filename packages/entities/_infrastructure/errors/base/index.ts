/**
 * Base Data Error Class
 */
import { DataErrorCode } from '../codes';

export class DataError extends Error {
    readonly code: DataErrorCode;
    readonly details?: unknown;
    readonly originalError?: Error;

    constructor(
        message: string,
        code: DataErrorCode = DataErrorCode.UNKNOWN,
        details?: unknown,
        originalError?: Error
    ) {
        super(message);
        this.name = 'DataError';
        this.code = code;
        this.details = details;
        this.originalError = originalError;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, DataError);
        }
    }

    toJSON() {
        return {
            name: this.name,
            message: this.message,
            code: this.code,
            details: this.details,
        };
    }
}

/**
 * Type guard to check if an error is a DataError
 */
export function isDataError(error: unknown): error is DataError {
    return error instanceof DataError;
}
