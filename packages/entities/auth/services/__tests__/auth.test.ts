/**
 * Auth Service Tests
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sessionService } from '../session/sessionService';
import { otpService } from '../otp/otpService';
import type { AuthResult, User, Session } from '../../interfaces';

// Mock user repository
vi.mock('../../repositories/userRepository', () => ({
    userRepository: {
        getSession: vi.fn(),
        getCurrentUser: vi.fn(),
        signOut: vi.fn(),
        onAuthStateChange: vi.fn(),
    },
}));

import { userRepository } from '../../repositories/userRepository';

describe('Auth Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getSession', () => {
        it('should return session and user when authenticated', async () => {
            const mockUser: User = {
                id: '123',
                aud: 'authenticated',
                email: 'test@example.com',
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

            const mockResult: AuthResult<{ session: Session | null; user: User | null }> = {
                success: true,
                data: {
                    session: mockSession,
                    user: mockUser,
                },
            };
            vi.mocked(userRepository.getSession).mockResolvedValue(mockResult);

            const result = await sessionService.getSession();

            expect(result.data?.session).toEqual(mockSession);
            expect(result.data?.user).toEqual(mockUser);
            expect(userRepository.getSession).toHaveBeenCalled();
        });

        it('should return nulls when no session exists', async () => {
            const mockResult: AuthResult<{ session: Session | null; user: User | null }> = {
                success: true,
                data: {
                    session: null,
                    user: null,
                },
            };
            vi.mocked(userRepository.getSession).mockResolvedValue(mockResult);

            const result = await sessionService.getSession();

            expect(result.data?.session).toBeNull();
            expect(result.data?.user).toBeNull();
        });

        it('should handle errors gracefully', async () => {
            vi.mocked(userRepository.getSession).mockRejectedValue(new Error('Auth error'));

            const result = await sessionService.getSession();

            expect(result.data?.session).toBeUndefined();
            expect(result.data?.user).toBeUndefined();
            expect(result.success).toBe(false);
        });
    });

    describe('getUser', () => {
        it('should return user from session', async () => {
            const mockUser: User = {
                id: '123',
                aud: 'authenticated',
                email: 'test@example.com',
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

            const mockResult: AuthResult<{ session: Session | null; user: User | null }> = {
                success: true,
                data: {
                    session: mockSession,
                    user: mockUser,
                },
            };
            vi.mocked(userRepository.getSession).mockResolvedValue(mockResult);

            const result = await sessionService.getUser();

            expect(result).toEqual(mockUser);
        });
    });

    describe('signOut', () => {
        it('should call repository signOut', async () => {
            vi.mocked(userRepository.signOut).mockResolvedValue({ success: true });

            await sessionService.signOut();

            expect(userRepository.signOut).toHaveBeenCalled();
        });

        it('should throw error if signOut fails', async () => {
            const error = new Error('Sign out failed');
            vi.mocked(userRepository.signOut).mockResolvedValue({
                success: false,
                error: { message: 'Sign out failed' }
            });

            const res = await sessionService.signOut();
            expect(res.success).toBe(false);
            expect(res.error?.message).toBe('Sign out failed');
        });
    });
});




