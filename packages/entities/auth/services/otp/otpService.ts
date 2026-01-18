import { userRepository } from '../../repositories/userRepository';
import type { AuthResult, Session, User } from '../../interfaces';

export const otpService = {
    async signInWithEmailLink(email: string, options: { redirectTo?: string } = {}): Promise<AuthResult<void>> {
        return userRepository.signInWithOtp({
            email,
            options: {
                emailRedirectTo: options.redirectTo || `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`,
                ...options
            }
        });
    },

    async sendEmailOTP(email: string): Promise<AuthResult<void>> {
        return userRepository.signInWithOtp({
            email,
            options: {
                shouldCreateUser: true,
            }
        });
    },

    async verifyEmailOTP(email: string, token: string): Promise<AuthResult<{ session: Session; user: User }>> {
        return userRepository.verifyOtp({
            email,
            token,
            type: 'email'
        });
    },
};


