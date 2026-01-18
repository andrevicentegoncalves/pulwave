/**
 * usePersonalData Partial Hook Tests
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePersonalData } from '../partials/usePersonalData';
import { contactService, type ContactFormMappedData } from '../../services/contactService';
import type { FullProfile } from '../../interfaces/types/FullProfile';
import type { User } from '@pulwave/entity-auth';

// Mock dependencies
vi.mock('../../services/contactService', () => ({
    contactService: {
        mapToFormData: vi.fn(),
    }
}));

describe('usePersonalData', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should initialize with empty data', () => {
        const { result } = renderHook(() => usePersonalData());
        expect(result.current.formData.username).toBe('');
        expect(result.current.formData.first_name).toBe('');
    });

    it('should map profile and user data correctly', () => {
        const mockProfile: Pick<FullProfile, 'id' | 'username' | 'first_name' | 'last_name' | 'display_name' | 'email' | 'contacts' | 'social_profiles'> = {
            id: 'p1',
            username: 'jdoe',
            first_name: 'John',
            last_name: 'Doe',
            display_name: 'John Doe',
            email: 'john@example.com',
            contacts: [],
            social_profiles: [
                { profile_id: 'p1', platform: 'linkedin', url: 'https://linkedin.com/jdoe' }
            ]
        };
        const mockUser: Pick<User, 'id' | 'email'> = { id: 'u1', email: 'user@example.com' };
        const mockContactData: ContactFormMappedData = {
            phone_code: '+1',
            phone_number: '123456789',
            phone_secondary_code: '',
            phone_secondary_number: '',
            emergency_contact_name: '',
            emergency_contact_phone: '',
            emergency_contact_relationship: '',
        };

        vi.mocked(contactService.mapToFormData).mockReturnValue(mockContactData);

        const { result } = renderHook(() => usePersonalData());

        act(() => {
            result.current.mapProfileToPersonalData(mockProfile as FullProfile, mockUser as User);
        });

        expect(result.current.formData.username).toBe('jdoe');
        expect(result.current.formData.first_name).toBe('John');
        expect(result.current.formData.email).toBe('user@example.com');
        expect(result.current.formData.linkedin_url).toBe('https://linkedin.com/jdoe');
        expect(result.current.formData.phone_number).toBe('123456789');
    });

    it('should auto-generate display_name from first/last name if not manually edited', () => {
        const { result } = renderHook(() => usePersonalData());

        const firstNameEvent: React.ChangeEvent<HTMLInputElement> = {
            target: { name: 'first_name', value: 'Jane' }
        } as React.ChangeEvent<HTMLInputElement>;

        act(() => {
            result.current.handlePersonalChange(firstNameEvent);
        });

        expect(result.current.formData.display_name).toBe('Jane');

        const lastNameEvent: React.ChangeEvent<HTMLInputElement> = {
            target: { name: 'last_name', value: 'Smith' }
        } as React.ChangeEvent<HTMLInputElement>;

        act(() => {
            result.current.handlePersonalChange(lastNameEvent);
        });

        expect(result.current.formData.display_name).toBe('Jane Smith');
    });

    it('should not overwrite display_name if manually edited', () => {
        const { result } = renderHook(() => usePersonalData());

        const displayNameEvent: React.ChangeEvent<HTMLInputElement> = {
            target: { name: 'display_name', value: 'Custom Name' }
        } as React.ChangeEvent<HTMLInputElement>;

        act(() => {
            result.current.handlePersonalChange(displayNameEvent);
        });

        expect(result.current.displayNameManuallyEdited).toBe(true);
        expect(result.current.formData.display_name).toBe('Custom Name');

        const firstNameEvent: React.ChangeEvent<HTMLInputElement> = {
            target: { name: 'first_name', value: 'Jane' }
        } as React.ChangeEvent<HTMLInputElement>;

        act(() => {
            result.current.handlePersonalChange(firstNameEvent);
        });

        expect(result.current.formData.display_name).toBe('Custom Name');
    });
});



