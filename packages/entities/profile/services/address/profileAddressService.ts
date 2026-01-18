/**
 * Address Service (Profile context)
 * Delegates to main address service.
 */
import { addressService, type Address } from '@pulwave/entity-address';

export const profileAddressService = {
    async updateAddress(profileId: string, type: 'primary' | 'billing', addressData: Partial<Address>): Promise<Address> {
        return addressService.upsert(profileId, type, addressData);
    },
};

