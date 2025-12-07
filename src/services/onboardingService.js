import { supabase } from '../lib/supabaseClient';

export const onboardingService = {
    /**
     * Get or create onboarding record for a profile
     */
    async getProgress(profileId) {
        const { data, error } = await supabase
            .from('user_onboarding')
            .select('current_step, completed')
            .eq('profile_id', profileId)
            .maybeSingle();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    /**
     * Update onboarding progress
     */
    async updateProgress(profileId, currentStep, totalSteps) {
        // Check if record exists
        const { data: existing } = await supabase
            .from('user_onboarding')
            .select('id')
            .eq('profile_id', profileId)
            .maybeSingle();

        const payload = {
            profile_id: profileId,
            current_step: currentStep,
            total_steps: totalSteps,
            updated_at: new Date().toISOString()
        };

        if (existing) {
            await supabase.from('user_onboarding').update(payload).eq('id', existing.id);
        } else {
            await supabase.from('user_onboarding').insert([payload]);
        }
    },

    /**
     * Complete onboarding
     */
    async completeOnboarding(profileId, totalSteps) {
        const { data: existing } = await supabase
            .from('user_onboarding')
            .select('id')
            .eq('profile_id', profileId)
            .maybeSingle();

        const payload = {
            profile_id: profileId,
            completed: true,
            completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            current_step: totalSteps,
            total_steps: totalSteps
        };

        if (existing) {
            await supabase.from('user_onboarding').update(payload).eq('id', existing.id);
        } else {
            await supabase.from('user_onboarding').insert([payload]);
        }
    },

    /**
     * Save Personal Information Step
     */
    async savePersonalInfo(authUserId, data) {
        const { first_name, middle_name, last_name, phone, avatar_url } = data;

        const updates = {
            updated_at: new Date().toISOString(),
            first_name,
            middle_name,
            last_name,
            phone,
        };

        if (avatar_url) {
            updates.avatar_url = avatar_url;
        }

        const { error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('auth_user_id', authUserId);

        if (error) throw error;
    },

    /**
     * Save Professional Information Step
     */
    async saveProfessionalInfo(profile, data) {
        if (!profile.organization_id) return;

        const { company_name, vat_id } = data;

        // Only proceed if there is data to save
        if (!company_name && !vat_id) return;

        const { data: existing } = await supabase
            .from('professional_profiles')
            .select('id')
            .eq('profile_id', profile.id)
            .maybeSingle();

        const payload = {
            profile_id: profile.id,
            organization_id: profile.organization_id,
            company_name: company_name,
            tax_id: vat_id,
            updated_at: new Date().toISOString()
        };

        if (existing) {
            await supabase.from('professional_profiles').update(payload).eq('id', existing.id);
        } else {
            await supabase.from('professional_profiles').insert([payload]);
        }
    },

    /**
     * Save Address Step
     */
    async saveAddress(profile, data) {
        if (!data.country_id) return;

        const addressPayload = {
            country_id: data.country_id,
            region_id: data.region_id || null,
            city_name: data.city_name || '',
            street_name: data.street_name || '',
            number: data.number || '',
            floor: data.floor || '',
            postal_code: data.postal_code || '',
            address_type: data.type || 'home',
            nominatim_data: data.nominatim_data || null,
            organization_id: profile.organization_id || null,
            is_primary: true,
        };

        let addressId = null;

        // Logic: specific to Onboarding - likely we update the profile's main address
        // Check if profile already has an address linked (assuming profiles.address_id exists based on original code)
        if (profile.address_id) {
            const { error } = await supabase
                .from('addresses')
                .update(addressPayload)
                .eq('id', profile.address_id);

            if (error) throw error;
            addressId = profile.address_id;
        } else {
            const { data: newAddress, error } = await supabase
                .from('addresses')
                .insert([addressPayload])
                .select()
                .single();

            if (error) throw error;
            addressId = newAddress.id;
        }

        // Link back to profile if we created a new one
        if (addressId && !profile.address_id) {
            await supabase
                .from('profiles')
                .update({ address_id: addressId, updated_at: new Date().toISOString() })
                .eq('id', profile.id);
        }
    }
};
