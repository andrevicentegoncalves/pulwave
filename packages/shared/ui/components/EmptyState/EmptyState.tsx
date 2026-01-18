
import React from 'react';
import { cn } from '@pulwave/utils';
import { Card } from '../Card';
import { Icon } from '../Icon';
import { emptyStateVariants, type EmptyStateProps } from './types';
import './styles/_index.scss';

export const EmptyState = ({
    icon,
    title,
    description,
    action,
    variant = 'default',
    size = 'm',
    className,
    children,
    ...props
}: EmptyStateProps) => {
    const classes = cn(emptyStateVariants({ size, variant }), className);

    const content = (
        <>
            {icon && (
                <div className="empty-state__icon" aria-hidden="true">
                    <Icon size={size === 's' ? 'l' : 'xl'}>{icon}</Icon>
                </div>
            )}
            <h3 className="empty-state__title">{title}</h3>
            {description && <p className="empty-state__description">{description}</p>}
            {children}
            {action && <div className="empty-state__action">{action}</div>}
        </>
    );

    if (variant === 'card') {
        return (
            <Card variant="elevated" className={classes} {...props}>
                {content}
            </Card>
        );
    }

    return (
        <div className={classes} {...props}>
            {content}
        </div>
    );
};

EmptyState.displayName = 'EmptyState';
