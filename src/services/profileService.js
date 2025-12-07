/**
 * Profile Service
 * Centralized data access layer for profile-related operations
 */
import { supabase } from '../lib/supabaseClient';
import { upsertRecord, deleteIfExists } from './supabaseUtils';

export const profileService = {
    /**
     * Get profile by user ID
     */
    async getById(userId) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Get profile by Auth User ID
     */
    async getByAuthId(authUserId) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('auth_user_id', authUserId)
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Get full profile with all related data using relational query
     * This reduces 8+ sequential API calls to a single query
     * 
     * @param {string} authUserId - The auth user ID
     * @returns {Object} Profile with related data
     */
    async getFullProfile(authUserId) {
        const { data, error } = await supabase
            .from('profiles')
            .select(`
                *,
                professional_profiles (*),
                social_profiles (*),
                profile_preferences (*),
                primary_address:addresses!profiles_address_id_fkey (*),
                billing_address:addresses!profiles_billing_address_id_fkey (*)
            `)
            .eq('auth_user_id', authUserId)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    /**
     * Get onboarding status for a profile
     */
    async getOnboardingStatus(profileId) {
        const { data, error } = await supabase
            .from('user_onboarding')
            .select('completed')
            .eq('profile_id', profileId)
            .maybeSingle();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    /**
     * Update profile
     */
    async update(userId, updates) {
        const { data, error } = await supabase
            .from('profiles')
            .update({
                ...updates,
                updated_at: new Date().toISOString(),
            })
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Get professional profile
     */
    async getProfessionalProfile(profileId) {
        const { data, error } = await supabase
            .from('professional_profiles')
            .select('*')
            .eq('profile_id', profileId)
            .maybeSingle();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    /**
     * Upsert professional profile using supabaseUtils
     */
    async upsertProfessionalProfile(profileId, data) {
        const result = await upsertRecord(
            'professional_profiles',
            { profile_id: profileId },
            data
        );
        if (result.error) throw result.error;
        return result.data;
    },

    /**
     * Get social profiles
     */
    async getSocialProfiles(profileId) {
        const { data, error } = await supabase
            .from('social_profiles')
            .select('*')
            .eq('profile_id', profileId);

        if (error) throw error;
        return data || [];
    },

    /**
     * Upsert social profile using supabaseUtils
     */
    async upsertSocialProfile(profileId, platform, profileUrl, organizationId = null) {
        if (!profileUrl) {
            // Delete if URL is empty
            await deleteIfExists('social_profiles', {
                profile_id: profileId,
                platform: platform
            });
            return null;
        }

        const result = await upsertRecord(
            'social_profiles',
            { profile_id: profileId, platform: platform },
            {
                profile_url: profileUrl,
                organization_id: organizationId,
                is_public: true,
                show_on_profile: true,
                is_active: true,
            }
        );
        if (result.error) throw result.error;
        return result.data;
    },

    /**
     * Upsert multiple social profiles in parallel
     */
    async upsertSocialProfiles(profileId, socialData, organizationId = null) {
        const platforms = [
            { platform: 'website', url: socialData.website },
            { platform: 'linkedin', url: socialData.linkedin_url },
            { platform: 'twitter', url: socialData.twitter_url },
            { platform: 'facebook', url: socialData.facebook_url },
        ];

        await Promise.all(
            platforms.map(({ platform, url }) =>
                this.upsertSocialProfile(profileId, platform, url, organizationId)
            )
        );
    },

    /**
     * Get user preferences
     */
    async getPreferences(profileId) {
        const { data, error } = await supabase
            .from('profile_preferences')
            .select('*')
            .eq('profile_id', profileId)
            .maybeSingle();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    /**
     * Upsert preferences using supabaseUtils
     */
    async upsertPreferences(profileId, preferences, organizationId = null) {
        const result = await upsertRecord(
            'profile_preferences',
            { profile_id: profileId },
            { ...preferences, organization_id: organizationId }
        );
        if (result.error) throw result.error;
        return result.data;
    },

    /**
     * Get organization ID for a profile
     */
    async getOrganizationId(profileId) {
        const { data, error } = await supabase
            .from('organization_members')
            .select('organization_id')
            .eq('profile_id', profileId)
            .eq('is_primary', true)
            .maybeSingle();

        if (error && error.code !== 'PGRST116') throw error;
        return data?.organization_id || null;
    },
};

export default profileService;
