/**
 * Security Service
 * Centralized security utilities and validation.
 */
import {
    escapeHtml,
    stripHtml,
    sanitizeInput,
    sanitizeEmail,
    sanitizeUrl,
    sanitizePhone,
    sanitizeFilename,
    detectMaliciousInput,
    encodeForHtmlAttribute,
    encodeForJavaScript,
} from '../utils/sanitize';

import {
    generateCsrfToken,
    storeCsrfToken,
    getCsrfToken,
    validateCsrfToken,
    initializeCsrfToken,
} from '../utils/csrf';

export const securityService = {
    /**
     * Sanitize all string fields in form data recursively
     * 
     * Removes control characters, trims whitespace, and limits length for all
     * string values in the object, including nested objects and arrays.
     * 
     * @template T - Type of the form data object
     * @param data - Form data to sanitize
     * @returns Sanitized form data with same structure
     * 
     * @example
     * ```typescript
     * const userInput = {
     *   name: '  John Doe  ',
     *   email: 'john@example.com',
     *   bio: 'Hello\x00World', // Control character
     *   tags: ['  tag1  ', 'tag2\x00']
     * };
     * 
     * const clean = securityService.sanitizeFormData(userInput);
     * // Result: {
     * //   name: 'John Doe',
     * //   email: 'john@example.com', 
     * //   bio: 'HelloWorld',
     * //   tags: ['tag1', 'tag2']
     * // }
     * ```
     */
    sanitizeFormData<T extends Record<string, unknown>>(data: T): T {
        const sanitized: Record<string, unknown> = {};

        for (const [key, value] of Object.entries(data)) {
            if (typeof value === 'string') {
                sanitized[key] = sanitizeInput(value);
            } else if (Array.isArray(value)) {
                sanitized[key] = value.map((v) =>
                    typeof v === 'string' ? sanitizeInput(v) : v
                );
            } else if (typeof value === 'object' && value !== null) {
                sanitized[key] = this.sanitizeFormData(value as Record<string, unknown>);
            } else {
                sanitized[key] = value;
            }
        }

        return sanitized as T;
    },

    /**
     * Validate form data for malicious content
     * Returns array of field names that contain suspicious content
     */
    validateFormData(data: Record<string, unknown>): string[] {
        const maliciousFields: string[] = [];

        for (const [key, value] of Object.entries(data)) {
            if (typeof value === 'string' && detectMaliciousInput(value)) {
                maliciousFields.push(key);
            } else if (Array.isArray(value)) {
                for (const v of value) {
                    if (typeof v === 'string' && detectMaliciousInput(v)) {
                        maliciousFields.push(key);
                        break;
                    }
                }
            }
        }

        return maliciousFields;
    },

    /**
     * Check if input contains malicious patterns
     */
    isMalicious: detectMaliciousInput,

    /**
     * Initialize CSRF protection with a new token
     * 
     * Generates a cryptographically secure token and stores it in browser storage.
     * Call this when rendering forms that will submit sensitive data.
     * 
     * @param storage - Where to store the token ('session' or 'local')
     * @returns The generated CSRF token to include in forms
     * 
     * @example
     * ```typescript
     * // In your form component
     * const csrfToken = securityService.initCsrf('session');
     * 
     * // Include in form
     * <input type="hidden" name="csrf_token" value={csrfToken} />
     * ```
     */
    initCsrf(storage: 'session' | 'local' = 'session'): string {
        return initializeCsrfToken(storage);
    },

    /**
     * Validate CSRF token from a form submission
     * 
     * Compares the submitted token against the stored token using constant-time
     * comparison to prevent timing attacks.
     * 
     * @param token - CSRF token from form submission
     * @param storage - Where the original token was stored
     * @returns true if token is valid, false otherwise
     * 
     * @example
     * ```typescript
     * // In your form submission handler
     * const isValid = securityService.validateCsrf(formData.csrf_token);
     * 
     * if (!isValid) {
     *   throw new Error('Invalid CSRF token');
     * }
     * ```
     */
    validateCsrf(token: string, storage: 'session' | 'local' = 'session'): boolean {
        return validateCsrfToken(token, storage);
    },

    /**
     * Get the current CSRF token without generating a new one
     * 
     * @param storage - Where the token is stored
     * @returns The current CSRF token, or null if none exists
     */
    getCsrfToken(storage: 'session' | 'local' = 'session'): string | null {
        return getCsrfToken(storage);
    },

    // Re-export individual sanitization utilities
    escapeHtml,
    stripHtml,
    sanitizeInput,
    sanitizeEmail,
    sanitizeUrl,
    sanitizePhone,
    sanitizeFilename,
    encodeForHtmlAttribute,
    encodeForJavaScript,
    generateCsrfToken,
};

export default securityService;
