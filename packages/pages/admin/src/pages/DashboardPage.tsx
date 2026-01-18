import React, { useMemo } from 'react';
import { useAdminDashboard } from '@pulwave/features-admin';
import { KpiCard, EmptyState, Skeleton, SectionHeader } from '@pulwave/ui';
import { ContentLayout } from '@pulwave/widgets';
import { Users, Building2, Activity, ToggleRight, Languages, Table2, List, FileText, Database } from '@pulwave/ui';
import { RecentActivityTable } from '@pulwave/features-admin';

/**
 * Admin Dashboard - Overview page with stats and recent activity
 * Uses KpiCard for rich KPI displays
 */
const DashboardPage = () => {
    const { data, isLoading, error } = useAdminDashboard();

    const { stats = {}, recentActivity = [], translationStats = {} } = data || {};

    // Memoize stat cards to prevent unnecessary re-renders
    const statCards = useMemo(() => [
        {
            icon: Users,
            value: stats.totalUsers || 0,
            title: 'Total Users',
            colorScheme: 'info',
        },
        {
            icon: Building2,
            value: stats.totalOrganizations || 0,
            title: 'Organizations',
            colorScheme: 'success',
        },
        {
            icon: Activity,
            value: stats.activeUsersLast7Days || 0,
            title: 'Active (7 days)',
            colorScheme: 'warning',
        },
        {
            icon: ToggleRight,
            value: stats.featureFlagsEnabled || 0,
            title: 'Feature Flags',
            colorScheme: 'primary',
        },
    ], [stats]);

    // Translation KPIs
    const translationCards = useMemo(() => [
        {
            icon: Languages,
            value: translationStats.ui || 0,
            title: 'UI Translations',
            colorScheme: 'info',
        },
        {
            icon: Table2,
            value: translationStats.schema || 0,
            title: 'Schema Translations',
            colorScheme: 'success',
        },
        {
            icon: List,
            value: translationStats.enum || 0,
            title: 'Enum Translations',
            colorScheme: 'warning',
        },
        {
            icon: FileText,
            value: translationStats.content || 0,
            title: 'Content Translations',
            colorScheme: 'primary',
        },
        {
            icon: Database,
            value: translationStats.masterData || 0,
            title: 'Master Data',
            colorScheme: 'neutral',
        },
    ], [translationStats]);

    if (error) {
        return (
            <ContentLayout>
                <EmptyState
                    icon={<Activity />}
                    title="Error loading dashboard"
                    description={(error as Error).message}
                    variant="card"
                />
            </ContentLayout>
        );
    }

    return (
        <ContentLayout>
            <SectionHeader title="Dashboard" />
            <p className="mb-4 color-muted">Overview of your admin backoffice</p>

            {/* Stats Grid */}
            <div className="admin-stats">
                {isLoading ? (
                    // Skeleton stat cards during loading
                    [...Array(4)].map((_, i) => (
                        <div key={i} className="kpi-card kpi-card--m kpi-card--neutral">
                            <Skeleton variant="circular" width={40} height={40} />
                            <Skeleton variant="text" width="60%" height={36} style={{ marginTop: 'var(--spacing-3)' }} />
                            <Skeleton variant="text" width="40%" height={16} style={{ marginTop: 'var(--spacing-2)' }} />
                        </div>
                    ))
                ) : (
                    statCards.map((card) => {
                        const IconComponent = card.icon;
                        return (
                            <KpiCard
                                key={card.title}
                                icon={<IconComponent />}
                                value={card.value.toLocaleString()}
                                title={card.title}
                                status={card.colorScheme}
                            />
                        );
                    })
                )}
            </div>

            {/* Translation KPIs */}
            <h3 className="margin-top-6 margin-bottom-3" style={{ fontSize: 'var(--font-size-body-l)', fontWeight: 600 }}>Translation Statistics</h3>
            <div className="admin-stats">
                {isLoading ? (
                    [...Array(5)].map((_, i) => (
                        <div key={i} className="kpi-card kpi-card--m kpi-card--neutral">
                            <Skeleton variant="circular" width={40} height={40} />
                            <Skeleton variant="text" width="60%" height={36} style={{ marginTop: 'var(--spacing-3)' }} />
                            <Skeleton variant="text" width="40%" height={16} style={{ marginTop: 'var(--spacing-2)' }} />
                        </div>
                    ))
                ) : (
                    translationCards.map((card) => {
                        const IconComponent = card.icon;
                        return (
                            <KpiCard
                                key={card.title}
                                icon={<IconComponent />}
                                value={card.value.toLocaleString()}
                                title={card.title}
                                status={card.colorScheme}
                            />
                        );
                    })
                )}
            </div>

            {/* Recent Activity */}
            <RecentActivityTable activities={recentActivity} />
        </ContentLayout>
    );
};

export default DashboardPage;
