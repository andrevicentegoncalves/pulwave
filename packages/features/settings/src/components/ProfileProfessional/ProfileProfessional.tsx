/**
 * ProfileProfessional Section
 *
 * Professional information form section including job title, company,
 * tax info, and license details.
 *
 * @package @pulwave/experience-settings
 */
import { Card, Input, Select, SectionHeader } from '@pulwave/ui';
import { Building } from '@pulwave/ui';
import { useProfessionalData } from '../../hooks/useProfileData';

// User type options
const USER_TYPE_OPTIONS = [
    { value: 'homeowner', label: 'Homeowner' },
    { value: 'tenant', label: 'Tenant' },
    { value: 'landlord', label: 'Landlord' },
    { value: 'property_manager', label: 'Property Manager' },
    { value: 'real_estate_agent', label: 'Real Estate Agent' },
    { value: 'contractor', label: 'Contractor' },
    { value: 'investor', label: 'Investor' },
    { value: 'other', label: 'Other' },
];

export interface ProfileProfessionalProps {
    professional: ReturnType<typeof useProfessionalData>;
    loading?: boolean;
}

/**
 * ProfileProfessional - Professional information form section
 */
export const ProfileProfessional = ({
    professional,
    loading = false
}: ProfileProfessionalProps) => {
    const { formData, handleProfessionalChange, setFormData } = professional;

    const onSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="profile-section">
            <SectionHeader icon={Building} title="Professional" />
            <div className="profile-section__cards">
                {/* General Card */}
                <Card>
                    <div className="card-header">
                        <h3>General</h3>
                    </div>
                    <div className="profile-form-grid">
                        <div className="form-item--full">
                            <Select
                                label="User Type"
                                value={formData.user_type || 'homeowner'}
                                onChange={(val: string) => onSelectChange('user_type', val)}
                                options={USER_TYPE_OPTIONS}
                                fullWidth
                                searchable
                                disabled={loading}
                            />
                        </div>

                        <div className="form-row-two">
                            <Input
                                label="Job Title"
                                name="job_title"
                                autoComplete="organization-title"
                                value={formData.job_title}
                                onChange={handleProfessionalChange}
                                placeholder="Your job title…"
                                fullWidth
                                disabled={loading}
                            />
                            <Input
                                label="Department"
                                name="department"
                                autoComplete="off"
                                value={formData.department}
                                onChange={handleProfessionalChange}
                                placeholder="Department name…"
                                fullWidth
                                disabled={loading}
                            />
                        </div>
                    </div>
                </Card>

                {/* Business Card */}
                <Card>
                    <div className="card-header">
                        <h3>Business</h3>
                    </div>
                    <div className="profile-form-grid">
                        <Input
                            label="Company Name"
                            name="company_name"
                            autoComplete="organization"
                            value={formData.company_name}
                            onChange={handleProfessionalChange}
                            placeholder="Company Name…"
                            fullWidth
                            disabled={loading}
                        />

                        <div className="form-row-two">
                            <Input
                                label="Tax ID / VAT"
                                name="tax_id"
                                autoComplete="off"
                                value={formData.tax_id}
                                onChange={handleProfessionalChange}
                                placeholder="Tax ID / VAT Number…"
                                fullWidth
                                disabled={loading}
                            />
                            <Input
                                label="Business Registration Number"
                                name="business_registration_number"
                                autoComplete="off"
                                value={formData.business_registration_number}
                                onChange={handleProfessionalChange}
                                placeholder="Registration #"
                                fullWidth
                                disabled={loading}
                            />
                        </div>
                    </div>
                </Card>

                {/* License Card */}
                <Card>
                    <div className="card-header">
                        <h3>License</h3>
                    </div>
                    <div className="profile-form-grid">
                        <div className="form-row-three">
                            <Input
                                label="License Number"
                                name="license_number"
                                value={formData.license_number}
                                onChange={handleProfessionalChange}
                                placeholder="License #"
                                fullWidth
                                disabled={loading}
                            />
                            <Input
                                label="License State"
                                name="license_state"
                                value={formData.license_state}
                                onChange={handleProfessionalChange}
                                placeholder="State"
                                fullWidth
                                disabled={loading}
                            />
                            <Input
                                label="License Expiry"
                                name="license_expiry"
                                type="date"
                                value={formData.license_expiry}
                                onChange={handleProfessionalChange}
                                fullWidth
                                disabled={loading}
                            />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

ProfileProfessional.displayName = 'ProfileProfessional';

export default ProfileProfessional;
