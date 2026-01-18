/**
 * CSRF Token Utilities
 * Cross-Site Request Forgery protection.
 */

/**
 * Generate a cryptographically secure CSRF token
 */
export const generateCsrfToken = (): string => {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
    }

    // Fallback for environments without crypto (not recommended for production)
    return `fallback_${Date.now()}_${Math.random().toString(36).substring(2)}`;
};

/**
 * Store CSRF token in session/local storage
 */
export const storeCsrfToken = (token: string, storage: 'session' | 'local' = 'session'): void => {
    if (typeof window === 'undefined') return;

    const store = storage === 'session' ? sessionStorage : localStorage;
    store.setItem('csrf_token', token);
};

/**
 * Retrieve stored CSRF token
 */
export const getCsrfToken = (storage: 'session' | 'local' = 'session'): string | null => {
    if (typeof window === 'undefined') return null;

    const store = storage === 'session' ? sessionStorage : localStorage;
    return store.getItem('csrf_token');
};

/**
 * Validate CSRF token
 */
export const validateCsrfToken = (
    submittedToken: string,
    storage: 'session' | 'local' = 'session'
): boolean => {
    const storedToken = getCsrfToken(storage);

    if (!storedToken || !submittedToken) {
        return false;
    }

    // Constant-time comparison to prevent timing attacks
    if (storedToken.length !== submittedToken.length) {
        return false;
    }

    let result = 0;
    for (let i = 0; i < storedToken.length; i++) {
        result |= storedToken.charCodeAt(i) ^ submittedToken.charCodeAt(i);
    }

    return result === 0;
};

/**
 * Create and store a new CSRF token, returning it
 */
export const initializeCsrfToken = (storage: 'session' | 'local' = 'session'): string => {
    const token = generateCsrfToken();
    storeCsrfToken(token, storage);
    return token;
};
