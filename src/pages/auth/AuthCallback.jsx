import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { Loader2 as Spinner } from 'lucide-react';
import { Card, Alert, Icon } from '../../components/ui';

/**
 * Auth Callback Handler
 * Handles OAuth/Magic Link/Wallet redirects from Supabase
 */
const AuthCallback = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [error, setError] = useState(null);

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Get the auth tokens from URL hash (Supabase puts them there)
                const { data: { session }, error: authError } = await supabase.auth.getSession();

                if (authError) throw authError;

                if (session) {
                    // Successfully authenticated
                    navigate('/', { replace: true });
                } else {
                    // Check for error in URL params
                    const errorMessage = searchParams.get('error_description') || searchParams.get('error');
                    if (errorMessage) {
                        throw new Error(errorMessage);
                    }

                    // No session and no error - might still be processing
                    // Wait a moment and try again
                    setTimeout(async () => {
                        const { data: { session: retrySession } } = await supabase.auth.getSession();
                        if (retrySession) {
                            navigate('/', { replace: true });
                        } else {
                            navigate('/auth', { replace: true });
                        }
                    }, 1000);
                }
            } catch (err) {
                console.error('Auth callback error:', err);
                setError(err.message || 'Authentication failed');
            }
        };

        handleCallback();
    }, [navigate, searchParams]);

    if (error) {
        return (
            <div className="auth-page">
                <Card variant="elevated" className="auth-container" noHoverTransform>
                    <Alert type="error">
                        {error}
                    </Alert>
                    <div className="margin-top-4 text-center">
                        <a href="/auth" className="link">Back to Sign In</a>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <Card variant="elevated" className="auth-container text-center" noHoverTransform>
                <Icon size="xl" className="color-primary margin-bottom-3">
                    <Spinner className="animate-spin" />
                </Icon>
                <h2>Signing you in...</h2>
                <p className="color-muted">Please wait</p>
            </Card>
        </div>
    );
};

export default AuthCallback;
