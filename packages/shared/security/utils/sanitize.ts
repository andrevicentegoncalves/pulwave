/**
 * Input Sanitization Utilities
 * XSS prevention and input cleaning.
 */

/**
 * HTML entities for escaping
 */
const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
};

/**
 * Escape HTML entities to prevent XSS
 */
export const escapeHtml = (str: string): string => {
    if (typeof str !== 'string') return '';
    return str.replace(/[&<>"'`=/]/g, (char) => htmlEntities[char] || char);
};

/**
 * Strip HTML tags from string
 */
export const stripHtml = (str: string): string => {
    if (typeof str !== 'string') return '';
    return str.replace(/<[^>]*>/g, '');
};

/**
 * Remove control characters from string
 */
const removeControlCharacters = (str: string): string => {
    return str.replace(/[\x00-\x1F\x7F]/g, '');
};

/**
 * Sanitize user input for database storage
 */
export const sanitizeInput = (input: string, maxLength = 10000): string => {
    if (typeof input !== 'string') return '';

    return removeControlCharacters(input.trim()).substring(0, maxLength);
};

/**
 * Validate and sanitize email
 */
export const sanitizeEmail = (email: string): string | null => {
    if (typeof email !== 'string') return null;

    const sanitized = sanitizeInput(email).toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(sanitized) ? sanitized : null;
};

/**
 * Sanitize URL - only allow http/https protocols
 */
export const sanitizeUrl = (url: string): string | null => {
    if (typeof url !== 'string') return null;

    try {
        const parsed = new URL(url);
        // Only allow http and https protocols
        if (!['http:', 'https:'].includes(parsed.protocol)) {
            return null;
        }
        return parsed.toString();
    } catch {
        return null;
    }
};

/**
 * Sanitize phone number - keep only digits and common separators
 */
export const sanitizePhone = (phone: string): string => {
    if (typeof phone !== 'string') return '';
    return phone.replace(/[^\d\s\-+().]/g, '').trim();
};

/**
 * Sanitize filename - remove path separators and dangerous characters
 */
export const sanitizeFilename = (filename: string): string => {
    if (typeof filename !== 'string') return '';

    return filename
        .replace(/[/\\:*?"<>|]/g, '') // Remove dangerous characters
        .replace(/\.\./g, '') // Prevent directory traversal
        .trim()
        .substring(0, 255); // Limit filename length
};

/**
 * Check for potentially malicious patterns (XSS, SQL injection indicators)
 */
export const detectMaliciousInput = (input: string): boolean => {
    if (typeof input !== 'string') return false;

    const patterns = [
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i,
        /data:/i,
        /vbscript:/i,
        /expression\s*\(/i,
        /url\s*\(/i,
        // SQL injection patterns
        /('|")\s*(or|and)\s*('|"|\d)/i,
        /;\s*(drop|delete|update|insert)/i,
        /--\s*$/,
        /\/\*.*\*\//,
    ];

    return patterns.some((pattern) => pattern.test(input));
};

/**
 * Encode for use in HTML attributes
 */
export const encodeForHtmlAttribute = (str: string): string => {
    return escapeHtml(str).replace(/'/g, '&#39;').replace(/"/g, '&quot;');
};

/**
 * Encode for use in JavaScript strings
 */
export const encodeForJavaScript = (str: string): string => {
    if (typeof str !== 'string') return '';

    return str
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t');
};
