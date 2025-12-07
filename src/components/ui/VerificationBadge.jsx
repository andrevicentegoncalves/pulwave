// src/components/ui/VerificationBadge.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Shield, Clock, AlertTriangle, AlertCircle } from 'lucide-react';
import Badge from './Badge';

/**
 * VerificationBadge Component
 * Displays verification status for payment methods and other verifiable items
 */

const STATUS_CONFIG = {
    verified: {
        type: 'success',
        icon: Shield,
        label: 'Verified'
    },
    pending: {
        type: 'warning',
        icon: Clock,
        label: 'Pending'
    },
    failed: {
        type: 'error',
        icon: AlertTriangle,
        label: 'Failed'
    },
    requires_action: {
        type: 'warning',
        icon: AlertCircle,
        label: 'Action Required'
    },
    unverified: {
        type: 'neutral',
        icon: AlertCircle,
        label: 'Unverified'
    }
};

const VerificationBadge = ({ status, size = 's', showIcon = true, className }) => {
    const config = STATUS_CONFIG[status];

    if (!config) return null;

    const { type, icon: Icon, label } = config;

    return (
        <Badge
            variant="light"
            type={type}
            size={size}
            className={className}
        >
            {showIcon && <Icon size={12} className="margin-right-1" />}
            {label}
        </Badge>
    );
};

VerificationBadge.propTypes = {
    /** Verification status */
    status: PropTypes.oneOf(['verified', 'pending', 'failed', 'requires_action', 'unverified']),
    /** Badge size */
    size: PropTypes.oneOf(['s', 'm', 'l']),
    /** Whether to show the status icon */
    showIcon: PropTypes.bool,
    /** Additional CSS classes */
    className: PropTypes.string
};

export default VerificationBadge;
