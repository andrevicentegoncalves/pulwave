/**
 * Organization Service
 * 
 * Handles organization-related operations.
 */
import { supabase } from '../lib/supabaseClient';

export const organizationService = {
    /**
     * Get all organizations the current user is a member of
     * @param {string} userId - The user's profile ID
     * @returns {Promise<Array>} List of organizations
     */
    async getUserOrganizations(userId) {
        if (!userId) return [];

        try {
            const { data: memberships, error } = await supabase
                .from('organization_members')
                .select(`
          organization_id,
          organizations (
            id,
            name,
            logo_url
          )
        `)
                .eq('profile_id', userId)
                .eq('is_active', true);

            if (error) throw error;

            return memberships?.map(m => m.organizations) || [];
        } catch (error) {
            console.error('OrganizationService: Error fetching user organizations:', error);
            return [];
        }
    },

    /**
     * Get a single organization by ID
     * @param {string} orgId 
     */
    async getOrganizationById(orgId) {
        try {
            const { data, error } = await supabase
                .from('organizations')
                .select('*')
                .eq('id', orgId)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('OrganizationService: Error fetching organization:', error);
            return null;
        }
    }
};

export default organizationService;
