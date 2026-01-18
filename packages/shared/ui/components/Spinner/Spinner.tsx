import React from 'react';
import { cn } from '@pulwave/utils';
import { spinnerVariants, type SpinnerProps } from './types';
import './styles/_index.scss';

const sizeMap = {
    xs: 12,
    s: 16,
    m: 24,
    l: 32,
    xl: 48,
} as const;

const SpinnerRoot = ({
    size = 'm',
    color = 'primary',
    className,
    testId = 'spinner',
}: SpinnerProps) => {
    const spinnerSize = sizeMap[size];

    return (
        <span
            className={cn(spinnerVariants({ size, color }), className)}
            style={{ width: spinnerSize, height: spinnerSize }}
            role="status"
            aria-label="Loading"
            data-testid={testId}
        >
            <span className="spinner__circle" />
        </span>
    );
};
SpinnerRoot.displayName = 'Spinner';

// Compound Sub-components
const SpinnerCircle = ({ className }: { className?: string }) => (
    <span className={cn('spinner__circle', className)} />
);
SpinnerCircle.displayName = 'Spinner.Circle';

export const Spinner = Object.assign(SpinnerRoot, {
    Circle: SpinnerCircle,
});
