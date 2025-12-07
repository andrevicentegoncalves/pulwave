import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Card from './Card';
import Icon from './Icon';

/**
 * EmptyState Component
 * A card for displaying empty state messages with icon, title, description, and optional action.
 * 
 * @example
 * <EmptyState
 *   icon={<Building />}
 *   title="No Buildings Yet"
 *   description="Add your first building to get started"
 *   action={<Button>Add Building</Button>}
 * />
 */
const EmptyState = ({
    icon,
    title,
    description,
    action,
    variant = 'default',
    size = 'm',
    className,
    ...props
}) => {
    const sizes = {
        s: 'empty-state--s',
        m: 'empty-state--m',
        l: 'empty-state--l',
    };

    const variants = {
        default: '',
        card: 'empty-state--card',
        inline: 'empty-state--inline',
    };

    const content = (
        <>
            {icon && (
                <div className="empty-state__icon">
                    <Icon size={size === 's' ? 'l' : '2xl'}>{icon}</Icon>
                </div>
            )}
            <h3 className="empty-state__title">{title}</h3>
            {description && (
                <p className="empty-state__description">{description}</p>
            )}
            {action && (
                <div className="empty-state__action">{action}</div>
            )}
        </>
    );

    if (variant === 'card') {
        return (
            <Card
                variant="elevated"
                className={clsx('empty-state', sizes[size], variants[variant], className)}
                {...props}
            >
                {content}
            </Card>
        );
    }

    return (
        <div
            className={clsx('empty-state', sizes[size], variants[variant], className)}
            {...props}
        >
            {content}
        </div>
    );
};

EmptyState.propTypes = {
    /** Icon element to display */
    icon: PropTypes.node,
    /** Title text */
    title: PropTypes.string.isRequired,
    /** Description text */
    description: PropTypes.string,
    /** Action element (usually a Button) */
    action: PropTypes.node,
    /** Visual variant */
    variant: PropTypes.oneOf(['default', 'card', 'inline']),
    /** Size variant */
    size: PropTypes.oneOf(['s', 'm', 'l']),
    /** Additional CSS classes */
    className: PropTypes.string,
};

export default EmptyState;
