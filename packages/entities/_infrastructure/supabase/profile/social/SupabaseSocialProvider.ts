/**
 * Supabase Social Profile Provider
 */
import type { SocialProfile } from '@pulwave/entity-profile';

import { getSupabase } from '../../client';
import { withErrorHandling } from '../../../errors/mappers';

export const SupabaseSocialProvider = {
    async findSocialProfiles(profileId: string): Promise<SocialProfile[]> {
        return withErrorHandling(async () => {
            const { data, error } = await getSupabase()
                .from('social_profiles')
                .select('*')
                .eq('profile_id', profileId);

            if (error) throw error;
            return (data || []) as SocialProfile[];
        }, 'SocialProfile');
    },

    async upsertSocialProfile(data: SocialProfile): Promise<SocialProfile> {
        return withErrorHandling(async () => {
            const { data: result, error } = await getSupabase()
                .from('social_profiles')
                .upsert(data, { onConflict: 'profile_id,platform' })
                .select()
                .single();

            if (error) throw error;
            return result as SocialProfile;
        }, 'SocialProfile');
    },

    async deleteSocialProfile(profileId: string, platform: string): Promise<void> {
        return withErrorHandling(async () => {
            const { error } = await getSupabase()
                .from('social_profiles')
                .delete()
                .eq('profile_id', profileId)
                .eq('platform', platform);

            if (error) throw error;
        }, 'SocialProfile');
    },
};



