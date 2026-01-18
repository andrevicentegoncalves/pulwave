/**
 * Base Versioned Repository Interface
 * Provides version metadata for all repository implementations.
 */

export interface IVersionedRepository {
    /**
     * Semantic version of this repository interface
     * Format: MAJOR.MINOR.PATCH
     * 
     * - MAJOR: Breaking changes to interface methods or signatures
     * - MINOR: New methods added (backward compatible)
     * - PATCH: Documentation or internal implementation changes
     */
    readonly version: string;

    /**
     * Optional metadata about the repository
     */
    readonly metadata?: {
        /** Human-readable name of the repository */
        name?: string;
        /** Description of what this repository manages */
        description?: string;
        /** Date when this version was released */
        releaseDate?: string;
        /** List of breaking changes in this version */
        breakingChanges?: string[];
    };
}

/**
 * Helper to check version compatibility
 * @param required Required version (e.g., "1.2.0")
 * @param current Current version (e.g., "1.3.0")
 * @returns true if current version is compatible with required
 */
export function isVersionCompatible(required: string, current: string): boolean {
    const [reqMajor, reqMinor] = required.split('.').map(Number);
    const [curMajor, curMinor] = current.split('.').map(Number);

    // Major version must match exactly
    if (reqMajor !== curMajor) {
        return false;
    }

    // Minor version must be greater than or equal
    return curMinor >= reqMinor;
}

/**
 * Helper to compare versions
 * @returns -1 if v1 < v2, 0 if equal, 1 if v1 > v2
 */
export function compareVersions(v1: string, v2: string): number {
    const [major1, minor1, patch1] = v1.split('.').map(Number);
    const [major2, minor2, patch2] = v2.split('.').map(Number);

    if (major1 !== major2) return major1 > major2 ? 1 : -1;
    if (minor1 !== minor2) return minor1 > minor2 ? 1 : -1;
    if (patch1 !== patch2) return patch1 > patch2 ? 1 : -1;
    return 0;
}
