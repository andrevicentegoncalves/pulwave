/**
 * Supabase Auth State Provider
 * User authentication state management.
 */
import { getSupabase } from '../../client';

export const SupabaseAuthStateProvider = {
    async updateAuthState(profileId: string, updates: Record<string, unknown>): Promise<void> {
        const { data: existing } = await getSupabase()
            .from('profile_auth_state')
            .select('profile_id')
            .eq('profile_id', profileId)
            .maybeSingle();

        if (existing) {
            const { error } = await getSupabase()
                .from('profile_auth_state')
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq('profile_id', profileId);

            if (error) throw error;
        } else {
            const { error } = await getSupabase()
                .from('profile_auth_state')
                .insert({ profile_id: profileId, ...updates });

            if (error) throw error;
        }
    },
};

