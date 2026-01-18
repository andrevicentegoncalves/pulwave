/**
 * Profile Repository
 * Generic proxy for profile data access.
 */
import { dataProvider } from '@pulwave/entity-infrastructure';
import { IProfileRepository } from '../interfaces';

export const profileRepository: IProfileRepository = dataProvider.profile;

export default profileRepository;



