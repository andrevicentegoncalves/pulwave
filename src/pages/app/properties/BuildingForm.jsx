import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../../lib/supabaseClient';
import { Card, Button, Input, TextArea, Alert, Form } from '../../../components/ui';
import Icon from '../../../components/ui/Icon';
import { Building, CheckCircle, XClose, Info, MapPin, Car, Dumbbell, Waves, Shirt, ShieldCheck } from '../../../components/ui/iconLibrary';
import ContentLayout from '../../../components/layouts/ContentLayout';
import AddressAutocomplete from '../../../components/forms/AddressAutocomplete';
import CountriesSelect from '../../../components/forms/CountriesSelect';
import RegionsSelect from '../../../components/forms/RegionsSelect';

const BuildingForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    street_name: '',
    street_address_2: '', // Keeping this if it exists in DB schema, otherwise remove
    city_name: '',
    region_id: '',
    postal_code: '',
    country_id: '',
    year_built: '',
    total_floors: '',
    total_units: '',
    building_type: 'residential',
    has_elevator: false,
    has_parking: false,
    has_gym: false,
    has_pool: false,
    has_security: false,
    has_laundry: false,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      fetchBuilding();
    }
  }, [id]);

  // Fetch selected country details for ISO code (needed for autocomplete)
  useEffect(() => {
    const fetchCountry = async () => {
      if (formData.country_id) {
        const { data } = await supabase
          .from('countries')
          .select('iso_code_2')
          .eq('id', formData.country_id)
          .single();
        setSelectedCountry(data);
      }
    };
    fetchCountry();
  }, [formData.country_id]);

  const fetchBuilding = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('buildings')
        .select(`
            *,
            address:addresses (
              *
            )
          `)
        .eq('id', id)
        .single();

      if (error) throw error;

      setFormData({
        name: data.name || '',
        description: data.description || '',
        street_name: data.address?.street_name || '',
        street_address_2: data.address?.street_address_2 || '', // Assuming this column exists or will be ignored
        city_name: data.address?.city_name || '',
        region_id: data.address?.region_id || '',
        postal_code: data.address?.postal_code || '',
        country_id: data.address?.country_id || '',
        year_built: data.year_built || '',
        total_floors: data.total_floors || '',
        total_units: data.total_units || '',
        building_type: data.building_type || 'residential',
        has_elevator: data.amenities?.elevator || false,
        has_parking: data.amenities?.parking || false,
        has_gym: data.amenities?.gym || false,
        has_pool: data.amenities?.pool || false,
        has_security: data.amenities?.security || false,
        has_laundry: data.amenities?.laundry || false,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleCitySelect = (addressInfo) => {
    setFormData(prev => ({
      ...prev,
      city_name: addressInfo.value,
      postal_code: addressInfo.postalCode || prev.postal_code
    }));
    if (errors.city_name) setErrors(prev => ({ ...prev, city_name: null }));
  };

  const handleStreetSelect = (addressInfo) => {
    setFormData(prev => ({
      ...prev,
      street_name: addressInfo.value,
      postal_code: addressInfo.postalCode || prev.postal_code
    }));
    if (errors.street_name) setErrors(prev => ({ ...prev, street_name: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Building name is required';
    if (!formData.street_name.trim()) newErrors.street_name = 'Street address is required';
    if (!formData.country_id) newErrors.country_id = 'Country is required';
    if (!formData.city_name.trim()) newErrors.city_name = 'City is required';
    if (!formData.postal_code.trim()) newErrors.postal_code = 'Postal code is required';
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
      let addressId;

      if (isEdit) {
        const { data: existingBuilding } = await supabase
          .from('buildings')
          .select('address_id')
          .eq('id', id)
          .single();

        addressId = existingBuilding.address_id;
        await supabase.from('addresses').update(addressData).eq('id', addressId);
      } else {
        const { data: newAddress, error: addressError } = await supabase
          .from('addresses')
          .insert(addressData)
          .select()
          .single();

        if (addressError) throw addressError;
        addressId = newAddress.id;
      }

      const buildingData = {
        name: formData.name,
        description: formData.description,
        address_id: addressId,
        year_built: formData.year_built ? parseInt(formData.year_built) : null,
        total_floors: formData.total_floors ? parseInt(formData.total_floors) : null,
        total_units: formData.total_units ? parseInt(formData.total_units) : null,
        building_type: formData.building_type,
        amenities: {
          elevator: formData.has_elevator,
          parking: formData.has_parking,
          gym: formData.has_gym,
          pool: formData.has_pool,
          security: formData.has_security,
          laundry: formData.has_laundry,
        },
      };

      if (isEdit) {
        const { error: updateError } = await supabase
          .from('buildings')
          .update(buildingData)
          .eq('id', id);

        if (updateError) throw updateError;
        setSuccess('Building updated successfully!');
      } else {
        const { data: newBuilding, error: buildingError } = await supabase
          .from('buildings')
          .insert(buildingData)
          .select()
          .single();

        if (buildingError) throw buildingError;

        const { error: ownerError } = await supabase
          .from('building_owners')
          .insert({
            building_id: newBuilding.id,
            owner_id: user.id,
            ownership_percentage: 100,
          });

        if (ownerError) throw ownerError;
        setSuccess('Building created successfully!');
      }

      setTimeout(() => navigate('/assets'), 1500);

    } catch (err) {
      console.error('Error saving building:', err);
      setError(err.message || 'An error occurred while saving');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <ContentLayout title={isEdit ? 'Edit Building' : 'Add New Building'}>
        <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
          Loading building data...
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout
      title={isEdit ? 'Edit Building' : 'Add New Building'}
      subtitle={isEdit ? 'Update building information and details' : 'Register a new building to your portfolio'}
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
        <Card variant="elevated" style={{ marginBottom: 'var(--space-6)' }}>
          <h2 style={{ marginTop: 0, marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <Icon size="m"><Info /></Icon>
            Basic Information
          </h2>

          <Input label="Building Name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g., Sunset Towers" error={errors.name} required fullWidth />
          <TextArea label="Description" name="description" value={formData.description} onChange={handleChange} placeholder="Brief description of the building..." rows={4} fullWidth />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
            <Input label="Building Type" name="building_type" value={formData.building_type} onChange={handleChange} as="select" required fullWidth>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="mixed-use">Mixed Use</option>
              <option value="industrial">Industrial</option>
            </Input>
            <Input label="Year Built" name="year_built" type="number" value={formData.year_built} onChange={handleChange} placeholder="e.g., 2020" min="1800" max={new Date().getFullYear()} fullWidth />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
            <Input label="Total Floors" name="total_floors" type="number" value={formData.total_floors} onChange={handleChange} placeholder="e.g., 10" min="1" fullWidth />
            <Input label="Total Units" name="total_units" type="number" value={formData.total_units} onChange={handleChange} placeholder="e.g., 50" min="1" fullWidth />
          </div>
        </Card>

        <Card variant="elevated" style={{ marginBottom: 'var(--space-6)' }}>
          <h2 style={{ marginTop: 0, marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <Icon size="m"><MapPin /></Icon>
            Location
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
            <CountriesSelect
              name="country_id"
              label="Country"
              value={formData.country_id}
              onChange={(val) => handleSelectChange('country_id', val)}
              error={errors.country_id}
              required
            />
            <RegionsSelect
              name="region_id"
              label="Region/State"
              countryId={formData.country_id}
              value={formData.region_id}
              onChange={(val) => handleSelectChange('region_id', val)}
            />
          </div>

          <AddressAutocomplete
            label="City"
            type="city"
            value={formData.city_name}
            onChange={(val) => handleSelectChange('city_name', val)}
            onSelect={handleCitySelect}
            countryCode={selectedCountry?.iso_code_2 || ''}
            placeholder="Search for your city..."
            disabled={!formData.country_id}
            error={errors.city_name}
            fullWidth
          />

          <Input label="Postal Code" name="postal_code" value={formData.postal_code} onChange={handleChange} placeholder="12345" error={errors.postal_code} required fullWidth />

          <AddressAutocomplete
            label="Street Address"
            type="street"
            name="street_name"
            value={formData.street_name}
            onChange={(val) => handleSelectChange('street_name', val)}
            onSelect={handleStreetSelect}
            countryCode={selectedCountry?.iso_code_2 || ''}
            city={formData.city_name}
            placeholder="Search for your street..."
            disabled={!formData.city_name}
            error={errors.street_name}
            fullWidth
          />
          {/* <Input label="Street Address Line 2" name="street_address_2" value={formData.street_address_2} onChange={handleChange} placeholder="Apt, suite, etc. (optional)" fullWidth /> */}
        </Card>

        <Card variant="elevated" style={{ marginBottom: 'var(--space-6)' }}>
          <h2 style={{ marginTop: 0, marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <Icon size="m"><CheckCircle /></Icon>
            Amenities
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
            {[
              { key: 'elevator', label: 'Elevator', icon: Building },
              { key: 'parking', label: 'Parking', icon: Car },
              { key: 'gym', label: 'Gym', icon: Dumbbell },
              { key: 'pool', label: 'Pool', icon: Waves },
              { key: 'security', label: 'Security', icon: ShieldCheck },
              { key: 'laundry', label: 'Laundry', icon: Shirt },
            ].map(({ key, label, icon: IconComponent }) => (
              <label key={key} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                padding: 'var(--space-3)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-m)',
                cursor: 'pointer',
                background: formData[`has_${key}`] ? 'var(--color-primary-container)' : 'transparent',
                borderColor: formData[`has_${key}`] ? 'var(--color-primary)' : 'var(--color-border)',
                transition: 'all 0.2s ease'
              }}>
                <input
                  type="checkbox"
                  name={`has_${key}`}
                  checked={formData[`has_${key}`]}
                  onChange={handleChange}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)' }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  {IconComponent && <Icon size="s"><IconComponent /></Icon>}
                  <span>{label}</span>
                </div>
              </label>
            ))}
          </div>
        </Card>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
          <Button type="button" variant="secondary" size="l" onClick={() => navigate('/assets')} disabled={saveLoading}>Cancel</Button>
          <Button type="submit" variant="primary" size="l" disabled={saveLoading}>
            {saveLoading ? 'Saving...' : isEdit ? 'Update Building' : 'Create Building'}
          </Button>
        </div>
      </Form>
    </ContentLayout>
  );
};

export default BuildingForm;