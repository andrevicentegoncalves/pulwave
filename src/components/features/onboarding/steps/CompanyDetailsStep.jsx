import React from 'react';
import { Input } from '../../../ui';

const CompanyDetailsStep = ({ formData, handleChange }) => {
    return (
        <div className="onboarding-step">
            <h3>Company Details 🏢</h3>
            <p className="step-description">Tell us about your organization.</p>

            <Input
                label="Company Name"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                placeholder="Acme Inc."
                fullWidth
            />
        </div>
    );
};

export default CompanyDetailsStep;
