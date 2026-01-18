/**
 * useProfileData Hook (Cleaned & Standardized)
 * Lean facade hook that composes atomic partials for profile management.
 * Uses React Query for data fetching and caching.
 */
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { clientEnv } from '@pulwave/internal-env';
import { authService } from '../../auth/services/authService';
import { type User } from '../../auth/interfaces';
import { profileService } from '../services';
import { type FullProfile } from '../interfaces';
import { profileKeys } from '../keys';

// Atomic Partials
import { usePersonalData } from './partials/usePersonalData';
import { useProfessionalData } from './partials/useProfessionalData';
import { useSecurityData } from './partials/useSecurityData';
import { usePrivacyData } from './partials/usePrivacyData';
import { useSettingsData } from './partials/useSettingsData';
import { useAddressingData } from './partials/useAddressingData';

export interface UseProfileDataOptions {
    onRedirect?: (path: string, options?: { replace?: boolean }) => void;
}

export interface UseProfileDataReturn {
    user: User | null;
    profile: FullProfile | null;
    isFetching: boolean;
    setProfile: (profile: FullProfile | null) => void;
    // Granular access
    personal: ReturnType<typeof usePersonalData>;
    professional: ReturnType<typeof useProfessionalData>;
    security: ReturnType<typeof useSecurityData>;
    privacy: ReturnType<typeof usePrivacyData>;
    settings: ReturnType<typeof useSettingsData>;
    addressing: ReturnType<typeof useAddressingData>;
    refreshProfile: () => Promise<void>;
}

export const useProfileData = ({ onRedirect }: UseProfileDataOptions = {}): UseProfileDataReturn => {
    const queryClient = useQueryClient();
    const [user, setUser] = useState<User | null>(null);

    // Initializing partials
    const personal = usePersonalData();
    const professional = useProfessionalData();
    const security = useSecurityData();
    const privacy = usePrivacyData();
    const settings = useSettingsData();
    const addressing = useAddressingData();

    // 1. Fetch User (Assuming auth is fast/local or handled by another hook, 
    // strictly speaking should be a query too but authService.getUser() might be sync-ish or check session)
    useEffect(() => {
        const loadUser = async () => {
            const currentUser = await authService.getUser();
            setUser(currentUser);
        };
        loadUser();
    }, []);

    // 2. Query for Full Profile
    const { data: profile = null, isLoading: isFetching, refetch } = useQuery({
        queryKey: profileKeys.full(user?.id),
        queryFn: () => profileService.getFullProfile(user!.id, user!.email || ''),
        enabled: !!user?.id,
    });

    // 3. Sync Logic & Onboarding Check
    useEffect(() => {
        if (profile && user) {
            const syncData = async () => {
                // Check onboarding status
                if (!clientEnv.VITE_SKIP_ONBOARDING) {
                    try {
                        const onboardingData = await profileService.getOnboardingStatus(profile.id);
                        if (!onboardingData || !onboardingData.completed) {
                            onRedirect?.('/onboarding', { replace: true });
                            // Don't return here if we want to populate partials anyway, 
                            // but usually redirect means stop.
                            return;
                        }
                    } catch {
                        // Onboarding check failed silently
                    }
                }

                // Map all data to partials
                personal.mapProfileToPersonalData(profile, user);
                professional.mapProfileToProfessionalData(profile);
                security.mapProfileToSecurityData(profile);
                privacy.mapProfileToPrivacyData(profile);
                settings.mapProfileToSettingsData(profile);
                addressing.mapProfileToAddressingData(profile);
            };

            syncData();
        }
    }, [profile, user, onRedirect]);

    const refreshProfile = async () => {
        await refetch();
    };

    const setProfile = (newProfile: FullProfile | null) => {
        // Optimistic update or manual set
        if (user?.id) {
            queryClient.setQueryData(profileKeys.full(user.id), newProfile);
        }
    };

    return {
        user,
        profile,
        isFetching,
        setProfile,
        // Granular
        personal,
        professional,
        security,
        privacy,
        settings,
        addressing,
        refreshProfile,
    };
};

export default useProfileData;
