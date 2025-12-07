import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        const initAuth = async () => {
            const { session: currentSession, user: currentUser } = await authService.getSession();
            setSession(currentSession);
            setUser(currentUser);
            setLoading(false);
        };

        initAuth();

        // Listen to auth changes
        const subscription = authService.onAuthStateChange((_event, newSession) => {
            setSession(newSession);
            setUser(newSession?.user ?? null);
            setLoading(false);
        });

        return () => {
            if (subscription && typeof subscription.unsubscribe === 'function') {
                subscription.unsubscribe();
            }
        };
    }, []);

    const signOut = async () => {
        await authService.signOut();
        setUser(null);
        setSession(null);
    };

    const value = {
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
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
