/**
 * Subscription Plan Interface
 */
export interface ISubscriptionPlan {
    id: string;
    plan_name: string;
    plan_tier: 'free' | 'pro' | 'enterprise';
    monthly_price: string;
    is_active: boolean;
    features?: string[];
}

