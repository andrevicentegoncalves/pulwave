/**
 * ProfilePersonal Section
 *
 * Personal information form section including name, email, phone,
 * demographics, and social links.
 *
 * @package @pulwave/experience-settings
 */
import { Card, Input, Select, TextArea, SectionHeader } from '@pulwave/ui';
import { User } from '@pulwave/ui';
import { PhoneInputGroup } from '@pulwave/features-shared';
import { SocialLinksCard } from '../';
import { usePersonalData } from '../../hooks/useProfileData';

/** Extended form data interface for ProfilePersonal with additional contact fields */
interface ExtendedPersonalFormData {
    first_name: string;
    middle_name: string;
    last_name: string;
    display_name: string;
    email: string;
    email_secondary?: string;
    phone_code: string;
    phone_number: string;
    phone_secondary_code: string;
    phone_secondary_number: string;
    date_of_birth: string;
    gender: string;
    bio: string;
    preferred_contact_method?: string;
}

// Inline translations (will use TranslationContext when available)
const translations: Record<string, string> = {
    'common.personal_information': 'Personal Information',
    'profile.first_name': 'First Name',
    'profile.middle_name': 'Middle Name',
    'profile.last_name': 'Last Name',
    'profile.display_name': 'Display Name',
    'profile.display_name_placeholder': 'How you want to be called',
    'profile.display_name_helper': 'This is how others will see your name',
    'profile.primary_email': 'Primary Email',
    'profile.email_placeholder': 'your@email.com',
    'profile.secondary_email': 'Secondary Email',
    'profile.secondary_email_placeholder': 'backup@email.com',
    'profile.primary_phone': 'Primary Phone',
    'profile.secondary_phone': 'Secondary Phone',
    'profile.preferred_contact_method': 'Preferred Contact Method',
    'profile.date_of_birth': 'Date of Birth',
    'profile.gender': 'Gender',
    'profile.bio': 'Bio',
    'profile.bio_placeholder': 'Tell us about yourself…',
    'profile.bio_helper': 'A short description visible to others',
};

const t = (key: string): string => translations[key] || key;

// Inline enum options
const CONTACT_METHOD_OPTIONS = [
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'sms', label: 'SMS' },
];

const GENDER_OPTIONS = [
    { value: '', label: 'Select…' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'non_binary', label: 'Non-binary' },
    { value: 'prefer_not_to_say', label: 'Prefer not to say' },
];

export interface ProfilePersonalProps {
    personal: ReturnType<typeof usePersonalData>;
    loading?: boolean;
}

/**
 * ProfilePersonal - Personal information form section
 */
export const ProfilePersonal = ({
    personal,
    loading = false
}: ProfilePersonalProps) => {
    const { formData: rawFormData, handlePersonalChange, setFormData } = personal;
    const formData = rawFormData as ExtendedPersonalFormData;

    const onSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

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
                                value={formData.first_name}
                                onChange={handlePersonalChange}
                                placeholder={t('profile.first_name')}
                                fullWidth
                                disabled={loading}
                            />
                            <Input
                                label={t('profile.middle_name')}
                                name="middle_name"
                                value={formData.middle_name}
                                onChange={handlePersonalChange}
                                placeholder={t('profile.middle_name')}
                                fullWidth
                                disabled={loading}
                            />
                            <Input
                                label={t('profile.last_name')}
                                name="last_name"
                                value={formData.last_name}
                                onChange={handlePersonalChange}
                                placeholder={t('profile.last_name')}
                                fullWidth
                                disabled={loading}
                            />
                        </div>

                        {/* Display Name - Only show after first and last name are filled */}
                        {(loading || (formData.first_name.trim() && formData.last_name.trim())) && (
                            <Input
                                label={t('profile.display_name')}
                                name="display_name"
                                value={formData.display_name}
                                onChange={handlePersonalChange}
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
                                value={formData.email}
                                onChange={handlePersonalChange}
                                placeholder={t('profile.email_placeholder')}
                                fullWidth
                                disabled={loading}
                            />
                            <Input
                                label={t('profile.secondary_email')}
                                name="email_secondary"
                                type="email"
                                autoComplete="email"
                                value={formData.email_secondary ?? ''}
                                onChange={handlePersonalChange}
                                placeholder={t('profile.secondary_email_placeholder')}
                                fullWidth
                                disabled={loading}
                            />
                        </div>

                        {/* Phone Fields */}
                        <div className="form-row-two">
                            <PhoneInputGroup
                                label={t('profile.primary_phone')}
                                codeName="phone_code"
                                numberName="phone_number"
                                codeValue={formData.phone_code}
                                numberValue={formData.phone_number}
                                onCodeChange={(val: string) => onSelectChange('phone_code', val)}
                                onNumberChange={handlePersonalChange}
                                codePlaceholder="+1"
                                numberPlaceholder="(555) 000-0000"
                                disabled={loading}
                            />
                            <PhoneInputGroup
                                label={t('profile.secondary_phone')}
                                codeName="phone_secondary_code"
                                numberName="phone_secondary_number"
                                codeValue={formData.phone_secondary_code}
                                numberValue={formData.phone_secondary_number}
                                onCodeChange={(val: string) => onSelectChange('phone_secondary_code', val)}
                                onNumberChange={handlePersonalChange}
                                codePlaceholder="+1"
                                numberPlaceholder="(555) 000-0001"
                                disabled={loading}
                            />
                        </div>

                        <Select
                            label={t('profile.preferred_contact_method')}
                            value={formData.preferred_contact_method ?? 'email'}
                            onChange={(val: string) => onSelectChange('preferred_contact_method', val)}
                            options={CONTACT_METHOD_OPTIONS}
                            fullWidth
                            loading={loading}
                        />

                        {/* Demographics */}
                        <div className="form-row-two">
                            <Input
                                label={t('profile.date_of_birth')}
                                name="date_of_birth"
                                type="date"
                                value={formData.date_of_birth}
                                onChange={handlePersonalChange}
                                fullWidth
                                disabled={loading}
                            />
                            <Select
                                label={t('profile.gender')}
                                value={formData.gender}
                                onChange={(val: string) => onSelectChange('gender', val)}
                                options={GENDER_OPTIONS}
                                fullWidth
                                disabled={loading}
                            />
                        </div>

                        {/* Bio */}
                        <div className="form-item--full">
                            <TextArea
                                label={t('profile.bio')}
                                name="bio"
                                value={formData.bio}
                                onChange={handlePersonalChange}
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

                {/* Social Links Card */}
                <SocialLinksCard
                    personal={personal}
                    loading={loading}
                />
            </div>
        </div>
    );
};

ProfilePersonal.displayName = 'ProfilePersonal';

export default ProfilePersonal;
