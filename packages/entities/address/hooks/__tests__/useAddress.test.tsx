/**
 * useAddress Hook Tests
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAddress } from '../useAddress';
import { addressService } from '../../services/addressService';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import type { Address } from '../../interfaces';

vi.mock('../../services/addressService', () => ({
    addressService: {
        upsert: vi.fn(),
        getById: vi.fn(),
        delete: vi.fn(),
        ensureRegion: vi.fn(),
    }
}));

function createMockAddress(overrides: Partial<Address> = {}): Address {
    return {
        id: 'addr-1',
        profile_id: 'profile-1',
        address_type: 'physical',
        city_name: 'Lisbon',
        ...overrides,
    };
}

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

describe('useAddress', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should load address', async () => {
        const mockAddress = createMockAddress({ id: 'addr-1', city_name: 'Lisbon' });
        vi.mocked(addressService.getById).mockResolvedValue(mockAddress);

        const { result } = renderHook(() => useAddress(), {
            wrapper: createWrapper(),
        });

        const data = await result.current.loadAddress('addr-1');
        expect(data).toEqual(mockAddress);
        expect(addressService.getById).toHaveBeenCalledWith('addr-1');
    });

    it('should save address', async () => {
        const mockAddress = createMockAddress({ id: 'addr-new' });
        vi.mocked(addressService.upsert).mockResolvedValue(mockAddress);

        const { result } = renderHook(() => useAddress(), {
            wrapper: createWrapper(),
        });

        const payload = { profile_id: 'p1', city_name: 'Porto', address_type: 'physical' };
        await result.current.saveAddress(payload);

        expect(addressService.upsert).toHaveBeenCalledWith('p1', 'physical', payload);
    });

    it('should delete address', async () => {
        vi.mocked(addressService.delete).mockResolvedValue(undefined);

        const { result } = renderHook(() => useAddress(), {
            wrapper: createWrapper(),
        });

        await result.current.deleteAddress('addr-1');
        expect(addressService.delete).toHaveBeenCalledWith('addr-1');
    });

    it('should ensure region', async () => {
        vi.mocked(addressService.ensureRegion).mockResolvedValue('reg-1');

        const { result } = renderHook(() => useAddress(), {
            wrapper: createWrapper(),
        });

        const id = await result.current.ensureRegion('Lisbon', 'PT');
        expect(id).toBe('reg-1');
        expect(addressService.ensureRegion).toHaveBeenCalledWith('Lisbon', 'PT');
    });
});

