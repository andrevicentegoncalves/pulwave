// src/App.jsx
import './assets/scss/main.scss';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BaseLayout from './components/layouts/BaseLayout';
import Auth from './pages/auth/Auth';
import AuthCallback from './pages/auth/AuthCallback';
import Hub from './pages/app/index';
import StyleGuide from './pages/dev/style-guide/StyleGuide';
import Assets from './pages/app/dashboards/Assets';
import BuildingForm from './pages/app/properties/BuildingForm';
import Settings from './pages/app/settings/index';
import ProfileOnboarding from './pages/app/onboarding/ProfileOnboarding';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastProvider';
import { QueryClientProvider } from './contexts/QueryClientProvider';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { TranslationProvider } from './contexts/TranslationContext';

// Admin Backoffice
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/dashboard/index';
import AdminUsers from './pages/admin/users/index';
import AdminTranslations from './pages/admin/translations/index';
import AdminAuditLogs from './pages/admin/audit-logs/index';
import AdminPermissions from './pages/admin/permissions/index';
import AdminFeatureFlags from './pages/admin/feature-flags/index';
import AdminRetention from './pages/admin/retention/index';
import AdminConfiguration from './pages/admin/configuration/index';
import AdminMasterData from './pages/admin/master-data/index';

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="app-loading">
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route
          path="/auth"
          element={!user ? <Auth /> : <Navigate to="/" replace />}
        />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Admin Backoffice Routes */}
        <Route path="/admin" element={user ? <AdminLayout /> : <Navigate to="/auth" replace />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="translations" element={<AdminTranslations />} />
          <Route path="audit-logs" element={<AdminAuditLogs />} />
          <Route path="permissions" element={<AdminPermissions />} />
          <Route path="settings" element={<Navigate to="/admin/configuration" replace />} />
          <Route path="feature-flags" element={<AdminFeatureFlags />} />
          <Route path="retention" element={<AdminRetention />} />
          <Route path="configuration" element={<AdminConfiguration />} />
          <Route path="master-data" element={<AdminMasterData />} />
        </Route>

        {/* Protected Routes with Base Layout */}
        <Route element={user ? <BaseLayout /> : <Navigate to="/auth" replace />}>
          <Route path="/" element={<Hub />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/buildings/new" element={<BuildingForm />} />
          <Route path="/buildings/:id/edit" element={<BuildingForm />} />
          <Route path="/onboarding" element={<ProfileOnboarding />} />
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
};

function App() {
  return (
    <QueryClientProvider>
      <AuthProvider>
        <TranslationProvider>
          <ThemeProvider>
            <ToastProvider>
              <AppContent />
            </ToastProvider>
          </ThemeProvider>
        </TranslationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;