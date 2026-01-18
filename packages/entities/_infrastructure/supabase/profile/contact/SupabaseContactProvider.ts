/**
 * Supabase Contact Provider
 */
import type { Contact } from '@pulwave/entity-profile';

import { getSupabase } from '../../client';
import { withErrorHandling } from '../../../errors/mappers';

export const SupabaseContactProvider = {
    async findContacts(profileId: string): Promise<Contact[]> {
        return withErrorHandling(async () => {
            const { data, error } = await getSupabase()
                .from('contacts')
                .select('*')
                .eq('profile_id', profileId);

            if (error) throw error;
            return (data || []) as Contact[];
        }, 'Contact');
    },

    async upsertContact(data: Partial<Contact>): Promise<Contact> {
        return withErrorHandling(async () => {
            // Check if exists by profile_id and contact_type
            if (data.profile_id && data.contact_type) {
                const { data: existing } = await getSupabase()
                    .from('contacts')
                    .select('id')
                    .eq('profile_id', data.profile_id)
                    .eq('contact_type', data.contact_type)
                    .maybeSingle();

                if (existing) {
                    const { data: result, error } = await getSupabase()
                        .from('contacts')
                        .update({ ...data, updated_at: new Date().toISOString() })
                        .eq('id', existing.id)
                        .select()
                        .single();
                    if (error) throw error;
                    return result as Contact;
                }
            }

            // Insert
            const { data: result, error } = await getSupabase()
                .from('contacts')
                .insert({ ...data, created_at: new Date().toISOString() })
                .select()
                .single();

            if (error) throw error;
            return result as Contact;
        }, 'Contact');
    },

    async deleteContact(id: string): Promise<void> {
        return withErrorHandling(async () => {
            const { error } = await getSupabase()
                .from('contacts')
                .update({ is_active: false })
                .eq('id', id);

            if (error) throw error;
        }, 'Contact');
    },
};



