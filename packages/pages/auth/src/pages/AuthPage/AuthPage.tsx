import { AppShell, BaseBlankLayout } from '@pulwave/pages-shell';
import { Card, Alert, Button, Divider } from '@pulwave/ui';
import {
    useAuthFlow,
    EmailOtpForm,
    OtpVerifyForm,
    WalletConnect,
    AuthSentView,
    type AuthView
} from '@pulwave/features-auth';

export type { AuthView };

// Import auth layout styles
import '../../../styles/auth/_index.scss';

export interface AuthPageProps {
    /** Success redirect path */
    successPath?: string;
    /** Show dev bypass button */
    showDevBypass?: boolean;
    /** Dev bypass redirect path */
    devBypassPath?: string;
}

/**
 * AuthPage - Assembly Layer
 *
 * Assembles atomic components from @pulwave/features-auth
 * into the final page experience.
 */
export const AuthPage = ({
    successPath = '/',
    showDevBypass = true,
    devBypassPath = '/admin/translations'
}: AuthPageProps) => {
    const {
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
    } = useAuthFlow({ successPath });

    // Helper for layout
    const renderLayout = (content: React.ReactNode) => (
        <AppShell>
            <BaseBlankLayout className="auth-layout">
                <div className="auth-centering-wrapper">
                    <Card variant="elevated" className="auth-container" noHoverTransform>
                        <div className="auth-header text-center">
                            <h1 className="h3">
                                {authView === 'main' ? 'Welcome' :
                                    authView === 'email-otp' ? 'Sign in with Email' :
                                        authView === 'otp-verify' ? 'Enter Code' : ''}
                            </h1>
                            {authView === 'email-otp' && <p className="color-muted">We'll send you a code</p>}
                        </div>

                        {error && (
                            <div style={{ marginBottom: 'var(--scale-4)' }}>
                                <Alert status="error" dismissible onDismiss={() => setError(null)}>
                                    {error}
                                </Alert>
                            </div>
                        )}

                        {authView === 'main' && (
                            <WalletConnect
                                onWalletClick={handleWallet}
                                onEmailClick={() => setAuthView('email-otp')}
                                loading={loading}
                            />
                        )}

                        {authView === 'email-otp' && (
                            <EmailOtpForm
                                email={email}
                                onEmailChange={setEmail}
                                onSubmit={handleSendOTP}
                                onBack={resetState}
                                loading={loading}
                            />
                        )}

                        {authView === 'otp-verify' && (
                            <OtpVerifyForm
                                email={email}
                                otpCode={otpCode}
                                onOtpChange={setOtpCode}
                                onSubmit={handleVerifyOTP}
                                onBack={() => setAuthView('email-otp')}
                                loading={loading}
                            />
                        )}

                        {authView === 'email-sent' && (
                            <AuthSentView
                                email={email}
                                onBack={resetState}
                            />
                        )}

                        {authView !== 'email-sent' && (
                            <>
                                <Divider spacing="default" />
                                <p className="text-center text-s color-muted">
                                    By continuing, you agree to our Terms of Service and Privacy Policy
                                </p>
                            </>
                        )}
                    </Card>

                    {/* Dev Bypass Button - Temporary */}
                    {showDevBypass && authView === 'main' && (
                        <div className="mt-5 text-center">
                            <Button
                                variant="ghost"
                                size="s"
                                onClick={() => {
                                    localStorage.setItem('dev_bypass', 'true');
                                    window.location.href = devBypassPath;
                                }}
                                className="opacity-50"
                            >
                                Dev Bypass (Temporary)
                            </Button>
                        </div>
                    )}
                </div>
            </BaseBlankLayout>
        </AppShell>
    );

    return renderLayout(null); // renderLayout handles the inner logic now
};

export default AuthPage;

