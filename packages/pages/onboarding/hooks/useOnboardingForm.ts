/**
 * useOnboardingForm Hook
 * @package @pulwave/experience/onboarding
 */
import { useState, useEffect } from 'react';

export interface Profile {
    id: string;
    organization_id?: string;
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
}

export interface FormData {
    first_name: string;
    middle_name: string;
    last_name: string;
    phone: string;
    phone_code: string;
    account_type: string;
    company_name: string;
    vat_id: string;
    country_id: string;
    region_id: string;
    city_name: string;
    street_name: string;
    number: string;
    postal_code: string;
    avatar_url?: string;
}

export interface ProfileService {
    getFullProfile(userId: string, email?: string): Promise<Profile | null>;
    update(profileId: string, data: Partial<Profile>): Promise<void>;
    upsertProfessionalProfile(profileId: string, data: Record<string, unknown>): Promise<void>;
}

export interface OnboardingService {
    completeOnboarding(profileId: string, steps: number): Promise<void>;
}

export interface UseOnboardingFormDeps {
    userId?: string;
    email?: string;
    profileService: ProfileService;
    onboardingService: OnboardingService;
    navigate?: (path: string) => void;
}

export function createUseOnboardingForm(deps: UseOnboardingFormDeps) {
    const { userId, email, profileService, onboardingService, navigate } = deps;

    return function useOnboardingForm() {
        const [currentStep, setCurrentStep] = useState(0);
        const [profile, setProfile] = useState<Profile | null>(null);
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState<string | null>(null);
        const [formData, setFormData] = useState<FormData>({
            first_name: '', middle_name: '', last_name: '',
            phone: '', phone_code: '', account_type: 'individual',
            company_name: '', vat_id: '', country_id: '',
            region_id: '', city_name: '', street_name: '',
            number: '', postal_code: '',
        });

        useEffect(() => {
            if (!userId) return;
            const fetch = async () => {
                try {
                    const data = await profileService.getFullProfile(userId, email);
                    if (data) {
                        setProfile(data);
                        setFormData(prev => ({
                            ...prev,
                            first_name: data.first_name || '',
                            last_name: data.last_name || '',
                        }));
                    }
                } catch (err) {
                    setError('Failed to load profile');
                }
            };
            fetch();
        }, [userId, email]);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        };

        const handleNext = () => {
            if (!formData.first_name || !formData.last_name) {
                setError('Name required');
                return;
            }
            setError(null);
            setCurrentStep(prev => prev + 1);
        };

        const handleBack = () => {
            setCurrentStep(prev => prev - 1);
            setError(null);
        };

        const handleFinish = async () => {
            setLoading(true);
            try {
                if (profile) {
                    await profileService.update(profile.id, {
                        first_name: formData.first_name,
                        last_name: formData.last_name,
                        avatar_url: formData.avatar_url,
                    });
                    await onboardingService.completeOnboarding(profile.id, 5);
                }
                navigate?.('/app/dashboard');
            } catch (err) {
                setError('Failed to save');
            } finally {
                setLoading(false);
            }
        };

        return {
            currentStep, profile, formData, setFormData,
            loading, error, setError,
            handleChange, handleNext, handleBack, handleFinish,
        };
    };
}
