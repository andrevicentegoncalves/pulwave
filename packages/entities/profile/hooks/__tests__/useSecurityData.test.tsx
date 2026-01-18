/**
 * useSecurityData Partial Hook Tests
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSecurityData } from '../partials/useSecurityData';
import { contactService, type ContactFormMappedData } from '../../services/contactService';
import type { FullProfile } from '../../interfaces/types/FullProfile';

// Mock dependencies
vi.mock('../../services/contactService', () => ({
    contactService: {
        mapToFormData: vi.fn(),
    }
}));

describe('useSecurityData', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should initialize with default security data', () => {
        const { result } = renderHook(() => useSecurityData());
        expect(result.current.formData.mfa_enabled).toBe(false);
        expect(result.current.formData.emergency_contact_name).toBe('');
    });

    it('should map security and emergency contact data correctly', () => {
        const mockProfile: Partial<FullProfile> = {
            auth_state: { profile_id: 'p1', mfa_enabled: true },
            contacts: []
        };
        const mockContactData: ContactFormMappedData = {
            phone_code: '',
            phone_number: '',
            phone_secondary_code: '',
            phone_secondary_number: '',
            emergency_contact_name: 'Jane Doe',
            emergency_contact_phone: '987654321',
            emergency_contact_relationship: 'Sister',
        };

        vi.mocked(contactService.mapToFormData).mockReturnValue(mockContactData);

        const { result } = renderHook(() => useSecurityData());

        act(() => {
            result.current.mapProfileToSecurityData(mockProfile as FullProfile);
        });

        expect(result.current.formData.mfa_enabled).toBe(true);
        expect(result.current.formData.emergency_contact_name).toBe('Jane Doe');
        expect(result.current.formData.emergency_contact_phone).toBe('987654321');
    });

    it('should handle security text change', () => {
        const { result } = renderHook(() => useSecurityData());

        act(() => {
            result.current.handleSecurityChange({
                target: { name: 'emergency_contact_name', value: 'New Contact', type: 'text' }
            } as React.ChangeEvent<HTMLInputElement>);
        });

        expect(result.current.formData.emergency_contact_name).toBe('New Contact');
    });

    it('should handle security checkbox change', () => {
        const { result } = renderHook(() => useSecurityData());

        act(() => {
            result.current.handleSecurityChange({
                target: { name: 'mfa_enabled', type: 'checkbox', checked: true }
            } as React.ChangeEvent<HTMLInputElement>);
        });

        expect(result.current.formData.mfa_enabled).toBe(true);
    });
});



