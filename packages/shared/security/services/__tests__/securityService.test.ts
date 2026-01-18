import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { securityService } from '../securityService';

// Mock storage
const createStorageMock = () => {
    const store: Record<string, string> = {};
    return {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => {
            store[key] = value;
        }),
        removeItem: vi.fn(),
        clear: vi.fn(),
    };
};

describe('securityService', () => {
    let sessionStorageMock: ReturnType<typeof createStorageMock>;

    beforeEach(() => {
        sessionStorageMock = createStorageMock();
        vi.stubGlobal('sessionStorage', sessionStorageMock);
        vi.stubGlobal('localStorage', createStorageMock());
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    describe('sanitizeFormData', () => {
        it('should sanitize string fields', () => {
            const data = {
                name: '  John Doe  ',
                email: 'john@example.com',
                bio: 'Hello\x00World',
            };

            const result = securityService.sanitizeFormData(data);

            expect(result.name).toBe('John Doe');
            expect(result.email).toBe('john@example.com');
            expect(result.bio).toBe('HelloWorld');
        });

        it('should sanitize arrays of strings', () => {
            const data = {
                tags: ['  tag1  ', 'tag2\x00'],
            };

            const result = securityService.sanitizeFormData(data);

            expect(result.tags).toEqual(['tag1', 'tag2']);
        });

        it('should preserve non-string values', () => {
            const data = {
                count: 42,
                active: true,
                price: 19.99,
                data: null,
            };

            const result = securityService.sanitizeFormData(data);

            expect(result).toEqual(data);
        });

        it('should recursively sanitize nested objects', () => {
            const data = {
                user: {
                    name: '  Nested  ',
                    profile: {
                        bio: 'Deep\x00Nested',
                    },
                },
            };

            const result = securityService.sanitizeFormData(data);

            expect(result.user.name).toBe('Nested');
            expect(result.user.profile.bio).toBe('DeepNested');
        });
    });

    describe('validateFormData', () => {
        it('should return empty array for safe data', () => {
            const data = {
                name: 'John Doe',
                email: 'john@example.com',
            };

            const result = securityService.validateFormData(data);

            expect(result).toEqual([]);
        });

        it('should detect malicious fields', () => {
            const data = {
                name: 'John Doe',
                comment: '<script>alert(1)</script>',
                bio: 'Safe bio text',
            };

            const result = securityService.validateFormData(data);

            expect(result).toContain('comment');
            expect(result).not.toContain('name');
            expect(result).not.toContain('bio');
        });

        it('should detect malicious content in arrays', () => {
            const data = {
                tags: ['safe', 'javascript:evil()'],
            };

            const result = securityService.validateFormData(data);

            expect(result).toContain('tags');
        });
    });

    describe('isMalicious', () => {
        it('should detect XSS attempts', () => {
            expect(securityService.isMalicious('<script>evil()</script>')).toBe(true);
            expect(securityService.isMalicious('Hello World')).toBe(false);
        });
    });

    describe('CSRF methods', () => {
        it('should initialize and validate CSRF token', () => {
            const token = securityService.initCsrf();

            expect(token).toMatch(/^[a-f0-9]{64}$/);
            expect(sessionStorageMock.setItem).toHaveBeenCalledWith('csrf_token', token);
        });

        it('should get stored CSRF token', () => {
            sessionStorageMock.getItem.mockReturnValue('stored-token');

            expect(securityService.getCsrfToken()).toBe('stored-token');
        });

        it('should validate matching CSRF token', () => {
            sessionStorageMock.getItem.mockReturnValue('valid-token');

            expect(securityService.validateCsrf('valid-token')).toBe(true);
            expect(securityService.validateCsrf('invalid-token')).toBe(false);
        });
    });

    describe('re-exported utilities', () => {
        it('should expose escapeHtml', () => {
            expect(securityService.escapeHtml('<div>')).toBe('&lt;div&gt;');
        });

        it('should expose sanitizeEmail', () => {
            expect(securityService.sanitizeEmail('Test@EXAMPLE.com')).toBe('test@example.com');
        });

        it('should expose sanitizeUrl', () => {
            expect(securityService.sanitizeUrl('https://example.com')).toBe('https://example.com/');
            expect(securityService.sanitizeUrl('javascript:alert(1)')).toBeNull();
        });
    });
});
