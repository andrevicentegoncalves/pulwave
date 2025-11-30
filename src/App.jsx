// src/App.jsx
import './assets/scss/main.scss';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BaseLayout from './components/layouts/BaseLayout';
import Auth from './pages/auth/Auth';
import Hub from './pages/app/index';
import StyleGuide from './pages/dev/style-guide/StyleGuide';
import Assets from './pages/app/dashboards/Assets';
import BuildingForm from './pages/app/properties/BuildingForm';
import Settings from './pages/app/settings/index';
import { ThemeProvider } from './contexts/ThemeContext';

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
    <ThemeProvider user={user}>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route
            path="/auth"
            element={!user ? <Auth /> : <Navigate to="/" replace />}
          />

          {/* Protected Routes with Base Layout */}
          <Route element={user ? <BaseLayout /> : <Navigate to="/auth" replace />}>
            <Route path="/" element={<Hub />} />
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
    </ThemeProvider>
  );
}

export default App;