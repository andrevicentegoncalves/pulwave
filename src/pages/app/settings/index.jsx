import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Tabs, TabPanel, VisualEffect } from '../../../components/ui';
import { CheckCircle } from '../../../components/ui/iconLibrary';
import AvatarUpload from '../../../components/shared/AvatarUpload';
import ContentLayout from '../../../components/layouts/ContentLayout';
import { useToast } from '../../../contexts/ToastProvider';
import { useTheme } from '../../../contexts/ThemeContext';
import { useProfileData } from '../../../hooks/useProfileData';
import { useProfileSubmit } from '../../../hooks/useProfileSubmit';
import { useAvatarUpload } from '../../../hooks/useAvatarUpload';
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
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    const saved = localStorage.getItem('settings-active-tab');
    return saved !== null ? parseInt(saved, 10) : 0;
  });

  // Responsive check
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleTabChange = (index) => {
    setActiveTab(index);
    localStorage.setItem('settings-active-tab', index.toString());
  };

  // 1. Data Hook
  const {
    user,
    profile,
    formData,
    addressData,
    billingAddressData,
    securityData,
    isFetching,
    setProfile,
    setFormData,
    setAddressData,
    setBillingAddressData,
    handleChange,
    handleSelectChange,
    handleCheckboxChange,
    handleSecurityChange,
  } = useProfileData({
    onRedirect: navigate
  });

  // 2. Submit Hook
  const { loading: saving, handleSubmit } = useProfileSubmit({
    user,
    profile,
    onSuccess: (msg) => showToast(msg, 'success'),
    onError: (msg) => showToast(msg, 'error'),
    onProfileUpdate: setProfile,
    onThemeUpdate: updateTheme
  });

  // 3. Avatar Hook
  const { uploading, handleAvatarUpload } = useAvatarUpload({
    user,
    profile,
    onProfileUpdate: setProfile,
    onSuccess: (msg) => showToast(msg, 'success'),
    onError: (msg) => showToast(msg, 'error')
  });

  // Wrapper for submit to pass data
  const onSave = (e) => {
    e.preventDefault();
    handleSubmit(formData, addressData, billingAddressData);
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

        <form onSubmit={onSave} className="settings-form">
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

          <div className="settings-form__actions">
            <Button type="submit" variant="primary" disabled={saving || isFetching} icon={<CheckCircle />}>
              {saving ? 'Saving...' : 'Save All Changes'}
            </Button>
          </div>
        </form>
      </div>
    </ContentLayout>
  );
};

export default Profile;
