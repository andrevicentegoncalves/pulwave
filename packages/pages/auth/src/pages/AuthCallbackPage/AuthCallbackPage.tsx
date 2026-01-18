/**
 * AuthCallbackPage - Full Migration
 * 
 * Handles OAuth/Magic Link/Wallet redirects from Supabase.
 * Uses authService from data package.
 * 
 * @package @pulwave/experience/auth
 */
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Alert, Spinner } from '@pulwave/ui';
import { authService } from '@pulwave/entity-auth';

export interface AuthCallbackPageProps {
    /** Success redirect path */
    successPath?: string;
    /** Auth page path for redirect on failure */
    authPath?: string;
}

/**
 * Auth Callback Handler
 * Handles OAuth/Magic Link/Wallet redirects from Supabase
 */
export const AuthCallbackPage = ({
    successPath = '/',
    authPath = '/auth'
}: AuthCallbackPageProps) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [error, setError] = useState<string | null>(null);

    // Get redirect path from state (set by login page)
    interface HistoryState {
        usr?: {
            from?: {
                pathname?: string;
            };
        };
    }
    const redirectPath = (history.state as HistoryState | null)?.usr?.from?.pathname || successPath;

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Use authService to get session
                const { data } = await authService.getSession();
                const session = data?.session;

                // Note: authService.getSession catches errors internally,
                // so we rely on session presence or URL params for error handling.

                if (session) {
                    navigate(redirectPath, { replace: true });
                } else {
                    const errorMessage = searchParams.get('error_description') || searchParams.get('error');
                    if (errorMessage) {
                        throw new Error(errorMessage);
                    }

                    // Retry logic
                    setTimeout(async () => {
                        const { data: retryData } = await authService.getSession();
                        const retrySession = retryData?.session;
                        if (retrySession) {
                            navigate(redirectPath, { replace: true });
                        } else {
                            navigate(authPath, { replace: true });
                        }
                    }, 1000);
                }
            } catch (err) {
                setError((err as Error).message || 'Authentication failed');
            }
        };

        handleCallback();
    }, [navigate, searchParams, redirectPath, authPath]);

    if (error) {
        return (
            <div className="auth-page">
                <Card variant="elevated" className="auth-container" noHoverTransform>
                    <Alert status="error">
                        {error}
                    </Alert>
                    <div className="margin-top-4 text-align-center">
                        <a href={authPath} className="link">Back to Sign In</a>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <Card variant="elevated" className="auth-container text-align-center" noHoverTransform>
                <Spinner size="xl" color="primary" className="margin-bottom-3" />
                <h2>Signing you in…</h2>
                <p className="color-muted">Please wait</p>
            </Card>
        </div>
    );
};

export default AuthCallbackPage;
