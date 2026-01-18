/**
 * useAddressingData Partial Hook Tests
 */
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAddressingData } from '../partials/useAddressingData';
import type { FullProfile } from '../../interfaces/types/FullProfile';
import type { Address } from '@pulwave/entity-address';

describe('useAddressingData', () => {
    it('should initialize with default addresses', () => {
        const { result } = renderHook(() => useAddressingData());
        expect(result.current.addressData.type).toBe('home');
        expect(result.current.billingAddressData.type).toBe('billing');
        expect(result.current.addressData.city_name).toBe('');
    });

    it('should map primary and billing addresses correctly', () => {
        const mockPrimaryAddress: Partial<Address> = {
            country_id: 'PT',
            city_name: 'Lisbon',
            street_name: 'Main St',
            postal_code: '1000-001'
        };

        const mockBillingAddress: Partial<Address> = {
            country_id: 'PT',
            city_name: 'Porto',
            street_name: 'Second St',
            postal_code: '4000-001'
        };

        const mockProfile: Pick<FullProfile, 'primary_address' | 'billing_address'> = {
            primary_address: mockPrimaryAddress as Address,
            billing_address: mockBillingAddress as Address
        };

        const { result } = renderHook(() => useAddressingData());

        act(() => {
            result.current.mapProfileToAddressingData(mockProfile as FullProfile);
        });

        expect(result.current.addressData.city_name).toBe('Lisbon');
        expect(result.current.addressData.country_id).toBe('PT');
        expect(result.current.billingAddressData.city_name).toBe('Porto');
    });

    it('should set address data manually', () => {
        const { result } = renderHook(() => useAddressingData());

        act(() => {
            result.current.setAddressData(prev => ({ ...prev, city_name: 'London' }));
        });

        expect(result.current.addressData.city_name).toBe('London');
    });
});


