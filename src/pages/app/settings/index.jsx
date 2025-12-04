import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabaseClient';
import { Button, Tabs, TabPanel } from '../../../components/ui';
import { CheckCircle } from '../../../components/ui/iconLibrary';
import { VisualEffect } from '../../../components/ui';
import AvatarUpload from '../../../components/shared/AvatarUpload';
import ContentLayout from '../../../components/layouts/ContentLayout';
import { useToast } from '../../../contexts/ToastProvider';
import { useTheme } from '../../../contexts/ThemeContext';
import {
  ProfilePersonal,
  ProfileProfessional,
  ProfileAddress,
  SettingsSecurity,
  SettingsPrivacy,
  SettingsPreferences,
  AccountBilling
} from './sections';

const Profile = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { updateTheme, applyTheme } = useTheme();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    const saved = localStorage.getItem('settings-active-tab');
    return saved !== null ? parseInt(saved, 10) : 0;
  });

  // Profile Form State
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    display_name: '',
    email: '',
    phone_code: '',
    phone_number: '',
    phone_secondary_code: '',
    phone_secondary_number: '',
    date_of_birth: '',
    gender: '',
    pronouns: '',
    bio: '',
    // Social links
    website: '',
    linkedin_url: '',
    twitter_url: '',
    facebook_url: '',
    // Professional
    user_type: '',
    company_name: '',
    vat_id: '',
    tax_id: '',
    business_registration_number: '',
    job_title: '',
    department: '',
    license_number: '',
    license_state: '',
    license_expiry: '',
    theme: 'light',
    // Preferences
    timezone: 'UTC',
    locale: 'en-US',
    profile_visibility: 'private',
    // Notification preferences
    notifications_enabled: false,
    email_notifications: false,
    sms_notifications: false,
    push_notifications: false,
    marketing_emails: false,
    // Privacy preferences
    data_processing_consent: false,
    marketing_consent: false,
    // Security - Emergency Contact
    two_factor_enabled: false,
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relationship: '',
  });

  const [displayNameManuallyEdited, setDisplayNameManuallyEdited] = useState(false);

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
      try {
        setIsFetching(true);
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
            // Check if onboarding is completed
            const { data: onboardingData } = await supabase
              .from('user_onboarding')
              .select('completed')
              .eq('profile_id', profileData.id)
              .single();

            // Redirect to onboarding if not completed
            if (!onboardingData || !onboardingData.completed) {
              navigate('/onboarding', { replace: true });
              return;
            }

            // Fetch professional profile data
            const { data: professionalData } = await supabase
              .from('professional_profiles')
              .select('*')
              .eq('profile_id', profileData.id)
              .maybeSingle();

            // Fetch profile preferences
            const { data: preferencesData } = await supabase
              .from('profile_preferences')
              .select('*')
              .eq('profile_id', profileData.id)
              .maybeSingle();

            // Fetch social profiles
            const { data: socialProfiles } = await supabase
              .from('social_profiles')
              .select('*')
              .eq('profile_id', profileData.id);

            // Map social profiles to formData
            const socialData = {
              website: '',
              linkedin_url: '',
              twitter_url: '',
              facebook_url: '',
            };

            if (socialProfiles) {
              socialProfiles.forEach(social => {
                if (social.platform === 'website') socialData.website = social.profile_url || '';
                if (social.platform === 'linkedin') socialData.linkedin_url = social.profile_url || '';
                if (social.platform === 'twitter') socialData.twitter_url = social.profile_url || '';
                if (social.platform === 'facebook') socialData.facebook_url = social.profile_url || '';
              });
            }

            // Check if display name is manually edited (different from auto-generated)
            const autoGeneratedName = `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim();
            const isCustom = profileData.display_name && profileData.display_name !== autoGeneratedName;
            setDisplayNameManuallyEdited(!!isCustom);

            // Merge data from all tables
            setFormData({
              // Core profile fields
              username: profileData.username || '',
              first_name: profileData.first_name || '',
              middle_name: profileData.middle_name || '',
              last_name: profileData.last_name || '',
              display_name: profileData.display_name || '',
              email: user.email || '',
              date_of_birth: profileData.date_of_birth || '',
              gender: profileData.gender || '',
              pronouns: profileData.pronouns || '',
              bio: profileData.bio || '',
              // Social links
              ...socialData,
              // Professional profile fields
              user_type: professionalData?.user_type || '',
              company_name: professionalData?.company_name || '',
              vat_id: professionalData?.tax_id || '',
              tax_id: professionalData?.tax_id || '',
              business_registration_number: professionalData?.business_registration_number || '',
              job_title: professionalData?.job_title || '',
              department: professionalData?.department || '',
              license_number: professionalData?.license_number || '',
              license_state: professionalData?.license_state || '',
              license_expiry: professionalData?.license_expiry || '',
              // Preferences
              theme: preferencesData?.theme || 'light',
              timezone: preferencesData?.timezone || 'UTC',
              locale: preferencesData?.locale || 'en-US',
              profile_visibility: preferencesData?.profile_visibility || 'private',
              // Notification preferences
              notifications_enabled: preferencesData?.notifications_enabled ?? false,
              email_notifications: preferencesData?.email_notifications ?? false,
              sms_notifications: preferencesData?.sms_notifications ?? false,
              push_notifications: preferencesData?.push_notifications ?? false,
              marketing_emails: preferencesData?.marketing_emails ?? false,
              // Privacy preferences
              data_processing_consent: preferencesData?.data_processing_consent ?? false,
              marketing_consent: preferencesData?.marketing_consent ?? false,
              // Phone fields
              phone_code: profileData.phone_code || '',
              phone_number: profileData.phone_number || '',
              phone_secondary_code: profileData.phone_secondary_code || '',
              phone_secondary_number: profileData.phone_secondary_number || '',
              // Security - Emergency Contact
              two_factor_enabled: profileData.two_factor_enabled ?? false,
              emergency_contact_name: profileData.emergency_contact_name || '',
              emergency_contact_phone: profileData.emergency_contact_phone || '',
              emergency_contact_relationship: profileData.emergency_contact_relationship || '',
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
                  city_name: address.city_name || '',
                  street_name: address.street_name || '',
                  number: address.number || '',
                  floor: address.floor || '',
                  postal_code: address.postal_code || '',
                  type: address.address_type || 'home',
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
                  city_name: billingAddress.city_name || '',
                  street_name: billingAddress.street_name || '',
                  number: billingAddress.number || '',
                  floor: billingAddress.floor || '',
                  postal_code: billingAddress.postal_code || '',
                  type: billingAddress.address_type || 'billing',
                });
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'display_name') {
      setDisplayNameManuallyEdited(true);
    }

    setFormData(prev => {
      const newData = { ...prev, [name]: value };

      // Auto-populate display name if not manually edited
      if ((name === 'first_name' || name === 'last_name') && !displayNameManuallyEdited) {
        const firstName = name === 'first_name' ? value : prev.first_name;
        const lastName = name === 'last_name' ? value : prev.last_name;
        newData.display_name = `${firstName || ''} ${lastName || ''}`.trim();
      }

      return newData;
    });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let addressId = profile?.address_id;
      let billingAddressId = profile?.billing_address_id;

      // 1. Upsert Primary Address
      const { country_id, region_id, street_name, city_name, type, nominatim_data, ...restAddressData } = addressData;

      const addressPayload = {
        ...restAddressData,
        country_id: country_id || null,
        region_division_id: region_id || null,
        city_name: city_name,
        street_name: street_name,
        address_type: type || 'home',
        nominatim_data: nominatim_data || null,
        organization_id: profile?.organization_id || null,
        is_primary: true,
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
      const { country_id: billing_country_id, region_id: billing_region_id, street_name: billing_street_name, city_name: billing_city_name, type: billing_type, nominatim_data: billing_nominatim_data, ...restBillingAddressData } = billingAddressData;

      const billingAddressPayload = {
        ...restBillingAddressData,
        country_id: billing_country_id || null,
        region_division_id: billing_region_id || null,
        city_name: billing_city_name,
        street_name: billing_street_name,
        address_type: billing_type || 'billing',
        nominatim_data: billing_nominatim_data || null,
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

      // 3. Update Core Profile Data
      const profilePayload = {
        username: formData.username,
        first_name: formData.first_name,
        middle_name: formData.middle_name,
        last_name: formData.last_name,
        display_name: formData.display_name,
        date_of_birth: formData.date_of_birth || null,
        gender: formData.gender || null,
        pronouns: formData.pronouns || null,
        bio: formData.bio || null,
        phone_code: formData.phone_code || null,
        phone_number: formData.phone_number || null,
        phone_secondary_code: formData.phone_secondary_code || null,
        phone_secondary_number: formData.phone_secondary_number || null,
        address_id: addressId,
        billing_address_id: billingAddressId,
        updated_at: new Date().toISOString(),
      };

      const { error: profileError } = await supabase
        .from('profiles')
        .update(profilePayload)
        .eq('auth_user_id', user.id);

      if (profileError) throw profileError;

      // Get organization_id from organization_members
      const { data: orgMember, error: orgMemberError } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('profile_id', profile.id)
        .maybeSingle();

      if (orgMemberError) {
        console.error('Error fetching organization membership:', orgMemberError);
      }

      const organizationId = orgMember?.organization_id || null;

      console.log('Organization ID:', organizationId); // Debug log

      if (!organizationId) {
        console.warn('No organization_id found. Professional and social profiles will not be saved.');
        console.warn('Profile ID:', profile.id);
        console.warn('Organization member data:', orgMember);
      }

      // 4. Upsert Professional Profile Data
      if (organizationId) {
        // Check if professional profile exists
        const { data: existingProfessional } = await supabase
          .from('professional_profiles')
          .select('id')
          .eq('profile_id', profile.id)
          .maybeSingle();

        const professionalPayload = {
          profile_id: profile.id,
          organization_id: organizationId,
          user_type: formData.user_type || null,
          company_name: formData.company_name || null,
          tax_id: formData.tax_id || formData.vat_id || null,
          business_registration_number: formData.business_registration_number || null,
          job_title: formData.job_title || null,
          department: formData.department || null,
          license_number: formData.license_number || null,
          license_state: formData.license_state || null,
          license_expiry: formData.license_expiry || null,
          updated_at: new Date().toISOString(),
          updated_by: profile.id,
        };

        if (existingProfessional) {
          const { error: professionalError } = await supabase
            .from('professional_profiles')
            .update(professionalPayload)
            .eq('profile_id', profile.id);

          if (professionalError) throw professionalError;
        } else {
          const { error: professionalError } = await supabase
            .from('professional_profiles')
            .insert([professionalPayload]);

          if (professionalError) throw professionalError;
        }
      }

      // 5. Upsert Social Profiles
      if (organizationId) {
        const socialPlatforms = [
          { platform: 'website', url: formData.website },
          { platform: 'linkedin', url: formData.linkedin_url },
          { platform: 'twitter', url: formData.twitter_url },
          { platform: 'facebook', url: formData.facebook_url },
        ];

        for (const { platform, url } of socialPlatforms) {
          if (url) {
            // Check if social profile exists
            const { data: existingSocial } = await supabase
              .from('social_profiles')
              .select('id')
              .eq('profile_id', profile.id)
              .eq('platform', platform)
              .maybeSingle();

            const socialPayload = {
              profile_id: profile.id,
              organization_id: organizationId,
              platform: platform,
              profile_url: url,
              is_public: true,
              show_on_profile: true,
              is_active: true,
              updated_at: new Date().toISOString(),
            };

            if (existingSocial) {
              const { error: socialError } = await supabase
                .from('social_profiles')
                .update(socialPayload)
                .eq('id', existingSocial.id);
              if (socialError) throw socialError;
            } else {
              const { error: socialError } = await supabase
                .from('social_profiles')
                .insert([{ ...socialPayload, created_at: new Date().toISOString() }]);
              if (socialError) throw socialError;
            }
          } else {
            // Delete if URL is empty
            await supabase
              .from('social_profiles')
              .delete()
              .eq('profile_id', profile.id)
              .eq('platform', platform);
          }
        }
      }

      // 6. Upsert Profile Preferences
      if (profile.organization_id || organizationId) {
        const preferencesPayload = {
          profile_id: profile.id,
          organization_id: profile.organization_id || organizationId,
          theme: formData.theme,
          timezone: formData.timezone,
          locale: formData.locale,
          profile_visibility: formData.profile_visibility,
          notifications_enabled: formData.notifications_enabled,
          email_notifications: formData.email_notifications,
          sms_notifications: formData.sms_notifications,
          push_notifications: formData.push_notifications,
          marketing_emails: formData.marketing_emails,
          data_processing_consent: formData.data_processing_consent,
          marketing_consent: formData.marketing_consent,
          updated_at: new Date().toISOString(),
          updated_by: profile.id,
        };

        // Check if preferences exist
        const { data: existingPreferences } = await supabase
          .from('profile_preferences')
          .select('id')
          .eq('profile_id', profile.id)
          .maybeSingle();

        if (existingPreferences) {
          const { error: preferencesError } = await supabase
            .from('profile_preferences')
            .update(preferencesPayload)
            .eq('profile_id', profile.id);

          if (preferencesError) throw preferencesError;
        } else {
          const { error: preferencesError } = await supabase
            .from('profile_preferences')
            .insert([preferencesPayload]);

          if (preferencesError) throw preferencesError;
        }
      }

      // 7. Upsert Security Settings (Two-Factor & Emergency Contact)
      if (profile.organization_id || organizationId) {
        const securityPayload = {
          two_factor_enabled: formData.two_factor_enabled,
          emergency_contact_name: formData.emergency_contact_name,
          emergency_contact_phone: formData.emergency_contact_phone,
          emergency_contact_relationship: formData.emergency_contact_relationship,
          updated_at: new Date().toISOString(),
        };

        const { error: securityError } = await supabase
          .from('profiles')
          .update(securityPayload)
          .eq('id', profile.id);

        if (securityError) {
          console.error('Error saving security settings:', securityError);
        }
      }



      // Refresh profile data
      const { data: updatedProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('auth_user_id', user.id)
        .single();
      setProfile(updatedProfile);

      // Update theme context if theme changed
      if (formData.theme) {
        updateTheme(formData.theme);
      }

      showToast('Settings saved successfully', 'success');
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Failed to update profile', 'error');
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

          // Fill with white background to handle PNG transparency
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);

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

  const handleTabChange = (index) => {
    setActiveTab(index);
    localStorage.setItem('settings-active-tab', index.toString());
  };

  return (
    <ContentLayout className="content-layout--no-top-padding">
      <div className="profile-page">

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
            loading={uploading || isFetching}
          />
        </div>

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Tabs defaultTab={activeTab} onChange={handleTabChange}>
            <TabPanel label="Personal Info">
              <ProfilePersonal
                formData={formData}
                onChange={handleChange}
                onSelectChange={handleSelectChange}
                loading={isFetching}
              />
            </TabPanel>

            <TabPanel label="Professional">
              <ProfileProfessional
                formData={formData}
                onChange={handleChange}
                onSelectChange={handleSelectChange}
                loading={isFetching}
              />
            </TabPanel>

            <TabPanel label="Address">
              <ProfileAddress
                addressData={addressData}
                billingAddressData={billingAddressData}
                onAddressChange={setAddressData}
                onBillingAddressChange={setBillingAddressData}
                loading={isFetching}
              />
            </TabPanel>

            <TabPanel label="Security">
              <SettingsSecurity
                formData={formData}
                securityData={securityData}
                onChange={handleChange}
                onSelectChange={handleSelectChange}
                onSecurityChange={handleSecurityChange}
                loading={isFetching}
                onCheckboxChange={handleCheckboxChange}
                user={user}
              />
            </TabPanel>

            <TabPanel label="Privacy">
              <SettingsPrivacy
                formData={formData}
                onChange={handleChange}
                onCheckboxChange={handleCheckboxChange}
              />
            </TabPanel>

            <TabPanel label="Preferences">
              <SettingsPreferences
                formData={formData}
                onChange={handleChange}
                onSelectChange={handleSelectChange}
                onCheckboxChange={handleCheckboxChange}
                onThemePreview={applyTheme}
              />
            </TabPanel>

            <TabPanel label="Billing">
              <AccountBilling
                formData={formData}
                onChange={handleChange}
                onSelectChange={handleSelectChange}
              />
            </TabPanel>
          </Tabs>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--spacing-6)' }}>
            <Button type="submit" variant="primary" disabled={loading} icon={<CheckCircle />}>
              {loading ? 'Saving...' : 'Save All Changes'}
            </Button>
          </div>
        </form>
      </div>
    </ContentLayout>
  );
};

export default Profile;
