import React from 'react';
import PropTypes from 'prop-types';
import { Card, Input, Select, Button } from '../../components/ui';
import Checkbox from '../../components/ui/Checkbox';
import Icon from '../../components/ui/Icon';
import { Lock } from '../../components/ui/iconLibrary';
import { supabase } from '../../lib/supabaseClient';

const SecuritySection = ({
    formData,
    securityData,
    onChange,
    onSelectChange,
    onSecurityChange,
    onCheckboxChange,
    setSuccess,
    setError,
    user,
}) => {
    return (
        <Card
            header={
                <h2 className="profile-form-title" style={{ border: 'none', margin: 0, padding: 0 }}>
                    <Icon size="m" style={{ marginRight: 'var(--space-3)', verticalAlign: 'middle' }}>
                        <Lock />
                    </Icon>
                    Security
                </h2>
            }
        >
            <div className="profile-form-grid">
                {/* Password Change */}
                <div className="form-item--full">
                    <h3 style={{ marginBottom: 'var(--space-3)' }}>Change Password</h3>
                </div>

                <div className="form-row-two">
                    <Input
                        label="Current Password"
                        name="currentPassword"
                        type="password"
                        value={securityData.currentPassword || ''}
                        onChange={onSecurityChange}
                        placeholder="Required to set new password"
                        fullWidth
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                        <Input
                            label="New Password"
                            name="newPassword"
                            type="password"
                            value={securityData.newPassword || ''}
                            onChange={onSecurityChange}
                            placeholder="New Password"
                            fullWidth
                            helperText="Leave blank to keep current password."
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={async () => {
                                    if (!user?.email) return;
                                    try {
                                        const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
                                            redirectTo: `${window.location.origin}/update-password`,
                                        });
                                        if (error) throw error;
                                        setSuccess('Password reset link sent to your email.');
                                    } catch (err) {
                                        setError(err.message);
                                    }
                                }}
                            >
                                Forgot Password?
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Two-Factor Authentication */}
                <div className="form-item--full">
                    <h3 style={{ marginTop: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>
                        Two-Factor Authentication
                    </h3>
                </div>

                <div className="form-item--full">
                    <Checkbox
                        label="Enable Two-Factor Authentication"
                        name="two_factor_enabled"
                        checked={formData.two_factor_enabled ?? false}
                        onChange={onCheckboxChange}
                        helperText="Add an extra layer of security to your account"
                    />
                </div>

                {/* Verification Status (Read-Only) */}
                <div className="form-item--full">
                    <h3 style={{ marginTop: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>
                        Verification Status
                    </h3>
                </div>

                <div className="form-row-two">
                    <div className="read-only-field">
                        <label className="input__label">Identity Verified</label>
                        <div className="read-only-value">
                            {formData.identity_verified ? '✓ Verified' : '✗ Not Verified'}
                        </div>
                    </div>
                    <div className="read-only-field">
                        <label className="input__label">Background Check</label>
                        <div className="read-only-value">
                            {formData.background_check_status || 'Not Completed'}
                        </div>
                    </div>
                </div>

                {/* Account Status (Read-Only) */}
                <div className="form-row-two">
                    <div className="read-only-field">
                        <label className="input__label">Account Status</label>
                        <div className="read-only-value">
                            {formData.is_active ? '✓ Active' : '✗ Inactive'}
                        </div>
                    </div>
                    <div className="read-only-field">
                        <label className="input__label">Suspended</label>
                        <div className="read-only-value">
                            {formData.is_suspended ? '⚠ Yes' : '✓ No'}
                        </div>
                    </div>
                </div>

                {/* Emergency Contact */}
                <div className="form-item--full">
                    <h3 style={{ marginTop: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>
                        Emergency Contact
                    </h3>
                </div>

                <div className="form-row-three">
                    <Input
                        label="Contact Name"
                        name="emergency_contact_name"
                        value={formData.emergency_contact_name || ''}
                        onChange={onChange}
                        placeholder="Full Name"
                        fullWidth
                    />
                    <Input
                        label="Contact Phone"
                        name="emergency_contact_phone"
                        type="tel"
                        value={formData.emergency_contact_phone || ''}
                        onChange={onChange}
                        placeholder="+1 (555) 000-0000"
                        fullWidth
                    />
                    <Select
                        label="Relationship"
                        value={formData.emergency_contact_relationship || ''}
                        onChange={(val) => onSelectChange('emergency_contact_relationship', val)}
                        options={[
                            { value: '', label: 'Select Relationship' },
                            { value: 'spouse', label: 'Spouse' },
                            { value: 'partner', label: 'Partner' },
                            { value: 'parent', label: 'Parent' },
                            { value: 'child', label: 'Child' },
                            { value: 'sibling', label: 'Sibling' },
                            { value: 'friend', label: 'Friend' },
                            { value: 'neighbor', label: 'Neighbor' },
                            { value: 'colleague', label: 'Colleague' },
                            { value: 'other', label: 'Other' },
                        ]}
                        fullWidth
                    />
                </div>
            </div>
        </Card>
    );
};

SecuritySection.propTypes = {
    formData: PropTypes.object.isRequired,
    securityData: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onSelectChange: PropTypes.func.isRequired,
    onSecurityChange: PropTypes.func.isRequired,
    onCheckboxChange: PropTypes.func.isRequired,
    setSuccess: PropTypes.func.isRequired,
    setError: PropTypes.func.isRequired,
    user: PropTypes.object,
};

export default SecuritySection;
