/**
 * Common type definitions used across the application
 */

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
    data: T;
    error?: string;
    message?: string;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
    page: number;
    pageSize: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

/**
 * Generic loading state
 */
export interface LoadingState {
    isLoading: boolean;
    isError: boolean;
    error?: Error | null;
}

/**
 * Generic async state with data
 */
export interface AsyncState<T> extends LoadingState {
    data: T | null;
}

/**
 * Theme variants
 */
export type Theme = 'light' | 'dark' | 'system';

/**
 * Locale code (BCP 47)
 */
export type LocaleCode = string;

/**
 * User role
 */
export type UserRole = 'admin' | 'user' | 'guest';

/**
 * Generic ID type
 */
export type ID = string | number;

/**
 * Nullable type helper
 */
export type Nullable<T> = T | null;

/**
 * Optional type helper
 */
export type Optional<T> = T | undefined;

/**
 * Make specific keys optional
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Make specific keys required
 */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/**
 * Extract the resolved type of a Promise
 */
export type Awaited<T> = T extends Promise<infer U> ? U : T;
/**
 * Translation bundles and hashes for i18n
 */
export interface TranslationBundles {
    ui: Record<string, unknown>;
    schema: Record<string, unknown>;
    enum: Record<string, unknown>;
    master_data?: Record<string, unknown>;
    content?: Record<string, unknown>;
}

export interface BundleHashes {
    ui: string | null;
    schema: string | null;
    enum: string | null;
    master_data?: string | null;
    content?: string | null;
}
