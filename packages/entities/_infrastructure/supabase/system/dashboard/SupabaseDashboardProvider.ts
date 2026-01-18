import type { DashboardStats } from '@pulwave/entity-system';

import { getSupabase } from '../../client';

export const SupabaseDashboardProvider = {
    async getDashboardStats(): Promise<DashboardStats> {
        const { data, error } = await getSupabase().rpc('get_admin_dashboard_stats');
        if (error) throw error;
        return data as unknown as DashboardStats;
    },

    async getTranslationStats(): Promise<Record<string, any>> {
        const { data, error } = await getSupabase().rpc('get_translation_stats');
        if (error) throw error;
        return data || {};
    },
};

