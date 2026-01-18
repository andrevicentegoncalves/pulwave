/**
 * Supabase Payment Method Provider
 * Payment methods and icons.
 */
import type { PaymentMethod, PaymentMethodIcon } from '@pulwave/entity-payment';

import { getSupabase } from '../../client';
import { withErrorHandling } from '../../../errors/mappers';

export const SupabasePaymentMethodProvider = {
    async findAll(organizationId: string): Promise<PaymentMethod[]> {
        return withErrorHandling(async () => {
            const { data, error } = await getSupabase()
                .from('payment_methods')
                .select('*')
                .eq('organization_id', organizationId)
                .eq('is_active', true);

            if (error) throw error;
            return (data || []) as PaymentMethod[];
        }, 'PaymentMethod');
    },

    async findById(id: string): Promise<PaymentMethod | null> {
        return withErrorHandling(async () => {
            const { data, error } = await getSupabase()
                .from('payment_methods')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data as PaymentMethod;
        }, 'PaymentMethod');
    },

    async create(data: Partial<PaymentMethod>): Promise<PaymentMethod> {
        return withErrorHandling(async () => {
            const { data: result, error } = await getSupabase()
                .from('payment_methods')
                .insert(data)
                .select()
                .single();

            if (error) throw error;
            return result as PaymentMethod;
        }, 'PaymentMethod');
    },

    async update(id: string, updates: Partial<PaymentMethod>): Promise<PaymentMethod> {
        return withErrorHandling(async () => {
            const { data: result, error } = await getSupabase()
                .from('payment_methods')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return result as PaymentMethod;
        }, 'PaymentMethod');
    },

    async softDelete(id: string): Promise<void> {
        return withErrorHandling(async () => {
            const { error } = await getSupabase()
                .from('payment_methods')
                .update({ is_active: false })
                .eq('id', id);

            if (error) throw error;
        }, 'PaymentMethod');
    },

    async unsetAllDefaults(organizationId: string): Promise<void> {
        return withErrorHandling(async () => {
            const { error } = await getSupabase()
                .from('payment_methods')
                .update({ is_default: false })
                .eq('organization_id', organizationId);

            if (error) throw error;
        }, 'PaymentMethod');
    },

    async getIcons(): Promise<PaymentMethodIcon[]> {
        return withErrorHandling(async () => {
            const { data, error } = await getSupabase()
                .from('payment_icons')
                .select('*')
                .order('display_order', { ascending: true });

            if (error) throw error;
            return (data || []) as PaymentMethodIcon[];
        }, 'PaymentIcon');
    },
};




