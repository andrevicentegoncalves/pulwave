/**
 * Profile Address Service Tests
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { profileAddressService } from '..//address/profileAddressService';
import { addressService, type Address, type AddressUpdateDto } from '@pulwave/entity-address';

// Mock the main address service
vi.mock('@pulwave/entity-address', () => ({
    addressService: {
        upsert: vi.fn(),
    }
}));

describe('ProfileAddressService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should delegate updateAddress to addressService.upsert', async () => {
        const addressData: AddressUpdateDto = { street_name: 'Main St' };
        const mockAddress: Address = {
            id: 'a1',
            profile_id: 'p1',
            address_type: 'primary',
            street_name: 'Main St'
        };
        vi.mocked(addressService.upsert).mockResolvedValue(mockAddress);

        const result = await profileAddressService.updateAddress('p1', 'primary', addressData);
        expect(result.id).toBe('a1');
        expect(addressService.upsert).toHaveBeenCalledWith('p1', 'primary', addressData);
    });
});

