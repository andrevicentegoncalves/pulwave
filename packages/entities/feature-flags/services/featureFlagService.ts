/**
 * Feature Flag Service
 * Business logic for feature flag evaluation and management.
 */
import { featureFlagRepository } from '../repositories/featureFlagRepository';
import type {
    FeatureFlag,
    FeatureFlagEvaluation,
    FeatureFlagCreateInput,
    FeatureFlagUpdateInput
} from '../interfaces';

export const featureFlagService = {
    /**
     * Check if a feature is enabled for the current context
     */
    async isEnabled(
        flagKey: string,
        userId?: string,
        userRoles?: string[]
    ): Promise<boolean> {
        const evaluation = await featureFlagRepository.evaluateFlag(flagKey, userId, userRoles);
        return evaluation.enabled;
    },

    /**
     * Get full evaluation details for a flag
     */
    async evaluate(
        flagKey: string,
        userId?: string,
        userRoles?: string[]
    ): Promise<FeatureFlagEvaluation> {
        return featureFlagRepository.evaluateFlag(flagKey, userId, userRoles);
    },

    /**
     * Get all feature flags (admin)
     */
    async getAllFlags(): Promise<FeatureFlag[]> {
        return featureFlagRepository.getAllFlags();
    },

    /**
     * Get a specific flag by key
     */
    async getFlagByKey(key: string): Promise<FeatureFlag | null> {
        return featureFlagRepository.getFlagByKey(key);
    },

    /**
     * Create a new flag (admin)
     */
    async createFlag(flag: FeatureFlagCreateInput): Promise<FeatureFlag> {
        return featureFlagRepository.createFlag(flag);
    },

    /**
     * Update a flag (admin)
     */
    async updateFlag(id: string, updates: FeatureFlagUpdateInput): Promise<FeatureFlag> {
        return featureFlagRepository.updateFlag(id, updates);
    },

    /**
     * Toggle a flag on/off (admin)
     */
    async toggleFlag(id: string, enabled: boolean): Promise<FeatureFlag> {
        return featureFlagRepository.updateFlag(id, { enabled });
    },

    /**
     * Delete a flag (admin)
     */
    async deleteFlag(id: string): Promise<void> {
        return featureFlagRepository.deleteFlag(id);
    },
};

export default featureFlagService;
