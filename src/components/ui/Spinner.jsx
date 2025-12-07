// src/components/ui/Spinner.jsx
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

/**
 * Spinner Component
 * Animated loading spinner with configurable sizes.
 * Uses the 'spin' CSS class from _spinner.scss for animation.
 */

const sizeMap = {
    s: 16,
    m: 24,
    l: 32,
    xl: 48
};

const Spinner = ({ size = 'm', className, ...props }) => {
    const iconSize = sizeMap[size] || sizeMap.m;

    return (
        <span
            className={clsx('spinner', `spinner--${size}`, className)}
            role="status"
            aria-label="Loading"
            {...props}
        >
            <Loader2 size={iconSize} className="spin" />
        </span>
    );
};

Spinner.propTypes = {
    /** Size of the spinner: 's' (16px), 'm' (24px), 'l' (32px), 'xl' (48px) */
    size: PropTypes.oneOf(['s', 'm', 'l', 'xl']),
    /** Additional CSS class names */
    className: PropTypes.string
};

export default Spinner;
