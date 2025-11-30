import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabaseClient';
import { Card, Button, Alert } from '../../../components/ui';
import Icon from '../../../components/ui/Icon';
import { Building, Home, Plus, Edit, Trash2, MapPin, TrendingUp, DollarSign, Percent } from '../../../components/ui/iconLibrary';
import ContentLayout from '../../../components/layouts/ContentLayout';

const Assets = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('buildings');
    const [buildings, setBuildings] = useState([]);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                // Fetch Buildings
                const { data: buildingsData, error: buildingsError } = await supabase
                    .from('buildings')
                    .select(`
            *,
            address:addresses (
              *,
              city:cities (
                *,
                country:countries (*)
              )
            ),
            building_owners!inner (
              owner_id
            )
          `)
                    .eq('building_owners.owner_id', user.id)
                    .order('created_at', { ascending: false });

                if (buildingsError) throw buildingsError;
                setBuildings(buildingsData || []);

                // Fetch Properties (Units)
                const { data: propertiesData, error: propertiesError } = await supabase
                    .from('units')
                    .select(`
            *,
            building:buildings (
              *,
              address:addresses (
                *,
                city:cities (
                  *,
                  country:countries (*)
                )
              )
            ),
            unit_owners!inner (
              owner_id
            )
          `)
                    .eq('unit_owners.owner_id', user.id)
                    .order('created_at', { ascending: false });

                if (propertiesError) throw propertiesError;
                setProperties(propertiesData || []);
            }
        } catch (err) {
            console.error('Error fetching assets:', err);
            setError('Failed to load assets. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBuilding = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
            return;
        }
        try {
            const { error } = await supabase.from('buildings').delete().eq('id', id);
            if (error) throw error;
            setBuildings(buildings.filter(b => b.id !== id));
        } catch (err) {
            console.error('Error deleting building:', err);
            alert('Failed to delete building. It may have associated properties.');
        }
    };

    const handleDeleteProperty = async (id, unitNumber) => {
        if (!window.confirm(`Are you sure you want to delete Unit ${unitNumber}? This action cannot be undone.`)) {
            return;
        }
        try {
            const { error } = await supabase.from('units').delete().eq('id', id);
            if (error) throw error;
            setProperties(properties.filter(p => p.id !== id));
        } catch (err) {
            console.error('Error deleting property:', err);
            alert('Failed to delete property.');
        }
    };

    // KPI Calculations
    const totalBuildings = buildings.length;
    const totalUnits = properties.length;
    const occupiedUnits = properties.filter(p => p.status === 'occupied').length;
    const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;
    const totalPotentialRent = properties.reduce((sum, p) => sum + (p.monthly_rent || 0), 0);

    if (loading) {
        return (
            <ContentLayout title="Assets Overview">
                <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>Loading assets...</div>
            </ContentLayout>
        );
    }

    return (
        <ContentLayout
            title="Assets Overview"
            subtitle="Manage your real estate portfolio and performance"
            actions={
                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                    <Button variant="secondary" size="m" onClick={() => navigate('/buildings/new')}>
                        <Icon size="s"><Plus /></Icon> Add Building
                    </Button>
                    <Button variant="primary" size="m" onClick={() => navigate('/properties/new')}>
                        <Icon size="s"><Plus /></Icon> Add Unit
                    </Button>
                </div>
            }
        >
            {error && <Alert type="error" dismissible onDismiss={() => setError(null)}>{error}</Alert>}

            {/* KPI Section */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 'var(--space-4)',
                marginBottom: 'var(--space-8)'
            }}>
                <Card variant="elevated" style={{ padding: 'var(--space-4)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                        <div style={{ padding: '8px', borderRadius: '8px', background: 'var(--color-primary-container)', color: 'var(--color-primary)' }}>
                            <Icon size="m"><Building /></Icon>
                        </div>
                        <span style={{ color: 'var(--color-on-surface-subtle)', fontSize: 'var(--font-size-body-s)' }}>Total Buildings</span>
                    </div>
                    <div style={{ fontSize: 'var(--font-size-h3)', fontWeight: 'bold' }}>{totalBuildings}</div>
                </Card>

                <Card variant="elevated" style={{ padding: 'var(--space-4)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                        <div style={{ padding: '8px', borderRadius: '8px', background: 'var(--color-secondary-container)', color: 'var(--color-secondary)' }}>
                            <Icon size="m"><Home /></Icon>
                        </div>
                        <span style={{ color: 'var(--color-on-surface-subtle)', fontSize: 'var(--font-size-body-s)' }}>Total Units</span>
                    </div>
                    <div style={{ fontSize: 'var(--font-size-h3)', fontWeight: 'bold' }}>{totalUnits}</div>
                </Card>

                <Card variant="elevated" style={{ padding: 'var(--space-4)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                        <div style={{ padding: '8px', borderRadius: '8px', background: 'var(--color-success-container)', color: 'var(--color-success)' }}>
                            <Icon size="m"><Percent /></Icon>
                        </div>
                        <span style={{ color: 'var(--color-on-surface-subtle)', fontSize: 'var(--font-size-body-s)' }}>Occupancy Rate</span>
                    </div>
                    <div style={{ fontSize: 'var(--font-size-h3)', fontWeight: 'bold' }}>{occupancyRate}%</div>
                    <div style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-on-surface-subtle)' }}>{occupiedUnits} occupied units</div>
                </Card>

                <Card variant="elevated" style={{ padding: 'var(--space-4)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                        <div style={{ padding: '8px', borderRadius: '8px', background: 'var(--color-tertiary-container)', color: 'var(--color-tertiary)' }}>
                            <Icon size="m"><DollarSign /></Icon>
                        </div>
                        <span style={{ color: 'var(--color-on-surface-subtle)', fontSize: 'var(--font-size-body-s)' }}>Potential Revenue</span>
                    </div>
                    <div style={{ fontSize: 'var(--font-size-h3)', fontWeight: 'bold' }}>${totalPotentialRent.toLocaleString()}</div>
                    <div style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-on-surface-subtle)' }}>per month</div>
                </Card>
            </div>

            {/* Tabs */}
            <div style={{ marginBottom: 'var(--space-6)', borderBottom: '1px solid var(--color-border)' }}>
                <button
                    onClick={() => setActiveTab('buildings')}
                    style={{
                        padding: 'var(--space-3) var(--space-6)',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === 'buildings' ? '2px solid var(--color-primary)' : '2px solid transparent',
                        color: activeTab === 'buildings' ? 'var(--color-primary)' : 'var(--color-on-surface-subtle)',
                        fontWeight: activeTab === 'buildings' ? 'bold' : 'normal',
                        cursor: 'pointer',
                        fontSize: 'var(--font-size-body-m)'
                    }}
                >
                    Buildings
                </button>
                <button
                    onClick={() => setActiveTab('units')}
                    style={{
                        padding: 'var(--space-3) var(--space-6)',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === 'units' ? '2px solid var(--color-primary)' : '2px solid transparent',
                        color: activeTab === 'units' ? 'var(--color-primary)' : 'var(--color-on-surface-subtle)',
                        fontWeight: activeTab === 'units' ? 'bold' : 'normal',
                        cursor: 'pointer',
                        fontSize: 'var(--font-size-body-m)'
                    }}
                >
                    Units
                </button>
            </div>

            {/* Content */}
            {activeTab === 'buildings' && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: 'var(--space-6)'
                }}>
                    {buildings.map((building) => (
                        <Card key={building.id} variant="elevated" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <div style={{ marginBottom: 'var(--space-4)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
                                    <h3 style={{ margin: 0, fontSize: 'var(--font-size-h4)' }}>{building.name}</h3>
                                    <span style={{
                                        fontSize: 'var(--font-size-caption)',
                                        padding: '2px 8px',
                                        borderRadius: '12px',
                                        background: 'var(--color-surface-variant)',
                                        color: 'var(--color-on-surface-subtle)'
                                    }}>
                                        {building.building_type}
                                    </span>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', color: 'var(--color-on-surface-subtle)', fontSize: 'var(--font-size-body-s)' }}>
                                    <Icon size="s" style={{ marginRight: 'var(--space-2)' }}><MapPin /></Icon>
                                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {building.address?.city?.name}, {building.address?.city?.country?.name}
                                    </span>
                                </div>
                            </div>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: 'var(--space-2)',
                                marginBottom: 'var(--space-6)',
                                padding: 'var(--space-3)',
                                background: 'var(--color-surface-variant)',
                                borderRadius: 'var(--radius-m)',
                                fontSize: 'var(--font-size-caption)'
                            }}>
                                <div style={{ textAlign: 'center' }}>
                                    <strong style={{ display: 'block', fontSize: 'var(--font-size-h4)' }}>{building.total_units || 0}</strong>
                                    <span style={{ color: 'var(--color-on-surface-subtle)' }}>Units</span>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <strong style={{ display: 'block', fontSize: 'var(--font-size-h4)' }}>{building.total_floors || 0}</strong>
                                    <span style={{ color: 'var(--color-on-surface-subtle)' }}>Floors</span>
                                </div>
                            </div>

                            <div style={{ marginTop: 'auto', display: 'flex', gap: 'var(--space-3)' }}>
                                <Button
                                    variant="secondary"
                                    size="s"
                                    fullWidth
                                    onClick={() => navigate(`/buildings/${building.id}/edit`)}
                                >
                                    <Icon size="s"><Edit /></Icon> Edit
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="s"
                                    onClick={() => handleDeleteBuilding(building.id, building.name)}
                                    style={{ color: 'var(--color-error)' }}
                                >
                                    <Icon size="s"><Trash2 /></Icon>
                                </Button>
                            </div>
                        </Card>
                    ))}
                    {buildings.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-on-surface-subtle)' }}>
                            No buildings found. Add your first building to get started.
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'units' && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: 'var(--space-6)'
                }}>
                    {properties.map((property) => (
                        <Card key={property.id} variant="elevated" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <div style={{ marginBottom: 'var(--space-4)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
                                    <h3 style={{ margin: 0, fontSize: 'var(--font-size-h4)' }}>
                                        Unit {property.unit_number}
                                    </h3>
                                    <span style={{
                                        fontSize: 'var(--font-size-caption)',
                                        padding: '2px 8px',
                                        borderRadius: '12px',
                                        background: property.status === 'vacant' ? 'var(--color-success-container)' : 'var(--color-surface-variant)',
                                        color: property.status === 'vacant' ? 'var(--color-on-success-container)' : 'var(--color-on-surface-subtle)',
                                        textTransform: 'capitalize'
                                    }}>
                                        {property.status}
                                    </span>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', color: 'var(--color-on-surface-subtle)', fontSize: 'var(--font-size-body-s)', marginBottom: 'var(--space-1)' }}>
                                    <Icon size="s" style={{ marginRight: 'var(--space-2)' }}><Building /></Icon>
                                    <span style={{ fontWeight: 'bold' }}>{property.building?.name}</span>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', color: 'var(--color-on-surface-subtle)', fontSize: 'var(--font-size-body-s)' }}>
                                    <Icon size="s" style={{ marginRight: 'var(--space-2)' }}><MapPin /></Icon>
                                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {property.building?.address?.city?.name}, {property.building?.address?.city?.country?.name}
                                    </span>
                                </div>
                            </div>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr 1fr',
                                gap: 'var(--space-2)',
                                marginBottom: 'var(--space-6)',
                                padding: 'var(--space-3)',
                                background: 'var(--color-surface-variant)',
                                borderRadius: 'var(--radius-m)',
                                fontSize: 'var(--font-size-caption)'
                            }}>
                                <div style={{ textAlign: 'center' }}>
                                    <strong style={{ display: 'block', fontSize: 'var(--font-size-body-m)' }}>{property.bedrooms || '-'}</strong>
                                    <span style={{ color: 'var(--color-on-surface-subtle)' }}>Bed</span>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <strong style={{ display: 'block', fontSize: 'var(--font-size-body-m)' }}>{property.bathrooms || '-'}</strong>
                                    <span style={{ color: 'var(--color-on-surface-subtle)' }}>Bath</span>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <strong style={{ display: 'block', fontSize: 'var(--font-size-body-m)' }}>{property.square_meters || '-'}</strong>
                                    <span style={{ color: 'var(--color-on-surface-subtle)' }}>m²</span>
                                </div>
                            </div>

                            {property.monthly_rent && (
                                <div style={{
                                    marginBottom: 'var(--space-4)',
                                    fontSize: 'var(--font-size-h4)',
                                    fontWeight: 'bold',
                                    color: 'var(--color-primary)'
                                }}>
                                    ${property.monthly_rent.toLocaleString()}<span style={{ fontSize: 'var(--font-size-body-s)', color: 'var(--color-on-surface-subtle)', fontWeight: 'normal' }}>/mo</span>
                                </div>
                            )}

                            <div style={{ marginTop: 'auto', display: 'flex', gap: 'var(--space-3)' }}>
                                <Button
                                    variant="secondary"
                                    size="s"
                                    fullWidth
                                    onClick={() => navigate(`/properties/${property.id}/edit`)}
                                >
                                    <Icon size="s"><Edit /></Icon> Edit
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="s"
                                    onClick={() => handleDeleteProperty(property.id, property.unit_number)}
                                    style={{ color: 'var(--color-error)' }}
                                >
                                    <Icon size="s"><Trash2 /></Icon>
                                </Button>
                            </div>
                        </Card>
                    ))}
                    {properties.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-on-surface-subtle)' }}>
                            No units found. Add your first unit to a building.
                        </div>
                    )}
                </div>
            )}
        </ContentLayout>
    );
};

export default Assets;
