/**
 * Supabase Preferences Provider
 */
import type { UserPreferences } from '@pulwave/entity-profile';

import { getSupabase } from '../../client';
import { withErrorHandling } from '../../../errors/mappers';

export const SupabasePreferencesProvider = {
    async findPreferences(profileId: string): Promise<UserPreferences | null> {
        return withErrorHandling(async () => {
            const { data, error } = await getSupabase()
                .from('user_preferences')
                .select('*')
                .eq('profile_id', profileId)
                .maybeSingle();
            if (error) throw error;
            return data as UserPreferences;
        }, 'UserPreferences');
    },

    async upsertPreferences(data: Partial<UserPreferences>): Promise<UserPreferences> {
        return withErrorHandling(async () => {
            const { data: result, error } = await getSupabase()
                .from('user_preferences')
                .upsert(data, { onConflict: 'profile_id' })
                .select()
                .single();
            if (error) throw error;
            return result as UserPreferences;
        }, 'UserPreferences');
    },
};

