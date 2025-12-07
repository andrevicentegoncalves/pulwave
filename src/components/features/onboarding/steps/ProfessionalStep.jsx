import React from 'react';
import { Select, Input } from '../../../ui';

const ProfessionalStep = ({ formData, handleSelectChange, handleChange }) => {
    return (
        <div className="onboarding-step">
            <h3>Professional Details 💼</h3>
            <p className="step-description">Tell us a bit about your professional status.</p>

            <Select
                label="Account Type"
                value={formData.account_type}
                onChange={(val) => handleSelectChange('account_type', val)}
                options={[
                    { value: 'individual', label: 'Individual' },
                    { value: 'company', label: 'Company' }
                ]}
                fullWidth
            />

            <Input
                label="VAT ID"
                name="vat_id"
                value={formData.vat_id}
                onChange={handleChange}
                placeholder="VAT123456"
                fullWidth
            />
        </div>
    );
};

export default ProfessionalStep;
