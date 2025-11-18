import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Input, Alert } from '../components/ui';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear general auth error
    if (authError) {
      setAuthError(null);
    }
  };

  const validate = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // Username validation (signup only)
    if (!isLogin && !formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});
    setAuthError(null);
    setMessage(null);
    
    // Validate form
    const newErrors = validate();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);

    try {
      if (isLogin) {
        console.log('=== LOGIN ATTEMPT ===');
        console.log('Email:', formData.email);
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;
        
        console.log('Login success:', data);
        setMessage('Login successful!');
        
      } else {
        console.log('=== SIGNUP ATTEMPT ===');
        console.log('Email:', formData.email);
        console.log('Username:', formData.username);
        
        const signupPayload = {
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              username: formData.username,
            },
          },
        };
        
        console.log('Full signup payload:', JSON.stringify(signupPayload, null, 2));
        
        const { data, error } = await supabase.auth.signUp(signupPayload);

        console.log('Signup response data:', data);
        console.log('Signup response error:', error);

        if (error) throw error;

        setMessage('Sign up successful! Please check your email to confirm your account.');
        
        // Clear form
        setFormData({
          email: '',
          password: '',
          username: ''
        });
      }
    } catch (error) {
      console.error('Auth error:', error);
      setAuthError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setAuthError(null);

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p style={{ 
            marginTop: 'var(--space-2)', 
            color: 'var(--color-on-surface-subtle)',
            fontSize: 'var(--font-size-body-s)'
          }}>
            {isLogin ? 'Sign in to your account to continue' : 'Create a new account to get started'}
          </p>
        </div>

        {authError && (
          <Alert 
            type="error" 
            variant="inline"
            style={{ marginBottom: 'var(--space-6)' }}
          >
            <strong>Authentication Failed</strong>
            {authError}
          </Alert>
        )}

        {message && (
          <Alert 
            type="success" 
            variant="inline"
            style={{ marginBottom: 'var(--space-6)' }}
          >
            <strong>Success!</strong>
            {message}
          </Alert>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <Input
              type="text"
              name="username"
              label="Username"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              required
              disabled={loading}
            />
          )}

          <Input
            type="email"
            name="email"
            label="Email Address"
            placeholder="your.email@example.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
            disabled={loading}
            autoComplete="email"
          />

          <Input
            type="password"
            name="password"
            label="Password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            helperText={isLogin ? undefined : "Minimum 6 characters required"}
            required
            disabled={loading}
            autoComplete={isLogin ? 'current-password' : 'new-password'}
          />

          <button 
            type="submit" 
            className="auth-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="spinner" viewBox="0 0 24 24">
                  <circle 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4" 
                    fill="none"
                    strokeDasharray="32"
                    strokeDashoffset="32"
                  />
                </svg>
                {isLogin ? 'Signing in...' : 'Creating account...'}
              </>
            ) : (
              isLogin ? 'Sign In' : 'Sign Up'
            )}
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <button 
          onClick={handleGoogleLogin} 
          disabled={loading}
          className="auth-oauth-button"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z" fill="#4285F4"/>
            <path d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z" fill="#34A853"/>
            <path d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59z" fill="#FBBC05"/>
            <path d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51l3.34 2.59C5.19 5.736 7.395 3.977 10 3.977z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div style={{ 
          marginTop: 'var(--space-6)', 
          textAlign: 'center',
          fontSize: 'var(--font-size-body-s)',
          color: 'var(--color-on-surface-subtle)'
        }}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setErrors({});
              setAuthError(null);
              setMessage(null);
            }}
            style={{ 
              color: 'var(--color-primary)',
              textDecoration: 'none',
              fontWeight: 'var(--font-weight-medium)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0
            }}
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}