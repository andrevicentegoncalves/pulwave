/**
 * useProfileSubmit Hook
 * Handles profile form submission to update user profile data.
 * 
 * @package @foundation/hooks
 */
import { useState, useCallback } from 'react';
import { profileService } from '../services';
import { Profile } from '../interfaces/types/Profile';
import { ProfessionalProfile } from '../interfaces/types/Professional';
import { UserPreferences } from '../interfaces/types/Preferences';
import { Address } from '../../address/interfaces/types/Address';
import { PersonalFormData } from './partials/usePersonalData';
import { ProfessionalFormData } from './partials/useProfessionalData';
import { SecurityFormData } from './partials/useSecurityData';
import { PrivacyFormData } from './partials/usePrivacyData';
import { SettingsFormData } from './partials/useSettingsData';
import { AddressFormData } from './partials/useAddressingData';

interface ProfileUpdateResult {
    data: Profile | null;
    error: Error | null;
}

type ServiceResult =
    | ProfileUpdateResult
    | ProfessionalProfile
    | UserPreferences
    | Address
    | { data: null; error: null };

export interface UseProfileSubmitOptions {
    user: { id: string; email?: string } | null;
    profile?: { id?: string } | null;
    onSuccess?: (message: string) => void;
    onError?: (message: string) => void;
    onProfileUpdate?: (profile: Profile) => void;
}

export interface UseProfileSubmitReturn {
    loading: boolean;
    error: string | null;
    handleSubmit: (params: {
        personal?: PersonalFormData;
        professional?: ProfessionalFormData;
        security?: SecurityFormData;
        privacy?: PrivacyFormData;
        settings?: SettingsFormData;
        address?: AddressFormData;
        billingAddress?: AddressFormData;
    }) => Promise<void>;
}

export const useProfileSubmit = ({
    user,
    profile,
    onSuccess,
    onError,
    onProfileUpdate,
}: UseProfileSubmitOptions): UseProfileSubmitReturn => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = useCallback(async ({
        personal,
        professional,
        security,
        privacy,
        settings,
        address,
        billingAddress
    }: {
        personal?: PersonalFormData;
        professional?: ProfessionalFormData;
        security?: SecurityFormData;
        privacy?: PrivacyFormData;
        settings?: SettingsFormData;
        address?: AddressFormData;
        billingAddress?: AddressFormData;
    }): Promise<void> => {
        if (!user?.id) {
            onError?.('User not authenticated');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const profileId = profile?.id || user.id;

            const results: ServiceResult[] = await Promise.all([
                personal ? profileService.updateProfile(user.id, personal) : Promise.resolve({ data: null, error: null }),
                professional ? profileService.upsertProfessionalProfile(profileId, professional) : Promise.resolve({ data: null, error: null }),
                (privacy || settings) ? profileService.upsertPreferences(profileId, { ...privacy, ...settings }) : Promise.resolve({ data: null, error: null }),
                address ? profileService.updateAddress(profileId, 'primary', address) : Promise.resolve({ data: null, error: null }),
                billingAddress ? profileService.updateAddress(profileId, 'billing', billingAddress) : Promise.resolve({ data: null, error: null }),
            ]);

            const profileResult = results[0] as ProfileUpdateResult;
            const errorResult = results.find((r): r is ProfileUpdateResult =>
                'error' in r && r.error !== null
            );

            if (errorResult?.error) {
                throw new Error(errorResult.error.message || 'Failed to update profile');
            }

            // Notify parent of profile update if core profile changed
            if (profileResult.data && onProfileUpdate) {
                onProfileUpdate(profileResult.data);
            }

            onSuccess?.('Profile updated successfully');

        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to update profile';
            setError(message);
            onError?.(message);
            // Error already captured in state and reported via onError callback
        } finally {
            setLoading(false);
        }
    }, [user, profile, onSuccess, onError, onProfileUpdate]);

    return {
        loading,
        error,
        handleSubmit
    };
};

export default useProfileSubmit;




