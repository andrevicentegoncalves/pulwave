import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { profileService, onboardingService, addressService, masterDataService } from '../services';
import { useAuth } from '../contexts/AuthContext';
import { ONBOARDING_STEPS, ACCOUNT_TYPES } from '../constants/onboardingConstants';
import { User, Briefcase, Building, MapPin, Camera } from '../components/ui';

export const useOnboardingForm = (navigate) => {
    const { user } = useAuth();
    const [currentStep, setCurrentStep] = useState(0);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState(null);

    // Form data
    const [formData, setFormData] = useState({
        first_name: '',
        middle_name: '',
        last_name: '',
        phone: '',
        phone_code: '',
        account_type: ACCOUNT_TYPES.INDIVIDUAL,
        company_name: '',
        vat_id: '',
        country_id: '',
        region_id: '',
        city_id: '',
        city_name: '',
        street_name: '',
        number: '',
        floor: '',
        postal_code: '',
        type: 'home',
    });

    const [steps, setSteps] = useState([]);

    // Fetch profile on mount
    useEffect(() => {
        if (!user) return;

        const fetchProfile = async () => {
            try {
                const data = await profileService.getFullProfile(user.id, user.email);
                if (data) {
                    setProfile(data);
                    setFormData(prev => ({
                        ...prev,
                        first_name: data.first_name || '',
                        last_name: data.last_name || '',
                        phone: data.phone_number || '',
                        phone_code: data.phone_code || '',
                        avatar_url: data.avatar_url
                    }));
                    if (data.avatar_url) setAvatarUrl(data.avatar_url);
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
                setError('Failed to load profile');
            }
        };

        fetchProfile();
    }, [user]);

    // Update steps when account type changes
    useEffect(() => {
        const baseSteps = [
            { title: ONBOARDING_STEPS.PERSONAL_INFO, icon: User },
            { title: ONBOARDING_STEPS.PROFESSIONAL, icon: Briefcase },
        ];

        if (formData.account_type === ACCOUNT_TYPES.COMPANY) {
            baseSteps.push({ title: ONBOARDING_STEPS.COMPANY_DETAILS, icon: Building });
        }

        baseSteps.push(
            { title: ONBOARDING_STEPS.ADDRESS, icon: MapPin },
            { title: ONBOARDING_STEPS.PROFILE_PICTURE, icon: Camera }
        );

        setSteps(baseSteps);
    }, [formData.account_type]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateStep = (stepIndex) => {
        if (!steps[stepIndex]) return true;
        const stepTitle = steps[stepIndex].title;

        if (stepTitle === ONBOARDING_STEPS.PERSONAL_INFO) {
            if (!formData.first_name || !formData.last_name) {
                setError('First name and last name are required');
                return false;
            }
        }
        // Add other validation logic here as needed

        setError(null);
        return true;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => prev - 1);
        setError(null);
    };

    const handleAvatarUpload = async (event) => {
        try {
            setUploading(true);
            const file = event.target.files[0];
            if (!file) return;

            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Math.random()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

            setAvatarUrl(data.publicUrl);
            setFormData(prev => ({ ...prev, avatar_url: data.publicUrl }));
        } catch (error) {
            console.error('Error uploading avatar:', error);
            setError('Error uploading avatar');
        } finally {
            setUploading(false);
        }
    };

    const handleFinish = async () => {
        setLoading(true);
        try {
            // 1. Update personal info (Profile)
            if (profile) {
                await profileService.update(profile.id, {
                    first_name: formData.first_name,
                    middle_name: formData.middle_name,
                    last_name: formData.last_name,
                    phone_number: formData.phone,
                    phone_code: formData.phone_code,
                    avatar_url: avatarUrl || formData.avatar_url,
                });
            }

            // 2. Upsert Professional Profile
            // Only if account type is 'company' OR we have professional data
            // We need to determine if we should create one.
            if (formData.account_type === ACCOUNT_TYPES.COMPANY || formData.company_name || formData.vat_id) {
                await profileService.upsertProfessionalProfile(profile.id, {
                    company_name: formData.company_name,
                    tax_id: formData.vat_id,
                    user_type: formData.account_type,
                    organization_id: profile.organization_id
                });
            }

            // 3. Upsert Address
            // Ensure location hierarchy exists first (using masterDataService)
            if (formData.country_id) {
                // Try to ensure hierarchy if we have minimal data
                if (formData.country_id && (formData.city_name || formData.region_id)) {
                    try {
                        await masterDataService.ensureLocationHierarchy({
                            country_id: formData.country_id,
                            region_id: formData.region_id, // Might be null
                            city_name: formData.city_name
                        });
                    } catch (hierarchyErr) {
                        console.warn('Hierarchy check warning:', hierarchyErr);
                        // Continue anyway, addressService might complain or just save raw
                    }
                }

                const addressData = {
                    country_id: formData.country_id,
                    region_division_id: formData.region_id || null, // Correct column name
                    locality_id: formData.city_id || null,          // Correct column name
                    city_name: formData.city_name,                  // Fallback text
                    street_name: formData.street_name,
                    number: formData.number,
                    floor: formData.floor,
                    postal_code: formData.postal_code,
                    address_type: formData.type || 'home',
                    is_primary: true,
                    is_active: true  // Required NOT NULL column
                };

                const savedAddress = await addressService.upsert(profile.id, addressData.address_type, addressData);

                // Link address to profile if it wasn't already
                if (savedAddress && savedAddress.id) {
                    await profileService.update(profile.id, { address_id: savedAddress.id });
                }
            }

            // 4. Mark Onboarding as Complete
            await onboardingService.completeOnboarding(profile.id, steps.length);

            // Navigate to dashboard
            if (navigate) navigate('/app/dashboard');
        } catch (err) {
            console.error('Error saving profile:', err);
            setError('Failed to save profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return {
        currentStep,
        steps,
        formData,
        setFormData,
        loading,
        uploading,
        error,
        avatarUrl,
        handleChange,
        handleSelectChange,
        handleNext,
        handleBack,
        handleFinish,
        handleAvatarUpload,
        setError
    };
};
