/**
 * Feature Flag Types
 * Type definitions for feature flag management.
 */

export interface FeatureFlag {
    id: string;
    key: string;
    name: string;
    description?: string;
    enabled: boolean;
    rolloutPercentage?: number;
    targetUserIds?: string[];
    targetRoles?: string[];
    metadata?: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
}

export interface FeatureFlagEvaluation {
    flagKey: string;
    enabled: boolean;
    variant?: string;
    reason: 'default' | 'user_targeted' | 'role_targeted' | 'percentage_rollout' | 'not_found';
}

export interface FeatureFlagCreateInput {
    key: string;
    name: string;
    description?: string;
    enabled?: boolean;
    rolloutPercentage?: number;
    targetUserIds?: string[];
    targetRoles?: string[];
    metadata?: Record<string, unknown>;
}

export interface FeatureFlagUpdateInput {
    name?: string;
    description?: string;
    enabled?: boolean;
    rolloutPercentage?: number;
    targetUserIds?: string[];
    targetRoles?: string[];
    metadata?: Record<string, unknown>;
}
