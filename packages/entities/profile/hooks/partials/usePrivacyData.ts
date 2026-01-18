/**
 * usePrivacyData Partial Hook
 * Manages privacy settings: profile visibility, data processing consent, and marketing consent.
 */
import { useState } from 'react';
import { FullProfile } from '../../interfaces/types/FullProfile';

export interface PrivacyFormData {
    profile_visibility: string;
    data_processing_consent: boolean;
    marketing_consent: boolean;
}

export const usePrivacyData = () => {
    const [formData, setFormData] = useState<PrivacyFormData>({
        profile_visibility: 'private',
        data_processing_consent: false,
        marketing_consent: false,
    });

    const mapProfileToPrivacyData = (profile: FullProfile | null) => {
        const prefs = profile?.user_preferences?.[0];
        if (!prefs) return;

        setFormData({
            profile_visibility: prefs.profile_visibility || 'private',
            data_processing_consent: prefs.data_processing_consent ?? false,
            marketing_consent: prefs.marketing_consent ?? false,
        });
    };

    const handlePrivacyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked, type } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: checked }));
        }
    };

    const handleVisibilityChange = (value: string) => {
        setFormData(prev => ({ ...prev, profile_visibility: value }));
    };

    return {
        formData,
        setFormData,
        mapProfileToPrivacyData,
        handlePrivacyChange,
        handleVisibilityChange,
    };
};
