/**
 * SettingsPage Wrapper
 *
 * Full settings page with 7 tabs: Personal, Professional, Address,
 * Security, Privacy, Preferences, and Billing.
 *
 * @package @pulwave/experience-settings
 */
import { useEffect, useState, useCallback, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

// Import UI components from packages
import { Button, Tabs, TabPanel, VisualEffect } from '@pulwave/ui';
import { ContentLayout } from '@pulwave/widgets';
import { CheckCircle } from '@pulwave/ui';

// Import hooks from this package
import { useProfileData } from '../hooks/useProfileData';
import { useProfileSubmit } from '../hooks/useProfileSubmit';
import { useAvatarUpload } from '../hooks/useAvatarUpload';
import { useToast } from '../hooks/useToast';
import { useTheme } from '../hooks/useTheme';

// Import sections from this package
import { ProfilePersonal } from '../components/ProfilePersonal';
import { ProfileProfessional } from '../components/ProfileProfessional';
import { ProfileAddress } from '../components/ProfileAddress';
import { AvatarUpload } from '../components/AvatarUpload';
import { SettingsSecurity } from '../components/SettingsSecurity';
import { SettingsPrivacy } from '../components/SettingsPrivacy';
import { SettingsPreferences } from '../components/SettingsPreferences';
import { AccountBilling } from '../components/AccountBilling';

export interface SettingsPageProps {
    /** Initial active tab index */
    defaultTab?: number;
}

/**
 * SettingsPage - Full settings management interface with 7 tabs
 */
export const SettingsPage = ({ defaultTab = 0 }: SettingsPageProps) => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { updateTheme, applyTheme } = useTheme();
    const [isMobile, setIsMobile] = useState(false);
    const [activeTab, setActiveTab] = useState(() => {
        const saved = localStorage.getItem('settings-active-tab');
        return saved !== null ? parseInt(saved, 10) : defaultTab;
    });

    // Responsive check
    const checkMobile = useCallback(() => setIsMobile(window.innerWidth < 768), []);

    useEffect(() => {
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, [checkMobile]);

    const handleTabChange = useCallback((index: number) => {
        setActiveTab(index);
        localStorage.setItem('settings-active-tab', index.toString());
    }, []);

    // 1. Data Hook
    const {
        user,
        profile,
        personal,
        professional,
        security,
        privacy,
        settings,
        addressing,
        isFetching,
        setProfile,
    } = useProfileData({
        onRedirect: navigate
    });

    // 2. Submit Hook
    const { loading: saving, handleSubmit } = useProfileSubmit({
        user,
        profile,
        onSuccess: (msg: string) => showToast(msg, 'success'),
        onError: (msg: string) => showToast(msg, 'error'),
        onProfileUpdate: setProfile,
        onThemeUpdate: updateTheme
    });

    // 3. Avatar Hook
    const { uploading, handleAvatarUpload } = useAvatarUpload({
        user,
        profile,
        onProfileUpdate: setProfile,
        onSuccess: (msg: string) => showToast(msg, 'success'),
        onError: (msg: string) => showToast(msg, 'error')
    });

    // Wrapper for submit to pass data
    const onSave = useCallback((e: FormEvent) => {
        e.preventDefault();
        handleSubmit(
            personal.formData,
            professional.formData,
            security.formData,
            privacy.formData,
            settings.formData,
            addressing.addressData,
            addressing.billingAddressData
        );
    }, [handleSubmit, personal.formData, professional.formData, security.formData, privacy.formData, settings.formData, addressing.addressData, addressing.billingAddressData]);

    return (
        <ContentLayout className="settings-page-layout">
            <div className="profile-page">
                {/* Centered Avatar Section */}
                <div className="profile-avatar-section">
                    <VisualEffect
                        variant="ring-wave"
                        size={isMobile ? 'm' : 'xl'}
                    />
                    <AvatarUpload
                        src={profile?.avatar_url || undefined}
                        alt={personal.formData.username || 'User'}
                        size={isMobile ? 'l' : 'xl'}
                        onUpload={handleAvatarUpload}
                        loading={uploading || isFetching}
                    />
                </div>

                <form onSubmit={onSave} className="settings-form">
                    <Tabs defaultTab={activeTab} onChange={handleTabChange}>
                        <TabPanel label="Personal Info">
                            <ProfilePersonal
                                personal={personal}
                                loading={isFetching}
                            />
                        </TabPanel>

                        <TabPanel label="Professional">
                            <ProfileProfessional
                                professional={professional}
                                loading={isFetching}
                            />
                        </TabPanel>

                        <TabPanel label="Address">
                            <ProfileAddress
                                addressing={addressing}
                                loading={isFetching}
                            />
                        </TabPanel>

                        <TabPanel label="Security">
                            <SettingsSecurity
                                security={security}
                                personal={personal}
                                user={user}
                                loading={isFetching}
                            />
                        </TabPanel>

                        <TabPanel label="Privacy">
                            <SettingsPrivacy
                                privacy={privacy}
                                loading={isFetching}
                            />
                        </TabPanel>

                        <TabPanel label="Preferences">
                            <SettingsPreferences
                                settings={settings}
                                privacy={privacy}
                                onThemePreview={applyTheme}
                                loading={isFetching}
                            />
                        </TabPanel>

                        <TabPanel label="Billing">
                            <AccountBilling
                                loading={isFetching}
                            />
                        </TabPanel>
                    </Tabs>

                    <div className="settings-form__actions">
                        <Button
                            type="submit"
                            variant="outlined"
                            disabled={saving || isFetching}
                        >
                            {saving ? 'Saving…' : 'Save All Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </ContentLayout>
    );
};

SettingsPage.displayName = 'SettingsPage';

export default SettingsPage;
