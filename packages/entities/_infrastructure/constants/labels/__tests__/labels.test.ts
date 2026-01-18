/**
 * Labels Constants Tests
 */
import { describe, it, expect } from 'vitest';
import { TABLE_LABELS } from '..';

describe('TABLE_LABELS', () => {
    it('should define label for profiles', () => {
        expect(TABLE_LABELS.profiles).toBe('User Profiles');
    });

    it('should define label for subscription_plans', () => {
        expect(TABLE_LABELS.subscription_plans).toBe('Subscription Plans');
    });

    it('should define label for countries', () => {
        expect(TABLE_LABELS.countries).toBe('Countries');
    });

    it('should define label for system_settings', () => {
        expect(TABLE_LABELS.system_settings).toBe('System Settings');
    });
});
