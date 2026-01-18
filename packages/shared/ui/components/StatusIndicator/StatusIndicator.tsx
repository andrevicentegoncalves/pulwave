/**
 * StatusIndicator Component
 * 
 * Visual presence/status indicator (online, busy, away, etc.)
 * Commonly used with Avatar or in chat/messaging contexts.
 */
import React from 'react';
import { cn } from '@pulwave/utils';
import { statusIndicatorVariants, type StatusIndicatorProps, type StatusType } from './types';
import './styles/_index.scss';

const statusLabels: Record<StatusType, string> = {
    online: 'Online',
    offline: 'Offline',
    busy: 'Busy',
    away: 'Away',
    dnd: 'Do Not Disturb',
    invisible: 'Invisible',
};


export const StatusIndicatorRoot = React.forwardRef<HTMLSpanElement, StatusIndicatorProps & React.HTMLAttributes<HTMLSpanElement>>(
    ({ status, size, pulse, className, children, ...props }, ref) => (
        <span
            ref={ref}
            className={cn(
                statusIndicatorVariants({ status, size, pulse: pulse && status === 'online' ? true : undefined }),
                className
            )}
            role="status"
            {...props}
        >
            {children}
        </span>
    )
);
StatusIndicatorRoot.displayName = 'StatusIndicator.Root';

export const StatusIndicatorDot = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
    ({ className, ...props }, ref) => (
        <span ref={ref} className={cn("status-indicator__dot", className)} {...props} />
    )
);
StatusIndicatorDot.displayName = 'StatusIndicator.Dot';

export const StatusIndicatorLabel = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
    ({ className, children, ...props }, ref) => (
        <span ref={ref} className={cn("status-indicator__label", className)} {...props}>
            {children}
        </span>
    )
);
StatusIndicatorLabel.displayName = 'StatusIndicator.Label';

const StatusIndicatorMain = ({
    status,
    size = 'm',
    pulse = false,
    label,
    className,
    ...props
}: StatusIndicatorProps) => {
    const displayLabel = label ?? statusLabels[status];

    return (
        <StatusIndicatorRoot status={status} size={size} pulse={pulse} className={className} aria-label={displayLabel} {...props}>
            <StatusIndicatorDot />
            {label !== undefined && (
                <StatusIndicatorLabel>{displayLabel}</StatusIndicatorLabel>
            )}
        </StatusIndicatorRoot>
    );
};

export const StatusIndicator = Object.assign(StatusIndicatorMain, {
    Root: StatusIndicatorRoot,
    Dot: StatusIndicatorDot,
    Label: StatusIndicatorLabel,
});

StatusIndicator.displayName = 'StatusIndicator';
