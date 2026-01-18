/**
 * SecuritySection - Security settings form
 *
 * @package @pulwave/experience-settings
 */

import { type ChangeEvent } from 'react';
import {
    Card,
    Input,
    Button,
    Checkbox,
    SectionHeader,
    Key
} from '@pulwave/ui';

// Types
export interface SecurityFormData {
    two_factor_enabled?: boolean;
    identity_verified?: boolean;
    background_check_status?: string;
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
    emergency_contact_relationship?: string;
}

export interface SecurityDataState {
    currentPassword?: string;
    newPassword?: string;
}

export interface SecuritySectionProps {
    formData: SecurityFormData;
    securityData: SecurityDataState;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onSecurityChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onCheckboxChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onSelectChange: (name: string, value: string) => void;
    setSuccess: (message: string) => void;
    setError: (message: string) => void;
    onResetPassword?: () => Promise<void>;
    user?: { email?: string };
}

/**
 * Security section for profile settings.
 * Includes password change, 2FA, and emergency contact.
 */
export const SecuritySection = ({
    formData,
    securityData,
    onChange,
    onSecurityChange,
    onCheckboxChange,
    onSelectChange,
    setSuccess,
    setError,
    onResetPassword,
    user,
}: SecuritySectionProps) => {
    const handleForgotPassword = async () => {
        if (onResetPassword) {
            try {
                await onResetPassword();
                setSuccess('Password reset link sent to your email.');
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to send reset link');
            }
        }
    };

    return (
        <div className="profile-section">
            <SectionHeader icon={Key} title="Security" />
            <div className="profile-section__cards">
                {/* Change Password Card */}
                <Card>
                    <div className="card-header">
                        <h3>Change Password</h3>
                    </div>
                    <div className="profile-form-grid">
                        <div className="form-row-two">
                            <Input
                                label="Current Password"
                                name="currentPassword"
                                type="password"
                                autoComplete="current-password"
                                value={securityData.currentPassword || ''}
                                onChange={onSecurityChange}
                                placeholder="Required to set new password"
                                fullWidth
                            />
                            <Input
                                label="New Password"
                                name="newPassword"
                                type="password"
                                autoComplete="new-password"
                                value={securityData.newPassword || ''}
                                onChange={onSecurityChange}
                                placeholder="New Password"
                                fullWidth
                                helperText="Leave blank to keep current password."
                            />
                        </div>
                        <div className="form-item--full margin-top-4">
                            <Button
                                type="button"
                                variant="outlined"
                                onClick={handleForgotPassword}
                            >
                                Forgot Password?
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Two-Factor Authentication Card */}
                <Card>
                    <div className="card-header">
                        <h3>Two-Factor Authentication</h3>
                    </div>
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
                <Card>
                    <div className="card-header">
                        <h3>Verification Status</h3>
                    </div>
                    <div className="profile-form-grid">
                        <div className="form-row-two">
                            <Input
                                label="Identity Verified"
                                value={formData.identity_verified ? '✓ Verified' : '✗ Not Verified'}
                                disabled
                                fullWidth
                            />
                            <Input
                                label="Background Check"
                                value={formData.background_check_status || 'Not Completed'}
                                disabled
                                fullWidth
                            />
                        </div>
                    </div>
                </Card>

                {/* Emergency Contact Card */}
                <Card>
                    <div className="card-header">
                        <h3>Emergency Contact</h3>
                    </div>
                    <div className="profile-form-grid">
                        <Input
                            label="Contact Name"
                            name="emergency_contact_name"
                            value={formData.emergency_contact_name || ''}
                            onChange={onChange}
                            placeholder="Full name"
                            fullWidth
                        />
                        <div className="form-row-two">
                            <Input
                                label="Contact Phone"
                                name="emergency_contact_phone"
                                value={formData.emergency_contact_phone || ''}
                                onChange={onChange}
                                placeholder="Phone number"
                                fullWidth
                            />
                            <Input
                                label="Relationship"
                                name="emergency_contact_relationship"
                                value={formData.emergency_contact_relationship || ''}
                                onChange={onChange}
                                placeholder="e.g., Spouse, Parent"
                                fullWidth
                            />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default SecuritySection;
