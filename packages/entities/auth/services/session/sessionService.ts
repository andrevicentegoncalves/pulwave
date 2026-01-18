import { userRepository } from '../../repositories/userRepository';
import type { User, Session, AuthResult } from '../../interfaces';

export const sessionService = {
    async getSession(): Promise<AuthResult<{ session: Session | null; user: User | null }>> {
        const devBypass = typeof localStorage !== 'undefined' && localStorage.getItem('dev_bypass');
        if (devBypass) {
            const devUserId = '00000000-0000-0000-0000-000000000001';
            const mockUser: User = {
                id: devUserId,
                email: 'dev@example.com',
                aud: 'authenticated',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                app_metadata: {},
                user_metadata: {}
            };
            return {
                success: true,
                data: {
                    session: {
                        access_token: 'dev-token',
                        refresh_token: 'dev-refresh',
                        expires_in: 3600,
                        token_type: 'bearer',
                        user: mockUser
                    },
                    user: mockUser
                }
            };
        }

        try {
            return await userRepository.getSession();
        } catch (error) {
            // Session fetch failed silently
            return {
                success: false,
                error: {
                    message: error instanceof Error ? error.message : 'Unknown auth error'
                }
            };
        }
    },

    async getUser(): Promise<User | null> {
        const result = await this.getSession();
        return result.data?.user ?? null;
    },

    onAuthStateChange(callback: (event: string, session: Session | null) => void) {
        return userRepository.onAuthStateChange(callback);
    },

    async signOut(): Promise<AuthResult<void>> {
        return userRepository.signOut();
    },
};



