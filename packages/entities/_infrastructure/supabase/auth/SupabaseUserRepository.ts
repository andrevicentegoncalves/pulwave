/**
 * Supabase User Repository
 * IUserRepository implementation.
 * Composed from atomic provider modules.
 */
import type { IUserRepository } from '@pulwave/entity-auth';
import { SupabaseUserProvider } from './users';
import { SupabaseUserPermissionsProvider } from './permissions';
import { SupabaseAuthStateProvider } from './state';

export const SupabaseUserRepository: IUserRepository = {
    version: '1.0.0',
    // Auth
    getSession: SupabaseUserProvider.getSession,
    getCurrentUser: SupabaseUserProvider.getCurrentUser,
    signOut: SupabaseUserProvider.signOut,
    resetPasswordForEmail: SupabaseUserProvider.resetPasswordForEmail,
    signInWithOtp: SupabaseUserProvider.signInWithOtp,
    verifyOtp: SupabaseUserProvider.verifyOtp,
    onAuthStateChange: SupabaseUserProvider.onAuthStateChange,

    // Users
    getUsers: SupabaseUserProvider.getUsers,
    getUserById: SupabaseUserProvider.getUserById,
    createUser: SupabaseUserProvider.createUser,
    updateUser: SupabaseUserProvider.updateUser,

    // Auth State
    updateAuthState: SupabaseAuthStateProvider.updateAuthState,

    // Permissions
    getUserPermissions: SupabaseUserPermissionsProvider.getUserPermissions,
    checkUserHasPermission: SupabaseUserPermissionsProvider.checkUserHasPermission,
    getUserPermissionGrants: SupabaseUserPermissionsProvider.getUserPermissionGrants,
    grantUserPermission: SupabaseUserPermissionsProvider.grantUserPermission,
    revokeUserPermission: SupabaseUserPermissionsProvider.revokeUserPermission,
    getAllPermissions: SupabaseUserPermissionsProvider.getAllPermissions,
};



