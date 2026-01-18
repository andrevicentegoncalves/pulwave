/**
 * Supabase Onboarding Provider
 */
import type { OnboardingStatus } from '@pulwave/entity-profile';

import { getSupabase } from '../../client';
import { withErrorHandling } from '../../../errors/mappers';

// Cache to avoid repeated 404s
let tableExists: boolean | null = null;

export const SupabaseOnboardingProvider = {
    async findOnboardingStatus(profileId: string): Promise<OnboardingStatus | null> {
        // If we've already determined the table doesn't exist, return null immediately
        if (tableExists === false) {
            return null;
        }

        try {
            const result = await withErrorHandling(async () => {
                const { data, error } = await getSupabase()
                    .from('onboarding_status')
                    .select('*')
                    .eq('profile_id', profileId)
                    .maybeSingle();

                if (error) throw error;
                return data as OnboardingStatus;
            }, 'OnboardingStatus');

            // Table exists, cache this result
            tableExists = true;
            return result;
        } catch (error: any) {
            // If table doesn't exist (404/PGRST204), cache this result
            if (error.message?.includes('onboarding_status') || error.code === 'PGRST204') {
                tableExists = false;
                // Table not found, future calls will be skipped
                return null;
            }
            throw error;
        }
    },
};

