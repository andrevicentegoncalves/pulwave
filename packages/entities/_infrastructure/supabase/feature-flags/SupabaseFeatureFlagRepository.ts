/**
 * Supabase Feature Flag Repository
 * Supabase-specific implementation for feature flags.
 */
import type {
    FeatureFlag,
    FeatureFlagCreateInput,
    FeatureFlagEvaluation,
    FeatureFlagUpdateInput,
    IFeatureFlagRepository,
} from '@pulwave/entity-feature-flags';

import { getSupabase } from '../client';

/**
 * Simple hash function for percentage rollout
 */
const hashUserId = (userId: string): number => {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
        const char = userId.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
};

export const SupabaseFeatureFlagRepository: IFeatureFlagRepository = {
    version: '1.0.0',
    async getAllFlags(): Promise<FeatureFlag[]> {
        const supabase = getSupabase();
        const { data, error } = await supabase
            .from('feature_flags')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return (data || []).map((row: any) => ({
            id: row.id,
            key: row.key,
            name: row.name,
            description: row.description,
            enabled: row.enabled,
            rolloutPercentage: row.rollout_percentage,
            targetUserIds: row.target_user_ids,
            targetRoles: row.target_roles,
            metadata: row.metadata,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        }));
    },

    async getFlagByKey(key: string): Promise<FeatureFlag | null> {
        const supabase = getSupabase();
        const { data, error } = await supabase
            .from('feature_flags')
            .select('*')
            .eq('key', key)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        if (!data) return null;

        return {
            id: data.id,
            key: data.key,
            name: data.name,
            description: data.description,
            enabled: data.enabled,
            rolloutPercentage: data.rollout_percentage,
            targetUserIds: data.target_user_ids,
            targetRoles: data.target_roles,
            metadata: data.metadata,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
        };
    },

    async evaluateFlag(
        key: string,
        userId?: string,
        userRoles?: string[]
    ): Promise<FeatureFlagEvaluation> {
        const flag = await this.getFlagByKey(key);

        // Flag doesn't exist - default to disabled
        if (!flag) {
            return { flagKey: key, enabled: false, reason: 'not_found' };
        }

        // Flag is globally disabled
        if (!flag.enabled) {
            return { flagKey: key, enabled: false, reason: 'default' };
        }

        // Check user targeting
        if (userId && flag.targetUserIds?.includes(userId)) {
            return { flagKey: key, enabled: true, reason: 'user_targeted' };
        }

        // Check role targeting
        if (userRoles && flag.targetRoles?.some(r => userRoles.includes(r))) {
            return { flagKey: key, enabled: true, reason: 'role_targeted' };
        }

        // Check percentage rollout
        if (flag.rolloutPercentage !== undefined && flag.rolloutPercentage < 100) {
            const hash = hashUserId(userId || 'anonymous');
            const percentage = hash % 100;
            const isEnabled = percentage < flag.rolloutPercentage;
            return {
                flagKey: key,
                enabled: isEnabled,
                reason: 'percentage_rollout'
            };
        }

        // Default: flag is enabled
        return { flagKey: key, enabled: true, reason: 'default' };
    },

    async createFlag(flag: FeatureFlagCreateInput): Promise<FeatureFlag> {
        const supabase = getSupabase();
        const { data, error } = await supabase
            .from('feature_flags')
            .insert({
                key: flag.key,
                name: flag.name,
                description: flag.description,
                enabled: flag.enabled ?? false,
                rollout_percentage: flag.rolloutPercentage,
                target_user_ids: flag.targetUserIds,
                target_roles: flag.targetRoles,
                metadata: flag.metadata,
            })
            .select()
            .single();

        if (error) throw error;

        return {
            id: data.id,
            key: data.key,
            name: data.name,
            description: data.description,
            enabled: data.enabled,
            rolloutPercentage: data.rollout_percentage,
            targetUserIds: data.target_user_ids,
            targetRoles: data.target_roles,
            metadata: data.metadata,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
        };
    },

    async updateFlag(id: string, updates: FeatureFlagUpdateInput): Promise<FeatureFlag> {
        const supabase = getSupabase();

        const updateData: Record<string, any> = {
            updated_at: new Date().toISOString(),
        };

        if (updates.name !== undefined) updateData.name = updates.name;
        if (updates.description !== undefined) updateData.description = updates.description;
        if (updates.enabled !== undefined) updateData.enabled = updates.enabled;
        if (updates.rolloutPercentage !== undefined) updateData.rollout_percentage = updates.rolloutPercentage;
        if (updates.targetUserIds !== undefined) updateData.target_user_ids = updates.targetUserIds;
        if (updates.targetRoles !== undefined) updateData.target_roles = updates.targetRoles;
        if (updates.metadata !== undefined) updateData.metadata = updates.metadata;

        const { data, error } = await supabase
            .from('feature_flags')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return {
            id: data.id,
            key: data.key,
            name: data.name,
            description: data.description,
            enabled: data.enabled,
            rolloutPercentage: data.rollout_percentage,
            targetUserIds: data.target_user_ids,
            targetRoles: data.target_roles,
            metadata: data.metadata,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
        };
    },

    async deleteFlag(id: string): Promise<void> {
        const supabase = getSupabase();
        const { error } = await supabase
            .from('feature_flags')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },
};
