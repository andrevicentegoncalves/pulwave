/**
 * Tables Constants Tests
 */
import { describe, it, expect } from 'vitest';
import { DATABASE_TABLES } from '..';

describe('DATABASE_TABLES', () => {
    it('should include profile tables', () => {
        expect(DATABASE_TABLES).toContain('profiles');
        expect(DATABASE_TABLES).toContain('addresses');
    });

    it('should include property tables', () => {
        expect(DATABASE_TABLES).toContain('buildings');
        expect(DATABASE_TABLES).toContain('units');
    });

    it('should include system tables', () => {
        expect(DATABASE_TABLES).toContain('system_settings');
        expect(DATABASE_TABLES).toContain('feature_flags');
    });

    it('should include geo tables', () => {
        expect(DATABASE_TABLES).toContain('countries');
        expect(DATABASE_TABLES).toContain('localities');
    });

    it('should include payment tables', () => {
        expect(DATABASE_TABLES).toContain('subscription_plans');
    });

    it('should include translation tables', () => {
        expect(DATABASE_TABLES).toContain('ui_translations');
    });
});
