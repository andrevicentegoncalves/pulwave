import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { AppShell, BaseSidebarLayout, type UserData, type NavSection } from '@pulwave/pages-shell';
// Auth context and user hook from features
import { useAuth } from '@pulwave/features-auth';
import { useUser } from '@pulwave/features-user';
import {
    PageLoader,
    LayoutDashboard,
    Building,
    Users,
    Wrench,
    DollarSign,
    FileText,
    MessageSquare,
    Settings,
    Building2,
    BarChart3,
    Shield
} from '@pulwave/ui';

// Pages (thin wrappers importing from packages)
// import {
//     DashboardPage,
//     LoginPage,
//     SettingsPage,
//     AdminPage,
//     PropertiesPage,
//     TenantsPage,
//     MaintenancePage,
//     FinancePage,
//     LeasesPage,
//     DocumentsPage,
//     CommunicationsPage,
//     CondominiumsPage,
//     AssetsPage,
//     AuthCallbackPage,
//     OnboardingPage,
// } from './pages';
// Lazy-loaded heavy routes for code splitting (reduce initial bundle)
const AdminPage = lazy(() => import('./pages/AdminPage').then(m => ({ default: m.AdminPage })));
const StyleGuideApp = lazy(() => import('@pulwave/pages-style-guide').then(m => ({ default: m.StyleGuideApp })));

// Lazy-load all page routes for optimal code splitting
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const SettingsPage = lazy(() => import('@pulwave/features-settings').then(m => ({ default: m.SettingsPage })));
const PropertiesPage = lazy(() => import('./pages/PropertiesPage').then(m => ({ default: m.PropertiesPage })));
const CommunicationsPage = lazy(() => import('./pages/CommunicationsPage').then(m => ({ default: m.CommunicationsPage })));
const TenantsPage = lazy(() => import('./pages/TenantsPage').then(m => ({ default: m.TenantsPage })));
const MaintenancePage = lazy(() => import('./pages/MaintenancePage').then(m => ({ default: m.MaintenancePage })));
const LeasesPage = lazy(() => import('./pages/LeasesPage').then(m => ({ default: m.LeasesPage })));
const FinancePage = lazy(() => import('./pages/FinancePage').then(m => ({ default: m.FinancePage })));
const DocumentsPage = lazy(() => import('./pages/DocumentsPage').then(m => ({ default: m.DocumentsPage })));
const CondominiumsPage = lazy(() => import('./pages/CondominiumsPage').then(m => ({ default: m.CondominiumsPage })));
const AssetsPage = lazy(() => import('./pages/AssetsPage').then(m => ({ default: m.AssetsPage })));
const DiagnosticPage = lazy(() => import('./pages/DiagnosticPage').then(m => ({ default: m.DiagnosticPage })));

// import { DebugTestPage } from './pages/DebugTestPage';

// Navigation configuration for BaseLayout
const NAV_SECTIONS: NavSection[] = [
    {
        title: 'Overview',
        items: [
            { label: 'Dashboard', path: '/', icon: LayoutDashboard },
            { label: 'Properties', path: '/properties', icon: Building2 },
            { label: 'Tenants', path: '/tenants', icon: Users },
            { label: 'Leases', path: '/leases', icon: FileText },
            { label: 'Maintenance', path: '/maintenance', icon: Wrench },
            { label: 'Finance', path: '/finance', icon: DollarSign },
            { label: 'Messages', path: '/communications', icon: MessageSquare },
            { label: 'Condominiums', path: '/condominiums', icon: Building2 },
            { label: 'Documents', path: '/documents', icon: FileText },
            { label: 'Assets', path: '/assets', icon: Building },
            { label: 'Admin', path: '/admin', icon: Shield },
            { label: 'Settings', path: '/settings', icon: Settings },
        ]
    }
];

// Layout with primary sidebar using BaseLayout
const RealEstateLayout = () => {
    const location = useLocation();
    const { signOut } = useAuth();
    const { user, loading, isAuthenticated, displayName, avatarUrl } = useUser();

    if (loading) {
        return <PageLoader />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    // User data mapping
    const userData: UserData | null = user ? {
        id: user.id || 'current-user',
        email: user.email || '',
        fullName: displayName || 'User',
        avatarUrl: avatarUrl,
    } : null;

    return (
        <BaseSidebarLayout
            sidebarItems={NAV_SECTIONS}
            user={userData}
            onLogout={signOut}
            settingsPath="/settings"
        />
    );
};

const RequireAdmin = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();
    const { profile, loading, isAuthenticated } = useUser();

    // Show loader while checking user permissions
    if (loading) {
        return <PageLoader />;
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    // If no profile yet, redirect to dashboard
    if (!profile) {
        return <Navigate to="/dashboard" replace />;
    }

    // Check admin access
    const hasAdminAccess = profile.app_role === 'admin' || profile.app_role === 'super_admin';

    // Redirect if user doesn't have admin access
    if (!hasAdminAccess) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};

export const App = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={
                <AppShell>
                    <Suspense fallback={<PageLoader />}>
                        <LoginPage />
                    </Suspense>
                </AppShell>
            } />
            {/* Diagnostic */}
            <Route path="/diagnostic" element={
                <AppShell>
                    <Suspense fallback={<PageLoader />}>
                        <DiagnosticPage />
                    </Suspense>
                </AppShell>
            } />
            {/* Style Guide V2 - has its own AppShell, lazy-loaded */}
            <Route path="/style-guide/*" element={
                <Suspense fallback={<PageLoader />}>
                    <StyleGuideApp />
                </Suspense>
            } />
            <Route path="/style-guide2" element={<Navigate to="/style-guide" replace />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Admin - has its own AppShell via AdminShell, lazy-loaded */}
            <Route path="/admin/*" element={
                <RequireAdmin>
                    <Suspense fallback={<PageLoader />}>
                        <AdminPage />
                    </Suspense>
                </RequireAdmin>
            } />

            {/* App Routes with Sidebar */}
            <Route element={<AppShell><RealEstateLayout /></AppShell>}>
                <Route path="/dashboard" element={
                    <Suspense fallback={<PageLoader />}>
                        <DashboardPage />
                    </Suspense>
                } />
                <Route path="/settings" element={
                    <Suspense fallback={<PageLoader />}>
                        <SettingsPage />
                    </Suspense>
                } />
                <Route path="/properties" element={
                    <Suspense fallback={<PageLoader />}>
                        <PropertiesPage />
                    </Suspense>
                } />
                <Route path="/communications" element={
                    <Suspense fallback={<PageLoader />}>
                        <CommunicationsPage />
                    </Suspense>
                } />
                <Route path="/tenants" element={
                    <Suspense fallback={<PageLoader />}>
                        <TenantsPage />
                    </Suspense>
                } />
                <Route path="/maintenance" element={
                    <Suspense fallback={<PageLoader />}>
                        <MaintenancePage />
                    </Suspense>
                } />
                <Route path="/leases" element={
                    <Suspense fallback={<PageLoader />}>
                        <LeasesPage />
                    </Suspense>
                } />
                <Route path="/finance" element={
                    <Suspense fallback={<PageLoader />}>
                        <FinancePage />
                    </Suspense>
                } />
                <Route path="/documents" element={
                    <Suspense fallback={<PageLoader />}>
                        <DocumentsPage />
                    </Suspense>
                } />
                <Route path="/condominiums" element={
                    <Suspense fallback={<PageLoader />}>
                        <CondominiumsPage />
                    </Suspense>
                } />
                <Route path="/assets" element={
                    <Suspense fallback={<PageLoader />}>
                        <AssetsPage />
                    </Suspense>
                } />
                {/* Add back other routes as needed */}
            </Route>
        </Routes>
    );
};

