import React from 'react';
import { Input } from '../../../ui';
import PhoneSelect from '../../../forms/PhoneSelect';

const PersonalInfoStep = ({ formData, handleChange }) => {
    return (
        <div className="onboarding-step">
            <h3>Let's get to know each other better!</h3>
            <p className="step-description">
                I'm gonna be your personal companion, ready to help you reach your goals.
                Let's reply to some questions, your answers will shape your personalized plan.
            </p>

            <div className="form-row-three">
                <Input
                    label="First Name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="First Name"
                    required
                    fullWidth
                />
                <Input
                    label="Middle Name"
                    name="middle_name"
                    value={formData.middle_name}
                    onChange={handleChange}
                    placeholder="Middle Name"
                    fullWidth
                />
                <Input
                    label="Last Name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Last Name"
                    required
                    fullWidth
                />
            </div>
            <div className="form-item form-item--full-width">
                <PhoneSelect
                    label="Phone Code"
                    name="phone_code"
                    value={formData.phone_code}
                    onChange={(value) => handleChange({ target: { name: 'phone_code', value } })}
                    placeholder="Select code..."
                    fullWidth
                    className="phone-select-wrapper"
                />
                <Input
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="123 456 789"
                    fullWidth
                    style={{ marginTop: '0.5rem' }}
                />
            </div>
        </div>
    );
};

export default PersonalInfoStep;
