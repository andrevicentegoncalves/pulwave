/**
 * LoadingState Pattern
 *
 * Display while content is loading.
 *
 * @package @pulwave/patterns
 */
import { cn } from '@pulwave/utils';
import { Spinner, Skeleton } from '@pulwave/ui';

export type LoadingStateSize = 's' | 'm' | 'l';

export interface LoadingStateProps {
    /** Loading message */
    message?: string;
    /** Display variant */
    variant?: 'spinner' | 'skeleton' | 'dots';
    /** Size variant */
    size?: LoadingStateSize;
    /** Number of skeleton lines (for skeleton variant) */
    lines?: number;
    /** Additional class */
    className?: string;
}

/**
 * LoadingState Pattern
 *
 * Shows loading feedback while content is being fetched.
 */
export const LoadingState = ({
    message,
    variant = 'spinner',
    size = 'm',
    lines = 3,
    className
}: LoadingStateProps) => {
    const spinnerSizeMap = {
        s: 's' as const,
        m: 'm' as const,
        l: 'l' as const
    };

    return (
        <div
            className={cn('loading-state', `loading-state--${size}`, className)}
            role="status"
            aria-busy="true"
            aria-live="polite"
        >
            {variant === 'spinner' && (
                <Spinner size={spinnerSizeMap[size]} />
            )}

            {variant === 'skeleton' && (
                <div className="loading-state__skeleton">
                    {Array.from({ length: lines }).map((_, i) => (
                        <Skeleton
                            key={i}
                            variant="text"
                            width={i === lines - 1 ? '60%' : '100%'}
                            height={size === 's' ? 16 : size === 'l' ? 24 : 20}
                        />
                    ))}
                </div>
            )}

            {variant === 'dots' && (
                <div className="loading-state__dots">
                    <span className="loading-state__dot" />
                    <span className="loading-state__dot" />
                    <span className="loading-state__dot" />
                </div>
            )}

            {message && (
                <p className="loading-state__message">{message}</p>
            )}

            {/* Screen reader only announcement */}
            <span className="visually-hidden">
                {message || 'Loading…'}
            </span>
        </div>
    );
};

LoadingState.displayName = 'LoadingState';
export default LoadingState;
