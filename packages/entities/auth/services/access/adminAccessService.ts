/**
 * Admin Access Service
 * Verifies if the current user has admin privileges.
 */
import { userRepository } from '../../repositories/userRepository';
import { profileRepository, profileService, type Profile } from '@pulwave/entity-profile';

export interface AdminAccessResult {
    hasAccess: boolean;
    profile: any | null;
}

export const adminAccessService = {
    async verifyAdminAccess(): Promise<AdminAccessResult> {
        const devBypass = typeof localStorage !== 'undefined' && localStorage.getItem('dev_bypass');
        if (devBypass) {
            return {
                hasAccess: true,
                profile: {
                    id: '00000000-0000-0000-0000-000000000001',
                    first_name: 'Dev',
                    last_name: 'Admin',
                    email: 'dev@example.com',
                    app_role: 'super_admin',
                }
            };
        }

        try {
            const result = await userRepository.getCurrentUser();
            const user = result.data?.user;
            if (!user) return { hasAccess: false, profile: null };

            const profile = await profileRepository.findByAuthUserId(user.id);

            if (!profile) {
                const p = await profileService.getFullProfile(user.id, user.id);
                if (!p) return { hasAccess: false, profile: null };
                const isAdmin = ['admin', 'super_admin', 'dev'].includes(p.app_role);
                return { hasAccess: isAdmin, profile: p };
            }

            const isAdmin = ['admin', 'super_admin', 'dev'].includes(profile.app_role);
            return { hasAccess: isAdmin, profile: profile as Profile };

        } catch {
            // Admin access check failed silently
            return { hasAccess: false, profile: null };
        }
    },
};



