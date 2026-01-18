/**
 * SettingsPreferences Section
 *
 * User preferences including theme, language, timezone, and notifications.
 *
 * @package @pulwave/experience-settings
 */
import { Card, Select, Checkbox, SectionHeader } from '@pulwave/ui';
import { Settings } from '@pulwave/ui';
import { useSettingsData, usePrivacyData } from '../../hooks/useProfileData';

export interface SettingsPreferencesProps {
    settings: ReturnType<typeof useSettingsData>;
    privacy: ReturnType<typeof usePrivacyData>;
    onThemePreview?: (theme: string) => void;
    loading?: boolean;
}

// Inline options
const THEME_OPTIONS = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' },
];

const VISIBILITY_OPTIONS = [
    { value: 'private', label: 'Private' },
    { value: 'public', label: 'Public' },
    { value: 'connections', label: 'Connections Only' },
];

const TIMEZONE_OPTIONS = [
    { value: 'UTC', label: 'UTC' },
    { value: 'America/New_York', label: 'Eastern Time (US)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (US)' },
    { value: 'Europe/London', label: 'London' },
    { value: 'Europe/Paris', label: 'Paris' },
    { value: 'Asia/Tokyo', label: 'Tokyo' },
];

const LOCALE_OPTIONS = [
    { value: 'en-US', label: 'English (US)' },
    { value: 'en-GB', label: 'English (UK)' },
    { value: 'pt-PT', label: 'Português' },
    { value: 'es-ES', label: 'Español' },
    { value: 'fr-FR', label: 'Français' },
];

/**
 * SettingsPreferences - Preferences form section
 */
export const SettingsPreferences = ({
    settings,
    privacy,
    onThemePreview,
    loading = false,
}: SettingsPreferencesProps) => {
    const { formData: settingsData, handleSettingsChange, handleSelectSettingsChange } = settings;
    const { formData: privacyData, handleVisibilityChange } = privacy;

    const handleThemeChange = (value: string) => {
        handleSelectSettingsChange('theme', value);
        onThemePreview?.(value);
    };

    return (
        <div className="profile-section">
            <SectionHeader icon={Settings} title="Preferences" />
            <div className="profile-section__cards">
                {/* Appearance Card */}
                <Card>
                    <div className="card-header">
                        <h3>Appearance</h3>
                    </div>
                    <div className="profile-form-grid">
                        <div className="form-row-two">
                            <Select
                                label="Theme"
                                value={settingsData.theme}
                                onChange={handleThemeChange}
                                options={THEME_OPTIONS}
                                fullWidth
                                disabled={loading}
                            />
                            <Select
                                label="Profile Visibility"
                                value={privacyData.profile_visibility}
                                onChange={handleVisibilityChange}
                                options={VISIBILITY_OPTIONS}
                                fullWidth
                                disabled={loading}
                            />
                        </div>
                    </div>
                </Card>

                {/* Regional Card */}
                <Card>
                    <div className="card-header">
                        <h3>Regional Settings</h3>
                    </div>
                    <div className="profile-form-grid">
                        <div className="form-row-two">
                            <Select
                                label="Timezone"
                                value={settingsData.timezone}
                                onChange={(val: string) => handleSelectSettingsChange('timezone', val)}
                                options={TIMEZONE_OPTIONS}
                                fullWidth
                                disabled={loading}
                            />
                            <Select
                                label="Language"
                                value={settingsData.locale}
                                onChange={(val: string) => handleSelectSettingsChange('locale', val)}
                                options={LOCALE_OPTIONS}
                                fullWidth
                                disabled={loading}
                            />
                        </div>
                    </div>
                </Card>

                {/* Notifications Card */}
                <Card>
                    <div className="card-header">
                        <h3>Notifications</h3>
                    </div>
                    <div className="profile-form-grid">
                        <div className="form-item--full">
                            <Checkbox
                                label="Enable notifications"
                                name="notifications_enabled"
                                checked={settingsData.notifications_enabled}
                                onChange={handleSettingsChange}
                            />
                        </div>
                        <div className="form-item--full">
                            <Checkbox
                                label="Email notifications"
                                name="email_notifications"
                                checked={settingsData.email_notifications}
                                onChange={handleSettingsChange}
                            />
                        </div>
                        <div className="form-item--full">
                            <Checkbox
                                label="SMS notifications"
                                name="sms_notifications"
                                checked={settingsData.sms_notifications}
                                onChange={handleSettingsChange}
                            />
                        </div>
                        <div className="form-item--full">
                            <Checkbox
                                label="Push notifications"
                                name="push_notifications"
                                checked={settingsData.push_notifications}
                                onChange={handleSettingsChange}
                            />
                        </div>
                        <div className="form-item--full">
                            <Checkbox
                                label="Marketing emails"
                                name="marketing_emails"
                                checked={settingsData.marketing_emails}
                                onChange={handleSettingsChange}
                            />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

SettingsPreferences.displayName = 'SettingsPreferences';

export default SettingsPreferences;
