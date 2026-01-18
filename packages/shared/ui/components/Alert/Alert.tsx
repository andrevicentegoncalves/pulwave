import React, { forwardRef } from 'react';
import { cn } from '@pulwave/utils';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from '../../icon-library';
import { alertVariants, type AlertProps } from './types';
import './styles/_index.scss';

const statusIcons = {
    info: Info,
    success: CheckCircle2,
    warning: AlertTriangle,
    error: AlertCircle,
};

const AlertRoot = forwardRef<HTMLDivElement, AlertProps>(({
    status = 'info',
    variant,
    className,
    children,
    dismissible,
    onDismiss,
    title, // Optional title separate from children
    ...props
}, ref) => {
    const IconComponent = statusIcons[status || 'info'];

    return (
        <div
            ref={ref}
            className={cn(alertVariants({ status, variant }), className)}
            role="alert"
            {...props}
        >
            <div className="alert__icon" aria-hidden="true">
                <IconComponent size={20} />
            </div>
            <div className="alert__content">
                {title && <div className="alert__title">{title}</div>}
                <div className="alert__message">{children}</div>
            </div>
            {dismissible && (
                <button
                    type="button"
                    className="alert__close"
                    onClick={onDismiss}
                    aria-label="Dismiss alert"
                >
                    <X size={16} aria-hidden="true" />
                </button>
            )}
        </div>
    );
});
AlertRoot.displayName = 'Alert';

export const Alert = AlertRoot;
