/**
 * Auth Sub-Services Tests
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { otpService } from '../otp/otpService';
import { passwordService } from '../password/passwordService';
import { authMethodsService } from '../methods/authMethodsService';
import type { AuthResult, User, Session } from '../../interfaces';
import type { ProfileAuthState } from '@pulwave/entity-profile';

// Mock repositories
vi.mock('../../repositories/userRepository', () => ({
    userRepository: {
        signInWithOtp: vi.fn(),
        verifyOtp: vi.fn(),
        resetPasswordForEmail: vi.fn(),
    },
}));

vi.mock('@pulwave/entity-profile', () => ({
    profileRepository: {
        findAuthState: vi.fn(),
    },
}));

import { userRepository } from '../../repositories/userRepository';
import { profileRepository } from '@pulwave/entity-profile';

describe('Auth Sub-Services', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('OTP Service', () => {
        it('should send email OTP', async () => {
            const mockResult: AuthResult<void> = { success: true };
            vi.mocked(userRepository.signInWithOtp).mockResolvedValue(mockResult);
            const result = await otpService.sendEmailOTP('test@example.com');
            expect(result.success).toBe(true);
            expect(userRepository.signInWithOtp).toHaveBeenCalled();
        });

        it('should verify email OTP', async () => {
            const mockUser: User = {
                id: '1',
                aud: 'authenticated',
                app_metadata: {},
                user_metadata: {},
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
            const mockSession: Session = {
                access_token: 'token',
                refresh_token: 'refresh',
                expires_in: 3600,
                token_type: 'bearer',
                user: mockUser,
            };
            const mockResult: AuthResult<{ session: Session; user: User }> = {
                success: true,
                data: { session: mockSession, user: mockUser },
            };
            vi.mocked(userRepository.verifyOtp).mockResolvedValue(mockResult);
            const result = await otpService.verifyEmailOTP('test@example.com', '123456');
            expect(result.success).toBe(true);
            expect(userRepository.verifyOtp).toHaveBeenCalled();
        });
    });

    describe('Password Service', () => {
        it('should reset password for email', async () => {
            const mockResult: AuthResult<void> = { success: true };
            vi.mocked(userRepository.resetPasswordForEmail).mockResolvedValue(mockResult);
            const result = await passwordService.resetPasswordForEmail('test@example.com');
            expect(result.success).toBe(true);
            expect(userRepository.resetPasswordForEmail).toHaveBeenCalledWith('test@example.com', {});
        });
    });

    describe('Auth Methods Service', () => {
        it('should get enabled auth methods', async () => {
            const mockProfile: ProfileAuthState = {
                profile_id: 'p1',
                auth_methods: ['email'],
                webauthn_enabled: true,
                mfa_enabled: false,
            };
            vi.mocked(profileRepository.findAuthState).mockResolvedValue(mockProfile);
            const result = await authMethodsService.getEnabledAuthMethods('p1');
            expect(result).toContain('email');
            expect(result).toContain('passkey');
            expect(profileRepository.findAuthState).toHaveBeenCalledWith('p1');
        });
    });
});


