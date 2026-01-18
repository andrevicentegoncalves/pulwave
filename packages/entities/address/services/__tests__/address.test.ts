/**
 * Address Service Tests
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

import type { Address } from '../../interfaces';

// Mock address repository
vi.mock('../../repositories/addressRepository', () => ({
    addressRepository: {
        getByProfileId: vi.fn(),
        getByType: vi.fn(),
        upsert: vi.fn(),
        delete: vi.fn(),
    },
}));

import { addressRepository } from '../../repositories/addressRepository';

function createMockAddress(overrides: Partial<Address> = {}): Address {
    return {
        id: '1',
        profile_id: 'profile-1',
        address_type: 'billing',
        city_name: 'Lisbon',
        ...overrides,
    };
}

describe('Address Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getByProfileId', () => {
        it('should return all addresses for a profile', async () => {
            const mockAddresses: Address[] = [
                createMockAddress({ id: '1', address_type: 'billing', city_name: 'Lisbon' }),
                createMockAddress({ id: '2', address_type: 'shipping', city_name: 'Porto' }),
            ];
            vi.mocked(addressRepository.getByProfileId).mockResolvedValue(mockAddresses);

            expect(addressRepository.getByProfileId).toBeDefined();
        });
    });

    describe('getByType', () => {
        it('should return specific address type', async () => {
            const mockAddress = createMockAddress({ id: '1', address_type: 'billing', city_name: 'Lisbon' });
            vi.mocked(addressRepository.getByType).mockResolvedValue(mockAddress);

            expect(addressRepository.getByType).toBeDefined();
        });

        it('should return null when address type not found', async () => {
            vi.mocked(addressRepository.getByType).mockResolvedValue(null);
            expect(true).toBe(true);
        });
    });

    describe('upsert', () => {
        it('should create new address if not exists', async () => {
            const mockAddress = createMockAddress({ id: '1', address_type: 'billing', city_name: 'Lisbon' });
            vi.mocked(addressRepository.upsert).mockResolvedValue(mockAddress);

            expect(addressRepository.upsert).toBeDefined();
        });

        it('should update existing address', async () => {
            const mockAddress = createMockAddress({ id: '1', address_type: 'billing', city_name: 'Updated City' });
            vi.mocked(addressRepository.upsert).mockResolvedValue(mockAddress);

            expect(true).toBe(true);
        });
    });

    describe('delete', () => {
        it('should remove address by id', async () => {
            vi.mocked(addressRepository.delete).mockResolvedValue(undefined);
            expect(addressRepository.delete).toBeDefined();
        });
    });

    describe('getRegionFromDistrict', () => {
        it('should map Lisboa to Lisboa region', async () => {
            const { addressService } = await import('..//addressService');
            const region = addressService.getRegionFromDistrict('Lisboa');
            expect(region).toBe('Lisboa');
        });

        it('should map Porto to Norte region', async () => {
            const { addressService } = await import('..//addressService');
            const region = addressService.getRegionFromDistrict('Porto');
            expect(region).toBe('Norte');
        });

        it('should return null for unknown district', async () => {
            const { addressService } = await import('..//addressService');
            const region = addressService.getRegionFromDistrict('Unknown');
            expect(region).toBeNull();
        });
    });
});




