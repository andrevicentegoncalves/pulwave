import React from 'react';
import PropTypes from 'prop-types';
import { Card, Input } from '../ui';

/**
 * SocialLinksCard Component
 * 
 * Reusable card for editing social media profile links.
 * Used in settings and onboarding flows.
 */
const SocialLinksCard = ({
    formData,
    onChange,
    loading = false,
    title = 'Social Links',
    showCard = true,
}) => {
    const content = (
        <div className="profile-form-grid">
            <div className="form-row-two">
                <Input
                    label="Website"
                    name="website"
                    type="url"
                    value={formData.website || ''}
                    onChange={onChange}
                    placeholder="https://yourwebsite.com"
                    fullWidth
                    loading={loading}
                />
                <Input
                    label="LinkedIn"
                    name="linkedin_url"
                    type="url"
                    value={formData.linkedin_url || ''}
                    onChange={onChange}
                    placeholder="https://linkedin.com/in/username"
                    fullWidth
                    loading={loading}
                />
            </div>

            <div className="form-row-two">
                <Input
                    label="Twitter"
                    name="twitter_url"
                    type="url"
                    value={formData.twitter_url || ''}
                    onChange={onChange}
                    placeholder="https://twitter.com/username"
                    fullWidth
                    loading={loading}
                />
                <Input
                    label="Facebook"
                    name="facebook_url"
                    type="url"
                    value={formData.facebook_url || ''}
                    onChange={onChange}
                    placeholder="https://facebook.com/username"
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

SocialLinksCard.propTypes = {
    formData: PropTypes.shape({
        website: PropTypes.string,
        linkedin_url: PropTypes.string,
        twitter_url: PropTypes.string,
        facebook_url: PropTypes.string,
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    title: PropTypes.string,
    showCard: PropTypes.bool,
};

export default SocialLinksCard;
