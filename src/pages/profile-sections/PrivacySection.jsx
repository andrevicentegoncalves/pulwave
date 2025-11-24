import React from 'react';
import PropTypes from 'prop-types';
import { Card, Input } from '../../components/ui';
import Checkbox from '../../components/ui/Checkbox';
import Textarea from '../../components/ui/TextArea';
import Icon from '../../components/ui/Icon';
import { ShieldCheck } from '../../components/ui/iconLibrary';

const PrivacySection = ({ formData, onChange, onCheckboxChange }) => {
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
                {/* Terms & Conditions */}
                <div className="form-item--full">
                    <h3 style={{ marginBottom: 'var(--space-3)' }}>Terms & Conditions</h3>
                </div>

                <div className="form-row-three">
                    <div className="read-only-field">
                        <label className="input__label">Accepted</label>
                        <div className="read-only-value">
                            {formData.terms_accepted ? '✓ Yes' : '✗ No'}
                        </div>
                    </div>
                    <div className="read-only-field">
                        <label className="input__label">Accepted At</label>
                        <div className="read-only-value">
                            {formData.terms_accepted_at
                                ? new Date(formData.terms_accepted_at).toLocaleDateString()
                                : 'N/A'}
                        </div>
                    </div>
                    <div className="read-only-field">
                        <label className="input__label">Version</label>
                        <div className="read-only-value">
                            {formData.terms_version || 'N/A'}
                        </div>
                    </div>
                </div>

                {/* Privacy Policy */}
                <div className="form-item--full">
                    <h3 style={{ marginTop: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>
                        Privacy Policy
                    </h3>
                </div>

                <div className="form-row-three">
                    <div className="read-only-field">
                        <label className="input__label">Accepted</label>
                        <div className="read-only-value">
                            {formData.privacy_accepted ? '✓ Yes' : '✗ No'}
                        </div>
                    </div>
                    <div className="read-only-field">
                        <label className="input__label">Accepted At</label>
                        <div className="read-only-value">
                            {formData.privacy_accepted_at
                                ? new Date(formData.privacy_accepted_at).toLocaleDateString()
                                : 'N/A'}
                        </div>
                    </div>
                    <div className="read-only-field">
                        <label className="input__label">Version</label>
                        <div className="read-only-value">
                            {formData.privacy_version || 'N/A'}
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

                {/* Account Deletion */}
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

                {/* Advanced: Tags & Metadata */}
                <div className="form-item--full">
                    <h3 style={{ marginTop: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>
                        Advanced (Optional)
                    </h3>
                </div>

                <Input
                    label="Tags"
                    name="tags"
                    value={formData.tags ? formData.tags.join(', ') : ''}
                    onChange={(e) => {
                        // Convert comma-separated string to array
                        const tagsArray = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
                        onChange({ target: { name: 'tags', value: tagsArray } });
                    }}
                    placeholder="tag1, tag2, tag3"
                    fullWidth
                    helperText="Comma-separated tags for categorization"
                />

                <div className="form-item--full">
                    <Textarea
                        label="Metadata (JSON)"
                        name="metadata"
                        value={formData.metadata ? JSON.stringify(formData.metadata, null, 2) : '{}'}
                        onChange={(e) => {
                            try {
                                const parsed = JSON.parse(e.target.value);
                                onChange({ target: { name: 'metadata', value: parsed } });
                            } catch (err) {
                                // Invalid JSON, keep as string for now
                                onChange(e);
                            }
                        }}
                        rows={6}
                        fullWidth
                        helperText="Advanced: Custom metadata in JSON format"
                    />
                </div>
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
