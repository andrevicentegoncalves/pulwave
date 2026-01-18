/**
 * User Admin Service
 * User management operations for admin backoffice.
 */
import { userRepository } from '@pulwave/entity-auth';
import type { UserData, UserQueryParams } from '@pulwave/entity-auth';

type AllowedUserFields = Pick<UserData, 'first_name' | 'last_name' | 'email' | 'app_role' | 'is_active'>;

export const userService = {
    async getUsers(options: UserQueryParams = {}): Promise<{ data: UserData[]; count: number | null }> {
        return userRepository.getUsers(options);
    },

    async getUserById(id: string): Promise<UserData | null> {
        return userRepository.getUserById(id);
    },

    async createUser(userData: Partial<UserData>): Promise<UserData> {
        if (!userData.email) {
            throw new Error('Email is required');
        }
        return userRepository.createUser(userData);
    },

    async updateUser(id: string, updates: Partial<UserData>): Promise<UserData> {
        const allowedFields: (keyof AllowedUserFields)[] = ['first_name', 'last_name', 'email', 'app_role', 'is_active'];
        const sanitized = Object.keys(updates)
            .filter((key): key is keyof AllowedUserFields => allowedFields.includes(key as keyof AllowedUserFields))
            .reduce<Partial<AllowedUserFields>>((obj, key) => ({ ...obj, [key]: updates[key] }), {});

        return userRepository.updateUser(id, sanitized);
    },

    async deleteUser(id: string): Promise<void> {
        await Promise.all([
            userRepository.updateUser(id, { is_deleted: true, deleted_at: new Date().toISOString() } as Partial<UserData>),
            userRepository.updateAuthState(id, { is_suspended: true })
        ]);
    },

    async suspendUser(id: string, reason: string): Promise<void> {
        return userRepository.updateAuthState(id, {
            is_suspended: true,
            suspension_reason: reason,
            suspended_at: new Date().toISOString()
        });
    },

    async activateUser(id: string): Promise<void> {
        return userRepository.updateAuthState(id, {
            is_suspended: false,
            suspension_reason: null,
            suspended_at: null
        });
    },
};



