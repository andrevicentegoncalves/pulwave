/**
 * Data Layer Error Codes
 */
export enum DataErrorCode {
    // Connection errors
    CONNECTION_FAILED = 'CONNECTION_FAILED',
    TIMEOUT = 'TIMEOUT',

    // CRUD errors
    NOT_FOUND = 'NOT_FOUND',
    ALREADY_EXISTS = 'ALREADY_EXISTS',
    VALIDATION_FAILED = 'VALIDATION_FAILED',

    // Permission errors
    UNAUTHORIZED = 'UNAUTHORIZED',
    FORBIDDEN = 'FORBIDDEN',

    // Constraint errors
    FOREIGN_KEY_VIOLATION = 'FOREIGN_KEY_VIOLATION',
    UNIQUE_VIOLATION = 'UNIQUE_VIOLATION',

    // General errors
    UNKNOWN = 'UNKNOWN',
    PROVIDER_ERROR = 'PROVIDER_ERROR',
}
