import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Card from './Card';
import Icon from './Icon';

/**
 * StatCard Component
 * A card for displaying key statistics with an icon, value, and label.
 * 
 * @example
 * <StatCard
 *   icon={<Building />}
 *   value={25}
 *   label="Buildings"
 *   variant="primary"
 * />
 */
const StatCard = ({
    icon,
    value,
    label,
    subtext,
    variant = 'primary',
    loading = false,
    className,
    ...props
}) => {
    const variants = {
        primary: 'stat-card--primary',
        secondary: 'stat-card--secondary',
        success: 'stat-card--success',
        warning: 'stat-card--warning',
        error: 'stat-card--error',
        info: 'stat-card--info',
    };

    return (
        <Card
            variant="elevated"
            className={clsx('stat-card', variants[variant], className)}
            {...props}
        >
            <div className="stat-card__header">
                <div className={clsx('stat-card__icon-wrapper', `stat-card__icon-wrapper--${variant}`)}>
                    <Icon size="l">{icon}</Icon>
                </div>
            </div>
            <div className="stat-card__body">
                <div className="stat-card__value">
                    {loading ? '—' : value}
                </div>
                <div className="stat-card__label">{label}</div>
                {subtext && (
                    <div className="stat-card__subtext">{subtext}</div>
                )}
            </div>
        </Card>
    );
};

StatCard.propTypes = {
    /** Icon element to display */
    icon: PropTypes.node.isRequired,
    /** Main value to display */
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    /** Label describing the value */
    label: PropTypes.string.isRequired,
    /** Optional subtext below the label */
    subtext: PropTypes.string,
    /** Color variant */
    variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'error', 'info']),
    /** Loading state */
    loading: PropTypes.bool,
    /** Additional CSS classes */
    className: PropTypes.string,
};

export default StatCard;
