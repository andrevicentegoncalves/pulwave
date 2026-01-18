/**
 * Billing Repository
 * Generic proxy for billing data access.
 */
import { dataProvider } from '@pulwave/entity-infrastructure';
import { IBillingRepository } from '../interfaces';

export const billingRepository: IBillingRepository = dataProvider.billing;

export default billingRepository;
