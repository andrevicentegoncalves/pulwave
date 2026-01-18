/**
 * Property Repository
 * Generic proxy for property data access.
 */
import { dataProvider } from '@pulwave/entity-infrastructure';
import { IPropertyRepository } from '../interfaces';

export const propertyRepository: IPropertyRepository = dataProvider.property;

export default propertyRepository;




