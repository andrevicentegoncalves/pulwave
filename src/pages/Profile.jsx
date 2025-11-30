import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Button, Alert, Form, Tabs, TabPanel } from '../components/ui';
import { CheckCircle } from '../components/ui/iconLibrary';
import { VisualEffect } from '../components/ui';
import AvatarUpload from '../components/ui/AvatarUpload';
import ContentLayout from '../components/layouts/ContentLayout';
import {
  PersonalInfoSection,
  ProfessionalSection,
  AddressSection,
  SecuritySection,
  PrivacySection,
  PreferencesSection
} from './profile-sections';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Profile Form State
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    display_name: '',
    email: '',
    email_secondary: '',
    phone: '',
    phone_secondary: '',
    preferred_contact_method: 'email',
    date_of_birth: '',
    gender: '',
    pronouns: '',
    bio: '',
    website: '',
    linkedin_url: '',
    twitter_url: '',
    facebook_url: '',
    company_name: '',
    vat_id: '',
    job_title: '',
    department: '',
    theme: 'light',
    // Notification preferences
    notifications_enabled: false,
    email_notifications: false,
    sms_notifications: false,
    push_notifications: false,
    marketing_emails: false,
    // Privacy preferences
    data_processing_consent: false,
    marketing_consent: false,
  });

  // Address Form State
  const [addressData, setAddressData] = useState({
    country_id: '',
    region_id: '',
    city_name: '',
    street_name: '',
    number: '',
    floor: '',
    postal_code: '',
    type: 'home',
  });

  const [billingAddressData, setBillingAddressData] = useState({
    country_id: '',
    region_id: '',
    city_name: '',
    street_name: '',
    number: '',
    floor: '',
    postal_code: '',
    type: 'billing',
  });

  // Security Form State
  const [securityData, setSecurityData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  // Dropdown Data
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [billingRegions, setBillingRegions] = useState([]);

  // Handle responsive avatar size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch User & Profile Data
  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('auth_user_id', user.id)
          .single();

        setProfile(profileData);
        if (profileData) {
          setFormData({
            username: profileData.username || '',
            first_name: profileData.first_name || '',
            middle_name: profileData.middle_name || '',
            last_name: profileData.last_name || '',
            display_name: profileData.display_name || '',
            email: user.email || '',
            email_secondary: profileData.email_secondary || '',
            phone: profileData.phone || '',
            phone_secondary: profileData.phone_secondary || '',
            preferred_contact_method: profileData.preferred_contact_method || 'email',
            date_of_birth: profileData.date_of_birth || '',
            gender: profileData.gender || '',
            pronouns: profileData.pronouns || '',
            bio: profileData.bio || '',
            website: profileData.website || '',
            linkedin_url: profileData.linkedin_url || '',
            twitter_url: profileData.twitter_url || '',
            facebook_url: profileData.facebook_url || '',
            company_name: profileData.company_name || '',
            vat_id: profileData.vat_id || '',
            job_title: profileData.job_title || '',
            department: profileData.department || '',
            theme: profileData.theme || 'light',
            // Notification preferences
            notifications_enabled: profileData.notifications_enabled ?? false,
            email_notifications: profileData.email_notifications ?? false,
            sms_notifications: profileData.sms_notifications ?? false,
            push_notifications: profileData.push_notifications ?? false,
            marketing_emails: profileData.marketing_emails ?? false,
            // Privacy preferences
            data_processing_consent: profileData.data_processing_consent ?? false,
            marketing_consent: profileData.marketing_consent ?? false,
          });

          // Fetch Address if exists
          if (profileData.address_id) {
            const { data: address } = await supabase
              .from('addresses')
              .select('*')
              .eq('id', profileData.address_id)
              .single();

            if (address) {
              setAddressData({
                country_id: address.country_id || '',
                region_id: address.region_id || '',
                city_name: address.city || '',
                street_name: address.street || '',
                number: address.number || '',
                floor: address.floor || '',
                postal_code: address.postal_code || '',
                type: address.type || 'home',
              });
            }
          }

          // Fetch Billing Address if exists
          if (profileData.billing_address_id) {
            const { data: billingAddress } = await supabase
              .from('addresses')
              .select('*')
              .eq('id', profileData.billing_address_id)
              .single();

            if (billingAddress) {
              setBillingAddressData({
                country_id: billingAddress.country_id || '',
                region_id: billingAddress.region_id || '',
                city_name: billingAddress.city || '',
                street_name: billingAddress.street || '',
                number: billingAddress.number || '',
                floor: billingAddress.floor || '',
                postal_code: billingAddress.postal_code || '',
                type: billingAddress.type || 'billing',
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

  // Fetch Billing Regions when Billing Country changes
  useEffect(() => {
    const fetchBillingRegions = async () => {
      if (!billingAddressData.country_id) {
        setBillingRegions([]);
        return;
      }
      try {
        const { data } = await supabase
          .from('regions')
          .select('id, name')
          .eq('country_id', billingAddressData.country_id)
          .order('name');
        if (data) setBillingRegions(data);
      } catch (err) {
        console.error('Error fetching billing regions:', err);
      }
    };

    fetchBillingRegions();
  }, [billingAddressData.country_id]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurityData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (type, e) => {
    if (e && e.target) {
      const { name, value } = e.target;
      if (type === 'billing') {
        setBillingAddressData(prev => ({ ...prev, [name]: value }));
      } else {
        setAddressData(prev => ({ ...prev, [name]: value }));
      }
    }
  };

  const handleAddressSelectChange = (type, name, value) => {
    if (type === 'billing') {
      setBillingAddressData(prev => ({ ...prev, [name]: value }));
    } else {
      setAddressData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let addressId = profile?.address_id;
      let billingAddressId = profile?.billing_address_id;

      // 1. Upsert Primary Address
      const { country_id, region_id, street_name, city_name, ...restAddressData } = addressData;

      const addressPayload = {
        ...restAddressData,
        country_id: country_id || null,
        region_id: region_id || null,
        city_name,
        street_name,
      };

      // Validate city is selected
      if (!city_name) {
        throw new Error('Please select a city from the dropdown for your primary address');
      }

      if (addressId) {
        const { error: addrError } = await supabase
          .from('addresses')
          .update(addressPayload)
          .eq('id', addressId);
        if (addrError) throw addrError;
      } else {
        const { data: newAddress, error: addrError } = await supabase
          .from('addresses')
          .insert([addressPayload])
          .select()
          .single();
        if (addrError) throw addrError;
        addressId = newAddress.id;
      }

      // 2. Upsert Billing Address
      const { country_id: billing_country_id, region_id: billing_region_id, street_name: billing_street_name, city_name: billing_city_name, ...restBillingAddressData } = billingAddressData;

      const billingAddressPayload = {
        ...restBillingAddressData,
        country_id: billing_country_id || null,
        region_id: billing_region_id || null,
        city_name: billing_city_name,
        street_name: billing_street_name,
      };

      if (billing_city_name) {
        if (billingAddressId) {
          const { error: billingError } = await supabase
            .from('addresses')
            .update(billingAddressPayload)
            .eq('id', billingAddressId);
          if (billingError) throw billingError;
        } else {
          const { data: newBillingAddress, error: billingError } = await supabase
            .from('addresses')
            .insert([billingAddressPayload])
            .select()
            .single();
          if (billingError) throw billingError;
          billingAddressId = newBillingAddress.id;
        }
      }

      // 3. Update Profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          ...formData,
          address_id: addressId,
          billing_address_id: billingAddressId,
          updated_at: new Date().toISOString(),
        })
        .eq('auth_user_id', user.id);

      if (updateError) throw updateError;

      setSuccess('Profile updated successfully!');

      // Refresh profile data
      const { data: updatedProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('auth_user_id', user.id)
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

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          avatar_url: publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('auth_user_id', user.id);

      if (updateError) throw updateError;

      setProfile({ ...profile, avatar_url: publicUrl });
      setSuccess('Avatar updated successfully!');
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  return (
    <ContentLayout className="content-layout--no-top-padding">
      <div className="profile-page">

        {success && <Alert type="success" dismissible onDismiss={() => setSuccess(null)} style={{ marginBottom: 'var(--space-6)', width: '100%' }}>{success}</Alert>}
        {error && <Alert type="error" dismissible onDismiss={() => setError(null)} style={{ marginBottom: 'var(--space-6)', width: '100%' }}>{error}</Alert>}

        {/* Centered Avatar Section */}
        <div className="profile-avatar-section">
          <VisualEffect variant="ring-wave"
            size={isMobile ? 'm' : 'xl'}
          />
          <AvatarUpload
            src={profile?.avatar_url}
            alt={formData.username || 'User'}
            size={isMobile ? 'l' : 'xl'}
            onUpload={handleAvatarUpload}
            loading={uploading}
          />
        </div>

        <Form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Tabs defaultTab={0}>
            <TabPanel label="Personal Info">
              <PersonalInfoSection
                formData={formData}
                onChange={handleChange}
                onSelectChange={handleSelectChange}
              />
            </TabPanel>

            <TabPanel label="Professional">
              <ProfessionalSection
                formData={formData}
                onChange={handleChange}
                onSelectChange={handleSelectChange}
              />
            </TabPanel>

            <TabPanel label="Address">
              <AddressSection
                addressData={addressData}
                billingAddressData={billingAddressData}
                onChange={handleAddressChange}
                onSelectChange={handleAddressSelectChange}
                countries={countries}
                regions={regions}
                billingRegions={billingRegions}
              />
            </TabPanel>

            <TabPanel label="Security">
              <SecuritySection
                formData={formData}
                securityData={securityData}
                onChange={handleChange}
                onSelectChange={handleSelectChange}
                onSecurityChange={handleSecurityChange}
                onCheckboxChange={handleCheckboxChange}
                setError={setError}
                setSuccess={setSuccess}
                user={user}
              />
            </TabPanel>

            <TabPanel label="Privacy">
              <PrivacySection
                formData={formData}
                onChange={handleChange}
                onCheckboxChange={handleCheckboxChange}
              />
            </TabPanel>

            <TabPanel label="Preferences">
              <PreferencesSection
                formData={formData}
                onChange={handleChange}
                onSelectChange={handleSelectChange}
                onCheckboxChange={handleCheckboxChange}
              />
            </TabPanel>
          </Tabs>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="primary" disabled={loading} icon={<CheckCircle />}>
              {loading ? 'Saving...' : 'Save All Changes'}
            </Button>
          </div>
        </Form>
      </div>
    </ContentLayout>
  );
};

export default Profile;