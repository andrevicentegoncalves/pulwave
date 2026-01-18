/**
 * CacheKeys Tests
 */
import { describe, it, expect } from 'vitest';
import { CacheKeys } from '..';

describe('CacheKeys', () => {
    describe('profile keys', () => {
        it('should generate profile key', () => {
            expect(CacheKeys.profile('123')).toBe('profile:123');
        });

        it('should generate fullProfile key', () => {
            expect(CacheKeys.fullProfile('auth-456')).toBe('fullProfile:auth-456');
        });

        it('should generate preferences key', () => {
            expect(CacheKeys.preferences('789')).toBe('preferences:789');
        });
    });

    describe('user keys', () => {
        it('should generate user key', () => {
            expect(CacheKeys.user('456')).toBe('user:456');
        });

        it('should generate permissions key', () => {
            expect(CacheKeys.permissions('user-123')).toBe('permissions:user-123');
        });
    });

    describe('payment keys', () => {
        it('should generate subscriptionPlans key', () => {
            expect(CacheKeys.subscriptionPlans()).toBe('subscriptionPlans');
        });

        it('should generate paymentMethods key', () => {
            expect(CacheKeys.paymentMethods('org-123')).toBe('paymentMethods:org-123');
        });
    });

    describe('lookup keys', () => {
        it('should generate countries key', () => {
            expect(CacheKeys.countries()).toBe('countries');
        });

        it('should generate timezones key', () => {
            expect(CacheKeys.timezones()).toBe('timezones');
        });

        it('should generate locales key', () => {
            expect(CacheKeys.locales()).toBe('locales');
        });

        it('should generate translations key', () => {
            expect(CacheKeys.translations('pt-PT')).toBe('translations:pt-PT');
        });
    });
});
