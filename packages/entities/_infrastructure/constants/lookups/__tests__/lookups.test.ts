/**
 * Lookups Constants Tests
 */
import { describe, it, expect } from 'vitest';
import { ALLOWED_LOOKUP_TABLES, LOOKUP_TABLE_CONFIG } from '..';

describe('ALLOWED_LOOKUP_TABLES', () => {
    it('should include geo lookup tables', () => {
        expect(ALLOWED_LOOKUP_TABLES).toContain('countries');
        expect(ALLOWED_LOOKUP_TABLES).toContain('localities');
    });

    it('should include locale tables', () => {
        expect(ALLOWED_LOOKUP_TABLES).toContain('locales');
        expect(ALLOWED_LOOKUP_TABLES).toContain('timezones');
    });

    it('should include payment tables', () => {
        expect(ALLOWED_LOOKUP_TABLES).toContain('subscription_plans');
    });
});

describe('LOOKUP_TABLE_CONFIG', () => {
    it('should define config for countries', () => {
        expect(LOOKUP_TABLE_CONFIG.countries).toHaveProperty('orderBy');
        expect(LOOKUP_TABLE_CONFIG.countries.orderBy).toBe('name');
    });

    it('should define config for timezones', () => {
        expect(LOOKUP_TABLE_CONFIG.timezones).toHaveProperty('orderBy');
        expect(LOOKUP_TABLE_CONFIG.timezones.selectActive).toBe(true);
    });

    it('should define config for locales', () => {
        expect(LOOKUP_TABLE_CONFIG.locales).toHaveProperty('orderBy');
    });
});
