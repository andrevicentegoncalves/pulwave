/**
 * Address Service Facade
 */
import { coreAddressService, Address, AddressInsertDto, AddressUpdateDto } from './core/coreAddressService';
import { addressUtils } from './utils/addressUtils';

export type { Address, AddressInsertDto, AddressUpdateDto };

export const addressService = {
    ...coreAddressService,
    ...addressUtils
};

export default addressService;

