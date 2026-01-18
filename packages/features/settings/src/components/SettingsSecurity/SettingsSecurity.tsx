/**
 * SettingsSecurity Section
 *
 * Security settings including password change, 2FA, and emergency contacts.
 *
 * @package @pulwave/experience-settings
 */
import { Card, Input, Button, Checkbox, SectionHeader } from '@pulwave/ui';
import { Key } from '@pulwave/ui';
import { useSecurityData, usePersonalData } from '../../hooks/useProfileData';

export interface SettingsSecurityProps {
    security: ReturnType<typeof useSecurityData>;
    personal: ReturnType<typeof usePersonalData>;
    user: any;
    loading?: boolean;
    setSuccess?: (message: string) => void;
    setError?: (message: string) => void;
}

/**
 * SettingsSecurity - Security settings form section
 */
export const SettingsSecurity = ({
    security,
    personal,
    user,
    loading = false,
}: SettingsSecurityProps) => {
    const { formData: securityFormData, handleSecurityTextChange, handleSecurityCheckboxChange } = security;
    const { formData: personalFormData, handlePersonalChange } = personal;

    const handleResetPassword = async () => {
        if (!user?.email) return;
        try {
            // TODO: Implement password reset via @foundation authService
        } catch {
            // Silent error - password reset errors handled by auth service
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
                                name="current_password"
                                type="password"
                                value={securityFormData.current_password}
                                onChange={handleSecurityTextChange}
                                placeholder="Required to set new password…"
                                fullWidth
                                disabled={loading}
                                autoComplete="current-password"
                            />
                            <Input
                                label="New Password"
                                name="new_password"
                                type="password"
                                value={securityFormData.new_password}
                                onChange={handleSecurityTextChange}
                                placeholder="Enter new password…"
                                fullWidth
                                helperText="Leave blank to keep current password."
                                disabled={loading}
                                autoComplete="new-password"
                            />
                        </div>
                        <div className="form-item--full margin-top-4">
                            <Button
                                type="button"
                                variant="outlined"
                                onClick={handleResetPassword}
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
                                name="mfa_enabled"
                                checked={securityFormData.mfa_enabled}
                                onChange={handleSecurityCheckboxChange}
                                helperText="Add an extra layer of security to your account"
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
                        <div className="form-row-two">
                            <Input
                                label="Contact Name"
                                name="emergency_contact_name"
                                value={securityFormData.emergency_contact_name}
                                onChange={handleSecurityTextChange}
                                placeholder="Full name"
                                fullWidth
                                disabled={loading}
                            />
                            <Input
                                label="Contact Phone"
                                name="emergency_contact_phone"
                                value={securityFormData.emergency_contact_phone}
                                onChange={handleSecurityTextChange}
                                placeholder="+1 234 567 8900"
                                fullWidth
                                disabled={loading}
                            />
                        </div>
                        <Input
                            label="Relationship"
                            name="emergency_contact_relationship"
                            value={securityFormData.emergency_contact_relationship}
                            onChange={handleSecurityTextChange}
                            placeholder="e.g., Spouse, Parent, Sibling"
                            fullWidth
                            disabled={loading}
                        />
                    </div>
                </Card>
            </div>
        </div>
    );
};

SettingsSecurity.displayName = 'SettingsSecurity';

export default SettingsSecurity;
