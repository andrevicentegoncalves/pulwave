/**
 * Admin Page - Assembly Layer
 *
 * Orchestrates the AdminShell with experience-level data (auth, user).
 * This is the entry point for the standalone admin app.
 *
 * @package @pulwave/pages-admin
 */
import { Routes, Route, Navigate } from 'react-router-dom';
import { type UserData } from '@pulwave/pages-shell';
import { useAuth } from '@pulwave/features-auth';
import { useUser } from '@pulwave/features-user';
import { AdminShell } from './AdminShell';
import { AdminProvider } from '@pulwave/features-admin';
import { adminService } from '@pulwave/entity-system';

// Import admin page components - locally from pages/admin and from features-admin
import { UsersList as UsersPage, Translations as TranslationsPage } from '@pulwave/features-admin';
import DashboardPage from './DashboardPage';
import AuditLogsPage from './AuditLogsPage';
import ConfigurationPage from './ConfigurationPage';
import FeatureFlagsPage from './FeatureFlagsPage';
import MasterDataPage from './MasterDataPage';
import RetentionPage from './RetentionPage';

/**
 * AdminPage - Assembly Layer
 * Orchestrates the admin shell with authentication and user data
 */
export const AdminPage = () => {
    // Auth & User - Experience Layer Concerns
    const { signOut } = useAuth();
    const { user, displayName, avatarUrl } = useUser();

    const userData: UserData | null = user ? {
        id: user.id,
        email: user.email || '',
        fullName: displayName || 'User',
        avatarUrl: avatarUrl,
    } : null;

    return (
        <AdminProvider service={adminService}>
            <AdminShell
                user={userData}
                onLogout={signOut}
            >
                <Routes>
                    <Route index element={<DashboardPage />} />
                    <Route path="users" element={<UsersPage />} />
                    <Route path="translations" element={<TranslationsPage />} />
                    <Route path="audit-logs" element={<AuditLogsPage />} />
                    <Route path="permissions" element={<Navigate to="/admin/users" replace />} />
                    <Route path="feature-flags" element={<FeatureFlagsPage />} />
                    <Route path="retention" element={<RetentionPage />} />
                    <Route path="configuration" element={<ConfigurationPage />} />
                    <Route path="master-data/:itemKey?" element={<MasterDataPage />} />
                </Routes>
            </AdminShell>
        </AdminProvider>
    );
};

export default AdminPage;
