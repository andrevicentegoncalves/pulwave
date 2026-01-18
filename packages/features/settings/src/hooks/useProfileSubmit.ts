/**
 * useProfileSubmit Hook
 *
 * Manages profile form submission including addresses, professional data,
 * social profiles, preferences, and security settings.
 *
 * @package @pulwave/experience-settings
 */
import { useState, useCallback } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { profileService, contactService } from '@pulwave/entity-profile';
import type { PersonalFormData } from '@pulwave/entity-profile';
import type { ProfessionalFormData } from '@pulwave/entity-profile';
import type { SecurityFormData } from '@pulwave/entity-profile';
import type { PrivacyFormData } from '@pulwave/entity-profile';
import type { SettingsFormData } from '@pulwave/entity-profile';
import type { AddressFormData as AddressData } from '@pulwave/entity-profile';
import type { FullProfile, Profile, ProfileAuthState, ProfessionalProfile } from '@pulwave/entity-profile';
import type { User } from '@pulwave/entity-auth';
import type { Address } from '@pulwave/entity-address';

interface LocationHierarchyIds {
    regionId?: string;
    municipalityId?: string;
    localityId?: string;
    parishId?: string;
}

export interface UseProfileSubmitOptions {
    user: User | null;
    profile: FullProfile | null;
    onSuccess?: (message: string) => void;
    onError?: (message: string) => void;
    onProfileUpdate?: Dispatch<SetStateAction<FullProfile | null>>;
    onThemeUpdate?: (theme: string) => void;
}

export interface UseProfileSubmitReturn {
    loading: boolean;
    handleSubmit: (
        personalData: PersonalFormData,
        professionalData: ProfessionalFormData,
        securityData: SecurityFormData,
        privacyData: PrivacyFormData,
        settingsData: SettingsFormData,
        addressData: AddressData,
        billingAddressData: AddressData
    ) => Promise<void>;
}

/**
 * useProfileSubmit Hook
 * Handles profile form submission with parallel operations
 */
export const useProfileSubmit = ({
    user,
    profile,
    onSuccess,
    onError,
    onProfileUpdate,
    onThemeUpdate,
}: UseProfileSubmitOptions): UseProfileSubmitReturn => {
    const [loading, setLoading] = useState(false);

    /**
     * Upsert address (primary or billing)
     */
    const upsertAddress = useCallback(async (
        addressData: AddressData,
        existingAddressId: string | null,
        isPrimary = true
    ): Promise<string | null> => {
        const {
            country_id,
            region_division_id: region_id,
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
        const hierarchyIds: LocationHierarchyIds = {};
        /* if (nominatim_data && country_id) {
            try {
                hierarchyIds = await masterDataService.ensureLocationHierarchy(nominatim_data, country_id);
            } catch (err) {
                console.error('Error ensuring hierarchy:', err);
            }
        } */

        // Build typed address payload matching Partial<Address>
        const payload: Partial<Address> = {
            profile_id: profile?.id || '',
            country_id: country_id || undefined,
            region_division_id: hierarchyIds.regionId || region_id || undefined,
            city_name,
            street_name,
            number: restData.number,
            floor: restData.floor,
            postal_code: restData.postal_code,
            address_type: type || (isPrimary ? 'home' : 'billing'),
        };

        if (!profile?.id) {
            throw new Error('Profile ID is required to save address');
        }

        const result = await profileService.updateAddress(
            profile.id,
            isPrimary ? 'primary' : 'billing',
            payload
        );
        return result.id;
    }, [profile]);

    /**
     * Submit all profile data
     */
    const handleSubmit = useCallback(async (
        personalData: PersonalFormData,
        professionalData: ProfessionalFormData,
        securityData: SecurityFormData,
        privacyData: PrivacyFormData,
        settingsData: SettingsFormData,
        addressData: AddressData,
        billingAddressData: AddressData
    ) => {
        setLoading(true);

        try {
            if (!profile?.id) {
                throw new Error('Profile data not loaded. Please refresh the page.');
            }

            // Get organization ID
            const organizationId = await profileService.getOrganizationId(profile.id);

            // Parallel operation: Addresses
            const [addressId, billingAddressId] = await Promise.all([
                upsertAddress(addressData, profile?.primary_address_id ?? null, true),
                upsertAddress(billingAddressData, profile?.billing_address_id ?? null, false),
            ]);

            // Build profile payload
            const profilePayload: Partial<Profile> = {
                username: personalData.username,
                first_name: personalData.first_name,
                middle_name: personalData.middle_name,
                last_name: personalData.last_name,
                display_name: personalData.display_name,
                date_of_birth: personalData.date_of_birth || null,
                gender: personalData.gender || null,
                pronouns: personalData.pronouns || null,
                bio: personalData.bio || null,
                primary_address_id: addressId,
                billing_address_id: billingAddressId,
            };

            if (organizationId) {
                const profPayload = {
                    organization_id: organizationId,
                    user_type: professionalData.user_type || null,
                    company_name: professionalData.company_name || null,
                    tax_id: professionalData.tax_id || null,
                    business_registration_number: professionalData.business_registration_number || null,
                    job_title: professionalData.job_title || null,
                    department: professionalData.department || null,
                    license_number: professionalData.license_number || null,
                    license_state: professionalData.license_state || null,
                    license_expiry: professionalData.license_expiry || null,
                    updated_by: profile.id,
                };

                const preferencesPayload = {
                    organization_id: organizationId,
                    theme: settingsData.theme,
                    ui_layout: settingsData.ui_layout,
                    timezone: settingsData.timezone,
                    locale: settingsData.locale,
                    profile_visibility: privacyData.profile_visibility,
                    notifications_enabled: settingsData.notifications_enabled,
                    email_notifications: settingsData.email_notifications,
                    sms_notifications: settingsData.sms_notifications,
                    push_notifications: settingsData.push_notifications,
                    marketing_emails: settingsData.marketing_emails,
                    data_processing_consent: privacyData.data_processing_consent,
                    marketing_consent: privacyData.marketing_consent,
                    updated_by: profile.id,
                };

                const socialData = {
                    website: personalData.website,
                    linkedin_url: personalData.linkedin_url,
                    twitter_url: personalData.twitter_url,
                    facebook_url: personalData.facebook_url,
                };

                // Execute all updates in parallel
                const profileUpdate: Partial<Profile> = {
                    ...profilePayload,
                    updated_at: new Date().toISOString()
                };

                const authStateUpdate: Partial<ProfileAuthState> = {
                    mfa_enabled: securityData.mfa_enabled ?? false
                };

                const professionalUpdate: Partial<ProfessionalProfile> = {
                    user_type: profPayload.user_type ?? undefined,
                    company_name: profPayload.company_name ?? undefined,
                    tax_id: profPayload.tax_id ?? undefined,
                    business_registration_number: profPayload.business_registration_number ?? undefined,
                    job_title: profPayload.job_title ?? undefined,
                    department: profPayload.department ?? undefined,
                    license_number: profPayload.license_number ?? undefined,
                    license_state: profPayload.license_state ?? undefined,
                    license_expiry: profPayload.license_expiry ?? undefined,
                };

                await Promise.all([
                    profileService.update(profile.id, profileUpdate),
                    profileService.upsertAuthState(profile.id, authStateUpdate),
                    profileService.upsertProfessionalProfile(profile.id, professionalUpdate),
                    profileService.upsertPreferences(profile.id, preferencesPayload, organizationId),
                    profileService.upsertSocialProfiles(profile.id, socialData, organizationId),
                    personalData.phone_number ? contactService.upsertContact(
                        profile.id, organizationId, 'phone-primary',
                        { phone: personalData.phone_number, phone_country_code: personalData.phone_code }
                    ) : Promise.resolve(),
                    personalData.phone_secondary_number ? contactService.upsertContact(
                        profile.id, organizationId, 'phone-secondary',
                        { phone: personalData.phone_secondary_number, phone_country_code: personalData.phone_secondary_code }
                    ) : Promise.resolve(),
                    securityData.emergency_contact_phone ? contactService.upsertContact(
                        profile.id, organizationId, 'phone-emergency',
                        {
                            phone: securityData.emergency_contact_phone,
                            contact_name: securityData.emergency_contact_name,
                            relationship: securityData.emergency_contact_relationship
                        }
                    ) : Promise.resolve(),
                ]);
            } else {
                // No organization - just update profile
                await profileService.update(profile.id, { ...profilePayload, updated_at: new Date().toISOString() });
            }

            // Update local state via callback
            if (onProfileUpdate) {
                onProfileUpdate((prev: FullProfile | null) => prev ? { ...prev, ...profilePayload } : null);
            }
            if (onThemeUpdate && settingsData.theme) {
                onThemeUpdate(settingsData.theme);
            }

            onSuccess?.('Profile updated successfully');
        } catch (error: unknown) {
            // Error reported via callback
            const message = error instanceof Error ? error.message : 'Failed to update profile';
            onError?.(message);
        } finally {
            setLoading(false);
        }
    }, [user, profile, upsertAddress, onSuccess, onError, onProfileUpdate, onThemeUpdate]);

    return { loading, handleSubmit };
};

export default useProfileSubmit;
