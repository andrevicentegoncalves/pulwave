import React from 'react';
import { Input } from '../../../ui';

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
            <Input
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                fullWidth
            />
        </div>
    );
};

export default PersonalInfoStep;
