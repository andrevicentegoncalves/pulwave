import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { SpacingScale } from '@pulwave/utils';

export const kpiIconVariants = cva('kpi-card__icon', {
    variants: {
        status: {
            neutral: 'text-color-text-secondary',
            primary: 'text-color-primary',
            success: 'text-color-success',
            warning: 'text-color-warning',
            error: 'text-color-error',
            info: 'text-color-info',
        }
    },
    defaultVariants: {
        status: 'neutral'
    }
});

export interface KpiCardProps extends VariantProps<typeof kpiIconVariants> {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    description?: string;
    trend?: {
        value: string | number;
        isPositive?: boolean;
        label?: string;
    };
    spacing?: SpacingScale;
    className?: string;
}
