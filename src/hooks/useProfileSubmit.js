import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { profileService, addressService, masterDataService, contactService } from '../services';
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

        // Auto-create/find master data hierarchy if nominatim data is present
        let hierarchyIds = {};
        if (nominatim_data && country_id) {
            try {
                // Import dynamically to avoid circular dependencies if any, or plain import
                // Since this is a hook, direct import at top is fine.
                // Assuming masterDataService is imported at top
                hierarchyIds = await masterDataService.ensureLocationHierarchy(nominatim_data, country_id);
                console.log('Hierarchy resolved:', hierarchyIds);
            } catch (err) {
                console.error('Error ensuring hierarchy:', err);
                // Continue saving address even if hierarchy fails, but with nulls
            }
        }

        const payload = {
            ...restData,
            profile_id: profile?.id || null,
            country_id: country_id || null,
            region_division_id: hierarchyIds.regionId || region_id || null,
            municipality_division_id: hierarchyIds.municipalityId || null,
            locality_id: hierarchyIds.localityId || null,
            parish_division_id: hierarchyIds.parishId || null,
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
            if (!newAddress) throw new Error('Failed to create address record. Please try again.');
            return newAddress.id;
        }
    };

    /**
     * Submit all profile data
     */
    const handleSubmit = async (formData, addressData, billingAddressData) => {
        setLoading(true);

        try {
            if (!profile?.id) {
                throw new Error('Profile data not loaded. Please refresh the page.');
            }

            // Get organization ID for related records
            const organizationId = await profileService.getOrganizationId(profile.id);

            // === PARALLEL OPERATION 1: Addresses ===
            const [addressId, billingAddressId] = await Promise.all([
                upsertAddress(addressData, profile?.address_id, true),
                upsertAddress(billingAddressData, profile?.billing_address_id, false),
            ]);

            // === Build profile payload (phone/emergency moved to contacts table) ===
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
                address_id: addressId,
                billing_address_id: billingAddressId,
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
                    ui_layout: formData.ui_layout,
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
                    // Auth state (2FA, etc.) - goes to profile_auth_state table
                    upsertRecord(
                        'profile_auth_state',
                        { profile_id: profile.id },
                        { two_factor_enabled: formData.two_factor_enabled ?? false }
                    ),
                    // Professional profile
                    profileService.upsertProfessionalProfile(profile.id, professionalPayload),
                    // Preferences
                    profileService.upsertPreferences(profile.id, preferencesPayload, organizationId),
                    // Social profiles (already parallelized internally)
                    profileService.upsertSocialProfiles(profile.id, socialData, organizationId),
                    // Contacts: Primary phone
                    formData.phone_number ? contactService.upsertContact(
                        profile.id, organizationId, 'phone-primary',
                        { phone: formData.phone_number, phone_country_code: formData.phone_code }
                    ) : Promise.resolve(),
                    // Contacts: Secondary phone
                    formData.phone_secondary_number ? contactService.upsertContact(
                        profile.id, organizationId, 'phone-secondary',
                        { phone: formData.phone_secondary_number, phone_country_code: formData.phone_secondary_code }
                    ) : Promise.resolve(),
                    // Contacts: Emergency contact
                    formData.emergency_contact_phone ? contactService.upsertContact(
                        profile.id, organizationId, 'phone-emergency',
                        {
                            phone: formData.emergency_contact_phone,
                            contact_name: formData.emergency_contact_name,
                            relationship: formData.emergency_contact_relationship
                        }
                    ) : Promise.resolve(),
                ]);
            } else {
                // No organization - just update profile
                await supabase
                    .from('profiles')
                    .update({ ...profilePayload, updated_at: new Date().toISOString() })
                    .eq('auth_user_id', user.id);
            }

            // Update local state via callback
            if (onProfileUpdate) {
                onProfileUpdate(prev => ({ ...prev, ...profilePayload }));
            }
            if (onThemeUpdate && formData.theme) {
                onThemeUpdate(formData.theme);
            }

            onSuccess?.('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            onError?.(error.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return { loading, handleSubmit };
};

export default useProfileSubmit;
