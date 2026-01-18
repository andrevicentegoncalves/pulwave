/**
 * Supabase Payment Repository
 * IPaymentRepository implementation.
 * Composed from atomic provider modules.
 */
import type { IPaymentRepository } from '@pulwave/entity-payment';
import { SupabasePaymentMethodProvider } from './methods';
import { SupabaseSubscriptionProvider } from './subscription';

export const SupabasePaymentRepository: IPaymentRepository = {
    version: '1.0.0',
    // Subscription
    findSubscriptionPlans: SupabaseSubscriptionProvider.findSubscriptionPlans,
    findSubscriptionInvoices: SupabaseSubscriptionProvider.findSubscriptionInvoices,

    // Methods
    findAll: SupabasePaymentMethodProvider.findAll,
    findById: SupabasePaymentMethodProvider.findById,
    create: SupabasePaymentMethodProvider.create,
    update: SupabasePaymentMethodProvider.update,
    softDelete: SupabasePaymentMethodProvider.softDelete,
    unsetAllDefaults: SupabasePaymentMethodProvider.unsetAllDefaults,
    getIcons: SupabasePaymentMethodProvider.getIcons,
};



