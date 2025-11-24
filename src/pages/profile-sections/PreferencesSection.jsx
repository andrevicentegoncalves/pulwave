import React from 'react';
import PropTypes from 'prop-types';
import { Card, Input, Select } from '../../components/ui';
import Checkbox from '../../components/ui/Checkbox';
import Icon from '../../components/ui/Icon';
import { Settings } from '../../components/ui/iconLibrary';

const PreferencesSection = ({ formData, onChange, onSelectChange, onCheckboxChange }) => {
    return (
        <Card
            header={
                <h2 className="profile-form-title" style={{ border: 'none', margin: 0, padding: 0 }}>
                    <Icon size="m" style={{ marginRight: 'var(--space-3)', verticalAlign: 'middle' }}>
                        <Settings />
                    </Icon>
                    Preferences
                </h2>
            }
        >
            <div className="profile-form-grid">
                {/* Theme, Timezone, Locale */}
                <div className="form-row-three">
                    <Select
                        label="Theme Preference"
                        value={formData.theme || 'auto'}
                        onChange={(val) => onSelectChange('theme', val)}
                        options={[
                            { value: 'light', label: 'Light' },
                            { value: 'dark', label: 'Dark' },
                            { value: 'auto', label: 'Auto (System)' },
                        ]}
                        fullWidth
                    />
                    <Select
                        label="Timezone"
                        value={formData.timezone || 'UTC'}
                        onChange={(val) => onSelectChange('timezone', val)}
                        options={[
                            { value: 'UTC', label: 'UTC' },
                            { value: 'Etc/GMT+12', label: 'International Date Line West (GMT-12:00)' },
                            { value: 'Pacific/Midway', label: 'Midway Island, Samoa (GMT-11:00)' },
                            { value: 'Pacific/Honolulu', label: 'Hawaii (GMT-10:00)' },
                            { value: 'America/Anchorage', label: 'Alaska (GMT-09:00)' },
                            { value: 'America/Los_Angeles', label: 'Pacific Time (US & Canada) (GMT-08:00)' },
                            { value: 'America/Denver', label: 'Mountain Time (US & Canada) (GMT-07:00)' },
                            { value: 'America/Phoenix', label: 'Arizona (GMT-07:00)' },
                            { value: 'America/Chicago', label: 'Central Time (US & Canada) (GMT-06:00)' },
                            { value: 'America/New_York', label: 'Eastern Time (US & Canada) (GMT-05:00)' },
                            { value: 'America/Indiana/Indianapolis', label: 'Indiana (East) (GMT-05:00)' },
                            { value: 'America/Caracas', label: 'Caracas, La Paz (GMT-04:00)' },
                            { value: 'America/Santiago', label: 'Santiago (GMT-04:00)' },
                            { value: 'America/St_Johns', label: 'Newfoundland (GMT-03:30)' },
                            { value: 'America/Sao_Paulo', label: 'Brasilia (GMT-03:00)' },
                            { value: 'America/Argentina/Buenos_Aires', label: 'Buenos Aires, Georgetown (GMT-03:00)' },
                            { value: 'Atlantic/Azores', label: 'Azores (GMT-01:00)' },
                            { value: 'Atlantic/Cape_Verde', label: 'Cape Verde Is. (GMT-01:00)' },
                            { value: 'Europe/London', label: 'London, Dublin, Edinburgh, Lisbon (GMT+00:00)' },
                            { value: 'Europe/Berlin', label: 'Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna (GMT+01:00)' },
                            { value: 'Europe/Paris', label: 'Paris, Brussels, Copenhagen, Madrid (GMT+01:00)' },
                            { value: 'Africa/Cairo', label: 'Cairo (GMT+02:00)' },
                            { value: 'Europe/Helsinki', label: 'Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius (GMT+02:00)' },
                            { value: 'Europe/Istanbul', label: 'Istanbul (GMT+03:00)' },
                            { value: 'Asia/Dubai', label: 'Abu Dhabi, Muscat (GMT+04:00)' },
                            { value: 'Asia/Kabul', label: 'Kabul (GMT+04:30)' },
                            { value: 'Asia/Karachi', label: 'Islamabad, Karachi, Tashkent (GMT+05:00)' },
                            { value: 'Asia/Kolkata', label: 'Chennai, Kolkata, Mumbai, New Delhi (GMT+05:30)' },
                            { value: 'Asia/Kathmandu', label: 'Kathmandu (GMT+05:45)' },
                            { value: 'Asia/Dhaka', label: 'Astana, Dhaka (GMT+06:00)' },
                            { value: 'Asia/Bangkok', label: 'Bangkok, Hanoi, Jakarta (GMT+07:00)' },
                            { value: 'Asia/Hong_Kong', label: 'Beijing, Chongqing, Hong Kong, Urumqi (GMT+08:00)' },
                            { value: 'Asia/Singapore', label: 'Kuala Lumpur, Singapore (GMT+08:00)' },
                            { value: 'Asia/Tokyo', label: 'Osaka, Sapporo, Tokyo (GMT+09:00)' },
                            { value: 'Australia/Adelaide', label: 'Adelaide (GMT+09:30)' },
                            { value: 'Australia/Darwin', label: 'Darwin (GMT+09:30)' },
                            { value: 'Australia/Brisbane', label: 'Brisbane (GMT+10:00)' },
                            { value: 'Australia/Sydney', label: 'Canberra, Melbourne, Sydney (GMT+10:00)' },
                            { value: 'Pacific/Noumea', label: 'Solomon Is., New Caledonia (GMT+11:00)' },
                            { value: 'Pacific/Auckland', label: 'Auckland, Wellington (GMT+12:00)' },
                        ]}
                        fullWidth
                    />
                    <Select
                        label="Locale"
                        value={formData.locale || 'en-US'}
                        onChange={(val) => onSelectChange('locale', val)}
                        options={[
                            { value: 'en-US', label: 'English (US)' },
                            { value: 'en-GB', label: 'English (UK)' },
                            { value: 'en-CA', label: 'English (Canada)' },
                            { value: 'es-ES', label: 'Spanish (Spain)' },
                            { value: 'fr-FR', label: 'French (France)' },
                            { value: 'de-DE', label: 'German (Germany)' },
                            { value: 'pt-BR', label: 'Portuguese (Brazil)' },
                        ]}
                        fullWidth
                    />
                </div>

                <Select
                    label="Profile Visibility"
                    value={formData.profile_visibility || 'private'}
                    onChange={(val) => onSelectChange('profile_visibility', val)}
                    options={[
                        { value: 'public', label: 'Public' },
                        { value: 'private', label: 'Private' },
                        { value: 'connections', label: 'Connections Only' },
                    ]}
                    fullWidth
                />

                {/* Notifications */}
                <div className="form-item--full">
                    <h3 style={{ marginTop: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>
                        Notification Preferences
                    </h3>
                </div>

                <div className="form-item--full">
                    <Checkbox
                        label="Enable Notifications"
                        name="notifications_enabled"
                        checked={formData.notifications_enabled ?? true}
                        onChange={onCheckboxChange}
                    />
                </div>

                <div className="form-row-two">
                    <Checkbox
                        label="Email Notifications"
                        name="email_notifications"
                        checked={formData.email_notifications ?? true}
                        onChange={onCheckboxChange}
                        disabled={!formData.notifications_enabled}
                    />
                    <Checkbox
                        label="SMS Notifications"
                        name="sms_notifications"
                        checked={formData.sms_notifications ?? false}
                        onChange={onCheckboxChange}
                        disabled={!formData.notifications_enabled}
                    />
                </div>

                <div className="form-row-two">
                    <Checkbox
                        label="Push Notifications"
                        name="push_notifications"
                        checked={formData.push_notifications ?? true}
                        onChange={onCheckboxChange}
                        disabled={!formData.notifications_enabled}
                    />
                    <Checkbox
                        label="Marketing Emails"
                        name="marketing_emails"
                        checked={formData.marketing_emails ?? false}
                        onChange={onCheckboxChange}
                    />
                </div>

                {/* Payment Preference */}
                <div className="form-item--full">
                    <h3 style={{ marginTop: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>
                        Payment
                    </h3>
                </div>

                <Select
                    label="Preferred Payment Method"
                    value={formData.preferred_payment_method || ''}
                    onChange={(val) => onSelectChange('preferred_payment_method', val)}
                    options={[
                        { value: '', label: 'Not Set' },
                        { value: 'credit-card', label: 'Credit Card' },
                        { value: 'debit-card', label: 'Debit Card' },
                        { value: 'bank-transfer', label: 'Bank Transfer' },
                        { value: 'paypal', label: 'PayPal' },
                        { value: 'stripe', label: 'Stripe' },
                        { value: 'check', label: 'Check' },
                        { value: 'cash', label: 'Cash' },
                        { value: 'other', label: 'Other' },
                    ]}
                    fullWidth
                />
            </div>
        </Card>
    );
};

PreferencesSection.propTypes = {
    formData: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onSelectChange: PropTypes.func.isRequired,
    onCheckboxChange: PropTypes.func.isRequired,
};

export default PreferencesSection;
