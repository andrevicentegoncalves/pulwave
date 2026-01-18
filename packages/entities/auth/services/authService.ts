/**
 * Auth Service Facade
 * Unified authentication service composed from atomic modules.
 */
import { sessionService } from './session';
import { adminAccessService, AdminAccessResult } from './admin';
import { passwordService } from './password';
import { otpService } from './otp';
import { AuthResult, Session } from '../interfaces';
import { authMethodsService } from './methods';

// Re-export types
export type { AdminAccessResult };

// Re-export atomic services
export * from './session';
export * from './admin';
export * from './password';
export * from './otp';
export * from './methods';
export * from './authContextAdapter';

/**
 * Unified Auth Service Facade
 * Maintains backward compatibility.
 */
export const authService = {
    // Session
    getSession: sessionService.getSession.bind(sessionService),
    getUser: sessionService.getUser.bind(sessionService),
    onAuthStateChange: sessionService.onAuthStateChange.bind(sessionService),
    signOut: sessionService.signOut.bind(sessionService),

    // Admin Access
    verifyAdminAccess: adminAccessService.verifyAdminAccess.bind(adminAccessService),

    // Password
    resetPasswordForEmail: passwordService.resetPasswordForEmail.bind(passwordService),

    // OTP
    signInWithEmailLink: otpService.signInWithEmailLink.bind(otpService),
    sendEmailOTP: otpService.sendEmailOTP.bind(otpService),
    verifyEmailOTP: otpService.verifyEmailOTP.bind(otpService),

    // Auth Methods
    getEnabledAuthMethods: authMethodsService.getEnabledAuthMethods.bind(authMethodsService),

    // Wallet (Stub for now)
    signInWithWallet: async () => ({ data: null, error: new Error('Wallet auth not implemented') }),
};

export default authService;

