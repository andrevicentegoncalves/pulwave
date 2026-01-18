import type { Permission, PermissionGrant } from '@pulwave/entity-auth';

import { getSupabase } from '../../client';

export const SupabaseUserPermissionsProvider = {
    async getUserPermissions(userId: string): Promise<string[]> {
        const { data, error } = await getSupabase().rpc('get_user_permissions', { p_user_id: userId });
        if (error) throw error;
        return data || [];
    },

    async checkUserHasPermission(userId: string, permissionName: string): Promise<boolean> {
        const { data, error } = await getSupabase().rpc('user_has_permission', { p_user_id: userId, p_permission_name: permissionName });
        if (error) throw error;
        return data || false;
    },

    async getUserPermissionGrants(userId: string): Promise<PermissionGrant[]> {
        const { data, error } = await getSupabase()
            .from('user_permissions')
            .select('*')
            .eq('user_id', userId);

        if (error) throw error;
        return (data || []) as unknown as PermissionGrant[];
    },

    async grantUserPermission(
        userId: string,
        permissionId: string,
        grantedBy: string,
        reason: string | null = null,
        expiresAt: string | null = null
    ): Promise<PermissionGrant> {
        const { data, error } = await getSupabase()
            .from('user_permissions')
            .upsert({
                user_id: userId,
                permission_id: permissionId,
                is_granted: true,
                granted_by: grantedBy,
                reason,
                expires_at: expiresAt,
                granted_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id,permission_id' })
            .select()
            .single();

        if (error) throw error;
        return data as unknown as PermissionGrant;
    },

    async revokeUserPermission(userId: string, permissionId: string): Promise<void> {
        const { error } = await getSupabase()
            .from('user_permissions')
            .delete()
            .eq('user_id', userId)
            .eq('permission_id', permissionId);

        if (error) throw error;
    },

    async getAllPermissions(): Promise<Permission[]> {
        const { data, error } = await getSupabase()
            .from('permissions')
            .select('*')
            .eq('is_active', true)
            .order('permission_category', { ascending: true });

        if (error) throw error;
        return (data || []) as unknown as Permission[];
    },
};

