import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    // Async function to check session
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
      setLoading(false);
    };

    checkSession();

    // Listen for auth state changes (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    setMessage('');
    const { user, error } = await supabase.auth.signIn({ email, password });
    if (error) setMessage(error.message);
    else {
      setUser(user);
      navigate('/');
    }
  };

  const handleSignUp = async () => {
    setMessage('');
    const { user, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setMessage(error.message);
      return;
    }

    if (user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ id: user.id, username: email }]);
      if (profileError) {
        setMessage(profileError.message);
        return;
      }

      setMessage(`Signed up as ${email}`);
      navigate('/');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setMessage('');
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (user) {
    return (
      <div className="auth-form">
        <p>Welcome, {user.email}</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  return (
    <div className="auth-form">
      <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={isLogin ? handleLogin : handleSignUp}>
        {isLogin ? 'Login' : 'Sign Up'}
      </button>
      <p>
        {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
        <button className="toggle-button" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Sign Up' : 'Login'}
        </button>
      </p>
      {message && <p className="message">{message}</p>}
    </div>
  );
}
