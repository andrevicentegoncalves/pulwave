/**
 * ErrorState Pattern
 *
 * Display for error conditions with retry option.
 *
 * @package @pulwave/patterns
 */
import { type ReactNode } from 'react';
import { cn } from '@pulwave/utils';
import { Button, Icon, AlertCircle, RefreshCw } from '@pulwave/ui';

export interface ErrorStateProps {
    /** Error title */
    title?: string;
    /** Error message */
    message?: string;
    /** Custom icon (default: AlertCircle) */
    icon?: ReactNode;
    /** Retry action */
    onRetry?: () => void;
    /** Retry button label */
    retryLabel?: string;
    /** Size variant */
    size?: 's' | 'm' | 'l';
    /** Additional class */
    className?: string;
}

/**
 * ErrorState Pattern
 *
 * Shows an error message with optional retry action.
 *
 * @example
 * if (error) {
 *     return (
 *         <ErrorState
 *             title="Failed to load"
 *             message={error.message}
 *             onRetry={refetch}
 *         />
 *     );
 * }
 */
export const ErrorState = ({
    title = 'Something went wrong',
    message,
    icon,
    onRetry,
    retryLabel = 'Try again',
    size = 'm',
    className
}: ErrorStateProps) => {
    return (
        <div
            className={cn('error-state', `error-state--${size}`, className)}
            role="alert"
        >
            <div className="error-state__icon" aria-hidden="true">
                {icon || (
                    <Icon size={size === 's' ? 'm' : 'l'} className="icon--error">
                        <AlertCircle />
                    </Icon>
                )}
            </div>

            <h3 className="error-state__title">{title}</h3>

            {message && (
                <p className="error-state__message">{message}</p>
            )}

            {onRetry && (
                <Button
                    kind="secondary"
                    size={size}
                    onClick={onRetry}
                    className="error-state__retry"
                >
                    <Icon size="s"><RefreshCw /></Icon>
                    {retryLabel}
                </Button>
            )}
        </div>
    );
};

ErrorState.displayName = 'ErrorState';
export default ErrorState;
