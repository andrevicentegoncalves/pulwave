// src/pages/Properties.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Card, Button } from '../components/ui';
import Icon from '../components/ui/Icon';
import { Building, MapPin } from '../components/ui/iconLibrary';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Fetch properties owned by the user
          const { data, error } = await supabase
            .from('properties')
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
              property_owners!inner (
                owner_id,
                ownership_percentage
              )
            `)
            .eq('property_owners.owner_id', user.id);

          if (error) throw error;
          setProperties(data || []);
        }
      } catch (err) {
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return (
      <div className="properties-page">
        <div className="properties-page__header">
          <h1 className="properties-page__title">Properties</h1>
        </div>
        <p>Loading properties...</p>
      </div>
    );
  }

  return (
    <div className="properties-page">
      <div className="properties-page__header">
        <h1 className="properties-page__title">Your Properties</h1>
        <p className="properties-page__subtitle">
          Manage and view all your real estate properties
        </p>
      </div>

      <div className="properties-page__actions">
        <Button variant="primary" size="l">
          <Icon size="m">
            <Building />
          </Icon>
          <span>Add Property</span>
        </Button>
      </div>

      {properties.length === 0 ? (
        <Card variant="elevated" className="properties-page__empty">
          <div className="properties-page__empty-icon">
            <Icon size="2xl">
              <Building />
            </Icon>
          </div>
          <h3>No properties yet</h3>
          <p>Get started by adding your first property</p>
          <Button variant="primary" size="m">
            Add Your First Property
          </Button>
        </Card>
      ) : (
        <div className="properties-grid">
          {properties.map((property) => (
            <Card key={property.id} variant="elevated" className="property-card">
              <div className="property-card__header">
                <h3 className="property-card__title">
                  Unit {property.unit_number}
                </h3>
                <span className={`property-card__status property-card__status--${property.status}`}>
                  {property.status}
                </span>
              </div>
              
              <div className="property-card__info">
                <div className="property-card__detail">
                  <Icon size="s">
                    <Building />
                  </Icon>
                  <span>{property.building?.name}</span>
                </div>
                <div className="property-card__detail">
                  <Icon size="s">
                    <MapPin />
                  </Icon>
                  <span>
                    {property.building?.address?.city?.name}, 
                    {property.building?.address?.city?.country?.name}
                  </span>
                </div>
              </div>

              <div className="property-card__specs">
                <span>{property.bedrooms} bed</span>
                <span>•</span>
                <span>{property.bathrooms} bath</span>
                <span>•</span>
                <span>{property.square_meters}m²</span>
              </div>

              {property.monthly_rent && (
                <div className="property-card__rent">
                  ${property.monthly_rent.toLocaleString()}/month
                </div>
              )}

              <Button variant="secondary" size="s" fullWidth>
                View Details
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Properties;