/**
 * Building Service
 * Centralized data access layer for building-related operations
 */
import { supabase } from '../lib/supabaseClient';

export const buildingService = {
    /**
     * Get all buildings
     */
    async getAll() {
        const { data, error } = await supabase
            .from('buildings')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    /**
     * Get building by ID
     */
    async getById(id) {
        const { data, error } = await supabase
            .from('buildings')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Create building
     */
    async create(buildingData) {
        const { data, error } = await supabase
            .from('buildings')
            .insert([buildingData])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Update building
     */
    async update(id, updates) {
        const { data, error } = await supabase
            .from('buildings')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Delete building
     */
    async delete(id) {
        const { error } = await supabase
            .from('buildings')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    /**
     * Get units for building
     */
    async getUnits(buildingId) {
        const { data, error } = await supabase
            .from('units')
            .select('*')
            .eq('building_id', buildingId)
            .order('unit_number');

        if (error) throw error;
        return data || [];
    },
};

export default buildingService;
