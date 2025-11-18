import './assets/scss/main.scss';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthForm from './pages/Login';
import Home from './pages/Home';
import StyleGuide from './pages/style-guide/StyleGuide';

function App() {
  const [user, setUser] = useState(null); 

  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    // Listen to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={user ? <Home /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/login"
          element={!user ? <AuthForm /> : <Navigate to="/" replace />}
        />
        <Route
          path="/style-guide"
          element={user ? <StyleGuide /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;