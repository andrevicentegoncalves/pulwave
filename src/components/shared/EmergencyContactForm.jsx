import React from 'react';
import PropTypes from 'prop-types';
import { Card, Input, Select } from '../ui';
import { RELATIONSHIP_OPTIONS } from '../../services/lookupService';

/**
 * EmergencyContactForm Component
 * 
 * Reusable form/card for emergency contact information.
 * Used in security settings and onboarding flows.
 */
const EmergencyContactForm = ({
    formData,
    onChange,
    onSelectChange,
    loading = false,
    title = 'Emergency Contact',
    showCard = true,
}) => {
    const content = (
        <div className="profile-form-grid">
            <div className="form-row-three">
                <Input
                    label="Contact Name"
                    name="emergency_contact_name"
                    value={formData.emergency_contact_name || ''}
                    onChange={onChange}
                    placeholder="Full Name"
                    fullWidth
                    loading={loading}
                />
                <Input
                    label="Contact Phone"
                    name="emergency_contact_phone"
                    type="tel"
                    value={formData.emergency_contact_phone || ''}
                    onChange={onChange}
                    placeholder="+1 (555) 000-0000"
                    fullWidth
                    loading={loading}
                />
                <Select
                    label="Relationship"
                    value={formData.emergency_contact_relationship || ''}
                    onChange={(val) => onSelectChange('emergency_contact_relationship', val)}
                    options={RELATIONSHIP_OPTIONS}
                    fullWidth
                    loading={loading}
                />
            </div>
        </div>
    );

    if (!showCard) {
        return content;
    }

    return (
        <Card header={<h3>{title}</h3>}>
            {content}
        </Card>
    );
};

EmergencyContactForm.propTypes = {
    formData: PropTypes.shape({
        emergency_contact_name: PropTypes.string,
        emergency_contact_phone: PropTypes.string,
        emergency_contact_relationship: PropTypes.string,
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    onSelectChange: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    title: PropTypes.string,
    showCard: PropTypes.bool,
};

export default EmergencyContactForm;
