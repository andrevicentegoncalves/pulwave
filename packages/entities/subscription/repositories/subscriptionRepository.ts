/**
 * Subscription Repository
 * Generic proxy for subscription data access.
 */
import { dataProvider } from '@pulwave/entity-infrastructure';
import { ISubscriptionRepository } from '../interfaces';

export const subscriptionRepository: ISubscriptionRepository = dataProvider.subscription;

export default subscriptionRepository;
