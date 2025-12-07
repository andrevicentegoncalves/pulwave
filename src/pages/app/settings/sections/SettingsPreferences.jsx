import React from 'react';
import PropTypes from 'prop-types';
import { Card, Input, Select, Checkbox, SectionHeader } from '../../../../components/ui';
import { LocaleSelect } from '../../../../components/forms';
import { Settings } from '../../../../components/ui/iconLibrary';
import { THEME_PREFERENCE, THEME_PREFERENCE_OPTIONS } from '../../../../constants';
import { useTimezones } from '../../../../hooks/useTimezones';

const PreferencesSection = ({ formData, onChange, onSelectChange, onCheckboxChange, onThemePreview }) => {
    const { timezones, loading: timezonesLoading } = useTimezones();

    return (
        <div className="profile-section">
            <SectionHeader icon={Settings} title="Preferences" />
            <div className="profile-section__cards">
                {/* Theme Card */}
                <Card header={<h3>Theme</h3>}>
                    <div className="profile-form-grid">
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
                    </div>
                </Card>

                {/* Timezone and Locale Card */}
                <Card header={<h3>Timezone and Locale</h3>}>
                    <div className="profile-form-grid">
                        <Select
                            label="Timezone"
                            value={formData.timezone || 'UTC'}
                            onChange={(val) => onSelectChange('timezone', val)}
                            options={timezones}
                            loading={timezonesLoading}
                            searchable
                            fullWidth
                        />

                        <LocaleSelect
                            label="Locale"
                            value={formData.locale || 'en-US'}
                            onChange={(val) => onSelectChange('locale', val)}
                            options={[
                                { value: 'en-US', label: 'English (US)', countryCode: 'US' },
                                { value: 'en-GB', label: 'English (UK)', countryCode: 'GB' },
                                { value: 'en-CA', label: 'English (Canada)', countryCode: 'CA' },
                                { value: 'es-ES', label: 'Spanish (Spain)', countryCode: 'ES' },
                                { value: 'fr-FR', label: 'French (France)', countryCode: 'FR' },
                                { value: 'de-DE', label: 'German (Germany)', countryCode: 'DE' },
                                { value: 'pt-BR', label: 'Portuguese (Brazil)', countryCode: 'BR' },
                                { value: 'pt-PT', label: 'Portuguese (Portugal)', countryCode: 'PT' },
                            ]}
                            fullWidth
                        />
                    </div>
                </Card>

                {/* Notifications Card */}
                <Card header={<h3>Notifications</h3>}>
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
                <Card header={<h3>Profile Visibility</h3>}>
                    <div className="profile-form-grid">
                        <Select
                            label="Who can see your profile"
                            value={formData.profile_visibility || 'private'}
                            onChange={(val) => onSelectChange('profile_visibility', val)}
                            options={[
                                { value: 'public', label: 'Public' },
                                { value: 'private', label: 'Private' },
                                { value: 'connections', label: 'Connections Only' },
                            ]}
                            fullWidth
                        />
                    </div>
                </Card>
            </div>
        </div>
    );
};

PreferencesSection.propTypes = {
    formData: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onSelectChange: PropTypes.func.isRequired,
    onCheckboxChange: PropTypes.func.isRequired,
};

export default PreferencesSection;
