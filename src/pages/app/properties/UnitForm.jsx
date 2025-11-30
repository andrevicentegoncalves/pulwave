import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../../lib/supabaseClient';
import { Card, Button, Input, TextArea, Alert, Form } from '../../../components/ui';
import Icon from '../../../components/ui/Icon';
import { Building, CheckCircle, XClose, Home } from '../../../components/ui/iconLibrary';
import ContentLayout from '../../../components/layouts/ContentLayout';

const PropertyForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [buildings, setBuildings] = useState([]);

    const [formData, setFormData] = useState({
        building_id: '',
        unit_number: '',
        floor_number: '',
        bedrooms: '',
        bathrooms: '',
        square_meters: '',
        monthly_rent: '',
        status: 'vacant',
        description: '',
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchBuildings();
        if (isEdit) {
            fetchProperty();
        }
    }, [id]);

    const fetchBuildings = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data, error } = await supabase
                    .from('buildings')
                    .select('id, name')
                    .eq('building_owners.owner_id', user.id)
                    .select('id, name, building_owners!inner(owner_id)')
                    .order('name');

                if (error) throw error;
                setBuildings(data || []);
            }
        } catch (err) {
            console.error('Error fetching buildings:', err);
        }
    };

    const fetchProperty = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('units')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;

            setFormData({
                building_id: data.building_id || '',
                unit_number: data.unit_number || '',
                floor_number: data.floor_number || '',
                bedrooms: data.bedrooms || '',
                bathrooms: data.bathrooms || '',
                square_meters: data.square_meters || '',
                monthly_rent: data.monthly_rent || '',
                status: data.status || 'vacant',
                description: data.description || '',
            });
        } catch (err) {
            setError('Failed to load property details');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.building_id) newErrors.building_id = 'Building is required';
        if (!formData.unit_number.trim()) newErrors.unit_number = 'Unit number is required';
        if (!formData.status) newErrors.status = 'Status is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            setError('Please fill in all required fields');
            return;
        }

        setSaveLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            const propertyData = {
                building_id: formData.building_id,
                unit_number: formData.unit_number,
                floor_number: formData.floor_number ? parseInt(formData.floor_number) : null,
                bedrooms: formData.bedrooms ? parseFloat(formData.bedrooms) : null,
                bathrooms: formData.bathrooms ? parseFloat(formData.bathrooms) : null,
                square_meters: formData.square_meters ? parseFloat(formData.square_meters) : null,
                monthly_rent: formData.monthly_rent ? parseFloat(formData.monthly_rent) : null,
                status: formData.status,
                description: formData.description,
            };

            if (isEdit) {
                const { error: updateError } = await supabase
                    .from('units')
                    .update(propertyData)
                    .eq('id', id);

                if (updateError) throw updateError;
                setSuccess('Property updated successfully!');
            } else {
                const { data: newProperty, error: createError } = await supabase
                    .from('units')
                    .insert(propertyData)
                    .select()
                    .single();

                if (createError) throw createError;

                // Link owner
                const { error: ownerError } = await supabase
                    .from('unit_owners')
                    .insert({
                        unit_id: newProperty.id,
                        owner_id: user.id,
                        ownership_percentage: 100
                    });

                if (ownerError) throw ownerError;
                setSuccess('Property created successfully!');
            }

            setTimeout(() => navigate('/assets'), 1500);

        } catch (err) {
            console.error('Error saving property:', err);
            setError(err.message || 'An error occurred while saving');
        } finally {
            setSaveLoading(false);
        }
    };

    if (loading) {
        return (
            <ContentLayout title={isEdit ? 'Edit Unit' : 'Add New Unit'}>
                <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                    Loading...
                </div>
            </ContentLayout>
        );
    }

    return (
        <ContentLayout
            title={isEdit ? 'Edit Unit' : 'Add New Unit'}
            subtitle={isEdit ? 'Update property details' : 'Register a new unit to a building'}
            actions={
                <Button variant="ghost" size="m" onClick={() => navigate('/assets')}>
                    <Icon size="s"><XClose /></Icon>
                    Cancel
                </Button>
            }
        >
            {error && <Alert type="error" dismissible onDismiss={() => setError(null)}>{error}</Alert>}
            {success && <Alert type="success" dismissible onDismiss={() => setSuccess(null)}>{success}</Alert>}

            <Form layout="vertical" onSubmit={handleSubmit}>
                <Card variant="elevated">
                    <h2 style={{ marginTop: 0, marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <Icon size="m"><Home /></Icon>
                        Unit Details
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-4)' }}>
                        <Input
                            label="Building"
                            name="building_id"
                            value={formData.building_id}
                            onChange={handleChange}
                            as="select"
                            error={errors.building_id}
                            required
                            fullWidth
                            disabled={isEdit} // Prevent moving units between buildings for now
                        >
                            <option value="">Select Building</option>
                            {buildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </Input>

                        <Input
                            label="Unit Number"
                            name="unit_number"
                            value={formData.unit_number}
                            onChange={handleChange}
                            placeholder="e.g. 101, 4B"
                            error={errors.unit_number}
                            required
                            fullWidth
                        />

                        <Input
                            label="Floor Number"
                            name="floor_number"
                            type="number"
                            value={formData.floor_number}
                            onChange={handleChange}
                            placeholder="e.g. 1"
                            fullWidth
                        />

                        <Input
                            label="Status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            as="select"
                            required
                            fullWidth
                        >
                            <option value="vacant">Vacant</option>
                            <option value="occupied">Occupied</option>
                            <option value="maintenance">Maintenance</option>
                        </Input>
                    </div>

                    <div style={{ margin: 'var(--space-6) 0', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-6)' }}>
                        <h3 style={{ fontSize: 'var(--font-size-title-xs)', marginBottom: 'var(--space-4)' }}>Specifications</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
                            <Input label="Bedrooms" name="bedrooms" type="number" step="0.5" value={formData.bedrooms} onChange={handleChange} placeholder="e.g. 2" fullWidth />
                            <Input label="Bathrooms" name="bathrooms" type="number" step="0.5" value={formData.bathrooms} onChange={handleChange} placeholder="e.g. 1.5" fullWidth />
                            <Input label="Size (m²)" name="square_meters" type="number" step="0.01" value={formData.square_meters} onChange={handleChange} placeholder="e.g. 75" fullWidth />
                        </div>
                    </div>

                    <div style={{ margin: 'var(--space-6) 0', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-6)' }}>
                        <h3 style={{ fontSize: 'var(--font-size-title-xs)', marginBottom: 'var(--space-4)' }}>Financials</h3>
                        <Input
                            label="Monthly Rent"
                            name="monthly_rent"
                            type="number"
                            step="0.01"
                            value={formData.monthly_rent}
                            onChange={handleChange}
                            placeholder="0.00"
                            leftIcon={<span style={{ paddingLeft: '8px' }}>$</span>}
                            fullWidth
                        />
                    </div>

                    <TextArea
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Additional details about this unit..."
                        rows={4}
                        fullWidth
                    />

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-6)', gap: 'var(--space-3)' }}>
                        <Button type="button" variant="secondary" size="l" onClick={() => navigate('/assets')} disabled={saveLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" size="l" disabled={saveLoading}>
                            {saveLoading ? 'Saving...' : isEdit ? 'Update Unit' : 'Create Unit'}
                        </Button>
                    </div>
                </Card>
            </Form>
        </ContentLayout>
    );
};

export default PropertyForm;
