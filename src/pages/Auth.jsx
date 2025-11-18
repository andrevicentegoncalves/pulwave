import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Card, Form, Button, Alert, Input, Divider, Spinner } from '../components/ui';
import Icon from '../components/ui/Icon.jsx';

/**
 * Auth Component
 * Handles user authentication (login/signup) using design system components
 */
const Auth = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (signUpError) throw signUpError;
        setSuccess('Account created! Check your email for verification.');
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (signInError) throw signInError;
        
        // Successful login - navigate to home
        if (data.session) {
          navigate('/', { replace: true });
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Card 
        variant="elevated" 
        className="auth-container"
      >
        <div className="auth-header">
          <h2>{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
        </div>

        {error && (
          <Alert 
            type="error" 
            dismissible 
            onDismiss={() => setError(null)}
            iconSize="s"
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert 
            type="success" 
            dismissible 
            onDismiss={() => setSuccess(null)}
            iconSize="s"
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

          <Input
            label="Password"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={loading}
            fullWidth
          />

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
              <span>{isSignUp ? 'Sign Up' : 'Sign In'}</span>
            )}
          </Button>
        </Form>

        <Divider spacing="default" />

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
      </Card>
    </div>
  );
};

export default Auth;