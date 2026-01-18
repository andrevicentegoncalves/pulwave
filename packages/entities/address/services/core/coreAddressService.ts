/**
 * Core Address Service
 * CRUD operations for addresses.
 */
import { addressRepository } from '../../repositories/addressRepository';
import type { Address, AddressInsertDto, AddressUpdateDto } from '../../interfaces';

export type { Address, AddressInsertDto, AddressUpdateDto };

export const coreAddressService = {
    async getByProfileId(profileId: string): Promise<Address[]> {
        return addressRepository.getByProfileId(profileId);
    },

    async getByType(profileId: string, addressType: string): Promise<Address | null> {
        return addressRepository.getByType(profileId, addressType);
    },

    async getById(addressId: string): Promise<Address | null> {
        return addressRepository.getById(addressId);
    },

    async upsert(profileId: string, addressType: string, addressData: Partial<Address>): Promise<Address> {
        return addressRepository.upsert(profileId, addressType, addressData);
    },

    async delete(addressId: string): Promise<void> {
        return addressRepository.delete(addressId);
    },

    async ensureRegion(regionName: string, countryId: string): Promise<string | null> {
        return addressRepository.ensureRegion(regionName, countryId);
    },
};



