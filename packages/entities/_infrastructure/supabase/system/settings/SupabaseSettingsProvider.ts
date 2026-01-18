import type { RetentionPolicy, SystemFeatureFlag, SystemSetting } from '@pulwave/entity-system';

import { getSupabase } from '../../client';

export const SupabaseSettingsProvider = {
    async getSystemSettings(): Promise<SystemSetting[]> {
        const { data, error } = await getSupabase()
            .from('system_settings')
            .select('*')
            .order('category', { ascending: true });

        if (error) throw error;
        return (data || []) as unknown as SystemSetting[];
    },

    async updateSystemSetting(key: string, value: any): Promise<SystemSetting> {
        const { data, error } = await getSupabase()
            .from('system_settings')
            .update({ value, updated_at: new Date().toISOString() })
            .eq('setting_key', key)
            .select()
            .single();

        if (error) throw error;
        return data as unknown as SystemSetting;
    },

    async upsertSystemSetting(setting: Partial<SystemSetting>): Promise<SystemSetting> {
        const { data, error } = await getSupabase()
            .from('system_settings')
            .upsert(setting)
            .select()
            .single();

        if (error) throw error;
        return data as unknown as SystemSetting;
    },

    async getFeatureFlags(): Promise<SystemFeatureFlag[]> {
        const { data, error } = await getSupabase()
            .from('feature_flags')
            .select('*')
            .order('name', { ascending: true });

        if (error) throw error;
        return (data || []) as unknown as SystemFeatureFlag[];
    },

    async updateFeatureFlag(key: string, updates: Partial<SystemFeatureFlag>): Promise<SystemFeatureFlag> {
        const { data, error } = await getSupabase()
            .from('feature_flags')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('name', key) // Assuming name is the unique key here based on interface
            .select()
            .single();

        if (error) throw error;
        return data as unknown as SystemFeatureFlag;
    },

    async createFeatureFlag(flag: Partial<SystemFeatureFlag>): Promise<SystemFeatureFlag> {
        const { data, error } = await getSupabase()
            .from('feature_flags')
            .insert(flag)
            .select()
            .single();

        if (error) throw error;
        return data as unknown as SystemFeatureFlag;
    },

    async deleteFeatureFlag(key: string): Promise<void> {
        const { error } = await getSupabase()
            .from('feature_flags')
            .delete()
            .eq('name', key);

        if (error) throw error;
    },

    async getRetentionPolicies(): Promise<RetentionPolicy[]> {
        const { data, error } = await getSupabase()
            .from('retention_policies')
            .select('*');

        if (error) throw error;
        return (data || []) as unknown as RetentionPolicy[];
    },

    async updateRetentionPolicy(id: string, updates: Partial<RetentionPolicy>): Promise<RetentionPolicy> {
        const { data, error } = await getSupabase()
            .from('retention_policies')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as unknown as RetentionPolicy;
    },
};

