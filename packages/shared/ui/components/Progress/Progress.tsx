import React from 'react';
import { Check } from '../../icon-library';
import { cn } from '@pulwave/utils';
import { progressVariants, type ProgressProps, type ProgressSize } from './types';
import './styles/_index.scss';

const ProgressRoot = ({
    value = 0, max = 100, variant = 'linear', color = 'primary', size = 'm',
    showLabel = false, label, steps, animated = true, indeterminate = false, className
}: ProgressProps) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    if (variant === 'steps' && steps) {
        return (
            <div className={cn(progressVariants({ variant, size }), className)}>
                {steps.map((step, i) => (
                    <div
                        key={i}
                        className={cn(
                            'progress__step',
                            step.complete && 'progress__step--complete',
                            step.active && 'progress__step--active'
                        )}
                    >
                        <div className="progress__step-indicator" aria-hidden="true">
                            {step.icon || (step.complete ? <Check size={14} /> : i + 1)}
                        </div>
                        {step.label && <span className="progress__step-label">{step.label}</span>}
                        {i < steps.length - 1 && <div className="progress__step-connector" />}
                    </div>
                ))}
            </div>
        );
    }

    if (variant === 'circular') {
        const radius = size === 's' ? 20 : size === 'l' ? 40 : 30;
        const stroke = size === 's' ? 3 : size === 'l' ? 6 : 4;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percentage / 100) * circumference;
        return (
            <div className={cn(
                progressVariants({ variant, color, size }),
                indeterminate && 'progress--indeterminate',
                className
            )}>
                <svg width={(radius + stroke) * 2} height={(radius + stroke) * 2}>
                    <circle
                        className="progress__circular-track"
                        cx={radius + stroke}
                        cy={radius + stroke}
                        r={radius}
                        strokeWidth={stroke}
                    />
                    <circle
                        className="progress__circular-fill"
                        cx={radius + stroke}
                        cy={radius + stroke}
                        r={radius}
                        strokeWidth={stroke}
                        strokeDasharray={circumference}
                        strokeDashoffset={indeterminate ? 0 : offset}
                    />
                </svg>
                {showLabel && <span className="progress__label">{label || `${Math.round(percentage)}%`}</span>}
            </div>
        );
    }

    return (
        <div
            className={cn(
                progressVariants({ variant, color, size }),
                indeterminate && 'progress--indeterminate',
                className
            )}
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={max}
        >
            <div className="progress__track">
                <div
                    className="progress__fill"
                    style={{ transform: indeterminate ? undefined : `scaleX(${percentage / 100})` }}
                />
            </div>
            {showLabel && <span className="progress__label">{label || `${Math.round(percentage)}%`}</span>}
        </div>
    );
};
ProgressRoot.displayName = 'Progress';

// Compound Sub-components
const ProgressTrack = ({ children, className }: { children?: React.ReactNode; className?: string }) => (
    <div className={cn('progress__track', className)}>{children}</div>
);
ProgressTrack.displayName = 'Progress.Track';

const ProgressFill = ({ percentage, className }: { percentage: number; className?: string }) => (
    <div className={cn('progress__fill', className)} style={{ transform: `scaleX(${percentage / 100})` }} />
);
ProgressFill.displayName = 'Progress.Fill';

const ProgressLabel = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <span className={cn('progress__label', className)}>{children}</span>
);
ProgressLabel.displayName = 'Progress.Label';

export const Progress = Object.assign(ProgressRoot, {
    Track: ProgressTrack,
    Fill: ProgressFill,
    Label: ProgressLabel,
});
