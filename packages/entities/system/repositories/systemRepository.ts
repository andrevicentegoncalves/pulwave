/**
 * System Repository
 * Generic proxy for system data access.
 */
import { dataProvider } from '@pulwave/entity-infrastructure';
import { ISystemRepository } from '../interfaces';

export const systemRepository: ISystemRepository = dataProvider.system;

export default systemRepository;




