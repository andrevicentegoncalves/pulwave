import React from 'react';
import PropTypes from 'prop-types';
import { Card, Input, Select, Button, Checkbox, SectionHeader } from '../../../../components/ui';
import { Key } from '../../../../components/ui/iconLibrary';
import { authService } from '../../../../services';
import { EmergencyContactForm } from '../../../../components/shared';

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
        <div className="profile-section">
            <SectionHeader icon={Key} title="Security" />
            <div className="profile-section__cards">
                {/* Change Password Card */}
                <Card header={<h3>Change Password</h3>}>
                    <div className="profile-form-grid">
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
                            <div className="flex flex-column gap-2">
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
                                <div className="flex justify-end margin-top-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={async () => {
                                            if (!user?.email) return;
                                            try {
                                                const { error } = await authService.resetPasswordForEmail(user.email, {
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
                    </div>
                </Card>

                {/* Two-Factor Authentication Card */}
                <Card header={<h3>Two-Factor Authentication</h3>}>
                    <div className="profile-form-grid">
                        <div className="form-item--full">
                            <Checkbox
                                label="Enable Two-Factor Authentication"
                                name="two_factor_enabled"
                                checked={formData.two_factor_enabled ?? false}
                                onChange={onCheckboxChange}
                                helperText="Add an extra layer of security to your account"
                            />
                        </div>
                    </div>
                </Card>

                {/* Verification Status Card */}
                <Card header={<h3>Verification Status</h3>}>
                    <div className="profile-form-grid">
                        <div className="form-row-two">
                            <Input
                                label="Identity Verified"
                                value={formData.identity_verified ? '✓ Verified' : '✗ Not Verified'}
                                variant="read-only"
                                fullWidth
                            />
                            <Input
                                label="Background Check"
                                value={formData.background_check_status || 'Not Completed'}
                                variant="read-only"
                                fullWidth
                            />
                        </div>
                    </div>
                </Card>

                {/* Emergency Contact Card - Using shared component */}
                <EmergencyContactForm
                    formData={formData}
                    onChange={onChange}
                    onSelectChange={onSelectChange}
                />
            </div>
        </div>
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
