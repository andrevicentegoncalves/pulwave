import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    generateCsrfToken,
    storeCsrfToken,
    getCsrfToken,
    validateCsrfToken,
    initializeCsrfToken,
} from '../csrf';

// Mock sessionStorage and localStorage
const createStorageMock = () => {
    const store: Record<string, string> = {};
    return {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => {
            store[key] = value;
        }),
        removeItem: vi.fn((key: string) => {
            delete store[key];
        }),
        clear: vi.fn(() => {
            Object.keys(store).forEach(key => delete store[key]);
        }),
    };
};

describe('CSRF utilities', () => {
    let sessionStorageMock: ReturnType<typeof createStorageMock>;
    let localStorageMock: ReturnType<typeof createStorageMock>;

    beforeEach(() => {
        sessionStorageMock = createStorageMock();
        localStorageMock = createStorageMock();

        vi.stubGlobal('sessionStorage', sessionStorageMock);
        vi.stubGlobal('localStorage', localStorageMock);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    describe('generateCsrfToken', () => {
        it('should generate a 64-character hex string', () => {
            const token = generateCsrfToken();
            expect(token).toMatch(/^[a-f0-9]{64}$/);
        });

        it('should generate unique tokens', () => {
            const token1 = generateCsrfToken();
            const token2 = generateCsrfToken();
            expect(token1).not.toBe(token2);
        });
    });

    describe('storeCsrfToken', () => {
        it('should store token in sessionStorage by default', () => {
            storeCsrfToken('test-token');
            expect(sessionStorageMock.setItem).toHaveBeenCalledWith('csrf_token', 'test-token');
        });

        it('should store token in localStorage when specified', () => {
            storeCsrfToken('test-token', 'local');
            expect(localStorageMock.setItem).toHaveBeenCalledWith('csrf_token', 'test-token');
        });
    });

    describe('getCsrfToken', () => {
        it('should retrieve token from sessionStorage by default', () => {
            sessionStorageMock.getItem.mockReturnValue('stored-token');
            expect(getCsrfToken()).toBe('stored-token');
        });

        it('should retrieve token from localStorage when specified', () => {
            localStorageMock.getItem.mockReturnValue('local-token');
            expect(getCsrfToken('local')).toBe('local-token');
        });

        it('should return null when no token exists', () => {
            sessionStorageMock.getItem.mockReturnValue(null);
            expect(getCsrfToken()).toBeNull();
        });
    });

    describe('validateCsrfToken', () => {
        it('should return true for matching tokens', () => {
            sessionStorageMock.getItem.mockReturnValue('valid-token');
            expect(validateCsrfToken('valid-token')).toBe(true);
        });

        it('should return false for non-matching tokens', () => {
            sessionStorageMock.getItem.mockReturnValue('stored-token');
            expect(validateCsrfToken('different-token')).toBe(false);
        });

        it('should return false when no token is stored', () => {
            sessionStorageMock.getItem.mockReturnValue(null);
            expect(validateCsrfToken('any-token')).toBe(false);
        });

        it('should return false when submitted token is empty', () => {
            sessionStorageMock.getItem.mockReturnValue('stored-token');
            expect(validateCsrfToken('')).toBe(false);
        });

        it('should return false for different length tokens (timing attack prevention)', () => {
            sessionStorageMock.getItem.mockReturnValue('short');
            expect(validateCsrfToken('much-longer-token')).toBe(false);
        });
    });

    describe('initializeCsrfToken', () => {
        it('should generate and store a new token', () => {
            const token = initializeCsrfToken();

            expect(token).toMatch(/^[a-f0-9]{64}$/);
            expect(sessionStorageMock.setItem).toHaveBeenCalledWith('csrf_token', token);
        });

        it('should use localStorage when specified', () => {
            const token = initializeCsrfToken('local');

            expect(localStorageMock.setItem).toHaveBeenCalledWith('csrf_token', token);
        });
    });
});
