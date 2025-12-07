import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Card from './Card';
import Icon from './Icon';

/**
 * KpiCard Component
 * A compact card for displaying KPI metrics with icon, value, label, and optional subtext.
 * Designed for dashboard grids.
 * 
 * @example
 * <KpiCard
 *   icon={<Building />}
 *   value={25}
 *   label="Total Buildings"
 *   colorScheme="primary"
 * />
 */
const KpiCard = ({
    icon,
    value,
    label,
    subtext,
    colorScheme = 'primary',
    loading = false,
    className,
    ...props
}) => {
    return (
        <Card
            variant="elevated"
            className={clsx('kpi-card', `kpi-card--${colorScheme}`, className)}
            {...props}
        >
            <div className="kpi-card__header">
                <div className={clsx('kpi-card__icon-wrapper', `kpi-card__icon-wrapper--${colorScheme}`)}>
                    <Icon size="m">{icon}</Icon>
                </div>
                <span className="kpi-card__label">{label}</span>
            </div>
            <div className="kpi-card__value">
                {loading ? '—' : value}
            </div>
            {subtext && (
                <div className="kpi-card__subtext">{subtext}</div>
            )}
        </Card>
    );
};

KpiCard.propTypes = {
    /** Icon element to display */
    icon: PropTypes.node.isRequired,
    /** Main value to display */
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    /** Label describing the metric */
    label: PropTypes.string.isRequired,
    /** Optional subtext for additional context */
    subtext: PropTypes.string,
    /** Color scheme for the card */
    colorScheme: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'error', 'tertiary']),
    /** Loading state */
    loading: PropTypes.bool,
    /** Additional CSS classes */
    className: PropTypes.string,
};

export default KpiCard;
