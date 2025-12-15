import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, Input, Select, TextArea, SectionHeader } from '../../../../components/ui';
import { User } from '../../../../components/ui/iconLibrary';
import { PhoneInputGroup } from '../../../../components/forms';
import { SocialLinksCard } from '../../../../components/shared';
import { useTranslation } from '../../../../hooks';

const PersonalInfoSection = ({ formData, onChange, onSelectChange, loading = false }) => {
    const { t } = useTranslation();

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
            <SectionHeader icon={User} title={t('common.personal_information')} />
            <div className="profile-section__cards">
                {/* Personal Information Card */}
                <Card header={<h3>{t('common.personal_information')}</h3>}>
                    <div className="profile-form-grid">
                        {/* Names in one row */}
                        <div className="form-row-three">
                            <Input
                                label={t('profile.first_name')}
                                name="first_name"
                                value={formData.first_name || ''}
                                onChange={onChange}
                                placeholder={t('profile.first_name')}
                                fullWidth
                                loading={loading}
                            />
                            <Input
                                label={t('profile.middle_name')}
                                name="middle_name"
                                value={formData.middle_name || ''}
                                onChange={onChange}
                                placeholder={t('profile.middle_name')}
                                fullWidth
                                loading={loading}
                            />
                            <Input
                                label={t('profile.last_name')}
                                name="last_name"
                                value={formData.last_name || ''}
                                onChange={onChange}
                                placeholder={t('profile.last_name')}
                                fullWidth
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

                        {/* Phone Fields - Using new PhoneInputGroup component */}
                        <div className="form-row-two">
                            <PhoneInputGroup
                                label="Primary Phone"
                                codeName="phone_code"
                                numberName="phone_number"
                                codeValue={formData.phone_code}
                                numberValue={formData.phone_number}
                                onCodeChange={(val) => onSelectChange('phone_code', val)}
                                onNumberChange={onChange}
                                codePlaceholder="+1"
                                numberPlaceholder="(555) 000-0000"
                                loading={loading}
                            />
                            <PhoneInputGroup
                                label="Secondary Phone"
                                codeName="phone_secondary_code"
                                numberName="phone_secondary_number"
                                codeValue={formData.phone_secondary_code}
                                numberValue={formData.phone_secondary_number}
                                onCodeChange={(val) => onSelectChange('phone_secondary_code', val)}
                                onNumberChange={onChange}
                                codePlaceholder="+1"
                                numberPlaceholder="(555) 000-0001"
                                loading={loading}
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
                        <div className="form-item--full">
                            <TextArea
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

                {/* Social Links Card - Using shared component */}
                <SocialLinksCard
                    formData={formData}
                    onChange={onChange}
                    loading={loading}
                />
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
