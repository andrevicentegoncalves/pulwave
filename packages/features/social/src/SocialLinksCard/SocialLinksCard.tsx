import { Card, Input, Text } from '@pulwave/ui';
import { usePersonalData } from '@pulwave/entity-profile';

export interface SocialLinksFormData {
    website?: string;
    linkedin_url?: string;
    twitter_url?: string;
    facebook_url?: string;
    instagram_url?: string;
    github_url?: string;
}

export interface SocialLinksCardProps {
    /** Personal data partial */
    personal: ReturnType<typeof usePersonalData>;
    /** Loading state */
    loading?: boolean;
    /** Card title */
    title?: string;
    /** Show card wrapper */
    showCard?: boolean;
}

/**
 * SocialLinksCard - Social media links form
 */
export const SocialLinksCard = ({
    personal,
    loading = false,
    title = 'Social Links',
    showCard = true,
}: SocialLinksCardProps) => {
    const { formData, handlePersonalChange } = personal;

    const content = (
        <div className="profile-form-grid">
            <div className="form-row-two">
                <Input
                    label="Website"
                    name="website"
                    type="url"
                    autoComplete="url"
                    value={formData.website}
                    onChange={handlePersonalChange}
                    placeholder="https://yourwebsite.com"
                    fullWidth
                    disabled={loading}
                />
                <Input
                    label="LinkedIn"
                    name="linkedin_url"
                    type="url"
                    autoComplete="url"
                    value={formData.linkedin_url}
                    onChange={handlePersonalChange}
                    placeholder="https://linkedin.com/in/username"
                    fullWidth
                    disabled={loading}
                />
            </div>

            <div className="form-row-two">
                <Input
                    label="Twitter"
                    name="twitter_url"
                    type="url"
                    autoComplete="url"
                    value={formData.twitter_url}
                    onChange={handlePersonalChange}
                    placeholder="https://twitter.com/username"
                    fullWidth
                    disabled={loading}
                />
                <Input
                    label="Facebook"
                    name="facebook_url"
                    type="url"
                    autoComplete="url"
                    value={formData.facebook_url}
                    onChange={handlePersonalChange}
                    placeholder="https://facebook.com/username"
                    fullWidth
                    disabled={loading}
                />
            </div>
        </div>
    );

    if (!showCard) {
        return content;
    }

    return (
        <Card>
            <div className="card-header">
                <h3>{title}</h3>
            </div>
            {content}
        </Card>
    );
};

SocialLinksCard.displayName = 'SocialLinksCard';

export default SocialLinksCard;
