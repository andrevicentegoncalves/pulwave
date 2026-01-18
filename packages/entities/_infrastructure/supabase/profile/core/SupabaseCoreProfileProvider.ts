/**
 * Supabase Core Profile Provider
 * Core CRUD operations for profiles.
 */
import type { Profile } from '@pulwave/entity-profile';

import { getSupabase } from '../../client';
import { withErrorHandling } from '../../../errors/mappers';

export const SupabaseCoreProfileProvider = {
    async findById(id: string): Promise<Profile | null> {
        return withErrorHandling(async () => {
            const { data, error } = await getSupabase()
                .from('profiles')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data as Profile;
        }, 'Profile');
    },

    async findByAuthUserId(authUserId: string): Promise<Profile | null> {
        return withErrorHandling(async () => {
            const { data, error } = await getSupabase()
                .from('profiles')
                .select('*')
                .eq('auth_user_id', authUserId)
                .maybeSingle();

            if (error) throw error;
            return data as Profile;
        }, 'Profile');
    },

    async create(profileData: Partial<Profile>): Promise<Profile> {
        return withErrorHandling(async () => {
            const { data, error } = await getSupabase()
                .from('profiles')
                .insert(profileData)
                .select()
                .single();

            if (error) throw error;
            return data as Profile;
        }, 'Profile');
    },

    async update(id: string, updates: Partial<Profile>): Promise<Profile> {
        return withErrorHandling(async () => {
            const { data, error } = await getSupabase()
                .from('profiles')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data as Profile;
        }, 'Profile');
    },
};



