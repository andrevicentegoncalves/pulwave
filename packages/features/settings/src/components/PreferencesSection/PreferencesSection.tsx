/**
 * PreferencesSection - User preferences settings form
 *
 * @package @pulwave/experience-settings
 */

import { type ChangeEvent } from 'react';
import {
    Card,
    Select,
    Checkbox,
    SectionHeader,
    Settings
} from '@pulwave/ui';

// Constants
export const THEME_PREFERENCE = {
    SYSTEM: 'system',
    LIGHT: 'light',
    DARK: 'dark',
} as const;

export const THEME_PREFERENCE_OPTIONS = [
    { value: THEME_PREFERENCE.SYSTEM, label: 'System Default' },
    { value: THEME_PREFERENCE.LIGHT, label: 'Light' },
    { value: THEME_PREFERENCE.DARK, label: 'Dark' },
];

export const UI_LAYOUT_OPTIONS = [
    { value: 'pulwave', label: 'PulWave (Rich & Dynamic)' },
    { value: 'minimalist', label: 'Minimalist (Clean & Simple)' },
];

export const VISIBILITY_OPTIONS = [
    { value: 'public', label: 'Public' },
    { value: 'private', label: 'Private' },
    { value: 'connections', label: 'Connections Only' },
];

// Types
export interface UILayout {
    style?: string;
}

export interface PreferencesFormData {
    theme?: string;
    ui_layout?: UILayout;
    timezone?: string;
    locale?: string;
    notifications_enabled?: boolean;
    email_notifications?: boolean;
    sms_notifications?: boolean;
    push_notifications?: boolean;
    marketing_emails?: boolean;
    profile_visibility?: string;
}

export interface TimezoneOption {
    value: string;
    label: string;
}

export interface LocaleOption {
    value: string;
    label: string;
    countryCode?: string | null;
}

export interface PreferencesSectionProps {
    formData: PreferencesFormData;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onSelectChange: (name: string, value: string | UILayout) => void;
    onCheckboxChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onThemePreview?: (theme: string) => void;
    timezones?: TimezoneOption[];
    timezonesLoading?: boolean;
    localeOptions?: LocaleOption[];
    localesLoading?: boolean;
}

/**
 * Preferences section for profile settings.
 * Includes theme, timezone, locale, and notification preferences.
 */
export const PreferencesSection = ({
    formData,
    onChange,
    onSelectChange,
    onCheckboxChange,
    onThemePreview,
    timezones = [],
    timezonesLoading = false,
    localeOptions = [],
    localesLoading = false,
}: PreferencesSectionProps) => {
    return (
        <div className="profile-section">
            <SectionHeader icon={Settings} title="Preferences" />
            <div className="profile-section__cards">
                {/* Theme Card */}
                <Card>
                    <div className="card-header">
                        <h3>Theme</h3>
                    </div>
                    <div className="profile-form-grid">
                        <div className="form-row-two">
                            <Select
                                label="Theme Preference"
                                value={formData.theme || THEME_PREFERENCE.SYSTEM}
                                onChange={(val) => {
                                    onSelectChange('theme', val);
                                    if (onThemePreview) onThemePreview(val);
                                }}
                                options={THEME_PREFERENCE_OPTIONS}
                                fullWidth
                            />
                            <Select
                                label="UI Layout Style"
                                value={formData.ui_layout?.style || 'pulwave'}
                                onChange={(val) => {
                                    const currentLayout = formData.ui_layout || {};
                                    onSelectChange('ui_layout', { ...currentLayout, style: val });
                                }}
                                options={UI_LAYOUT_OPTIONS}
                                fullWidth
                            />
                        </div>
                    </div>
                </Card>

                {/* Timezone and Locale Card */}
                <Card>
                    <div className="card-header">
                        <h3>Timezone and Locale</h3>
                    </div>
                    <div className="profile-form-grid">
                        <Select
                            label="Timezone"
                            value={formData.timezone || 'UTC'}
                            onChange={(val) => onSelectChange('timezone', val)}
                            options={timezones}
                            disabled={timezonesLoading}
                            searchable
                            fullWidth
                        />
                        <Select
                            label="Locale"
                            value={formData.locale || 'en-US'}
                            onChange={(val) => onSelectChange('locale', val)}
                            options={localeOptions}
                            disabled={localesLoading}
                            fullWidth
                        />
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
                                label="Enable Notifications"
                                name="notifications_enabled"
                                checked={formData.notifications_enabled}
                                onChange={onCheckboxChange}
                            />
                        </div>

                        <div className="form-row-two">
                            <Checkbox
                                label="Email Notifications"
                                name="email_notifications"
                                checked={formData.email_notifications}
                                onChange={onCheckboxChange}
                                disabled={!formData.notifications_enabled}
                            />
                            <Checkbox
                                label="SMS Notifications"
                                name="sms_notifications"
                                checked={formData.sms_notifications}
                                onChange={onCheckboxChange}
                                disabled={!formData.notifications_enabled}
                            />
                        </div>

                        <div className="form-row-two">
                            <Checkbox
                                label="Push Notifications"
                                name="push_notifications"
                                checked={formData.push_notifications}
                                onChange={onCheckboxChange}
                                disabled={!formData.notifications_enabled}
                            />
                            <Checkbox
                                label="Marketing Emails"
                                name="marketing_emails"
                                checked={formData.marketing_emails}
                                onChange={onCheckboxChange}
                                disabled={!formData.notifications_enabled}
                            />
                        </div>
                    </div>
                </Card>

                {/* Profile Visibility Card */}
                <Card>
                    <div className="card-header">
                        <h3>Profile Visibility</h3>
                    </div>
                    <div className="profile-form-grid">
                        <Select
                            label="Who can see your profile"
                            value={formData.profile_visibility || 'private'}
                            onChange={(val) => onSelectChange('profile_visibility', val)}
                            options={VISIBILITY_OPTIONS}
                            fullWidth
                        />
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default PreferencesSection;
