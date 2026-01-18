/**
 * Supabase Export Provider
 */
import type { UserExportData } from '@pulwave/entity-profile';

import { getSupabase } from '../../client';
import { withErrorHandling } from '../../../errors/mappers';

export const SupabaseExportProvider = {
    async exportUserData(profileId: string): Promise<UserExportData> {
        return withErrorHandling(async () => {
            const { data, error } = await getSupabase().rpc('export_user_data', { p_profile_id: profileId });
            if (error) throw error;
            return data as UserExportData;
        }, 'ExportData');
    },
};

