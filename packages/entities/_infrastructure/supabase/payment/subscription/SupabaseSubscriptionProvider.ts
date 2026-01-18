/**
 * Supabase Subscription Provider
 * Subscription plans and invoices.
 */
import type { SubscriptionInvoice, SubscriptionPlan } from '@pulwave/entity-payment';

import { getSupabase } from '../../client';
import { withErrorHandling } from '../../../errors/mappers';

export const SupabaseSubscriptionProvider = {
    async findSubscriptionPlans(): Promise<SubscriptionPlan[]> {
        return withErrorHandling(async () => {
            const { data, error } = await getSupabase()
                .from('subscription_plans')
                .select('*')
                .eq('is_active', true);

            if (error) throw error;
            return (data || []) as SubscriptionPlan[];
        }, 'SubscriptionPlan');
    },

    async findSubscriptionInvoices(organizationId: string): Promise<SubscriptionInvoice[]> {
        return withErrorHandling(async () => {
            const { data, error } = await getSupabase()
                .from('subscription_invoices')
                .select('*')
                .eq('organization_id', organizationId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return (data || []) as SubscriptionInvoice[];
        }, 'SubscriptionInvoice');
    },
};



