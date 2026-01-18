/**
 * useSettingsData Partial Hook Tests
 */
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSettingsData } from '../partials/useSettingsData';
import type { FullProfile } from '../../interfaces/types/FullProfile';

describe('useSettingsData', () => {
    it('should initialize with default settings', () => {
        const { result } = renderHook(() => useSettingsData());
        expect(result.current.formData.theme).toBe('light');
        expect(result.current.formData.locale).toBe('en-US');
    });

    it('should map settings data correctly', () => {
        const mockProfile: Partial<FullProfile> = {
            user_preferences: [{
                profile_id: 'p1',
                theme: 'dark',
                timezone: 'Europe/Lisbon',
                locale: 'pt-PT',
                notifications_enabled: true
            }]
        };

        const { result } = renderHook(() => useSettingsData());

        act(() => {
            result.current.mapProfileToSettingsData(mockProfile as FullProfile);
        });

        expect(result.current.formData.theme).toBe('dark');
        expect(result.current.formData.timezone).toBe('Europe/Lisbon');
        expect(result.current.formData.locale).toBe('pt-PT');
        expect(result.current.formData.notifications_enabled).toBe(true);
    });

    it('should handle settings checkbox change', () => {
        const { result } = renderHook(() => useSettingsData());

        act(() => {
            result.current.handleSettingsChange({
                target: { name: 'email_notifications', type: 'checkbox', checked: true }
            } as React.ChangeEvent<HTMLInputElement>);
        });

        expect(result.current.formData.email_notifications).toBe(true);
    });

    it('should handle settings select change', () => {
        const { result } = renderHook(() => useSettingsData());

        act(() => {
            result.current.handleSelectSettingsChange('theme', 'dark');
        });

        expect(result.current.formData.theme).toBe('dark');
    });
});


