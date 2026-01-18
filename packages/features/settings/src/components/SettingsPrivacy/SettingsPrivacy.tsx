/**
 * SettingsPrivacy Section
 *
 * Privacy settings including data consent and marketing preferences.
 *
 * @package @pulwave/experience-settings
 */
import { Card, Checkbox, SectionHeader } from '@pulwave/ui';
import { Shield } from '@pulwave/ui';
import { usePrivacyData } from '../../hooks/useProfileData';

export interface SettingsPrivacyProps {
    privacy: ReturnType<typeof usePrivacyData>;
    loading?: boolean;
}

/**
 * SettingsPrivacy - Privacy settings form section
 */
export const SettingsPrivacy = ({
    privacy,
    loading = false,
}: SettingsPrivacyProps) => {
    const { formData, handlePrivacyChange } = privacy;

    return (
        <div className="profile-section">
            <SectionHeader icon={Shield} title="Privacy" />
            <div className="profile-section__cards">
                {/* Data Processing Consent */}
                <Card>
                    <div className="card-header">
                        <h3>Data Processing</h3>
                    </div>
                    <div className="profile-form-grid">
                        <div className="form-item--full">
                            <Checkbox
                                label="I consent to the processing of my personal data"
                                name="data_processing_consent"
                                checked={formData.data_processing_consent}
                                onChange={handlePrivacyChange}
                                helperText="Required for account functionality"
                            />
                        </div>
                    </div>
                </Card>

                {/* Marketing Consent */}
                <Card>
                    <div className="card-header">
                        <h3>Marketing Preferences</h3>
                    </div>
                    <div className="profile-form-grid">
                        <div className="form-item--full">
                            <Checkbox
                                label="I consent to receive marketing communications"
                                name="marketing_consent"
                                checked={formData.marketing_consent}
                                onChange={handlePrivacyChange}
                                helperText="You can unsubscribe at any time"
                            />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

SettingsPrivacy.displayName = 'SettingsPrivacy';

export default SettingsPrivacy;
