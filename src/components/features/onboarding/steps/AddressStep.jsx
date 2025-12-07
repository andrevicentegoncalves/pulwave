import React from 'react';
import { AddressForm } from '../../../shared';

const AddressStep = ({ formData, setFormData }) => {
    return (
        <div className="onboarding-step">
            <h3>Where in the world are you? 🌍</h3>
            <p className="step-description">We'll use this to show you relevant local content</p>

            <AddressForm
                value={formData}
                onChange={setFormData}
                title=""
                showAddressType={false}
            />
        </div>
    );
};

export default AddressStep;
