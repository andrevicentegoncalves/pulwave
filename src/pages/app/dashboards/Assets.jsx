import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabaseClient';
import { Card, Button, Alert, KpiCard, EmptyState, ConfirmationModal, Icon } from '../../../components/ui';
import { Building, Home, Plus, Edit, Trash2, MapPin, DollarSign, Percent } from '../../../components/ui/iconLibrary';
import ContentLayout from '../../../components/layouts/ContentLayout';

const Assets = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('buildings');
    const [buildings, setBuildings] = useState([]);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, type: null, id: null, name: '' });

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

    const confirmDeleteBuilding = (id, name) => {
        setDeleteModal({
            isOpen: true,
            type: 'building',
            id,
            name,
            title: 'Delete Building',
            message: `Are you sure you want to delete "${name}"? This action cannot be undone.`
        });
    };

    const confirmDeleteProperty = (id, unitNumber) => {
        setDeleteModal({
            isOpen: true,
            type: 'property',
            id,
            name: `Unit ${unitNumber}`,
            title: 'Delete Unit',
            message: `Are you sure you want to delete Unit ${unitNumber}? This action cannot be undone.`
        });
    };

    const handleDelete = async () => {
        const { type, id } = deleteModal;
        if (!type || !id) return;

        try {
            if (type === 'building') {
                const { error } = await supabase.from('buildings').delete().eq('id', id);
                if (error) throw error;
                setBuildings(buildings.filter(b => b.id !== id));
            } else if (type === 'property') {
                const { error } = await supabase.from('units').delete().eq('id', id);
                if (error) throw error;
                setProperties(properties.filter(p => p.id !== id));
            }
        } catch (err) {
            console.error(`Error deleting ${type}:`, err);
            setError(`Failed to delete ${type}. ${type === 'building' ? 'It may have associated properties.' : ''}`);
        } finally {
            setDeleteModal({ isOpen: false, type: null, id: null, name: '' });
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
                <div className="assets-page__loading">Loading assets...</div>
            </ContentLayout>
        );
    }

    return (
        <ContentLayout
            title="Assets Overview"
            subtitle="Manage your real estate portfolio and performance"
            actions={
                <div className="assets-page__actions">
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
            <div className="assets-kpi-grid">
                <KpiCard
                    icon={<Building />}
                    label="Total Buildings"
                    value={totalBuildings}
                    colorScheme="primary"
                    loading={loading}
                />
                <KpiCard
                    icon={<Home />}
                    label="Total Units"
                    value={totalUnits}
                    colorScheme="secondary"
                    loading={loading}
                />
                <KpiCard
                    icon={<Percent />}
                    label="Occupancy Rate"
                    value={`${occupancyRate}%`}
                    subtext={`${occupiedUnits} occupied units`}
                    colorScheme="success"
                    loading={loading}
                />
                <KpiCard
                    icon={<DollarSign />}
                    label="Potential Revenue"
                    value={`$${totalPotentialRent.toLocaleString()}`}
                    subtext="per month"
                    colorScheme="tertiary"
                    loading={loading}
                />
            </div>

            {/* Tabs */}
            <div className="assets-tabs">
                <button
                    onClick={() => setActiveTab('buildings')}
                    className={`assets-tabs__tab ${activeTab === 'buildings' ? 'assets-tabs__tab--active' : ''}`}
                >
                    Buildings
                </button>
                <button
                    onClick={() => setActiveTab('units')}
                    className={`assets-tabs__tab ${activeTab === 'units' ? 'assets-tabs__tab--active' : ''}`}
                >
                    Units
                </button>
            </div>

            {/* Buildings Content */}
            {activeTab === 'buildings' && (
                <div className="assets-grid">
                    {buildings.map((building) => (
                        <Card key={building.id} variant="elevated" className="building-card">
                            <div className="building-card__header">
                                <div className="building-card__title-row">
                                    <h3 className="building-card__name">{building.name}</h3>
                                    <span className="building-card__type-badge">
                                        {building.building_type}
                                    </span>
                                </div>

                                <div className="building-card__location">
                                    <Icon size="s"><MapPin /></Icon>
                                    <span>
                                        {building.address?.city?.name}, {building.address?.city?.country?.name}
                                    </span>
                                </div>
                            </div>

                            <div className="building-card__stats">
                                <div className="building-card__stats-item">
                                    <strong>{building.total_units || 0}</strong>
                                    <span>Units</span>
                                </div>
                                <div className="building-card__stats-item">
                                    <strong>{building.total_floors || 0}</strong>
                                    <span>Floors</span>
                                </div>
                            </div>

                            <div className="building-card__actions">
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
                                    className="building-card__delete-btn"
                                    onClick={() => confirmDeleteBuilding(building.id, building.name)}
                                >
                                    <Icon size="s"><Trash2 /></Icon>
                                </Button>
                            </div>
                        </Card>
                    ))}
                    {buildings.length === 0 && (
                        <EmptyState
                            icon={<Building />}
                            title="No Buildings Yet"
                            description="Add your first building to get started."
                            className="assets-empty"
                        />
                    )}
                </div>
            )}

            {/* Units Content */}
            {activeTab === 'units' && (
                <div className="assets-grid">
                    {properties.map((property) => (
                        <Card key={property.id} variant="elevated" className="unit-card">
                            <div className="unit-card__header">
                                <div className="unit-card__title-row">
                                    <h3 className="unit-card__name">
                                        Unit {property.unit_number}
                                    </h3>
                                    <span className={`unit-card__status-badge unit-card__status-badge--${property.status}`}>
                                        {property.status}
                                    </span>
                                </div>

                                <div className="unit-card__building">
                                    <Icon size="s"><Building /></Icon>
                                    <span>{property.building?.name}</span>
                                </div>

                                <div className="unit-card__location">
                                    <Icon size="s"><MapPin /></Icon>
                                    <span>
                                        {property.building?.address?.city?.name}, {property.building?.address?.city?.country?.name}
                                    </span>
                                </div>
                            </div>

                            <div className="unit-card__stats">
                                <div className="unit-card__stats-item">
                                    <strong>{property.bedrooms || '-'}</strong>
                                    <span>Bed</span>
                                </div>
                                <div className="unit-card__stats-item">
                                    <strong>{property.bathrooms || '-'}</strong>
                                    <span>Bath</span>
                                </div>
                                <div className="unit-card__stats-item">
                                    <strong>{property.square_meters || '-'}</strong>
                                    <span>m²</span>
                                </div>
                            </div>

                            {property.monthly_rent && (
                                <div className="unit-card__price">
                                    ${property.monthly_rent.toLocaleString()}<span>/mo</span>
                                </div>
                            )}

                            <div className="unit-card__actions">
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
                                    className="unit-card__delete-btn"
                                    onClick={() => confirmDeleteProperty(property.id, property.unit_number)}
                                >
                                    <Icon size="s"><Trash2 /></Icon>
                                </Button>
                            </div>
                        </Card>
                    ))}
                    {properties.length === 0 && (
                        <EmptyState
                            icon={<Home />}
                            title="No Units Yet"
                            description="Add your first unit to a building."
                            className="assets-empty"
                        />
                    )}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, type: null, id: null, name: '' })}
                onConfirm={handleDelete}
                title={deleteModal.title}
                message={deleteModal.message}
                confirmText="Delete"
                variant="danger"
            />
        </ContentLayout>
    );
};

export default Assets;
