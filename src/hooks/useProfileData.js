import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { profileService, contactService } from '../services';

/**
 * useProfileData Hook
 * Manages fetching and state for profile, professional, social, and preferences data.
 * 
 * Refactored to use profileService.getFullProfile() for a single efficient query
 * instead of 8+ sequential API calls.
 * 
 * @param {object} options - Hook options
 * @param {function} options.onRedirect - Callback for navigation (e.g., to onboarding)
 * @returns {object} Profile data, loading state, and related utilities
 */
export const useProfileData = ({ onRedirect } = {}) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [isFetching, setIsFetching] = useState(true);
    const [displayNameManuallyEdited, setDisplayNameManuallyEdited] = useState(false);

    // Profile Form State
    const [formData, setFormData] = useState({
        username: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        display_name: '',
        email: '',
        phone_code: '',
        phone_number: '',
        phone_secondary_code: '',
        phone_secondary_number: '',
        date_of_birth: '',
        gender: '',
        pronouns: '',
        bio: '',
        // Social links
        website: '',
        linkedin_url: '',
        twitter_url: '',
        facebook_url: '',
        // Professional
        user_type: '',
        company_name: '',
        vat_id: '',
        tax_id: '',
        business_registration_number: '',
        job_title: '',
        department: '',
        license_number: '',
        license_state: '',
        license_expiry: '',
        theme: 'light',
        ui_layout: { style: 'pulwave' },
        // Preferences
        timezone: 'UTC',
        locale: 'en-US',
        profile_visibility: 'private',
        // Notification preferences
        notifications_enabled: false,
        email_notifications: false,
        sms_notifications: false,
        push_notifications: false,
        marketing_emails: false,
        // Privacy preferences
        data_processing_consent: false,
        marketing_consent: false,
        // Security - Emergency Contact
        two_factor_enabled: false,
        emergency_contact_name: '',
        emergency_contact_phone: '',
        emergency_contact_relationship: '',
    });

    // Address Form State
    const [addressData, setAddressData] = useState({
        country_id: '',
        region_id: '',
        city_name: '',
        street_name: '',
        number: '',
        floor: '',
        postal_code: '',
        type: 'home',
    });

    const [billingAddressData, setBillingAddressData] = useState({
        country_id: '',
        region_id: '',
        city_name: '',
        street_name: '',
        number: '',
        floor: '',
        postal_code: '',
        type: 'billing',
    });

    // Security Form State
    const [securityData, setSecurityData] = useState({
        current_password: '',
        new_password: '',
        confirm_password: '',
    });

    /**
     * Map social profiles array to form data object
     */
    const mapSocialProfilesToFormData = (socialProfiles) => {
        const socialData = {
            website: '',
            linkedin_url: '',
            twitter_url: '',
            facebook_url: '',
        };

        if (socialProfiles) {
            socialProfiles.forEach(social => {
                if (social.platform === 'website') socialData.website = social.profile_url || '';
                if (social.platform === 'linkedin') socialData.linkedin_url = social.profile_url || '';
                if (social.platform === 'twitter') socialData.twitter_url = social.profile_url || '';
                if (social.platform === 'facebook') socialData.facebook_url = social.profile_url || '';
            });
        }

        return socialData;
    };

    /**
     * Map address data from database to form state
     */
    const mapAddressToFormData = (address, type = 'home') => {
        if (!address) return null;

        return {
            country_id: address.country_id || '',
            region_id: address.region_division_id || address.region_id || '',
            city_name: address.city_name || '',
            street_name: address.street_name || '',
            number: address.number || '',
            floor: address.floor || '',
            postal_code: address.postal_code || '',
            type: address.address_type || type,
        };
    };

    // Fetch User & Profile Data (using relational query)
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setIsFetching(true);
                const { data: { user } } = await supabase.auth.getUser();
                setUser(user);

                if (user) {
                    // Use profileService for optimized single-query fetching
                    const fullProfile = await profileService.getFullProfile(user.id, user.email);


                    if (!fullProfile) {
                        setIsFetching(false);
                        return;
                    }

                    setProfile(fullProfile);

                    // Feature flag to skip onboarding (set to true to disable)
                    const SKIP_ONBOARDING = true;

                    // Check onboarding status (if not skipped)
                    if (!SKIP_ONBOARDING) {
                        const onboardingData = await profileService.getOnboardingStatus(fullProfile.id);
                        if (!onboardingData || !onboardingData.completed) {
                            onRedirect?.('/onboarding', { replace: true });
                            return;
                        }
                    }


                    // Extract related data from relational query
                    const professionalData = fullProfile.professional_profiles?.[0] || null;
                    const preferencesData = fullProfile.user_preferences?.[0] || null;
                    const socialProfiles = fullProfile.social_profiles || [];
                    const primaryAddress = fullProfile.primary_address || null;
                    const billingAddress = fullProfile.billing_address || null;
                    const contacts = fullProfile.contacts || [];
                    const authStateData = fullProfile.auth_state || null;

                    // Map contacts to form data fields
                    const contactFormData = contactService.mapToFormData(contacts);

                    // Map social profiles
                    const socialData = mapSocialProfilesToFormData(socialProfiles);

                    // Check if display name is manually edited
                    const autoGeneratedName = `${fullProfile.first_name || ''} ${fullProfile.last_name || ''}`.trim();
                    const isCustom = fullProfile.display_name && fullProfile.display_name !== autoGeneratedName;
                    setDisplayNameManuallyEdited(!!isCustom);

                    // Merge data from all tables
                    setFormData({
                        // Core profile fields
                        username: fullProfile.username || '',
                        first_name: fullProfile.first_name || '',
                        middle_name: fullProfile.middle_name || '',
                        last_name: fullProfile.last_name || '',
                        display_name: fullProfile.display_name || '',
                        email: user.email || '',
                        date_of_birth: fullProfile.date_of_birth || '',
                        gender: fullProfile.gender || '',
                        pronouns: fullProfile.pronouns || '',
                        bio: fullProfile.bio || '',
                        // Social links
                        ...socialData,
                        // Professional profile fields
                        user_type: professionalData?.user_type || '',
                        company_name: professionalData?.company_name || '',
                        vat_id: professionalData?.tax_id || '',
                        tax_id: professionalData?.tax_id || '',
                        business_registration_number: professionalData?.business_registration_number || '',
                        job_title: professionalData?.job_title || '',
                        department: professionalData?.department || '',
                        license_number: professionalData?.license_number || '',
                        license_state: professionalData?.license_state || '',
                        license_expiry: professionalData?.license_expiry || '',
                        // Preferences
                        theme: preferencesData?.theme || 'light',
                        ui_layout: preferencesData?.ui_layout || { style: 'pulwave' },
                        timezone: preferencesData?.timezone || 'UTC',
                        locale: preferencesData?.locale || 'en-US',
                        profile_visibility: preferencesData?.profile_visibility || 'private',
                        // Notification preferences
                        notifications_enabled: preferencesData?.notifications_enabled ?? false,
                        email_notifications: preferencesData?.email_notifications ?? false,
                        sms_notifications: preferencesData?.sms_notifications ?? false,
                        push_notifications: preferencesData?.push_notifications ?? false,
                        marketing_emails: preferencesData?.marketing_emails ?? false,
                        // Privacy preferences
                        data_processing_consent: preferencesData?.data_processing_consent ?? false,
                        marketing_consent: preferencesData?.marketing_consent ?? false,
                        // Phone fields - now from contacts table
                        phone_code: contactFormData.phone_code,
                        phone_number: contactFormData.phone_number,
                        phone_secondary_code: contactFormData.phone_secondary_code,
                        phone_secondary_number: contactFormData.phone_secondary_number,
                        // Security - now from profile_auth_state table
                        two_factor_enabled: authStateData?.two_factor_enabled ?? false,
                        // Emergency Contact - from contacts table
                        emergency_contact_name: contactFormData.emergency_contact_name,
                        emergency_contact_phone: contactFormData.emergency_contact_phone,
                        emergency_contact_relationship: contactFormData.emergency_contact_relationship,
                    });

                    // Set address data from relational query results
                    const mappedPrimaryAddress = mapAddressToFormData(primaryAddress, 'home');
                    if (mappedPrimaryAddress) {
                        setAddressData(mappedPrimaryAddress);
                    }

                    const mappedBillingAddress = mapAddressToFormData(billingAddress, 'billing');
                    if (mappedBillingAddress) {
                        setBillingAddressData(mappedBillingAddress);
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setIsFetching(false);
            }
        };

        fetchUserData();
    }, [onRedirect]);

    // Form handlers
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'display_name') {
            setDisplayNameManuallyEdited(true);
        }

        setFormData(prev => {
            const newData = { ...prev, [name]: value };

            // Auto-populate display name if not manually edited
            if ((name === 'first_name' || name === 'last_name') && !displayNameManuallyEdited) {
                const firstName = name === 'first_name' ? value : prev.first_name;
                const lastName = name === 'last_name' ? value : prev.last_name;
                newData.display_name = `${firstName || ''} ${lastName || ''}`.trim();
            }

            return newData;
        });
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleSecurityChange = (e) => {
        const { name, value } = e.target;
        setSecurityData(prev => ({ ...prev, [name]: value }));
    };

    // Refresh profile data using service
    const refreshProfile = async () => {
        if (!user) return;

        try {
            const updatedProfile = await profileService.getFullProfile(user.id, user.email);
            setProfile(updatedProfile);
        } catch (error) {
            console.error('Error refreshing profile:', error);
        }
    };

    return {
        // State
        user,
        profile,
        formData,
        addressData,
        billingAddressData,
        securityData,
        isFetching,
        displayNameManuallyEdited,

        // Setters
        setProfile,
        setFormData,
        setAddressData,
        setBillingAddressData,
        setSecurityData,

        // Handlers
        handleChange,
        handleSelectChange,
        handleCheckboxChange,
        handleSecurityChange,

        // Actions
        refreshProfile,
    };
};

export default useProfileData;
