/**
 * PersonalInfoSection - Profile personal information form
 *
 * @package @pulwave/experience-settings
 */

import { useEffect, type ChangeEvent } from 'react';
import {
    Card,
    Input,
    Select,
    TextArea,
    SectionHeader,
    User
} from '@pulwave/ui';

// Types
export interface PersonalInfoFormData {
    first_name?: string;
    middle_name?: string;
    last_name?: string;
    display_name?: string;
    email?: string;
    email_secondary?: string;
    phone_code?: string;
    phone_number?: string;
    phone_secondary_code?: string;
    phone_secondary_number?: string;
    preferred_contact_method?: string;
    date_of_birth?: string;
    gender?: string;
    bio?: string;
    // Social links
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
    website?: string;
}

export interface PersonalInfoSectionProps {
    formData: PersonalInfoFormData;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onSelectChange: (name: string, value: string) => void;
    loading?: boolean;
    t?: (key: string) => string;
    enumOptions?: {
        contactMethod: Array<{ value: string; label: string }>;
        gender: Array<{ value: string; label: string }>;
    };
}

/**
 * Personal information section for profile settings.
 * Mobile-first component with responsive grid layout.
 */
export const PersonalInfoSection = ({
    formData,
    onChange,
    onSelectChange,
    loading = false,
    t = (key) => key,
    enumOptions = {
        contactMethod: [
            { value: 'email', label: 'Email' },
            { value: 'phone', label: 'Phone' },
            { value: 'sms', label: 'SMS' },
        ],
        gender: [
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' },
            { value: 'prefer_not_to_say', label: 'Prefer not to say' },
        ],
    },
}: PersonalInfoSectionProps) => {
    // Auto-populate display name from first + last name
    useEffect(() => {
        const firstName = formData.first_name?.trim() || '';
        const lastName = formData.last_name?.trim() || '';
        const autoDisplayName = [firstName, lastName].filter(Boolean).join(' ');

        if (autoDisplayName && !formData.display_name) {
            onChange({
                target: { name: 'display_name', value: autoDisplayName }
            } as ChangeEvent<HTMLInputElement>);
        }
    }, [formData.first_name, formData.last_name]);

    return (
        <div className="profile-section">
            <SectionHeader icon={User} title={t('common.personal_information')} />
            <div className="profile-section__cards">
                {/* Personal Information Card */}
                <Card>
                    <div className="card-header">
                        <h3>{t('common.personal_information')}</h3>
                    </div>
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
                                disabled={loading}
                            />
                            <Input
                                label={t('profile.middle_name')}
                                name="middle_name"
                                value={formData.middle_name || ''}
                                onChange={onChange}
                                placeholder={t('profile.middle_name')}
                                fullWidth
                                disabled={loading}
                            />
                            <Input
                                label={t('profile.last_name')}
                                name="last_name"
                                value={formData.last_name || ''}
                                onChange={onChange}
                                placeholder={t('profile.last_name')}
                                fullWidth
                                disabled={loading}
                            />
                        </div>

                        {/* Display Name */}
                        {(loading || (formData.first_name?.trim() && formData.last_name?.trim())) && (
                            <Input
                                label={t('profile.display_name')}
                                name="display_name"
                                value={formData.display_name || ''}
                                onChange={onChange}
                                placeholder={t('profile.display_name_placeholder')}
                                fullWidth
                                helperText={t('profile.display_name_helper')}
                                disabled={loading}
                            />
                        )}

                        {/* Email Fields */}
                        <div className="form-row-two">
                            <Input
                                label={t('profile.primary_email')}
                                name="email"
                                type="email"
                                autoComplete="email"
                                value={formData.email || ''}
                                onChange={onChange}
                                placeholder={t('profile.email_placeholder')}
                                fullWidth
                                disabled={loading}
                            />
                            <Input
                                label={t('profile.secondary_email')}
                                name="email_secondary"
                                type="email"
                                autoComplete="email"
                                value={formData.email_secondary || ''}
                                onChange={onChange}
                                placeholder={t('profile.secondary_email_placeholder')}
                                fullWidth
                                disabled={loading}
                            />
                        </div>

                        {/* Contact Method */}
                        <Select
                            label={t('profile.preferred_contact_method')}
                            value={formData.preferred_contact_method || 'email'}
                            onChange={(val) => onSelectChange('preferred_contact_method', val)}
                            options={enumOptions.contactMethod}
                            fullWidth
                            disabled={loading}
                        />

                        {/* Demographics */}
                        <div className="form-row-two">
                            <Input
                                label={t('profile.date_of_birth')}
                                name="date_of_birth"
                                type="date"
                                value={formData.date_of_birth || ''}
                                onChange={onChange}
                                fullWidth
                                disabled={loading}
                            />
                            <Select
                                label={t('profile.gender')}
                                value={formData.gender || ''}
                                onChange={(val) => onSelectChange('gender', val)}
                                options={enumOptions.gender}
                                fullWidth
                                disabled={loading}
                            />
                        </div>

                        {/* Bio */}
                        <div className="form-item--full">
                            <TextArea
                                label={t('profile.bio')}
                                name="bio"
                                value={formData.bio || ''}
                                onChange={onChange}
                                placeholder={t('profile.bio_placeholder')}
                                rows={4}
                                fullWidth
                                maxLength={500}
                                helperText={t('profile.bio_helper')}
                                disabled={loading}
                            />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default PersonalInfoSection;
