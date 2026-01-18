import type { ActivityLog } from '@pulwave/entity-system';

import { getSupabase } from '../../client';

export const SupabaseActivityProvider = {
    async getActivityLogs(params: Record<string, any> = {}): Promise<{ data: ActivityLog[]; count: number | null }> {
        const { page = 1, limit = 50, action, entityType } = params;

        let query = getSupabase()
            .from('activity_log')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range((page - 1) * limit, page * limit - 1);

        if (action) query = query.eq('action', action);
        if (entityType) query = query.eq('entity_type', entityType);

        const { data, error, count } = await query;
        if (error) throw error;
        return { data: (data || []) as unknown as ActivityLog[], count };
    },
};

