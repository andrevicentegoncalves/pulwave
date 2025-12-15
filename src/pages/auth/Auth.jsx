import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services';
import {
  Mail,
  Wallet,
  KeyRound,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';
import { Card, Alert, Input, Button, Icon, Divider } from '../../components/ui';

/**
 * Multi-Auth Page
 * Supports: Email OTP, Web3 Wallet
 */
const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [authMethod, setAuthMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [walletLoading, setWalletLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle Email OTP - Send Code
  const handleSendOTP = async (e) => {
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
      setAuthMethod('otp-verify');
    } catch (err) {
      console.error('OTP send error:', err);
      setError(err.message || 'Failed to send code');
    } finally {
      setLoading(false);
    }
  };

  // Handle Email OTP - Verify Code
  const handleVerifyOTP = async (e) => {
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
        navigate('/', { replace: true });
      }
    } catch (err) {
      console.error('OTP verify error:', err);
      setError(err.message || 'Invalid code');
    } finally {
      setLoading(false);
    }
  };

  // Handle Web3 Wallet
  const handleWallet = async () => {
    setWalletLoading(true);
    setError(null);

    try {
      const { error: authError } = await authService.signInWithWallet();
      if (authError) throw authError;
    } catch (err) {
      console.error('Wallet error:', err);
      setError(err.message || 'Wallet connection failed');
    } finally {
      setWalletLoading(false);
    }
  };

  const resetState = () => {
    setAuthMethod(null);
    setError(null);
    setEmail('');
    setOtpCode('');
  };

  // Email sent confirmation
  if (authMethod === 'email-sent') {
    return (
      <div className="auth-page">
        <Card variant="elevated" className="auth-container" noHoverTransform>
          <div className="auth-header text-center">
            <Icon size="xl" className="color-success margin-bottom-3">
              <CheckCircle />
            </Icon>
            <h1 className="h3">Check Your Email</h1>
            <p className="color-muted margin-top-2">
              We sent a link to <strong>{email}</strong>
            </p>
          </div>
          <div className="margin-top-4">
            <Button variant="secondary" fullWidth onClick={resetState}>
              <Icon size="s"><ArrowLeft /></Icon>
              Back to Sign In
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // OTP Code verification view
  if (authMethod === 'otp-verify') {
    return (
      <div className="auth-page">
        <Card variant="elevated" className="auth-container" noHoverTransform>
          <div className="auth-header text-center">
            <h1 className="h3">Enter Code</h1>
            <p className="color-muted">
              We sent a 6-digit code to <strong>{email}</strong>
            </p>
          </div>

          {error && (
            <Alert type="error" dismissible onDismiss={() => setError(null)}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleVerifyOTP}>
            <Input
              label="Verification Code"
              type="text"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="123456"
              maxLength={6}
              required
              disabled={loading}
              fullWidth
              autoFocus
              className="text-center text-xl tracking-widest"
            />

            <div className="margin-top-4">
              <Button
                type="submit"
                variant="primary"
                size="l"
                loading={loading}
                disabled={otpCode.length < 6}
                fullWidth
              >
                Verify & Sign In
              </Button>
            </div>
          </form>

          <Divider spacing="default" />

          <Button variant="secondary" fullWidth onClick={resetState} disabled={loading}>
            <Icon size="s"><ArrowLeft /></Icon>
            Back
          </Button>
        </Card>
      </div>
    );
  }

  // Email input view (for OTP)
  if (authMethod === 'email-otp') {
    return (
      <div className="auth-page">
        <Card variant="elevated" className="auth-container" noHoverTransform>
          <div className="auth-header">
            <h1 className="h3">Sign in with Email</h1>
            <p className="color-muted">We'll send you a 6-digit code</p>
          </div>

          {error && (
            <Alert type="error" dismissible onDismiss={() => setError(null)}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSendOTP}>
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={loading}
              fullWidth
              autoFocus
            />

            <div className="margin-top-4">
              <Button
                type="submit"
                variant="primary"
                size="l"
                loading={loading}
                disabled={!email}
                fullWidth
                leftIcon={<KeyRound size={18} />}
              >
                Send Code
              </Button>
            </div>
          </form>

          <Divider spacing="default" />

          <Button variant="secondary" fullWidth onClick={resetState} disabled={loading}>
            <Icon size="s"><ArrowLeft /></Icon>
            Back
          </Button>
        </Card>
      </div>
    );
  }

  // Main auth selection view
  return (
    <div className="auth-page">
      <Card variant="elevated" className="auth-container" noHoverTransform>
        <div className="auth-header text-center">
          <h1 className="h3">Welcome</h1>
        </div>

        {error && (
          <Alert type="error" dismissible onDismiss={() => setError(null)}>
            {error}
          </Alert>
        )}

        <div className="auth-buttons flex flex-column gap-3">
          {/* Email OTP (Code) */}
          <Button
            variant="primary"
            size="l"
            fullWidth
            onClick={() => setAuthMethod('email-otp')}
            leftIcon={<Mail size={18} />}
          >
            Continue with Email
          </Button>

          {/* Web3 Wallet */}
          <Button
            variant="secondary"
            size="l"
            fullWidth
            onClick={handleWallet}
            loading={walletLoading}
            leftIcon={<Wallet size={18} />}
          >
            Connect Wallet
          </Button>
        </div>

        <Divider spacing="default" />

        <p className="text-center text-s color-muted">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </Card>

      {/* Dev Bypass Button - Temporary */}
      <div className="margin-top-5 text-center">
        <Button
          variant="text"
          size="s"
          onClick={() => {
            localStorage.setItem('dev_bypass', 'true');
            window.location.href = '/admin/translations';
          }}
          className="opacity-50"
        >
          Dev Bypass (Temporary)
        </Button>
      </div>
    </div>
  );
};

export default Auth;