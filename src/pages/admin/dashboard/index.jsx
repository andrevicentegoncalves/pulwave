import React, { useMemo } from 'react';
import { useAdminDashboard } from '../../../hooks/admin';
import { StatCard, Users, Building2, Activity, ToggleRight, EmptyState } from '../../../components/ui';
import { AdminPageHeader, AdminLoadingState } from '../../../components/admin';
import RecentActivityTable from '../../../components/admin/dashboard/RecentActivityTable';

/**
 * Admin Dashboard - Overview page with stats and recent activity
 * Uses existing UI components: StatCard, Card, EmptyState, Spinner
 */
const Dashboard = () => {
    const { data, isLoading, error } = useAdminDashboard();

    if (isLoading) {
        return <AdminLoadingState />;
    }

    if (error) {
        return (
            <EmptyState
                icon={<Activity />}
                title="Error loading dashboard"
                description={error.message}
                variant="card"
            />
        );
    }

    const { stats = {}, recentActivity = [] } = data || {};

    // Memoize stat cards to prevent unnecessary re-renders
    const statCards = useMemo(() => [
        {
            icon: <Users />,
            value: stats.totalUsers || 0,
            label: 'Total Users',
            variant: 'info',
        },
        {
            icon: <Building2 />,
            value: stats.totalOrganizations || 0,
            label: 'Organizations',
            variant: 'success',
        },
        {
            icon: <Activity />,
            value: stats.activeUsersLast7Days || 0,
            label: 'Active (7 days)',
            variant: 'warning',
        },
        {
            icon: <ToggleRight />,
            value: stats.featureFlagsEnabled || 0,
            label: 'Feature Flags',
            variant: 'primary',
        },
    ], [stats]);

    return (
        <div className="admin-dashboard">
            <AdminPageHeader title="Dashboard" subtitle="Overview of your admin backoffice" />

            {/* Stats Grid */}
            <div className="admin-stats">
                {statCards.map((card, index) => (
                    <StatCard
                        key={index}
                        icon={card.icon}
                        value={card.value.toLocaleString()}
                        label={card.label}
                        variant={card.variant}
                    />
                ))}
            </div>

            {/* Recent Activity */}
            <RecentActivityTable activities={recentActivity} />
        </div>
    );
};

export default Dashboard;
