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
     * Get full profile with all related data using parallel queries
     * This avoids PostgREST recursion depth issues and improves reliability
     */
    async getFullProfile(authUserId, userEmail) {
        // 1. Get base profile
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('auth_user_id', authUserId)
            .single();

        if (profileError) {
            if (profileError.code === 'PGRST116') {
                // Profile missing: Auto-create for existing authenticated users
                console.log('Profile missing, creating new profile for:', authUserId);
                const { data: newProfile, error: createError } = await supabase
                    .from('profiles')
                    .insert([{
                        auth_user_id: authUserId,
                        email: userEmail, // Use the passed email
                        first_name: '',
                        last_name: ''
                    }])
                    .select()
                    .single();

                if (createError) throw createError;
                profile = newProfile;
            } else {
                throw profileError;
            }
        }

        if (!profile) return null;

        // 2. Fetch all related data in parallel
        const [
            { data: professional },
            { data: social },
            { data: preferences },
            { data: primaryAddress },
            { data: billingAddress },
            { data: organizationMember },
            { data: contacts },
            { data: authState }
        ] = await Promise.all([
            // Professional Profile
            supabase
                .from('professional_profiles')
                .select('*')
                .eq('profile_id', profile.id)
                .maybeSingle(),

            // Social Profiles
            supabase
                .from('social_profiles')
                .select('*')
                .eq('profile_id', profile.id),

            // Preferences
            supabase
                .from('user_preferences')
                .select('*')
                .eq('profile_id', profile.id)
                .maybeSingle(),

            // Primary Address
            profile.address_id
                ? supabase.from('addresses').select('*').eq('id', profile.address_id).single()
                : Promise.resolve({ data: null }),

            // Billing Address
            profile.billing_address_id
                ? supabase.from('addresses').select('*').eq('id', profile.billing_address_id).single()
                : Promise.resolve({ data: null }),

            // Organization Member (for is_primary org)
            supabase
                .from('organization_members')
                .select('organization_id')
                .eq('profile_id', profile.id)
                .eq('is_primary', true)
                .maybeSingle(),

            // Contacts (phones, emergency contacts)
            supabase
                .from('contacts')
                .select('*')
                .eq('profile_id', profile.id)
                .eq('is_active', true),

            // Auth State (2FA, suspension, etc.)
            supabase
                .from('profile_auth_state')
                .select('*')
                .eq('profile_id', profile.id)
                .maybeSingle()
        ]);

        // 3. Assemble and return
        return {
            ...profile,
            professional_profiles: professional ? [professional] : [],
            social_profiles: social || [],
            user_preferences: preferences ? [preferences] : [],
            primary_address: primaryAddress,
            billing_address: billingAddress,
            organization_id: organizationMember?.organization_id || null,
            contacts: contacts || [],
            auth_state: authState || null
        };
    },

    /**
     * Get onboarding status
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
            .from('user_preferences')
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
            'user_preferences',
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

    // =========================================================================
    // GDPR DATA EXPORT (Article 15 - Right of Access)
    // =========================================================================

    /**
     * Export all user data for GDPR compliance
     * Calls the SQL function export_user_data
     * @param {string} profileId - Profile UUID
     * @returns {Promise<Object>} - Complete user data export
     */
    async exportUserData(profileId) {
        const { data, error } = await supabase
            .rpc('export_user_data', { p_profile_id: profileId });

        if (error) throw error;
        return data;
    },

    /**
     * Export user data as JSON string (downloadable)
     * @param {string} profileId - Profile UUID
     * @returns {Promise<string>} - JSON string
     */
    async exportAsJson(profileId) {
        const data = await this.exportUserData(profileId);
        return JSON.stringify(data, null, 2);
    },

    /**
     * Export user data as CSV (flattened)
     * @param {string} profileId - Profile UUID
     * @returns {Promise<string>} - CSV string
     */
    async exportAsCsv(profileId) {
        const data = await this.exportUserData(profileId);
        const rows = [];

        // Flatten profile data
        const profile = data.data?.profile || {};
        rows.push(['Section', 'Field', 'Value']);

        Object.entries(profile).forEach(([key, value]) => {
            if (typeof value !== 'object') {
                rows.push(['Profile', key, value ?? '']);
            }
        });

        // Flatten preferences
        const prefs = data.data?.preferences?.[0] || {};
        Object.entries(prefs).forEach(([key, value]) => {
            if (typeof value !== 'object') {
                rows.push(['Preferences', key, value ?? '']);
            }
        });

        // Flatten contacts
        (data.data?.contacts || []).forEach((contact, i) => {
            Object.entries(contact).forEach(([key, value]) => {
                if (typeof value !== 'object') {
                    rows.push([`Contact ${i + 1}`, key, value ?? '']);
                }
            });
        });

        // Flatten addresses
        (data.data?.addresses || []).forEach((addr, i) => {
            Object.entries(addr).forEach(([key, value]) => {
                if (typeof value !== 'object') {
                    rows.push([`Address ${i + 1}`, key, value ?? '']);
                }
            });
        });

        // Convert to CSV
        return rows.map(row =>
            row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
        ).join('\n');
    },
};

export default profileService;

