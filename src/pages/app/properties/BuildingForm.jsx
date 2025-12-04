import React, { useState } from 'react';
import { Card, Input, Button } from '../../../components/ui';
import { AddressAutocomplete } from '../../../components/forms';

const BuildingForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    street_name: '',
    number: '',
    postal_code: '',
    city_name: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStreetSelect = (info) => {
    setFormData(prev => ({
      ...prev,
      street_name: info.value,
      postal_code: info.postalCode || prev.postal_code,
      city_name: info.address?.city || info.address?.town || prev.city_name
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Building data:', formData);
    // Add your save logic here
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card header={<h2>Building Information</h2>}>
        <div className="form-grid">
          <Input
            label="Building Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter building name"
            required
            fullWidth
          />

          <AddressAutocomplete
            label="Street Address"
            type="street"
            value={formData.street_name}
            onChange={(val) => handleChange({ target: { name: 'street_name', value: val } })}
            onSelect={handleStreetSelect}
            city={formData.city_name}
            placeholder="Search for street..."
            fullWidth
          />

          <Input
            label="Number"
            name="number"
            value={formData.number}
            onChange={handleChange}
            placeholder="123"
            fullWidth
          />

          <Input
            label="Postal Code"
            name="postal_code"
            value={formData.postal_code}
            onChange={handleChange}
            placeholder="12345"
            fullWidth
          />

          <Input
            label="City"
            name="city_name"
            value={formData.city_name}
            onChange={handleChange}
            placeholder="City name"
            fullWidth
          />
        </div>

        <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <Button type="button" variant="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save Building
          </Button>
        </div>
      </Card>
    </form>
  );
};

export default BuildingForm;
