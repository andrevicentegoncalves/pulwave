import { supabase } from '../lib/supabaseClient';

/**
 * Property Repository
 * Handles data access for Buildings, Units, and Ownership.
 */
export const propertyRepository = {
    /**
     * Get building IDs owned by a user
     * @param {string} userId 
     * @returns {Promise<string[]>} Array of building IDs
     */
    async getBuildingIdsByOwner(userId) {
        const { data, error } = await supabase
            .from('building_owners')
            .select('building_id')
            .eq('owner_id', userId);

        if (error) throw error;
        return data.map(b => b.building_id);
    },

    /**
     * Get buildings by IDs
     * @param {string[]} buildingIds 
     * @returns {Promise<any[]>}
     */
    async getBuildingsByIds(buildingIds) {
        if (!buildingIds || buildingIds.length === 0) return [];

        const { data, error } = await supabase
            .from('buildings')
            .select('*')
            .in('id', buildingIds);

        if (error) throw error;
        return data;
    },

    /**
     * Get units for specific buildings
     * @param {string[]} buildingIds 
     * @returns {Promise<any[]>}
     */
    async getUnitsByBuildingIds(buildingIds) {
        if (!buildingIds || buildingIds.length === 0) return [];

        const { data, error } = await supabase
            .from('units')
            .select('id, status, monthly_rent, building_id')
            .in('building_id', buildingIds);

        if (error) throw error;
        return data;
    },

    /**
     * Count properties by status
     * @param {string[]} buildingIds 
     * @param {string} status 
     */
    async countUnitsByStatus(buildingIds, status) {
        if (!buildingIds || buildingIds.length === 0) return 0;

        const { count, error } = await supabase
            .from('units')
            .select('id', { count: 'exact', head: true })
            .in('building_id', buildingIds)
            .eq('status', status);

        if (error) throw error;
        return count || 0;
    }
};

export default propertyRepository;
