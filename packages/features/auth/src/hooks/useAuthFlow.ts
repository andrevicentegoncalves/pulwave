import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '@pulwave/entity-auth';

export type AuthView = 'main' | 'email-otp' | 'otp-verify' | 'email-sent';

interface LocationState {
    from?: {
        pathname?: string;
    };
}

export interface UseAuthFlowProps {
    successPath?: string;
}

export function useAuthFlow({ successPath = '/' }: UseAuthFlowProps = {}) {
    const navigate = useNavigate();
    const location = useLocation();

    // Get the redirect path from location state (set by protected routes)
    const locationState = location.state as LocationState | null;
    const redirectPath = locationState?.from?.pathname ?? successPath;
    const [email, setEmail] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [authView, setAuthView] = useState<AuthView>('main');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSendOTP = useCallback(async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!email) {
            setError('Please enter your email');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { error: authError } = await authService.sendEmailOTP(email);
            if (authError) throw authError;
            setAuthView('otp-verify');
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to send code';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [email]);

    const handleVerifyOTP = useCallback(async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!otpCode || otpCode.length < 6) {
            setError('Please enter the 6-digit code');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { data, error: authError } = await authService.verifyEmailOTP(email, otpCode);
            if (authError) throw authError;
            if (data?.session) {
                navigate(redirectPath, { replace: true });
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Invalid code';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [email, otpCode, navigate, redirectPath]);

    const handleWallet = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const { error: authError } = await authService.signInWithWallet();
            if (authError) throw authError;
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Wallet connection failed';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    const resetState = useCallback(() => {
        setAuthView('main');
        setError(null);
        setEmail('');
        setOtpCode('');
    }, []);

    return {
        email,
        setEmail,
        otpCode,
        setOtpCode,
        authView,
        setAuthView,
        loading,
        error,
        setError,
        handleSendOTP,
        handleVerifyOTP,
        handleWallet,
        resetState
    };
}
