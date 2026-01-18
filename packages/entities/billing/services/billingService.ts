/**
 * Billing Service
 * Domain logic for billing history and invoices.
 */
import { billingRepository } from '../repositories/billingRepository';
import { IBillingHistory } from '../../billing/interfaces/IBillingHistory';

export const billingService = {
    /**
     * Get billing history for a user
     */
    async getHistory(userId: string): Promise<IBillingHistory[]> {
        return billingRepository.getHistory(userId);
    },

    /**
     * Get invoice URL
     */
    async getInvoice(invoiceId: string): Promise<string | null> {
        return billingRepository.getInvoice(invoiceId);
    }
};

export default billingService;



