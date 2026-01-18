/**
 * Storage Repository Proxy
 * Generic proxy that delegates to the configured provider (Supabase, Firebase, etc.).
 */
import { dataProvider } from '@pulwave/entity-infrastructure';
import { IStorageRepository } from '../interfaces';

export const storageRepository: IStorageRepository = dataProvider.storage;

export default storageRepository;
