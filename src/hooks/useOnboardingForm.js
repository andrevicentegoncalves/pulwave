import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { profileService, onboardingService } from '../services';
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
                const data = await profileService.getByAuthId(user.id);
                if (data) {
                    setProfile(data);
                    setFormData(prev => ({
                        ...prev,
                        first_name: data.first_name || '',
                        last_name: data.last_name || '',
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
            // Update profile
            await profileService.update(profile.id, {
                first_name: formData.first_name,
                middle_name: formData.middle_name,
                last_name: formData.last_name,
                // Add logic for saving other parts
            });

            // Navigate to dashboard or next
            if (navigate) navigate('/app/dashboard');
        } catch (err) {
            console.error('Error saving profile:', err);
            setError('Failed to save profile');
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
