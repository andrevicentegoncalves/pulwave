// src/App.jsx
import './assets/scss/main.scss';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BaseLayout from './components/layouts/BaseLayout';
import Auth from './pages/Auth';
import Home from './pages/Home';
import ProfileWrapper from './pages/ProfileWrapper';
import StyleGuide from './pages/style-guide/StyleGuide';
import Assets from './pages/Assets';
import BuildingForm from './pages/BuildingForm';
import Settings from './pages/Settings';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for dev bypass
    const devBypass = localStorage.getItem('dev_bypass');
    if (devBypass) {
      setUser({ id: 'dev', email: 'dev@example.com' });
      setLoading(false);
      return;
    }

    // Get current session
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    // Listen to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route
          path="/auth"
          element={!user ? <Auth /> : <Navigate to="/" replace />}
        />

        {/* Protected Routes with Base Layout */}
        <Route element={user ? <BaseLayout /> : <Navigate to="/auth" replace />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<ProfileWrapper />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/buildings/new" element={<BuildingForm />} />
          <Route path="/buildings/:id/edit" element={<BuildingForm />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/style-guide" element={<StyleGuide />} />
        </Route>

        {/* Catch all - redirect to home or auth */}
        <Route
          path="*"
          element={<Navigate to={user ? "/" : "/auth"} replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;