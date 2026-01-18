
import React, { forwardRef } from 'react';
import { cn } from '@pulwave/utils';
import { logoVariants, type LogoProps } from './types';
import './styles/_index.scss';

export const Logo = forwardRef<HTMLDivElement, LogoProps>(({
    variant = 'full',
    size = 'm',
    collapsed = false,
    className,
    ...props
}, ref) => {
    return (
        <div
            ref={ref}
            className={cn(logoVariants({ variant, size, collapsed }), className)}
            {...props}
        >
            <div className="logo__mark" aria-hidden="true">
                <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="32" height="32" rx="8" fill="currentColor" fillOpacity="0.2" />
                    <path d="M16 6L24 14L16 22L8 14L16 6Z" fill="currentColor" />
                </svg>
            </div>
            {/* Always render text for CSS animation - collapsed state handled by CSS */}
            <div className="logo__text" aria-hidden={collapsed || undefined}>
                {props.title && <span className="logo__title">{props.title}</span>}
                {props.subtitle && <span className="logo__subtitle">{props.subtitle}</span>}
            </div>
        </div>
    );
});

Logo.displayName = 'Logo';
