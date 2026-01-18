/**
 * Error Layer Exports
 */
export { DataErrorCode } from './codes';
export { DataError, isDataError } from './base';
export { NotFoundError, ValidationError, UnauthorizedError, ForbiddenError } from './specialized';
export { mapSupabaseError, withErrorHandling } from './mappers';
