// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Card, Button } from '../components/ui';
import Icon from '../components/ui/Icon';
import { Home as HomeIcon, Building, MapPin, Calendar, DollarSign, AlertCircle } from '../components/ui/iconLibrary';

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
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
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          // Fetch profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          setProfile(profileData);

          // Fetch statistics
          const { data: buildingOwners } = await supabase
            .from('building_owners')
            .select('building_id')
            .eq('owner_id', user.id);

          const buildingIds = buildingOwners?.map(b => b.building_id) || [];

          if (buildingIds.length > 0) {
            const { data: buildings } = await supabase
              .from('buildings')
              .select('id')
              .in('id', buildingIds);

            const { data: properties } = await supabase
              .from('properties')
              .select('id, status, monthly_rent, building_id')
              .in('building_id', buildingIds);

            const rented = properties?.filter(p => p.status === 'rented').length || 0;
            const available = properties?.filter(p => p.status === 'available').length || 0;
            const revenue = properties
              ?.filter(p => p.status === 'rented')
              .reduce((sum, p) => sum + (parseFloat(p.monthly_rent) || 0), 0) || 0;

            setStats({
              totalBuildings: buildings?.length || 0,
              totalProperties: properties?.length || 0,
              rentedUnits: rented,
              availableUnits: available,
              locations: new Set(buildings?.map(b => b.id)).size || 0,
              monthlyRevenue: revenue,
            });
          }
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="home-page">
      {/* Welcome Header */}
      <div className="home-page__welcome">
        <div className="home-page__welcome-text">
          <h1 className="home-page__greeting">
            {getGreeting()}, {profile?.full_name || user?.email?.split('@')[0]}! 👋
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
            variant="primary" 
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
        <div className="home-page__stats-grid">
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
              <div className="stat-card__label">Total Properties</div>
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
                ${loading ? '—' : stats.monthlyRevenue.toLocaleString()}
              </div>
              <div className="stat-card__label">Monthly Revenue</div>
            </div>
          </Card>
        </div>
      </div>

      {/* Occupancy Section */}
      <div className="home-page__section">
        <h2 className="home-page__section-title">Occupancy Status</h2>
        <div className="home-page__occupancy-grid">
          <Card variant="elevated" className="occupancy-card occupancy-card--rented">
            <div className="occupancy-card__value">{loading ? '—' : stats.rentedUnits}</div>
            <div className="occupancy-card__label">Rented Units</div>
            <div className="occupancy-card__percentage">
              {loading || stats.totalProperties === 0 
                ? '—' 
                : Math.round((stats.rentedUnits / stats.totalProperties) * 100)}%
            </div>
          </Card>

          <Card variant="elevated" className="occupancy-card occupancy-card--available">
            <div className="occupancy-card__value">{loading ? '—' : stats.availableUnits}</div>
            <div className="occupancy-card__label">Available Units</div>
            <div className="occupancy-card__percentage">
              {loading || stats.totalProperties === 0 
                ? '—' 
                : Math.round((stats.availableUnits / stats.totalProperties) * 100)}%
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="home-page__section">
        <h2 className="home-page__section-title">Quick Actions</h2>
        <div className="home-page__actions-grid">
          <Card 
            variant="elevated" 
            className="action-card"
            onClick={() => navigate('/buildings/new')}
          >
            <div className="action-card__icon action-card__icon--primary">
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
            <div className="action-card__icon action-card__icon--success">
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
            onClick={() => navigate('/properties')}
          >
            <div className="action-card__icon action-card__icon--info">
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
            onClick={() => navigate('/properties')}
          >
            <div className="action-card__icon action-card__icon--warning">
              <Icon size="xl">
                <AlertCircle />
              </Icon>
            </div>
            <h3 className="action-card__title">Maintenance</h3>
            <p className="action-card__description">
              Track and manage maintenance requests
            </p>
          </Card>
        </div>
      </div>

      {/* Empty State */}
      {!loading && stats.totalBuildings === 0 && (
        <Card variant="elevated" className="home-page__empty-state">
          <div className="empty-state">
            <div className="empty-state__icon">
              <Icon size="2xl">
                <Building />
              </Icon>
            </div>
            <h3 className="empty-state__title">Get Started with Your First Building</h3>
            <p className="empty-state__description">
              Add your first building to start managing your real estate portfolio
            </p>
            <Button 
              variant="primary" 
              size="l"
              onClick={() => navigate('/buildings/new')}
            >
              <Icon size="m">
                <Building />
              </Icon>
              <span>Add Your First Building</span>
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Home;