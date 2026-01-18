/**
 * useProfileData Hook Tests
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useProfileData } from '../useProfileData';
import { profileService } from '../../services';
import { authService } from '@pulwave/entity-auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import type { User } from '@pulwave/entity-auth';
import type { FullProfile } from '../../interfaces/types/FullProfile';
import type { OnboardingStatus } from '../../interfaces/types/Profile';

// Mock Partial Hooks
vi.mock('../../partials/usePersonalData', () => ({
    usePersonalData: () => ({
        mapProfileToPersonalData: vi.fn(),
        formData: {}
    })
}));
vi.mock('../../partials/useProfessionalData', () => ({
    useProfessionalData: () => ({
        mapProfileToProfessionalData: vi.fn(),
        formData: {}
    })
}));
vi.mock('../../partials/useSecurityData', () => ({
    useSecurityData: () => ({
        mapProfileToSecurityData: vi.fn(),
        formData: {}
    })
}));
vi.mock('../../partials/usePrivacyData', () => ({
    usePrivacyData: () => ({
        mapProfileToPrivacyData: vi.fn(),
        formData: {}
    })
}));
vi.mock('../../partials/useSettingsData', () => ({
    useSettingsData: () => ({
        mapProfileToSettingsData: vi.fn(),
        formData: {}
    })
}));
vi.mock('../../partials/useAddressingData', () => ({
    useAddressingData: () => ({
        mapProfileToAddressingData: vi.fn(),
        formData: {}
    })
}));

// Mock Services
vi.mock('../../services', () => ({
    profileService: {
        getFullProfile: vi.fn(),
        getOnboardingStatus: vi.fn(),
    }
}));
vi.mock('@pulwave/entity-auth', () => ({
    authService: {
        getUser: vi.fn(),
    }
}));

// Mock Env
vi.stubGlobal('import.meta', { env: { VITE_SKIP_ONBOARDING: 'false' } });

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

describe('useProfileData', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should fetch user and profile data', async () => {
        const mockUser: Partial<User> = { id: 'u1', email: 'test@test.com' };
        const mockProfile: Partial<FullProfile> = { id: 'p1', auth_user_id: 'u1' };
        const mockOnboarding: OnboardingStatus = {
            profile_id: 'p1',
            completed: true,
            step: 'complete',
            updated_at: new Date().toISOString()
        };

        vi.mocked(authService.getUser).mockResolvedValue(mockUser as User);
        vi.mocked(profileService.getFullProfile).mockResolvedValue(mockProfile as FullProfile);
        vi.mocked(profileService.getOnboardingStatus).mockResolvedValue(mockOnboarding);

        const { result } = renderHook(() => useProfileData(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.user).toEqual(mockUser));
        await waitFor(() => expect(result.current.profile).toEqual(mockProfile));
    });

    it.skip('should check onboarding status', async () => {
        const mockUser: Partial<User> = { id: 'u1', email: 'test@test.com' };
        const mockProfile: Partial<FullProfile> = { id: 'p1', auth_user_id: 'u1' };
        const mockOnboarding: OnboardingStatus = {
            profile_id: 'p1',
            completed: false,
            step: 'personal',
            updated_at: new Date().toISOString()
        };

        vi.mocked(authService.getUser).mockResolvedValue(mockUser as User);
        vi.mocked(profileService.getFullProfile).mockResolvedValue(mockProfile as FullProfile);
        vi.mocked(profileService.getOnboardingStatus).mockResolvedValue(mockOnboarding);

        renderHook(() => useProfileData(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(profileService.getOnboardingStatus).toHaveBeenCalledWith('p1'));
    });
});

