// src/components/ui/SectionHeader.jsx
import React from 'react';
import PropTypes from 'prop-types';
import Icon from './Icon';

/**
 * SectionHeader Component
 * Reusable section title with icon for settings/profile pages
 */
const SectionHeader = ({ icon: IconComponent, title, size = 'l' }) => (
    <h2 className="profile-section__title">
        <Icon size={size}>
            <IconComponent />
        </Icon>
        {title}
    </h2>
);

SectionHeader.propTypes = {
    icon: PropTypes.elementType.isRequired,
    title: PropTypes.string.isRequired,
    size: PropTypes.oneOf(['s', 'm', 'l', 'xl']),
};

export default SectionHeader;
