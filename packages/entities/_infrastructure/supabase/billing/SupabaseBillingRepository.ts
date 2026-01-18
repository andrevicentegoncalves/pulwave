/**
 * Supabase Billing Repository
 */
import type { IBillingHistory, IBillingRepository } from '@pulwave/entity-billing';

import { getSupabase } from '../client';

export class SupabaseBillingRepository implements IBillingRepository {
    readonly version = '1.0.0';
    async getHistory(userId: string): Promise<IBillingHistory[]> {
        const { data, error } = await getSupabase()
            .from('billing_history')
            .select('*')
            .eq('user_id', userId)
            .order('date', { ascending: false });

        if (error) {
            // If table doesn't exist yet, return empty array to prevent crash
            return [];
        }
        return data as IBillingHistory[];
    }

    async getInvoice(invoiceId: string): Promise<string | null> {
        // Mock implementation for invoice URL
        return `https://api.pulwave.com/invoices/${invoiceId}.pdf`;
    }
}




