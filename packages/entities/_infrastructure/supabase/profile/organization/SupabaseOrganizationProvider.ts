/**
 * Supabase Organization Provider
 */
import { getSupabase } from '../../client';

// Cache to avoid repeated 404s
let functionExists: boolean | null = null;

export const SupabaseOrganizationProvider = {
    async findPrimaryOrganization(profileId: string) {
        // If we've already determined the function doesn't exist, return null immediately
        if (functionExists === false) {
            return null;
        }

        const { data, error } = await getSupabase().rpc('get_user_primary_organization', { p_profile_id: profileId });

        if (error) {
            // If function doesn't exist (404/PGRST202), cache this result
            if (error.code === 'PGRST202') {
                functionExists = false;
                // Function not found, future calls will be skipped
                return null;
            }
            throw error;
        }

        // Function exists, cache this result
        functionExists = true;
        return data;
    },
};

