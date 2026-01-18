import React from 'react';
import { cn } from '@pulwave/utils';
import { Icon } from '../Icon';
import {
    sectionHeaderVariants,
    sectionHeaderIconVariants,
    type SectionHeaderProps
} from './types';
import './styles/_index.scss';

export const SectionHeader = ({
    icon,
    title,
    size = 'l',
    className,
    description,
    actions,
    ...props
}: SectionHeaderProps) => (
    <div className="section-header-container">
        <div className="section-header-content">
            <h2 className={cn(sectionHeaderVariants({ size }), className)} {...props}>
                {icon && (
                    <span className={cn(sectionHeaderIconVariants())}>
                        {typeof icon === 'string' ? (
                            <Icon name={icon} size={size === 'xl' ? 'xl' : size === 'l' ? 'l' : 'm'} />
                        ) : (
                            <Icon icon={icon} size={size === 'xl' ? 'xl' : size === 'l' ? 'l' : 'm'} />
                        )}
                    </span>
                )}
                {title}
            </h2>
            {description && (
                <p className="text-sm text-neutral-500 mt-1">{description}</p>
            )}
        </div>
        {actions && (
            <div className="section-header-actions">
                {actions}
            </div>
        )}
    </div>
);
SectionHeader.displayName = 'SectionHeader';
