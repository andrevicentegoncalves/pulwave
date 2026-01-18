/**
 * Translation Repository
 * Generic proxy for translation data access.
 */
import { dataProvider } from '@pulwave/entity-infrastructure';
import { ITranslationRepository } from '../interfaces';

export const translationRepository: ITranslationRepository = dataProvider.translation;

export default translationRepository;



