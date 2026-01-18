import { describe, it, expect } from 'vitest';
import { isVersionCompatible, compareVersions } from '../IVersionedRepository';

describe('IVersionedRepository helpers', () => {
    describe('isVersionCompatible', () => {
        it('should return true for same version', () => {
            expect(isVersionCompatible('1.2.3', '1.2.3')).toBe(true);
        });

        it('should return true for compatible higher minor version', () => {
            expect(isVersionCompatible('1.2.0', '1.3.0')).toBe(true);
            expect(isVersionCompatible('1.0.0', '1.5.2')).toBe(true);
        });

        it('should return false for different major version', () => {
            expect(isVersionCompatible('1.0.0', '2.0.0')).toBe(false);
            expect(isVersionCompatible('2.0.0', '1.9.9')).toBe(false);
        });

        it('should return false for lower minor version', () => {
            expect(isVersionCompatible('1.5.0', '1.3.0')).toBe(false);
        });

        it('should return true regardless of patch version', () => {
            expect(isVersionCompatible('1.2.5', '1.2.0')).toBe(true);
            expect(isVersionCompatible('1.2.0', '1.2.9')).toBe(true);
        });
    });

    describe('compareVersions', () => {
        it('should return 0 for equal versions', () => {
            expect(compareVersions('1.2.3', '1.2.3')).toBe(0);
        });

        it('should return 1 when first version is higher', () => {
            expect(compareVersions('2.0.0', '1.9.9')).toBe(1);
            expect(compareVersions('1.3.0', '1.2.0')).toBe(1);
            expect(compareVersions('1.2.5', '1.2.3')).toBe(1);
        });

        it('should return -1 when first version is lower', () => {
            expect(compareVersions('1.0.0', '2.0.0')).toBe(-1);
            expect(compareVersions('1.2.0', '1.3.0')).toBe(-1);
            expect(compareVersions('1.2.3', '1.2.5')).toBe(-1);
        });

        it('should prioritize major > minor > patch', () => {
            expect(compareVersions('2.0.0', '1.9.9')).toBe(1);
            expect(compareVersions('1.5.0', '1.4.9')).toBe(1);
        });
    });
});
