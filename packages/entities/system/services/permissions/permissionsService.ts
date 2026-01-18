/**
 * Permissions Admin Service
 * Permission management for admin backoffice.
 */
import { userRepository } from '@pulwave/entity-auth';
import { systemRepository } from '../../repositories/systemRepository';

export const permissionsService = {
    async getUserPermissions(userId: string) {
        return userRepository.getUserPermissions(userId);
    },

    async checkUserHasPermission(userId: string, permissionName: string) {
        return userRepository.checkUserHasPermission(userId, permissionName);
    },

    async getUserPermissionGrants(userId: string) {
        return userRepository.getUserPermissionGrants(userId);
    },

    async grantUserPermission(userId: string, permissionId: string, grantedBy: string, reason: string, expiresAt: string) {
        return userRepository.grantUserPermission(userId, permissionId, grantedBy, reason, expiresAt);
    },

    async revokeUserPermission(userId: string, permissionId: string) {
        return userRepository.revokeUserPermission(userId, permissionId);
    },

    async getAllPermissions() {
        return userRepository.getAllPermissions();
    },

    async getPermissions() {
        return systemRepository.getPermissions();
    },

    async getRolePermissions(roleId: string) {
        return systemRepository.getRolePermissions(roleId);
    },

    async getAllUserPermissions(userId: string) {
        return systemRepository.getAllUserPermissions(userId);
    },
};



