/**
 * Supabase Auth State Provider
 */
import type { ProfileAuthState } from '@pulwave/entity-profile';

import { getSupabase } from '../../client';
import { withErrorHandling } from '../../../errors/mappers';

export const SupabaseAuthStateProvider = {
    async findAuthState(profileId: string): Promise<ProfileAuthState | null> {
        return withErrorHandling(async () => {
            const { data, error } = await getSupabase()
                .from('profile_auth_state')
                .select('*')
                .eq('profile_id', profileId)
                .maybeSingle();

            if (error) throw error;
            return data as ProfileAuthState;
        }, 'AuthState');
    },

    async upsertAuthState(profileId: string, data: Partial<ProfileAuthState>): Promise<ProfileAuthState> {
        return withErrorHandling(async () => {
            const { data: result, error } = await getSupabase()
                .from('profile_auth_state')
                .upsert({ ...data, profile_id: profileId })
                .select()
                .single();

            if (error) throw error;
            return result as ProfileAuthState;
        }, 'AuthState');
    },
};

