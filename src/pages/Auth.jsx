// src/pages/Auth.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Card, Form, Button, Alert, Input, Divider, Spinner, Checkbox } from '../components/ui';
import Icon from '../components/ui/Icon';
import { Eye, EyeOff } from '../components/ui/iconLibrary';

/**
 * Auth Component
 * Handles user authentication (login/signup/password reset) using design system components
 * ✅ Uses: Card, Form, Button, Alert, Input, Divider, Icon, Checkbox from design system
 */
const Auth = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(localStorage.getItem('rememberMe') === 'true');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isForgotPassword) {
        // Handle password reset
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);

        if (resetError) throw resetError;
        setSuccess('Password reset email sent! Check your inbox.');
        setEmail('');
      } else if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) throw signUpError;
        setSuccess('Account created! Check your email for verification.');
      } else {
        // Store remember me preference BEFORE login
        const currentRememberMe = localStorage.getItem('rememberMe') === 'true';
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('rememberMe');
        }

        // If preference changed, we need to reload the page after login
        // so the Supabase client uses the correct storage
        const needsReload = currentRememberMe !== rememberMe;

        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        // Successful login
        if (data.session) {
          if (needsReload) {
            // Reload to reinitialize Supabase with correct storage
            window.location.href = '/';
          } else {
            navigate('/', { replace: true });
          }
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (isForgotPassword) return 'Reset Password';
    if (isSignUp) return 'Create Account';
    return 'Welcome Back';
  };

  const getButtonText = () => {
    if (loading) return 'Processing...';
    if (isForgotPassword) return 'Send Reset Email';
    if (isSignUp) return 'Sign Up';
    return 'Sign In';
  };

  return (
    <div className="auth-page">
      <Card
        variant="elevated"
        className="auth-container"
        noHoverTransform
      >
        <div className="auth-header">
          <h1>{getTitle()}</h1>
        </div>

        {error && (
          <Alert
            type="error"
            dismissible
            onDismiss={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            type="success"
            dismissible
            onDismiss={() => setSuccess(null)}
          >
            {success}
          </Alert>
        )}

        <Form layout="vertical" onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            disabled={loading}
            fullWidth
          />

          {!isForgotPassword && (
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
              fullWidth
              rightIcon={
                <div
                  style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </div>
              }
            />
          )}

          {!isForgotPassword && !isSignUp && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '-8px', marginBottom: '12px' }}>
              <Checkbox
                label="Remember me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <Button
                variant="text"
                size="s"
                onClick={() => {
                  setIsForgotPassword(true);
                  setError(null);
                  setSuccess(null);
                }}
                type="button"
              >
                Forgot Password?
              </Button>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="l"
            disabled={loading}
            fullWidth
          >
            {loading ? (
              <>
                <Icon size="s">
                  <Spinner />
                </Icon>
                <span>Processing...</span>
              </>
            ) : (
              <span>{getButtonText()}</span>
            )}
          </Button>
        </Form>

        <Divider spacing="default" />

        <div className="auth-buttons">
          {isForgotPassword ? (
            <Button
              variant="secondary"
              size="m"
              fullWidth
              onClick={() => {
                setIsForgotPassword(false);
                setIsSignUp(false);
                setError(null);
                setSuccess(null);
              }}
              disabled={loading}
            >
              Back to Sign In
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="m"
              fullWidth
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
                setSuccess(null);
              }}
              disabled={loading}
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </Button>
          )}
        </div>
      </Card>

      {/* Dev Bypass Button - Temporary */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Button
          variant="text"
          size="s"
          onClick={() => {
            localStorage.setItem('dev_bypass', 'true');
            window.location.reload();
          }}
          style={{ opacity: 0.5 }}
        >
          Dev Bypass (Temporary)
        </Button>
      </div>
    </div>
  );
};

export default Auth;