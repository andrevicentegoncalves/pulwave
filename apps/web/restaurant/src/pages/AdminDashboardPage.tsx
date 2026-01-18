/**
 * AdminDashboardPage - Restaurant App (Thin Wrapper)
 * Uses AdminShell and DashboardWrapper from admin-dashboard package
 * @package @pulwave/apps/restaurant
 */
// import { AdminShell, DashboardWrapper } from '@pulwave/experience-admin-dashboard';

// Thin wrapper using AdminShell + DashboardWrapper from admin-dashboard package
export const AdminDashboardPage = () => {
    // In production:
    // return <AdminShell><DashboardWrapper /></AdminShell>;
    return (
        <div className="admin-dashboard-page">
            {/* AdminShell provides navigation, DashboardWrapper provides content */}
            <h1>Restaurant Admin Dashboard</h1>
        </div>
    );
};

export default AdminDashboardPage;
