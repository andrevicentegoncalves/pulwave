import React from 'react';
import PropTypes from 'prop-types';
import { Card, Input, Select } from '../../components/ui';
import Textarea from '../../components/ui/TextArea';
import Icon from '../../components/ui/Icon';
import { User } from '../../components/ui/iconLibrary';

const PersonalInfoSection = ({ formData, onChange, onSelectChange }) => {
    return (
        <Card
            header={
                <h2 className="profile-form-title" style={{ border: 'none', margin: 0, padding: 0 }}>
                    <Icon size="m" style={{ marginRight: 'var(--space-3)', verticalAlign: 'middle' }}>
                        <User />
                    </Icon>
                    Personal Information
                </h2>
            }
        >
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
                    />
                    <Input
                        label="Middle Name"
                        name="middle_name"
                        value={formData.middle_name || ''}
                        onChange={onChange}
                        placeholder="Middle Name"
                        fullWidth
                    />
                    <Input
                        label="Last Name"
                        name="last_name"
                        value={formData.last_name || ''}
                        onChange={onChange}
                        placeholder="Last Name"
                        fullWidth
                        required
                    />
                </div>

                <Input
                    label="Display Name"
                    name="display_name"
                    value={formData.display_name || ''}
                    onChange={onChange}
                    placeholder="How you'd like to be called"
                    fullWidth
                    helperText="Optional: Override your full name display"
                />

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
                    />
                    <Input
                        label="Secondary Email"
                        name="email_secondary"
                        type="email"
                        value={formData.email_secondary || ''}
                        onChange={onChange}
                        placeholder="alternate@email.com"
                        fullWidth
                    />
                </div>

                {/* Phone Fields */}
                <div className="form-row-two">
                    <Input
                        label="Primary Phone"
                        name="phone"
                        type="tel"
                        value={formData.phone || ''}
                        onChange={onChange}
                        placeholder="+1 (555) 000-0000"
                        fullWidth
                    />
                    <Input
                        label="Secondary Phone"
                        name="phone_secondary"
                        type="tel"
                        value={formData.phone_secondary || ''}
                        onChange={onChange}
                        placeholder="+1 (555) 000-0001"
                        fullWidth
                    />
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
                        style={{ resize: 'vertical', minHeight: '100px', maxHeight: '300px', width: '100%' }}
                    />
                </div>

                {/* Social Links */}
                <div className="form-item--full">
                    <h3 style={{ marginTop: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>
                        Social Links
                    </h3>
                </div>

                <div className="form-row-two">
                    <Input
                        label="Website"
                        name="website"
                        type="url"
                        value={formData.website || ''}
                        onChange={onChange}
                        placeholder="https://yourwebsite.com"
                        fullWidth
                    />
                    <Input
                        label="LinkedIn"
                        name="linkedin_url"
                        type="url"
                        value={formData.linkedin_url || ''}
                        onChange={onChange}
                        placeholder="https://linkedin.com/in/username"
                        fullWidth
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
                    />
                    <Input
                        label="Facebook"
                        name="facebook_url"
                        type="url"
                        value={formData.facebook_url || ''}
                        onChange={onChange}
                        placeholder="https://facebook.com/username"
                        fullWidth
                    />
                </div>
            </div>
        </Card>
    );
};

PersonalInfoSection.propTypes = {
    formData: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onSelectChange: PropTypes.func.isRequired,
};

export default PersonalInfoSection;
