/**
 * useProfessionalData Partial Hook Tests
 */
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useProfessionalData } from '../partials/useProfessionalData';
import type { FullProfile } from '../../interfaces/types/FullProfile';

describe('useProfessionalData', () => {
    it('should initialize with empty data', () => {
        const { result } = renderHook(() => useProfessionalData());
        expect(result.current.formData.company_name).toBe('');
    });

    it('should map professional profile data correctly', () => {
        const mockProfile: Partial<FullProfile> = {
            professional_profiles: [{
                profile_id: 'p1',
                user_type: 'agent',
                company_name: 'Real Estate Co',
                tax_id: 'TX123',
                job_title: 'Agent',
                license_number: 'L123'
            }]
        };

        const { result } = renderHook(() => useProfessionalData());

        act(() => {
            result.current.mapProfileToProfessionalData(mockProfile as FullProfile);
        });

        expect(result.current.formData.user_type).toBe('agent');
        expect(result.current.formData.company_name).toBe('Real Estate Co');
        expect(result.current.formData.tax_id).toBe('TX123');
        expect(result.current.formData.license_number).toBe('L123');
    });

    it('should update professional data on change', () => {
        const { result } = renderHook(() => useProfessionalData());

        act(() => {
            result.current.handleProfessionalChange({
                target: { name: 'job_title', value: 'Broker' }
            } as React.ChangeEvent<HTMLInputElement>);
        });

        expect(result.current.formData.job_title).toBe('Broker');
    });
});


