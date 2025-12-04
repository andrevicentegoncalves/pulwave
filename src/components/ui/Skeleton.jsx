import React from 'react';
import PropTypes from 'prop-types';

const Skeleton = ({
    variant = 'text',
    width,
    height,
    className = '',
    animation = 'pulse',
    style: externalStyle,
    ...props
}) => {
    const internalStyle = {
        width,
        height,
    };

    // Merge external style with internal style
    const mergedStyle = { ...internalStyle, ...externalStyle };

    return (
        <div
            className={`skeleton skeleton--${variant} skeleton--${animation} ${className}`}
            style={mergedStyle}
            {...props}
        />
    );
};

Skeleton.propTypes = {
    variant: PropTypes.oneOf(['text', 'circular', 'rectangular', 'line']),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    className: PropTypes.string,
    animation: PropTypes.oneOf(['pulse', 'wave', 'none']),
    style: PropTypes.object,
};

export default Skeleton;
