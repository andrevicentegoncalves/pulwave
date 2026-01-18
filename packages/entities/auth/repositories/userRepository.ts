/**
 * User Repository
 * Generic proxy for user data access.
 */
import { dataProvider } from '@pulwave/entity-infrastructure';
import { IUserRepository } from '../interfaces';

export const userRepository: IUserRepository = dataProvider.user;

export default userRepository;



