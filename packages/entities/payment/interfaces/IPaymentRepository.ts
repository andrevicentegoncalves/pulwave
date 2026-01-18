/**
 * Payment Repository Interface
 */
import { PaymentMethod, PaymentMethodIcon } from './types/PaymentMethod';
import { SubscriptionPlan, SubscriptionInvoice } from './types/Subscription';
import type { IVersionedRepository } from '../../_infrastructure/interfaces';

export interface IPaymentRepository extends IVersionedRepository {
    readonly version: '1.0.0';
    findSubscriptionPlans(): Promise<SubscriptionPlan[]>;
    findAll(organizationId: string): Promise<PaymentMethod[]>;
    findById(id: string): Promise<PaymentMethod | null>;
    create(data: Partial<PaymentMethod>): Promise<PaymentMethod>;
    update(id: string, updates: Partial<PaymentMethod>): Promise<PaymentMethod>;
    softDelete(id: string): Promise<void>;
    unsetAllDefaults(organizationId: string): Promise<void>;
    findSubscriptionInvoices(organizationId: string): Promise<SubscriptionInvoice[]>;
    getIcons(): Promise<PaymentMethodIcon[]>;
}

