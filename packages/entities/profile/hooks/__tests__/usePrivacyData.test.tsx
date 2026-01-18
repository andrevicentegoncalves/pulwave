/**
 * usePrivacyData Partial Hook Tests
 */
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePrivacyData } from '../partials/usePrivacyData';
import type { FullProfile } from '../../interfaces/types/FullProfile';
import type { UserPreferences } from '../../interfaces/types/Preferences';

describe('usePrivacyData', () => {
    it('should initialize with default privacy data', () => {
        const { result } = renderHook(() => usePrivacyData());
        expect(result.current.formData.profile_visibility).toBe('private');
        expect(result.current.formData.data_processing_consent).toBe(false);
    });

    it('should map privacy data correctly', () => {
        const mockPreferences: UserPreferences = {
            profile_id: 'test-profile-id',
            profile_visibility: 'public',
            data_processing_consent: true,
            marketing_consent: true
        };

        const mockProfile: Pick<FullProfile, 'user_preferences'> = {
            user_preferences: [mockPreferences]
        };

        const { result } = renderHook(() => usePrivacyData());

        act(() => {
            result.current.mapProfileToPrivacyData(mockProfile as FullProfile);
        });

        expect(result.current.formData.profile_visibility).toBe('public');
        expect(result.current.formData.data_processing_consent).toBe(true);
        expect(result.current.formData.marketing_consent).toBe(true);
    });

    it('should handle privacy checkbox change', () => {
        const { result } = renderHook(() => usePrivacyData());

        const event: React.ChangeEvent<HTMLInputElement> = {
            target: { name: 'marketing_consent', type: 'checkbox', checked: true }
        } as React.ChangeEvent<HTMLInputElement>;

        act(() => {
            result.current.handlePrivacyChange(event);
        });

        expect(result.current.formData.marketing_consent).toBe(true);
    });

    it('should handle visibility change', () => {
        const { result } = renderHook(() => usePrivacyData());

        act(() => {
            result.current.handleVisibilityChange('restricted');
        });

        expect(result.current.formData.profile_visibility).toBe('restricted');
    });
});


