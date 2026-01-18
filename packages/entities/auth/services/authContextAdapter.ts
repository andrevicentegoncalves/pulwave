/**
 * Auth Context Adapter
 *
 * Adapts the internal AuthResult-based authService to match
 * the interface expected by AuthContext/AuthProvider.
 */
import { sessionService } from './session';
import type { Session, User } from '../interfaces';

/**
 * Interface expected by AuthContext
 */
export interface AuthContextService {
    getSession(): Promise<{ session: Session | null; user: User | null }>;
    onAuthStateChange(callback: (event: string, session: Session | null) => void): { unsubscribe: () => void };
    signOut(): Promise<void>;
}

/**
 * Adapted auth service for use with AuthProvider
 * Unwraps AuthResult responses into the expected format
 */
export const authContextService: AuthContextService = {
    async getSession() {
        const result = await sessionService.getSession();
        if (result.success && result.data) {
            return {
                session: result.data.session,
                user: result.data.user
            };
        }
        // Return nulls on error - let AuthContext handle unauthenticated state
        return { session: null, user: null };
    },

    onAuthStateChange(callback) {
        return sessionService.onAuthStateChange(callback);
    },

    async signOut() {
        await sessionService.signOut();
    }
};

export default authContextService;
