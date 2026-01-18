/**
 * Supabase Profile Address Provider
 */
import type { Address } from '@pulwave/entity-address';

import { getSupabase } from '../../client';
import { withErrorHandling } from '../../../errors/mappers';

export const SupabaseAddressRefProvider = {
    async findAddress(id: string | null): Promise<Address | null> {
        return withErrorHandling(async () => {
            if (!id) return null;
            const { data, error } = await getSupabase()
                .from('addresses')
                .select('*')
                .eq('id', id)
                .single();
            if (error) throw error;
            return data as Address;
        }, 'Address');
    },
};

