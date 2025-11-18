import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const Home = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div style={{ padding: '40px' }}>
      <h1>Welcome to Pulwave</h1>
      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={() => navigate('/style-guide')}>
          View Style Guide
        </button>
        <button onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Home;