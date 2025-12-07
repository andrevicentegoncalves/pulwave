import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { profileService } from '../services';
import { upsertRecord } from '../services/supabaseUtils';

/**
 * useProfileSubmit Hook
 * Manages profile form submission including addresses, professional data, 
 * social profiles, preferences, and security settings.
 * 
 * Refactored to use profileService and parallel operations for better performance.
 * 
 * @param {object} options - Hook options
 * @param {object} options.user - Current user object
 * @param {object} options.profile - Current profile object
 * @param {function} options.onSuccess - Callback on successful save
 * @param {function} options.onError - Callback on error
 * @param {function} options.onProfileUpdate - Callback when profile is updated
 * @param {function} options.onThemeUpdate - Callback to update theme context
 * @returns {object} Submit state and handler
 */
export const useProfileSubmit = ({
    user,
    profile,
    onSuccess,
    onError,
    onProfileUpdate,
    onThemeUpdate,
}) => {
    const [loading, setLoading] = useState(false);

    /**
     * Upsert address (primary or billing)
     */
    const upsertAddress = async (addressData, existingAddressId, isPrimary = true) => {
        const {
            country_id,
            region_id,
            street_name,
            city_name,
            type,
            nominatim_data,
            ...restData
        } = addressData;

        // Skip if no city selected
        if (!city_name && isPrimary) {
            throw new Error('Please select a city from the dropdown for your primary address');
        }
        if (!city_name) return null;

        const payload = {
            ...restData,
            country_id: country_id || null,
            region_division_id: region_id || null,
            city_name,
            street_name,
            address_type: type || (isPrimary ? 'home' : 'billing'),
            nominatim_data: nominatim_data || null,
            organization_id: profile?.organization_id || null,
            is_primary: isPrimary,
        };

        if (existingAddressId) {
            const { error } = await supabase
                .from('addresses')
                .update({ ...payload, updated_at: new Date().toISOString() })
                .eq('id', existingAddressId);
            if (error) throw error;
            return existingAddressId;
        } else {
            const { data: newAddress, error } = await supabase
                .from('addresses')
                .insert([{ ...payload, created_at: new Date().toISOString() }])
                .select()
                .single();
            if (error) throw error;
            return newAddress.id;
        }
    };

    /**
     * Submit all profile data
     */
    const handleSubmit = async (formData, addressData, billingAddressData) => {
        setLoading(true);

        try {
            // Get organization ID for related records
            const organizationId = await profileService.getOrganizationId(profile.id);

            // === PARALLEL OPERATION 1: Addresses ===
            const [addressId, billingAddressId] = await Promise.all([
                upsertAddress(addressData, profile?.address_id, true),
                upsertAddress(billingAddressData, profile?.billing_address_id, false),
            ]);

            // === Build profile payload ===
            const profilePayload = {
                username: formData.username,
                first_name: formData.first_name,
                middle_name: formData.middle_name,
                last_name: formData.last_name,
                display_name: formData.display_name,
                date_of_birth: formData.date_of_birth || null,
                gender: formData.gender || null,
                pronouns: formData.pronouns || null,
                bio: formData.bio || null,
                phone_code: formData.phone_code || null,
                phone_number: formData.phone_number || null,
                phone_secondary_code: formData.phone_secondary_code || null,
                phone_secondary_number: formData.phone_secondary_number || null,
                address_id: addressId,
                billing_address_id: billingAddressId,
                // Security fields
                two_factor_enabled: formData.two_factor_enabled,
                emergency_contact_name: formData.emergency_contact_name,
                emergency_contact_phone: formData.emergency_contact_phone,
                emergency_contact_relationship: formData.emergency_contact_relationship,
            };

            // === PARALLEL OPERATION 2: Profile + Related Data ===
            if (organizationId) {
                const professionalPayload = {
                    organization_id: organizationId,
                    user_type: formData.user_type || null,
                    company_name: formData.company_name || null,
                    tax_id: formData.tax_id || formData.vat_id || null,
                    business_registration_number: formData.business_registration_number || null,
                    job_title: formData.job_title || null,
                    department: formData.department || null,
                    license_number: formData.license_number || null,
                    license_state: formData.license_state || null,
                    license_expiry: formData.license_expiry || null,
                    updated_by: profile.id,
                };

                const preferencesPayload = {
                    organization_id: organizationId,
                    theme: formData.theme,
                    timezone: formData.timezone,
                    locale: formData.locale,
                    profile_visibility: formData.profile_visibility,
                    notifications_enabled: formData.notifications_enabled,
                    email_notifications: formData.email_notifications,
                    sms_notifications: formData.sms_notifications,
                    push_notifications: formData.push_notifications,
                    marketing_emails: formData.marketing_emails,
                    data_processing_consent: formData.data_processing_consent,
                    marketing_consent: formData.marketing_consent,
                    updated_by: profile.id,
                };

                const socialData = {
                    website: formData.website,
                    linkedin_url: formData.linkedin_url,
                    twitter_url: formData.twitter_url,
                    facebook_url: formData.facebook_url,
                };

                // Execute all updates in parallel
                await Promise.all([
                    // Update core profile
                    supabase
                        .from('profiles')
                        .update({ ...profilePayload, updated_at: new Date().toISOString() })
                        .eq('auth_user_id', user.id),
                    // Professional profile
                    profileService.upsertProfessionalProfile(profile.id, professionalPayload),
                    // Preferences
                    profileService.upsertPreferences(profile.id, preferencesPayload, organizationId),
                    // Social profiles (already parallelized internally)
                    profileService.upsertSocialProfiles(profile.id, socialData, organizationId),
                ]);
            } else {
                // No organization - just update profile
                await supabase
                    .from('profiles')
                    .update({ ...profilePayload, updated_at: new Date().toISOString() })
                    .eq('auth_user_id', user.id);
            }

            // Refresh profile data
            const updatedProfile = await profileService.getFullProfile(user.id);
            onProfileUpdate?.(updatedProfile);

            // Update theme context if theme changed
            if (formData.theme) {
                onThemeUpdate?.(formData.theme);
            }

            onSuccess?.('Settings saved successfully');
        } catch (err) {
            console.error('Profile submit error:', err);
            onError?.(err.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        handleSubmit,
    };
};

export default useProfileSubmit;
