/**
 * Supabase Permissions Provider
 * Roles and permissions.
 */
import { getSupabase } from '../../client';

export const SupabasePermissionsProvider = {
    async getPermissions(): Promise<string[]> {
        const { data, error } = await getSupabase()
            .from('permissions')
            .select('permission_name')
            .eq('is_active', true)
            .order('permission_category', { ascending: true });

        if (error) throw error;
        return (data || []).map(p => p.permission_name);
    },

    async getRolePermissions(role: string): Promise<string[]> {
        const { data, error } = await getSupabase()
            .rpc('get_role_permissions', { p_role_name: role });

        if (error) throw error;
        return data || [];
    },

    async getAllUserPermissions(userId: string): Promise<string[]> {
        const { data, error } = await getSupabase()
            .rpc('get_user_permissions', { p_user_id: userId });

        if (error) return [];
        return data || [];
    },
};

