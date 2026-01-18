/**
 * Billing History Interface
 */
export interface IBillingHistory {
    id: string;
    user_id: string;
    amount: string;
    currency: string;
    status: 'paid' | 'pending' | 'failed';
    date: string;
    invoice_url?: string;
}

