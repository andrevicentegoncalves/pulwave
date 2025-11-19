// src/pages/BuildingForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Card, Button, Input, TextArea, Alert, Form, Building, MapPin, XClose, CheckCircle } from '../components/ui';
import Icon from '../components/ui/Icon';

const BuildingForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    street_address: '',
    street_address_2: '',
    city_id: '',
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
    fetchCountries();
    if (isEdit) {
      fetchBuilding();
    }
  }, [id]);

  useEffect(() => {
    if (formData.country_id) {
      fetchCities(formData.country_id);
    }
  }, [formData.country_id]);

  const fetchCountries = async () => {
    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .order('name');
    
    if (!error) setCountries(data || []);
  };

  const fetchCities = async (countryId) => {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .eq('country_id', countryId)
      .order('name');
    
    if (!error) setCities(data || []);
  };

  const fetchBuilding = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('buildings')
        .select(`
          *,
          address:addresses (
            *,
            city:cities (
              *,
              country:countries (*)
            )
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      setFormData({
        name: data.name || '',
        description: data.description || '',
        street_address: data.address?.street_address || '',
        street_address_2: data.address?.street_address_2 || '',
        city_id: data.address?.city_id || '',
        postal_code: data.address?.postal_code || '',
        country_id: data.address?.city?.country_id || '',
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

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Building name is required';
    if (!formData.street_address.trim()) newErrors.street_address = 'Street address is required';
    if (!formData.country_id) newErrors.country_id = 'Country is required';
    if (!formData.city_id) newErrors.city_id = 'City is required';
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
      const { data: { user } } = await supabase.auth.getUser();

      const addressData = {
        street_address: formData.street_address,
        street_address_2: formData.street_address_2,
        city_id: formData.city_id,
        postal_code: formData.postal_code,
      };

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

      setTimeout(() => navigate('/properties'), 1500);

    } catch (err) {
      console.error('Error saving building:', err);
      setError(err.message || 'An error occurred while saving');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="building-form-page">
        <Card variant="elevated" className="building-form-page__card">
          <p>Loading building data...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="building-form-page">
      <div className="building-form-page__header">
        <div>
          <h1 className="building-form-page__title">
            <Icon size="l">
              <Building />
            </Icon>
            {isEdit ? 'Edit Building' : 'Add New Building'}
          </h1>
          <p className="building-form-page__subtitle">
            {isEdit 
              ? 'Update building information and details' 
              : 'Register a new building to your portfolio'}
          </p>
        </div>
        <Button variant="ghost" size="m" onClick={() => navigate('/properties')}>
          <Icon size="s"><XClose /></Icon>
          Cancel
        </Button>
      </div>

      {error && <Alert type="error" dismissible onDismiss={() => setError(null)}>{error}</Alert>}
      {success && <Alert type="success" dismissible onDismiss={() => setSuccess(null)}>{success}</Alert>}

      <Form layout="vertical" onSubmit={handleSubmit}>
        <Card variant="elevated" className="building-form-page__section">
          <h2 className="building-form-page__section-title">Basic Information</h2>
          
          <Input label="Building Name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g., Sunset Towers" error={errors.name} required fullWidth />
          <TextArea label="Description" name="description" value={formData.description} onChange={handleChange} placeholder="Brief description of the building..." rows={4} fullWidth />

          <div className="building-form-page__row">
            <Input label="Building Type" name="building_type" value={formData.building_type} onChange={handleChange} as="select" required fullWidth>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="mixed-use">Mixed Use</option>
              <option value="industrial">Industrial</option>
            </Input>
            <Input label="Year Built" name="year_built" type="number" value={formData.year_built} onChange={handleChange} placeholder="e.g., 2020" min="1800" max={new Date().getFullYear()} fullWidth />
          </div>

          <div className="building-form-page__row">
            <Input label="Total Floors" name="total_floors" type="number" value={formData.total_floors} onChange={handleChange} placeholder="e.g., 10" min="1" fullWidth />
            <Input label="Total Units" name="total_units" type="number" value={formData.total_units} onChange={handleChange} placeholder="e.g., 50" min="1" fullWidth />
          </div>
        </Card>

        <Card variant="elevated" className="building-form-page__section">
          <h2 className="building-form-page__section-title">
            <Icon size="m"><MapPin /></Icon>
            Location
          </h2>

          <Input label="Street Address" name="street_address" value={formData.street_address} onChange={handleChange} placeholder="123 Main Street" error={errors.street_address} required fullWidth />
          <Input label="Street Address Line 2" name="street_address_2" value={formData.street_address_2} onChange={handleChange} placeholder="Apt, suite, etc. (optional)" fullWidth />

          <div className="building-form-page__row">
            <Input label="Country" name="country_id" value={formData.country_id} onChange={handleChange} as="select" error={errors.country_id} required fullWidth>
              <option value="">Select Country</option>
              {countries.map(country => <option key={country.id} value={country.id}>{country.name}</option>)}
            </Input>
            <Input label="City" name="city_id" value={formData.city_id} onChange={handleChange} as="select" error={errors.city_id} required disabled={!formData.country_id} fullWidth>
              <option value="">Select City</option>
              {cities.map(city => <option key={city.id} value={city.id}>{city.name}</option>)}
            </Input>
          </div>

          <Input label="Postal Code" name="postal_code" value={formData.postal_code} onChange={handleChange} placeholder="12345" error={errors.postal_code} required fullWidth />
        </Card>

        <Card variant="elevated" className="building-form-page__section">
          <h2 className="building-form-page__section-title">Amenities</h2>
          <div className="building-form-page__checkbox-grid">
            {['elevator', 'parking', 'gym', 'pool', 'security', 'laundry'].map(amenity => (
              <label key={amenity} className="checkbox-label">
                <input type="checkbox" name={`has_${amenity}`} checked={formData[`has_${amenity}`]} onChange={handleChange} />
                <span>{amenity.charAt(0).toUpperCase() + amenity.slice(1)}</span>
              </label>
            ))}
          </div>
        </Card>

        <div className="building-form-page__actions">
          <Button type="button" variant="secondary" size="l" onClick={() => navigate('/properties')} disabled={saveLoading}>Cancel</Button>
          <Button type="submit" variant="primary" size="l" disabled={saveLoading}>
            {saveLoading ? (<><Icon size="s"><CheckCircle /></Icon>Saving...</>) : (<><Icon size="s"><CheckCircle /></Icon>{isEdit ? 'Update Building' : 'Create Building'}</>)}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default BuildingForm;