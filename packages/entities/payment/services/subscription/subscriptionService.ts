/**
 * Subscription Service
 * Management of subscription plans and billing history.
 */
import { paymentRepository } from '../../repositories/paymentRepository';
import { SubscriptionPlan, SubscriptionInvoice } from '../../interfaces/types/Subscription';

export const subscriptionService = {
    async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
        return paymentRepository.findSubscriptionPlans();
    },

    async getBillingHistory(organizationId: string): Promise<SubscriptionInvoice[]> {
        return paymentRepository.findSubscriptionInvoices(organizationId);
    },
};



