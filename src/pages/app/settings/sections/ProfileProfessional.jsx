import React from 'react';
import PropTypes from 'prop-types';
import { Card, Input, Select, SectionHeader } from '../../../../components/ui';
import { Building } from '../../../../components/ui/iconLibrary';
import { USER_TYPE, USER_TYPE_OPTIONS } from '../../../../constants';

const ProfessionalSection = ({ formData, onChange, onSelectChange, loading = false }) => {
    return (
        <div className="profile-section">
            <SectionHeader icon={Building} title="Professional" />
            <div className="profile-section__cards">
                {/* General Card */}
                <Card header={<h3>General</h3>}>
                    <div className="profile-form-grid">
                        <div className="form-item--full">
                            <Select
                                label="User Type"
                                value={formData.user_type || USER_TYPE.HOMEOWNER}
                                onChange={(val) => onSelectChange('user_type', val)}
                                options={USER_TYPE_OPTIONS}
                                fullWidth
                                searchable
                                loading={loading}
                            />
                        </div>

                        <div className="form-row-two">
                            <Input
                                label="Job Title"
                                name="job_title"
                                value={formData.job_title || ''}
                                onChange={onChange}
                                placeholder="Your job title"
                                fullWidth
                                loading={loading}
                            />
                            <Input
                                label="Department"
                                name="department"
                                value={formData.department || ''}
                                onChange={onChange}
                                placeholder="Department name"
                                fullWidth
                                loading={loading}
                            />
                        </div>
                    </div>
                </Card>

                {/* Business Card */}
                <Card header={<h3>Business</h3>}>
                    <div className="profile-form-grid">
                        <Input
                            label="Company Name"
                            name="company_name"
                            value={formData.company_name || ''}
                            onChange={onChange}
                            placeholder="Company Name"
                            fullWidth
                            loading={loading}
                        />

                        <div className="form-row-two">
                            <Input
                                label="Tax ID / VAT"
                                name="tax_id"
                                value={formData.tax_id || ''}
                                onChange={onChange}
                                placeholder="Tax ID / VAT Number"
                                fullWidth
                                loading={loading}
                            />
                            <Input
                                label="Business Registration Number"
                                name="business_registration_number"
                                value={formData.business_registration_number || ''}
                                onChange={onChange}
                                placeholder="Registration #"
                                fullWidth
                                loading={loading}
                            />
                        </div>
                    </div>
                </Card>

                {/* License Card */}
                <Card header={<h3>License</h3>}>
                    <div className="profile-form-grid">
                        <div className="form-row-three">
                            <Input
                                label="License Number"
                                name="license_number"
                                value={formData.license_number || ''}
                                onChange={onChange}
                                placeholder="License #"
                                fullWidth
                                loading={loading}
                            />
                            <Input
                                label="License State"
                                name="license_state"
                                value={formData.license_state || ''}
                                onChange={onChange}
                                placeholder="State"
                                fullWidth
                                loading={loading}
                            />
                            <Input
                                label="License Expiry"
                                name="license_expiry"
                                type="date"
                                value={formData.license_expiry || ''}
                                onChange={onChange}
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

ProfessionalSection.propTypes = {
    formData: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onSelectChange: PropTypes.func.isRequired,
    loading: PropTypes.bool,
};

export default ProfessionalSection;
