import type { IAddressRepository } from '@pulwave/entity-address';

import { getSupabase } from '../client';
import { withErrorHandling } from '../../errors/mappers';

export const SupabaseAddressRepository: IAddressRepository = {
    version: '1.0.0',
    async getByProfileId(profileId: string) {
        return withErrorHandling(async () => {
            const { data, error } = await getSupabase().from('addresses').select('*').eq('profile_id', profileId);
            if (error) throw error;
            return data || [];
        }, 'Address');
    },

    async getByType(profileId: string, addressType: string) {
        return withErrorHandling(async () => {
            const { data, error } = await getSupabase().from('addresses').select('*').eq('profile_id', profileId).eq('address_type', addressType).maybeSingle();
            if (error) throw error;
            return data;
        }, 'Address');
    },

    async getById(addressId: string) {
        return withErrorHandling(async () => {
            const { data, error } = await getSupabase().from('addresses').select('*').eq('id', addressId).single();
            if (error) throw error;
            return data;
        }, 'Address');
    },

    async upsert(profileId: string, addressType: string, addressData: any) {
        return withErrorHandling(async () => {
            const { data: existing } = await getSupabase().from('addresses').select('id').eq('profile_id', profileId).eq('address_type', addressType).maybeSingle();
            const payload = { profile_id: profileId, address_type: addressType, ...addressData, updated_at: new Date().toISOString() };

            if (existing) {
                const { data, error } = await getSupabase().from('addresses').update(payload).eq('id', existing.id).select().single();
                if (error) throw error;
                return data;
            } else {
                const { data, error } = await getSupabase().from('addresses').insert([{ ...payload, created_at: new Date().toISOString() }]).select().single();
                if (error) throw error;
                return data;
            }
        }, 'Address');
    },

    async delete(addressId: string) {
        return withErrorHandling(async () => {
            const { error } = await getSupabase().from('addresses').delete().eq('id', addressId);
            if (error) throw error;
        }, 'Address');
    },

    async ensureRegion(regionName: string, countryId: string) {
        return withErrorHandling(async () => {
            const { data: existing } = await getSupabase().from('regions').select('id').eq('name', regionName).eq('country_id', countryId).maybeSingle();
            if (existing) return existing.id;

            const { data, error } = await getSupabase()
                .from('regions')
                .insert([{ name: regionName, country_id: countryId, created_at: new Date().toISOString() }])
                .select()
                .single();

            if (error) throw error;
            return data.id;
        }, 'Address');
    }
};



