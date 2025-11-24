import React from 'react';
import PropTypes from 'prop-types';
import { Card, Input, Select } from '../../components/ui';
import Icon from '../../components/ui/Icon';
import { Building } from '../../components/ui/iconLibrary';

const ProfessionalSection = ({ formData, onChange, onSelectChange }) => {
    return (
        <Card
            header={
                <h2 className="profile-form-title" style={{ border: 'none', margin: 0, padding: 0 }}>
                    <Icon size="m" style={{ marginRight: 'var(--space-3)', verticalAlign: 'middle' }}>
                        <Building />
                    </Icon>
                    Professional Information
                </h2>
            }
        >
            <div className="profile-form-grid">
                {/* User Type */}
                <div className="form-item--full">
                    <Select
                        label="User Type"
                        value={formData.user_type || 'homeowner'}
                        onChange={(val) => onSelectChange('user_type', val)}
                        options={[
                            { value: 'homeowner', label: 'Homeowner' },
                            { value: 'contractor', label: 'Contractor' },
                            { value: 'vendor', label: 'Vendor' },
                            { value: 'real_estate_agent', label: 'Real Estate Agent' },
                            { value: 'broker', label: 'Broker' },
                            { value: 'investor', label: 'Investor' },
                            { value: 'developer', label: 'Developer' },
                            { value: 'manager', label: 'Manager' },
                            { value: 'designer', label: 'Designer' },
                            { value: 'admin', label: 'Admin' },
                        ]}
                        fullWidth
                    />
                </div>

                {/* Job Details */}
                <div className="form-row-two">
                    <Input
                        label="Job Title"
                        name="job_title"
                        value={formData.job_title || ''}
                        onChange={onChange}
                        placeholder="Your job title"
                        fullWidth
                    />
                    <Input
                        label="Department"
                        name="department"
                        value={formData.department || ''}
                        onChange={onChange}
                        placeholder="Department name"
                        fullWidth
                    />
                </div>

                {/* Company Information */}
                <Input
                    label="Company Name"
                    name="company_name"
                    value={formData.company_name || ''}
                    onChange={onChange}
                    placeholder="Company Name"
                    fullWidth
                />

                {/* License Information */}
                <div className="form-item--full">
                    <h3 style={{ marginTop: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>
                        License Information
                    </h3>
                </div>

                <div className="form-row-three">
                    <Input
                        label="License Number"
                        name="license_number"
                        value={formData.license_number || ''}
                        onChange={onChange}
                        placeholder="License #"
                        fullWidth
                    />
                    <Input
                        label="License State"
                        name="license_state"
                        value={formData.license_state || ''}
                        onChange={onChange}
                        placeholder="State"
                        fullWidth
                    />
                    <Input
                        label="License Expiry"
                        name="license_expiry"
                        type="date"
                        value={formData.license_expiry || ''}
                        onChange={onChange}
                        fullWidth
                    />
                </div>

                {/* Business Registration */}
                <div className="form-item--full">
                    <h3 style={{ marginTop: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>
                        Business Registration
                    </h3>
                </div>

                <div className="form-row-two">
                    <Input
                        label="Tax ID / VAT"
                        name="tax_id"
                        value={formData.tax_id || ''}
                        onChange={onChange}
                        placeholder="Tax ID / VAT Number"
                        fullWidth
                    />
                    <Input
                        label="Business Registration Number"
                        name="business_registration_number"
                        value={formData.business_registration_number || ''}
                        onChange={onChange}
                        placeholder="Registration #"
                        fullWidth
                    />
                </div>
            </div>
        </Card>
    );
};

ProfessionalSection.propTypes = {
    formData: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onSelectChange: PropTypes.func.isRequired,
};

export default ProfessionalSection;
