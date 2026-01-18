/**
 * Address Repository
 * Generic proxy for address data access.
 */
import { dataProvider } from '@pulwave/entity-infrastructure';
import { IAddressRepository } from '../interfaces';

export const addressRepository: IAddressRepository = dataProvider.address;

export default addressRepository;



