/**
 * Subscription Types
 */
export interface SubscriptionPlan {
    id: string;
    price: number;
    interval: string;
    currency: string;
    description?: string;
    is_active: boolean;
}

export interface SubscriptionInvoice {
    id: string;
    organization_id: string;
    amount: number;
    currency: string;
    status: string;
    created_at: string;
}

