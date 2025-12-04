import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, Input, Select, PhoneSelect } from '../../../../components/ui';
import Textarea from '../../../../components/ui/TextArea';
import Icon from '../../../../components/ui/Icon';
import { User } from '../../../../components/ui/iconLibrary';

const PersonalInfoSection = ({ formData, onChange, onSelectChange, loading = false }) => {
    // Auto-populate display name from first + last name
    useEffect(() => {
        const firstName = formData.first_name?.trim() || '';
        const lastName = formData.last_name?.trim() || '';
        const autoDisplayName = [firstName, lastName].filter(Boolean).join(' ');

        // Only auto-update if display_name is empty or matches the previous auto-generated value
        if (autoDisplayName && !formData.display_name) {
            onChange({ target: { name: 'display_name', value: autoDisplayName } });
        }
    }, [formData.first_name, formData.last_name]);

    return (
        <div className="profile-section">
            <h2 className="profile-section__title">
                <Icon size="l">
                    <User />
                </Icon>
                Personal Information
            </h2>
            <div className="profile-section__cards">
                {/* Personal Information Card */}
                <Card header={<h3>Personal Information</h3>}>
                    <div className="profile-form-grid">
                        {/* Names in one row */}
                        <div className="form-row-three">
                            <Input
                                label="First Name"
                                name="first_name"
                                value={formData.first_name || ''}
                                onChange={onChange}
                                placeholder="First Name"
                                fullWidth
                                required
                                loading={loading}
                            />
                            <Input
                                label="Middle Name"
                                name="middle_name"
                                value={formData.middle_name || ''}
                                onChange={onChange}
                                placeholder="Middle Name"
                                fullWidth
                                loading={loading}
                            />
                            <Input
                                label="Last Name"
                                name="last_name"
                                value={formData.last_name || ''}
                                onChange={onChange}
                                placeholder="Last Name"
                                fullWidth
                                required
                                loading={loading}
                            />
                        </div>

                        {/* Display Name - Only show after first and last name are filled */}
                        {(loading || (formData.first_name?.trim() && formData.last_name?.trim())) && (
                            <Input
                                label="Display Name"
                                name="display_name"
                                value={formData.display_name || ''}
                                onChange={onChange}
                                placeholder="How you'd like to be called"
                                fullWidth
                                helperText="Auto-populated from first and last name. You can override it here."
                                loading={loading}
                            />
                        )}

                        {/* Email Fields */}
                        <div className="form-row-two">
                            <Input
                                label="Primary Email"
                                name="email"
                                type="email"
                                value={formData.email || ''}
                                onChange={onChange}
                                placeholder="your@email.com"
                                fullWidth
                                required
                                loading={loading}
                            />
                            <Input
                                label="Secondary Email"
                                name="email_secondary"
                                type="email"
                                value={formData.email_secondary || ''}
                                onChange={onChange}
                                placeholder="alternate@email.com"
                                fullWidth
                                loading={loading}
                            />
                        </div>

                        {/* Phone Fields */}
                        <div className="form-row-two">
                            <div className="form-item">
                                <label className="form-label">Primary Phone</label>
                                <div style={{ display: 'flex', gap: 'var(--spacing-2)', alignItems: 'center' }}>
                                    <div style={{ width: '140px', flexShrink: 0 }}>
                                        <PhoneSelect
                                            label=""
                                            name="phone_code"
                                            value={formData.phone_code}
                                            onChange={(val) => onSelectChange('phone_code', val)}
                                            placeholder="+1"
                                            loading={loading}
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <Input
                                            name="phone_number"
                                            type="tel"
                                            value={formData.phone_number || ''}
                                            onChange={onChange}
                                            placeholder="(555) 000-0000"
                                            fullWidth
                                            loading={loading}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-item">
                                <label className="form-label">Secondary Phone</label>
                                <div style={{ display: 'flex', gap: 'var(--spacing-2)', alignItems: 'center' }}>
                                    <div style={{ width: '140px', flexShrink: 0 }}>
                                        <PhoneSelect
                                            label=""
                                            name="phone_secondary_code"
                                            value={formData.phone_secondary_code}
                                            onChange={(val) => onSelectChange('phone_secondary_code', val)}
                                            placeholder="+1"
                                            loading={loading}
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <Input
                                            name="phone_secondary_number"
                                            type="tel"
                                            value={formData.phone_secondary_number || ''}
                                            onChange={onChange}
                                            placeholder="(555) 000-0001"
                                            fullWidth
                                            loading={loading}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Select
                            label="Preferred Contact Method"
                            value={formData.preferred_contact_method || 'email'}
                            onChange={(val) => onSelectChange('preferred_contact_method', val)}
                            options={[
                                { value: 'email', label: 'Email' },
                                { value: 'phone', label: 'Phone' },
                                { value: 'sms', label: 'SMS' },
                            ]}
                            fullWidth
                            loading={loading}
                        />

                        {/* Demographics */}
                        <div className="form-row-two">
                            <Input
                                label="Date of Birth"
                                name="date_of_birth"
                                type="date"
                                value={formData.date_of_birth || ''}
                                onChange={onChange}
                                fullWidth
                                loading={loading}
                            />
                            <Select
                                label="Gender"
                                value={formData.gender || ''}
                                onChange={(val) => onSelectChange('gender', val)}
                                options={[
                                    { value: '', label: 'Prefer not to say' },
                                    { value: 'male', label: 'Male' },
                                    { value: 'female', label: 'Female' },
                                    { value: 'non_binary', label: 'Non-binary' },
                                    { value: 'other', label: 'Other' },
                                ]}
                                fullWidth
                                loading={loading}
                            />
                        </div>

                        {/* Bio */}
                        <div className="form-item--full" style={{ width: '100%' }}>
                            <Textarea
                                label="Bio"
                                name="bio"
                                value={formData.bio || ''}
                                onChange={onChange}
                                placeholder="Tell us about yourself..."
                                rows={4}
                                fullWidth
                                showCount
                                maxLength={500}
                                helperText="Brief description for your profile."
                                loading={loading}
                            />
                        </div>
                    </div>
                </Card>

                {/* Social Links Card */}
                <Card header={<h3>Social Links</h3>}>
                    <div className="profile-form-grid">
                        <div className="form-row-two">
                            <Input
                                label="Website"
                                name="website"
                                type="url"
                                value={formData.website || ''}
                                onChange={onChange}
                                placeholder="https://yourwebsite.com"
                                fullWidth
                                loading={loading}
                            />
                            <Input
                                label="LinkedIn"
                                name="linkedin_url"
                                type="url"
                                value={formData.linkedin_url || ''}
                                onChange={onChange}
                                placeholder="https://linkedin.com/in/username"
                                fullWidth
                                loading={loading}
                            />
                        </div>

                        <div className="form-row-two">
                            <Input
                                label="Twitter"
                                name="twitter_url"
                                type="url"
                                value={formData.twitter_url || ''}
                                onChange={onChange}
                                placeholder="https://twitter.com/username"
                                fullWidth
                                loading={loading}
                            />
                            <Input
                                label="Facebook"
                                name="facebook_url"
                                type="url"
                                value={formData.facebook_url || ''}
                                onChange={onChange}
                                placeholder="https://facebook.com/username"
                                fullWidth
                                loading={loading}
                            />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

PersonalInfoSection.propTypes = {
    formData: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onSelectChange: PropTypes.func.isRequired,
    loading: PropTypes.bool,
};

export default PersonalInfoSection;
