/**
 * Address Repository Interface
 */
import { Address } from './types/Address';

import type { IVersionedRepository } from '../../_infrastructure/interfaces';
export interface IAddressRepository extends IVersionedRepository {
    readonly version: '1.0.0';
    getByProfileId(profileId: string): Promise<Address[]>;
    getByType(profileId: string, addressType: string): Promise<Address | null>;
    getById(addressId: string): Promise<Address | null>;
    upsert(profileId: string, addressType: string, addressData: Partial<Address>): Promise<Address>;
    delete(addressId: string): Promise<void>;
    ensureRegion(regionName: string, countryId: string): Promise<string | null>;
}

