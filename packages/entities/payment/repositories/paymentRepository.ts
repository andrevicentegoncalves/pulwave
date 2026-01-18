/**
 * Payment Repository
 * Generic proxy for payment data access.
 */
import { dataProvider } from '@pulwave/entity-infrastructure';
import { IPaymentRepository } from '../interfaces';

export const paymentRepository: IPaymentRepository = dataProvider.payment;

export default paymentRepository;



