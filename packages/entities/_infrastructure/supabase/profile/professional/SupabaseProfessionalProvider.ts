/**
 * Supabase Professional Profile Provider
 */
import type { ProfessionalProfile } from '@pulwave/entity-profile';

import { getSupabase } from '../../client';
import { withErrorHandling } from '../../../errors/mappers';

export const SupabaseProfessionalProvider = {
    async findProfessionalProfile(profileId: string): Promise<ProfessionalProfile | null> {
        return withErrorHandling(async () => {
            const { data, error } = await getSupabase()
                .from('professional_profiles')
                .select('*')
                .eq('profile_id', profileId)
                .maybeSingle();
            if (error) throw error;
            return data as ProfessionalProfile;
        }, 'ProfessionalProfile');
    },

    async upsertProfessionalProfile(data: ProfessionalProfile): Promise<ProfessionalProfile> {
        return withErrorHandling(async () => {
            const { data: result, error } = await getSupabase()
                .from('professional_profiles')
                .upsert(data)
                .select()
                .single();
            if (error) throw error;
            return result as ProfessionalProfile;
        }, 'ProfessionalProfile');
    },
};

