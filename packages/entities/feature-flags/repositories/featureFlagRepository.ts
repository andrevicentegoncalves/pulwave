/**
 * Feature Flag Repository
 * Generic proxy for feature flag data access.
 */
import { dataProvider } from '@pulwave/entity-infrastructure';
import type { IFeatureFlagRepository } from '../interfaces';

export const featureFlagRepository: IFeatureFlagRepository = dataProvider.featureFlag;

export default featureFlagRepository;
