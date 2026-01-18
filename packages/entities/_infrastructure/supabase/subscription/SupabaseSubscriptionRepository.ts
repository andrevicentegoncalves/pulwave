/**
 * Supabase Subscription Repository
 */
import type { ISubscriptionPlan, ISubscriptionRepository } from '@pulwave/entity-subscription';

import { getSupabase } from '../client';

export class SupabaseSubscriptionRepository implements ISubscriptionRepository {
    readonly version = '1.0.0';
    async getPlans(): Promise<ISubscriptionPlan[]> {
        const { data, error } = await getSupabase()
            .from('subscription_plans')
            .select('*')
            .eq('is_active', true);

        if (error) throw error;
        return data as ISubscriptionPlan[];
    }

    async getCurrentPlan(userId: string): Promise<ISubscriptionPlan | null> {
        // Implementation logic to fetch user's plan
        // This might involve joining user_subscriptions table
        // For now returning mock or basic logic as per existing usage

        // This is a placeholder for the logic found in AccountBilling.tsx which was fetching free plans if nothing else
        // Ideally we fetch from 'user_subscriptions' table (if it exists) or return default.

        const { data, error } = await getSupabase()
            .from('subscription_plans')
            .select('*')
            .eq('plan_tier', 'free') // Fallback logic from AccountBilling
            .eq('is_active', true)
            .limit(1);

        if (error) throw error;
        return data?.[0] as ISubscriptionPlan || null;
    }
}




