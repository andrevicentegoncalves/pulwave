// src/repositories/profileRepository.js
import { supabase } from '../lib/supabaseClient';

/**
 * Profile Repository
 * Data access layer for profile-related data.
 * This is the ONLY file that should know about Supabase for profile operations.
 */
export const profileRepository = {
    /**
     * Get the current authenticated user
     * @returns {Promise<Object|null>} User object or null
     */
    async getCurrentUser() {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        return user;
    },

    /**
     * Find a profile by auth user ID
     * @param {string} authUserId - Auth user UUID
     * @returns {Promise<Object|null>} Profile or null
     */
    async findByAuthUserId(authUserId) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('auth_user_id', authUserId)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    /**
     * Find a profile with all related data (optimized query)
     * @param {string} authUserId - Auth user UUID
     * @returns {Promise<Object|null>} Full profile data or null
     */
    async findFullProfile(authUserId) {
        const { data, error } = await supabase
            .from('profiles')
            .select(`
                *,
                professional_profiles (*),
                social_profiles (*),
                profile_preferences (*),
                addresses (*)
            `)
            .eq('auth_user_id', authUserId)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    /**
     * Update a profile
     * @param {string} id - Profile UUID
     * @param {Object} updates - Fields to update
     * @returns {Promise<Object>} Updated profile
     */
    async update(id, updates) {
        const { data, error } = await supabase
            .from('profiles')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Update profile by auth user ID
     * @param {string} authUserId - Auth user UUID
     * @param {Object} updates - Fields to update
     * @returns {Promise<Object>} Updated profile
     */
    async updateByAuthUserId(authUserId, updates) {
        const { data, error } = await supabase
            .from('profiles')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('auth_user_id', authUserId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Upsert professional profile
     * @param {Object} data - Professional profile data
     * @returns {Promise<Object>} Upserted record
     */
    async upsertProfessionalProfile(data) {
        const { data: result, error } = await supabase
            .from('professional_profiles')
            .upsert(data, { onConflict: 'profile_id' })
            .select()
            .single();

        if (error) throw error;
        return result;
    },

    /**
     * Upsert social profile
     * @param {Object} data - Social profile data
     * @returns {Promise<Object>} Upserted record
     */
    async upsertSocialProfile(data) {
        const { data: result, error } = await supabase
            .from('social_profiles')
            .upsert(data, { onConflict: 'profile_id' })
            .select()
            .single();

        if (error) throw error;
        return result;
    },

    /**
     * Upsert profile preferences
     * @param {Object} data - Preferences data
     * @returns {Promise<Object>} Upserted record
     */
    async upsertPreferences(data) {
        const { data: result, error } = await supabase
            .from('profile_preferences')
            .upsert(data, { onConflict: 'profile_id' })
            .select()
            .single();

        if (error) throw error;
        return result;
    }
};

export default profileRepository;
