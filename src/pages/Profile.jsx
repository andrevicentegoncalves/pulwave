import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Card, Button, Input, Alert, Form, Select } from '../components/ui';
import Icon from '../components/ui/Icon';
import { User, CheckCircle, MapPin, Building } from '../components/ui/iconLibrary';
import { VisualEffect } from '../components/ui';
import AvatarUpload from '../components/ui/AvatarUpload';
import ContentLayout from '../components/layouts/ContentLayout';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  // Profile Form State
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    phone: '',
    company_name: '',
    vat_id: '',
    theme: 'light',
  });

  // Address Form State - keeping country_id/region_id for UI filtering, but won't save them
  const [addressData, setAddressData] = useState({
    country_id: '',
    region_id: '',
    city_id: '',
    street_name: '',
    number: '',
    floor: '',
    postal_code: '',
    type: 'home',
  });

  // Dropdown Data
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);

  // Fetch User & Profile Data
  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        setProfile(profileData);
        if (profileData) {
          setFormData({
            username: profileData.username || '',
            first_name: profileData.first_name || '',
            middle_name: profileData.middle_name || '',
            last_name: profileData.last_name || '',
            phone: profileData.phone || '',
            company_name: profileData.company_name || '',
            vat_id: profileData.vat_id || '',
            theme: profileData.theme || 'light',
          });

          // Fetch Address if exists
          if (profileData.address_id) {
            const { data: address } = await supabase
              .from('addresses')
              .select(`
                *,
                cities (
                  id,
                  name,
                  country_id,
                  region_id
                )
              `)
              .eq('id', profileData.address_id)
              .single();

            if (address) {
              setAddressData({
                country_id: address.cities?.country_id || '', // For UI filtering
                region_id: address.cities?.region_id || '', // For UI filtering
                city_id: address.city_id || '',
                street_name: address.street || '', // Map from 'street' column
                number: address.number || '',
                floor: address.floor || '',
                postal_code: address.postal_code || '',
                type: address.type || 'home',
              });
            }
          }
        }
      }
    };

    fetchUserData();
    fetchCountries();
  }, []);

  // Fetch Countries
  const fetchCountries = async () => {
    try {
      const { data } = await supabase.from('countries').select('id, name').order('name');
      if (data) setCountries(data);
    } catch (err) {
      console.error('Error fetching countries:', err);
    }
  };

  // Fetch Regions when Country changes
  useEffect(() => {
    const fetchRegions = async () => {
      if (!addressData.country_id) {
        setRegions([]);
        return;
      }
      try {
        const { data } = await supabase
          .from('regions')
          .select('id, name')
          .eq('country_id', addressData.country_id)
          .order('name');
        if (data) setRegions(data);
      } catch (err) {
        console.error('Error fetching regions:', err);
      }
    };

    fetchRegions();
  }, [addressData.country_id]);

  // Fetch Cities when Country changes
  useEffect(() => {
    const fetchCities = async () => {
      if (!addressData.country_id) {
        setCities([]);
        return;
      }
      try {
        const { data } = await supabase
          .from('cities')
          .select('id, name')
          .eq('country_id', addressData.country_id)
          .order('name');
        if (data) setCities(data);
      } catch (err) {
        console.error('Error fetching cities:', err);
      }
    };

    fetchCities();
  }, [addressData.country_id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleThemeChange = (value) => {
    setFormData({ ...formData, theme: value });
  };

  const handleAddressChange = (e) => {
    setAddressData({
      ...addressData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddressSelectChange = (name, value) => {
    setAddressData({
      ...addressData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let addressId = profile?.address_id;

      // 1. Upsert Address - filter out fields that don't exist in DB
      const { country_id, region_id, street_name, ...restAddressData } = addressData;

      const addressPayload = {
        ...restAddressData,
        street: street_name, // Map street_name to street column
      };

      // Validate required fields - city_id is required (NOT NULL constraint)
      if (!addressPayload.city_id) {
        throw new Error('Please select a city before saving your address');
      }

      if (addressId) {
        // Update existing address
        const { error: addrError } = await supabase
          .from('addresses')
          .update(addressPayload)
          .eq('id', addressId);
        if (addrError) throw addrError;
      } else {
        // Create new address
        const { data: newAddress, error: addrError } = await supabase
          .from('addresses')
          .insert([addressPayload])
          .select()
          .single();
        if (addrError) throw addrError;
        addressId = newAddress.id;
      }

      // 2. Update Profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          username: formData.username,
          first_name: formData.first_name,
          middle_name: formData.middle_name,
          last_name: formData.last_name,
          phone: formData.phone,
          company_name: formData.company_name,
          vat_id: formData.vat_id,
          theme: formData.theme,
          address_id: addressId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setSuccess('Profile and address updated successfully!');

      // Refresh profile data
      const { data: updatedProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(updatedProfile);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Image resizing logic
  const resizeImage = (file, maxWidth = 800, maxHeight = 800) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            if (blob) {
              resolve(new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              }));
            } else {
              reject(new Error('Failed to create image blob'));
            }
          }, 'image/jpeg', 0.85);
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const handleAvatarUpload = async (e) => {
    try {
      setUploading(true);
      setError(null);
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) throw new Error('Please upload an image file');
      if (file.size > 5 * 1024 * 1024) throw new Error('Image size must be less than 5MB');

      let fileToUpload = file;
      try {
        fileToUpload = await resizeImage(file);
      } catch (resizeErr) {
        console.warn('Image resizing failed, falling back to original file:', resizeErr);
        // Continue with original file
      }

      if (profile?.avatar_url) {
        try {
          const urlParts = profile.avatar_url.split('/storage/v1/object/public/profile-images/');
          if (urlParts.length > 1) {
            await supabase.storage.from('profile-images').remove([urlParts[1]]);
          }
        } catch (e) { console.warn(e); }
      }

      const fileName = `${user.id}-${Date.now()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(`avatars/${fileName}`, fileToUpload, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(`avatars/${fileName}`);

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          avatar_url: publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setProfile({ ...profile, avatar_url: publicUrl });
      setSuccess('Avatar updated successfully!');
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setUploading(false);
      // Reset input value to allow selecting same file again
      if (e.target) e.target.value = '';
    }
  };

  return (
    <ContentLayout className="content-layout--no-top-padding">
      <div className="profile-page">

        {success && <Alert type="success" dismissible onDismiss={() => setSuccess(null)} style={{ marginBottom: 'var(--space-6)', width: '100%' }}>{success}</Alert>}
        {error && <Alert type="error" dismissible onDismiss={() => setError(null)} style={{ marginBottom: 'var(--space-6)', width: '100%' }}>{error}</Alert>}

        {/* Centered Avatar Section with Large Wave Animation */}
        <div className="profile-avatar-section">
          <div className="profile-avatar">
            <VisualEffect variant="ring-wave" />
            <AvatarUpload
              src={profile?.avatar_url}
              alt={formData.username || 'User'}
              size="l"
              onUpload={handleAvatarUpload}
              loading={uploading}
              className="profile-avatar__preview"
            />
          </div>
        </div>

        <Form onSubmit={handleSubmit} style={{ width: '100%' }}>
          {/* Personal Information Section */}
          <Card
            header={
              <h2 className="profile-form-title" style={{ border: 'none', margin: 0, padding: 0 }}>
                <Icon size="m" style={{ marginRight: 'var(--space-3)', verticalAlign: 'middle' }}><User /></Icon>
                Personal Information
              </h2>
            }
            style={{ marginBottom: 'var(--space-6)' }}
          >
            <div className="profile-form-grid">
              <Input label="Username" name="username" value={formData.username} onChange={handleChange} placeholder="@username" fullWidth />
              <Input label="Email" value={user?.email || ''} disabled fullWidth helperText="Managed by auth provider" />

              {/* Names in one row */}
              <div className="form-row-three">
                <Input label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="First Name" fullWidth />
                <Input label="Middle Name" name="middle_name" value={formData.middle_name} onChange={handleChange} placeholder="Middle Name" fullWidth />
                <Input label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Last Name" fullWidth />
              </div>

              <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" fullWidth />

              {/* Theme Selector */}
              <Select
                label="Theme Preference"
                value={formData.theme}
                onChange={handleThemeChange}
                options={[
                  { value: 'light', label: 'Light' },
                  { value: 'dark', label: 'Dark' },
                  { value: 'auto', label: 'Auto (System)' }
                ]}
                fullWidth
              />
            </div>
          </Card>

          {/* Company Information Section */}
          <Card
            header={
              <h2 className="profile-form-title" style={{ border: 'none', margin: 0, padding: 0 }}>
                <Icon size="m" style={{ marginRight: 'var(--space-3)', verticalAlign: 'middle' }}><Building /></Icon>
                Company Details
              </h2>
            }
            style={{ marginBottom: 'var(--space-6)' }}
          >
            <div className="profile-form-grid">
              <Input label="Company Name" name="company_name" value={formData.company_name} onChange={handleChange} placeholder="Company Name" fullWidth />
              <Input label="VAT ID" name="vat_id" value={formData.vat_id} onChange={handleChange} placeholder="VAT ID" fullWidth />
            </div>
          </Card>

          {/* Address Section */}
          <Card
            header={
              <h2 className="profile-form-title" style={{ border: 'none', margin: 0, padding: 0 }}>
                <Icon size="m" style={{ marginRight: 'var(--space-3)', verticalAlign: 'middle' }}><MapPin /></Icon>
                Address
              </h2>
            }
            style={{ marginBottom: 'var(--space-6)' }}
          >
            <div className="profile-form-grid">
              {/* Country Dropdown - for filtering regions/cities, not saved to DB */}
              <Select
                label="Country"
                value={addressData.country_id}
                onChange={(val) => handleAddressSelectChange('country_id', val)}
                options={countries.map(c => ({ value: c.id, label: c.name }))}
                placeholder="Select Country"
                fullWidth
              />

              {/* Region Dropdown */}
              <Select
                label="Region/State"
                value={addressData.region_id}
                onChange={(val) => handleAddressSelectChange('region_id', val)}
                options={regions.map(r => ({ value: r.id, label: r.name }))}
                placeholder="Select Region"
                disabled={!addressData.country_id}
                fullWidth
              />

              {/* City Dropdown */}
              <Select
                label="City"
                value={addressData.city_id}
                onChange={(val) => handleAddressSelectChange('city_id', val)}
                options={cities.map(c => ({ value: c.id, label: c.name }))}
                placeholder="Select City"
                disabled={!addressData.country_id}
                fullWidth
              />

              <Input label="Postal Code" name="postal_code" value={addressData.postal_code} onChange={handleAddressChange} placeholder="Postal Code" fullWidth />

              <div className="form-item--full">
                <Input label="Street Name" name="street_name" value={addressData.street_name} onChange={handleAddressChange} placeholder="Street Name" fullWidth />
              </div>

              <div className="form-row-three">
                <Input label="Number" name="number" value={addressData.number} onChange={handleAddressChange} placeholder="No." fullWidth />
                <Input label="Floor/Unit" name="floor" value={addressData.floor} onChange={handleAddressChange} placeholder="Floor" fullWidth />

                <Select
                  label="Type"
                  value={addressData.type}
                  onChange={(val) => handleAddressSelectChange('type', val)}
                  options={[
                    { value: 'home', label: 'Home' },
                    { value: 'work', label: 'Work' },
                    { value: 'billing', label: 'Billing' }
                  ]}
                  fullWidth
                />
              </div>
            </div>
          </Card>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="primary" size="l" disabled={loading} icon={<CheckCircle />}>
              {loading ? 'Saving...' : 'Save All Changes'}
            </Button>
          </div>
        </Form>
      </div>
    </ContentLayout>
  );
};

export default Profile;