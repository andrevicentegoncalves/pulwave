/**
 * Subscription internal types
 */

export interface SubscriptionPlan {
    id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    interval: 'month' | 'year';
    features: string[];
    isPopular?: boolean;
    isCurrent?: boolean;
}

export interface BillingRecord {
    id: string;
    date: Date;
    amount: number;
    currency: string;
    status: 'paid' | 'pending' | 'failed' | 'refunded';
    description: string;
    invoiceUrl?: string;
}
