import type { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

// CVA for Progress component - using BEM class names
export const progressVariants = cva('progress', {
    variants: {
        variant: {
            linear: 'progress--linear',
            circular: 'progress--circular',
            steps: 'progress--steps',
        },
        color: {
            primary: 'progress--primary',
            secondary: 'progress--secondary',
            success: 'progress--success',
            warning: 'progress--warning',
            error: 'progress--error',
            info: 'progress--info',
        },
        size: {
            s: 'progress--s',
            m: 'progress--m',
            l: 'progress--l',
        },
    },
    defaultVariants: {
        variant: 'linear',
        color: 'primary',
        size: 'm',
    },
});

export type ProgressVariants = VariantProps<typeof progressVariants>;

export type ProgressVariant = 'linear' | 'circular' | 'steps';
export type ProgressColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
export type ProgressSize = 's' | 'm' | 'l';

export interface ProgressStep {
    label?: string;
    icon?: ReactNode;
    complete?: boolean;
    active?: boolean;
}

export interface ProgressProps extends ProgressVariants {
    value?: number;
    max?: number;
    variant?: ProgressVariant;
    color?: ProgressColor;
    size?: ProgressSize;
    showLabel?: boolean;
    label?: ReactNode;
    steps?: ProgressStep[];
    animated?: boolean;
    indeterminate?: boolean;
    className?: string;
}
