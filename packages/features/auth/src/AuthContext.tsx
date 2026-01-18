/**
 * Auth Context
 * Main provider for authentication state management
 * 
 * @package @foundation/shared
 */
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

import type { User, Session } from '@pulwave/entity-auth';

export interface AuthService {
    getSession(): Promise<{ session: Session | null; user: User | null }>;
    onAuthStateChange(callback: (event: string, session: Session | null) => void): { unsubscribe: () => void };
    signOut(): Promise<void>;
}

export interface AuthContextValue {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signOut: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
    authService: AuthService;
}

/**
 * Auth Provider Component
 */
export function AuthProvider({ children, authService }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Skip if authService is not provided
        if (!authService) {
            setLoading(false);
            return;
        }

        const initAuth = async () => {
            if (authService.getSession) {
                const { session: currentSession, user: currentUser } = await authService.getSession();
                setSession(currentSession);
                setUser(currentUser);
            }
            setLoading(false);
        };

        initAuth();

        let subscription: { unsubscribe: () => void } | undefined;
        if (authService.onAuthStateChange) {
            subscription = authService.onAuthStateChange(async (_event: string, newSession: Session | null) => {
                const devBypass = localStorage.getItem('dev_bypass');
                if (devBypass && authService.getSession) {
                    const { session: bypassSession, user: bypassUser } = await authService.getSession();
                    setSession(bypassSession);
                    setUser(bypassUser);
                } else {
                    setSession(newSession);
                    setUser(newSession?.user ?? null);
                }
                setLoading(false);
            });
        }

        return () => {
            if (subscription && typeof subscription.unsubscribe === 'function') {
                subscription.unsubscribe();
            }
        };
    }, [authService]);

    const signOut = async () => {
        localStorage.removeItem('dev_bypass');
        if (authService?.signOut) {
            await authService.signOut();
        }
        setUser(null);
        setSession(null);
    };

    const value: AuthContextValue = {
        user,
        session,
        loading,
        signOut,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * Hook to access auth context
 */
export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export { AuthContext };
