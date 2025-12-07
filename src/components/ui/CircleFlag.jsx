import React from 'react';
import PropTypes from 'prop-types';
import * as flags from 'country-flag-icons/react/3x2';

/**
 * CircleFlag Component
 * Renders a country flag in a strictly circular container with proper cropping.
 */
const CircleFlag = ({ countryCode, size = 'm', className = '' }) => {
    if (!countryCode) {
        return (
            <div className={`circle-flag circle-flag--${size} ${className}`}>
                <span style={{ fontSize: size === 's' ? '10px' : size === 'l' ? '20px' : '14px' }}>🌍</span>
            </div>
        );
    }

    const FlagComponent = flags[countryCode.toUpperCase()];

    return (
        <div className={`circle-flag circle-flag--${size} ${className}`}>
            {FlagComponent ? (
                <FlagComponent title={countryCode} />
            ) : (
                <span style={{ fontSize: size === 's' ? '10px' : size === 'l' ? '20px' : '14px', lineHeight: 1 }}>{countryCode}</span>
            )}
        </div>
    );
};

CircleFlag.propTypes = {
    countryCode: PropTypes.string,
    size: PropTypes.oneOf(['s', 'm', 'l']),
    className: PropTypes.string,
};

export default CircleFlag;
