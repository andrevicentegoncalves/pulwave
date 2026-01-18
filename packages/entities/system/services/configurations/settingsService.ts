import { systemRepository } from '../../repositories/systemRepository';
import type { SystemSetting, SystemFeatureFlag, RetentionPolicy } from '../../interfaces/types/System';

export const settingsService = {
    // System Settings
    async getSystemSettings(): Promise<SystemSetting[]> {
        return systemRepository.getSystemSettings();
    },

    async updateSystemSetting(key: string, value: unknown): Promise<SystemSetting> {
        return systemRepository.updateSystemSetting(key, value);
    },

    async upsertSystemSetting(setting: Partial<SystemSetting>): Promise<SystemSetting> {
        return systemRepository.upsertSystemSetting(setting);
    },

    // Feature Flags
    async getFeatureFlags(): Promise<SystemFeatureFlag[]> {
        return systemRepository.getFeatureFlags();
    },

    async toggleFeatureFlag(key: string, enabled: boolean): Promise<SystemFeatureFlag> {
        return systemRepository.updateFeatureFlag(key, { is_enabled: enabled });
    },

    async createFeatureFlag(flag: Partial<SystemFeatureFlag>): Promise<SystemFeatureFlag> {
        return systemRepository.createFeatureFlag(flag);
    },

    async deleteFeatureFlag(key: string): Promise<void> {
        return systemRepository.deleteFeatureFlag(key);
    },

    // Data Retention
    async getRetentionPolicies(): Promise<RetentionPolicy[]> {
        return systemRepository.getRetentionPolicies();
    },

    async updateRetentionPolicy(id: string, updates: Partial<RetentionPolicy>): Promise<RetentionPolicy> {
        return systemRepository.updateRetentionPolicy(id, updates);
    },
};



