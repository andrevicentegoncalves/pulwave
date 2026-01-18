/**
 * Columns Constants Tests
 */
import { describe, it, expect } from 'vitest';
import { TABLE_COLUMNS } from '..';

describe('TABLE_COLUMNS', () => {
    it('should define columns for profiles table', () => {
        expect(TABLE_COLUMNS.profiles).toContain('first_name');
        expect(TABLE_COLUMNS.profiles).toContain('last_name');
    });

    it('should define columns for addresses table', () => {
        expect(TABLE_COLUMNS.addresses).toContain('street');
        expect(TABLE_COLUMNS.addresses).toContain('city');
    });

    it('should define columns for buildings table', () => {
        expect(TABLE_COLUMNS.buildings).toContain('name');
        expect(TABLE_COLUMNS.buildings).toContain('description');
    });

    it('should define columns for subscription_plans table', () => {
        expect(TABLE_COLUMNS.subscription_plans).toContain('plan_name');
        expect(TABLE_COLUMNS.subscription_plans).toContain('features');
    });
});
