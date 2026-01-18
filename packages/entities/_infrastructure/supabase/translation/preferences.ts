import type { UserPreference } from '@pulwave/entity-translation';

import { getSupabase } from '../client';

export const SupabasePreferencesProvider = {
    async updateUserLocale(profileId: string, locale: string): Promise<UserPreference> {
        const { data: existing } = await getSupabase().from('user_preferences').select('id').eq('profile_id', profileId).maybeSingle();
        if (existing) {
            const { data, error } = await getSupabase()
                .from('user_preferences')
                .update({ locale, updated_at: new Date().toISOString() })
                .eq('profile_id', profileId)
                .select('id, profile_id, locale, updated_at')
                .single();
            if (error) throw error;
            return data as UserPreference;
        } else {
            const { data, error } = await getSupabase()
                .from('user_preferences')
                .insert({ profile_id: profileId, locale })
                .select('id, profile_id, locale, updated_at')
                .single();
            if (error) throw error;
            return data as UserPreference;
        }
    },

    async getUserPreference(profileId: string): Promise<UserPreference | null> {
        const { data, error } = await getSupabase()
            .from('user_preferences')
            .select('id, profile_id, locale, updated_at')
            .eq('profile_id', profileId)
            .maybeSingle();

        if (error) throw error;
        return data as UserPreference | null;
    }
};
