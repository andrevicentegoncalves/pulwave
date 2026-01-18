/**
 * Feature Flag Repository Interface
 * Provider-agnostic interface for feature flag management.
 */
import type {
    FeatureFlag,
    FeatureFlagEvaluation,
    FeatureFlagCreateInput,
    FeatureFlagUpdateInput
} from './types/FeatureFlag';
import type { IVersionedRepository } from '../../_infrastructure/interfaces';

// Types are exported via ./types/index.ts to avoid duplicate exports

export interface IFeatureFlagRepository extends IVersionedRepository {
    readonly version: '1.0.0';
    /**
     * Get all feature flags
     */
    getAllFlags(): Promise<FeatureFlag[]>;

    /**
     * Get a specific flag by key
     */
    getFlagByKey(key: string): Promise<FeatureFlag | null>;

    /**
     * Evaluate a flag for a specific user
     */
    evaluateFlag(
        key: string,
        userId?: string,
        userRoles?: string[]
    ): Promise<FeatureFlagEvaluation>;

    /**
     * Create a new feature flag (admin only)
     */
    createFlag(flag: FeatureFlagCreateInput): Promise<FeatureFlag>;

    /**
     * Update an existing feature flag (admin only)
     */
    updateFlag(id: string, updates: FeatureFlagUpdateInput): Promise<FeatureFlag>;

    /**
     * Delete a feature flag (admin only)
     */
    deleteFlag(id: string): Promise<void>;
}
