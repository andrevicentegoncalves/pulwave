import type { IPropertyRepository } from '@pulwave/entity-property';

import { getSupabase } from '../client';

export const SupabasePropertyRepository: IPropertyRepository = {
    version: '1.0.0',
    async getBuildingIdsByOwner(userId: string) {
        const { data, error } = await getSupabase().from('buildings').select('id').eq('owner_id', userId);
        if (error) throw error;
        return data?.map(b => b.id) || [];
    },

    async getBuildingsByIds(buildingIds: string[]) {
        const { data, error } = await getSupabase().from('buildings').select('*').in('id', buildingIds);
        if (error) throw error;
        return data || [];
    },

    async getUnitsByBuildingIds(buildingIds: string[]) {
        const { data, error } = await getSupabase().from('properties').select('*').in('building_id', buildingIds);
        if (error) throw error;
        return data || [];
    },

    async countUnitsByStatus(buildingIds: string[], status: string) {
        const { count, error } = await getSupabase().from('properties').select('*', { count: 'exact', head: true }).in('building_id', buildingIds).eq('status', status);
        if (error) throw error;
        return count || 0;
    },
};



