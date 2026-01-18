/**
 * Supabase Error Mapping
 */
import { DataErrorCode } from '../codes';
import { DataError } from '../base';
import { NotFoundError, ForbiddenError, UnauthorizedError } from '../specialized';

/**
 * Map Supabase errors to DataErrors
 */
export function mapSupabaseError(error: any): DataError {
    if (!error) {
        return new DataError('Unknown error occurred', DataErrorCode.UNKNOWN);
    }

    const message = error.message || error.error_description || 'Unknown error';
    const code = error.code || '';

    // PostgreSQL/Supabase error code mapping
    if (code === '23505' || code === 'PGRST116') {
        return new DataError(message, DataErrorCode.UNIQUE_VIOLATION, error, error);
    }

    if (code === '23503') {
        return new DataError(message, DataErrorCode.FOREIGN_KEY_VIOLATION, error, error);
    }

    if (code === '42501' || code === 'PGRST301') {
        return new ForbiddenError(message);
    }

    if (code === 'PGRST204' || message.includes('not found')) {
        return new NotFoundError('Resource');
    }

    if (error.status === 401) {
        return new UnauthorizedError(message);
    }

    if (error.status === 403) {
        return new ForbiddenError(message);
    }

    return new DataError(message, DataErrorCode.PROVIDER_ERROR, error, error);
}

/**
 * Wrap a provider function to catch and convert errors
 */
export async function withErrorHandling<T>(
    fn: () => Promise<T>,
    resourceName = 'Resource'
): Promise<T> {
    try {
        return await fn();
    } catch (error: any) {
        if (error instanceof DataError) {
            throw error;
        }
        throw mapSupabaseError(error);
    }
}
