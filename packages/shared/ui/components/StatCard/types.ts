import type { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

export const statCardVariants = cva('stat-card', {
    variants: {
        variant: {
            primary: 'stat-card--primary',
            secondary: 'stat-card--secondary',
            success: 'stat-card--success',
            warning: 'stat-card--warning',
            error: 'stat-card--error',
            info: 'stat-card--info',
            neutral: 'stat-card--neutral',
        },
    },
    defaultVariants: {
        variant: 'primary',
    },
});

export const statCardIconVariants = cva('stat-card__icon-wrapper', {
    variants: {
        variant: {
            primary: 'stat-card__icon-wrapper--variant-primary',
            secondary: 'stat-card__icon-wrapper--variant-secondary',
            success: 'stat-card__icon-wrapper--variant-success',
            warning: 'stat-card__icon-wrapper--variant-warning',
            error: 'stat-card__icon-wrapper--variant-error',
            info: 'stat-card__icon-wrapper--variant-info',
            neutral: 'stat-card__icon-wrapper--variant-neutral',
        },
    },
    defaultVariants: {
        variant: 'primary',
    },
});

export type StatCardVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';

export interface StatCardRootProps extends VariantProps<typeof statCardVariants> {
    children?: ReactNode;
    className?: string;
}

import { SpacingScale } from '@pulwave/utils';

export interface StatCardProps extends StatCardRootProps {
    icon?: ReactNode;
    value: string | number;
    label: string;
    subtext?: string;
    trend?: {
        value: string | number;
        isPositive?: boolean;
    };
    spacing?: SpacingScale;
    loading?: boolean;
}
