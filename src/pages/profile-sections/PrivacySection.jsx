import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Card, Input, Button } from '../../components/ui';
import Checkbox from '../../components/ui/Checkbox';
import Icon from '../../components/ui/Icon';
import { ShieldCheck } from '../../components/ui/iconLibrary';

const PrivacySection = ({ formData, onChange, onCheckboxChange }) => {
    const navigate = useNavigate();

    return (
        <Card
            header={
                <h2 className="profile-form-title" style={{ border: 'none', margin: 0, padding: 0 }}>
                    <Icon size="m" style={{ marginRight: 'var(--space-3)', verticalAlign: 'middle' }}>
                        <ShieldCheck />
                    </Icon>
                    Privacy & Compliance
                </h2>
            }
        >
            <div className="profile-form-grid">
                {/* Legal Documents */}
                <div className="form-item--full">
                    <h3 style={{ marginBottom: 'var(--space-3)' }}>Legal Documents</h3>
                </div>

                <div className="form-item--full" style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                    <Button variant="outline" onClick={() => navigate('/terms-and-conditions')}>
                        View Terms & Conditions
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/privacy-policy')}>
                        View Privacy Policy
                    </Button>
                </div>

                <div className="form-row-three">
                    <div className="read-only-field">
                        <label className="input__label">Terms Accepted</label>
                        <div className="read-only-value">
                            {formData.terms_accepted ? '✓ Yes' : '✗ No'}
                        </div>
                    </div>
                    <div className="read-only-field">
                        <label className="input__label">Privacy Accepted</label>
                        <div className="read-only-value">
                            {formData.privacy_accepted ? '✓ Yes' : '✗ No'}
                        </div>
                    </div>
                    <div className="read-only-field">
                        <label className="input__label">Version</label>
                        <div className="read-only-value">
                            {formData.terms_version || 'N/A'}
                        </div>
                    </div>
                </div>

                {/* Consent Settings */}
                <div className="form-item--full">
                    <h3 style={{ marginTop: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>
                        Consent Settings
                    </h3>
                </div>

                <div className="form-row-two">
                    <Checkbox
                        label="Data Processing Consent"
                        name="data_processing_consent"
                        checked={formData.data_processing_consent ?? false}
                        onChange={onCheckboxChange}
                        helperText="Allow us to process your personal data"
                    />
                    <Checkbox
                        label="Marketing Consent"
                        name="marketing_consent"
                        checked={formData.marketing_consent ?? false}
                        onChange={onCheckboxChange}
                        helperText="Receive marketing communications"
                    />
                </div>

                {/* Account Deletion - Only show if requested */}
                {formData.deletion_requested && (
                    <>
                        <div className="form-item--full">
                            <h3 style={{ marginTop: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>
                                Account Deletion
                            </h3>
                        </div>

                        <div className="form-row-three">
                            <div className="read-only-field">
                                <label className="input__label">Deletion Requested</label>
                                <div className="read-only-value">
                                    {formData.deletion_requested ? '⚠ Yes' : '✓ No'}
                                </div>
                            </div>
                            <div className="read-only-field">
                                <label className="input__label">Requested At</label>
                                <div className="read-only-value">
                                    {formData.deletion_requested_at
                                        ? new Date(formData.deletion_requested_at).toLocaleDateString()
                                        : 'N/A'}
                                </div>
                            </div>
                            <div className="read-only-field">
                                <label className="input__label">Scheduled For</label>
                                <div className="read-only-value">
                                    {formData.deletion_scheduled_for
                                        ? new Date(formData.deletion_scheduled_for).toLocaleDateString()
                                        : 'N/A'}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Card>
    );
};

PrivacySection.propTypes = {
    formData: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onCheckboxChange: PropTypes.func.isRequired,
};

export default PrivacySection;
