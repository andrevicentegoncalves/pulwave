/**
 * Real Estate Dashboard
 * 
 * Main dashboard for the real estate application.
 * Shows portfolio overview, stats, and quick actions.
 * 
 * @package @pulwave/pages-dashboard
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Home as HomeIcon, MapPin, DollarSign, Calendar, AlertCircle } from '@pulwave/ui';
import { Card, CardGrid, Button, Icon, FloatingActionButton } from '@pulwave/ui';
import { authService } from '@pulwave/entity-auth';

// Dashboard stats type
export interface DashboardStats {
    totalBuildings: number;
    totalProperties: number;
    rentedUnits: number;
    availableUnits: number;
    locations: number;
    monthlyRevenue: number;
}

// Helper to get greeting based on time
const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
};

// Helper to get display name
const getDisplayName = (user: { email?: string } | null, profile: { first_name?: string } | null): string => {
    if (profile?.first_name) return profile.first_name;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
};

export interface RealEstateDashboardProps {
    /** Optional custom greeting */
    greeting?: string;
}

/**
 * RealEstateDashboard - Main dashboard for real estate app
 */
export const RealEstateDashboard = (_props: RealEstateDashboardProps) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<{ email?: string } | null>(null);
    const [profile, setProfile] = useState<{ first_name?: string } | null>(null);
    const [stats, setStats] = useState<DashboardStats>({
        totalBuildings: 0,
        totalProperties: 0,
        rentedUnits: 0,
        availableUnits: 0,
        locations: 0,
        monthlyRevenue: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await authService.getSession();
                setUser(data?.user || null);

                // TODO: Fetch stats from dashboardService when migrated to foundation
                // For now, use placeholder data
                setStats({
                    totalBuildings: 0,
                    totalProperties: 0,
                    rentedUnits: 0,
                    availableUnits: 0,
                    locations: 0,
                    monthlyRevenue: 0,
                });
            } catch {
                // Silent error handling for dashboard data fetch
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Floating Action Button actions
    const fabActions = [
        {
            icon: <Building />,
            label: 'Add Building',
            onClick: () => navigate('/buildings/new')
        },
        {
            icon: <HomeIcon />,
            label: 'Add Property',
            onClick: () => navigate('/properties/new')
        }
    ];

    return (
        <div className="home-page">
            {/* Welcome Header */}
            <div className="home-page__welcome">
                <div className="home-page__welcome-text">
                    <h1 className="home-page__greeting">
                        {getGreeting()}, {getDisplayName(user, profile)}! 👋
                    </h1>
                    <p className="home-page__date">
                        {new Date().toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                </div>
                <div className="home-page__welcome-actions">
                    <Button
                        kind="primary"
                        size="m"
                        onClick={() => navigate('/buildings/new')}
                    >
                        <Icon size="s">
                            <Building />
                        </Icon>
                        <span>Add Building</span>
                    </Button>
                </div>
            </div>

            {/* Statistics Overview */}
            <div className="home-page__section">
                <h2 className="home-page__section-title">Overview</h2>
                <CardGrid minCardWidth="narrow" gap="m">
                    <Card variant="elevated" className="stat-card stat-card--primary">
                        <div className="stat-card__header">
                            <div className="stat-card__icon-wrapper stat-card__icon-wrapper--primary">
                                <Icon size="l">
                                    <Building />
                                </Icon>
                            </div>
                        </div>
                        <div className="stat-card__body">
                            <div className="stat-card__value">{loading ? '—' : stats.totalBuildings}</div>
                            <div className="stat-card__label">Buildings</div>
                        </div>
                    </Card>

                    <Card variant="elevated" className="stat-card stat-card--success">
                        <div className="stat-card__header">
                            <div className="stat-card__icon-wrapper stat-card__icon-wrapper--success">
                                <Icon size="l">
                                    <HomeIcon />
                                </Icon>
                            </div>
                        </div>
                        <div className="stat-card__body">
                            <div className="stat-card__value">{loading ? '—' : stats.totalProperties}</div>
                            <div className="stat-card__label">Properties</div>
                        </div>
                    </Card>

                    <Card variant="elevated" className="stat-card stat-card--info">
                        <div className="stat-card__header">
                            <div className="stat-card__icon-wrapper stat-card__icon-wrapper--info">
                                <Icon size="l">
                                    <MapPin />
                                </Icon>
                            </div>
                        </div>
                        <div className="stat-card__body">
                            <div className="stat-card__value">{loading ? '—' : stats.locations}</div>
                            <div className="stat-card__label">Locations</div>
                        </div>
                    </Card>

                    <Card variant="elevated" className="stat-card stat-card--warning">
                        <div className="stat-card__header">
                            <div className="stat-card__icon-wrapper stat-card__icon-wrapper--warning">
                                <Icon size="l">
                                    <DollarSign />
                                </Icon>
                            </div>
                        </div>
                        <div className="stat-card__body">
                            <div className="stat-card__value">
                                {loading ? '—' : `$${stats.monthlyRevenue.toLocaleString()}`}
                            </div>
                            <div className="stat-card__label">Monthly Revenue</div>
                        </div>
                    </Card>
                </CardGrid>
            </div>

            {/* Quick Actions */}
            <div className="home-page__section">
                <h2 className="home-page__section-title">Quick Actions</h2>
                <CardGrid minCardWidth="standard" gap="m" className="card-grid--comfortable">
                    <Card
                        variant="elevated"
                        className="action-card"
                        onClick={() => navigate('/buildings/new')}
                    >
                        <div className="action-card__icon-wrapper action-card__icon-wrapper--primary">
                            <Icon size="xl">
                                <Building />
                            </Icon>
                        </div>
                        <h3 className="action-card__title">Add Building</h3>
                        <p className="action-card__description">
                            Register a new building to your portfolio
                        </p>
                    </Card>

                    <Card
                        variant="elevated"
                        className="action-card"
                        onClick={() => navigate('/properties')}
                    >
                        <div className="action-card__icon-wrapper action-card__icon-wrapper--success">
                            <Icon size="xl">
                                <HomeIcon />
                            </Icon>
                        </div>
                        <h3 className="action-card__title">View Properties</h3>
                        <p className="action-card__description">
                            Manage all your property units
                        </p>
                    </Card>

                    <Card
                        variant="elevated"
                        className="action-card"
                        onClick={() => navigate('/schedule')}
                    >
                        <div className="action-card__icon-wrapper action-card__icon-wrapper--info">
                            <Icon size="xl">
                                <Calendar />
                            </Icon>
                        </div>
                        <h3 className="action-card__title">Schedule</h3>
                        <p className="action-card__description">
                            View appointments and maintenance
                        </p>
                    </Card>

                    <Card
                        variant="elevated"
                        className="action-card"
                        onClick={() => navigate('/maintenance')}
                    >
                        <div className="action-card__icon-wrapper action-card__icon-wrapper--warning">
                            <Icon size="xl">
                                <AlertCircle />
                            </Icon>
                        </div>
                        <h3 className="action-card__title">Maintenance</h3>
                        <p className="action-card__description">
                            Track and manage maintenance requests
                        </p>
                    </Card>
                </CardGrid>
            </div>

            {/* Empty State for New Users */}
            {!loading && stats.totalBuildings === 0 && (
                <div className="home-page__empty-state">
                    <Card variant="elevated" className="empty-state-card">
                        <div className="empty-state-card__icon">
                            <Icon size="xl">
                                <Building />
                            </Icon>
                        </div>
                        <h3 className="empty-state-card__title">Get Started with Your First Building</h3>
                        <p className="empty-state-card__description">
                            Add your first building to start managing your real estate portfolio
                        </p>
                        <Button
                            kind="primary"
                            size="l"
                            onClick={() => navigate('/buildings/new')}
                        >
                            <Icon size="s">
                                <Building />
                            </Icon>
                            <span>Add Your First Building</span>
                        </Button>
                    </Card>
                </div>
            )}

            {/* Floating Action Button (Mobile Only) */}
            <FloatingActionButton
                position="bottom-right"
                actions={fabActions}
            />
        </div>
    );
};

RealEstateDashboard.displayName = 'RealEstateDashboard';

export default RealEstateDashboard;
