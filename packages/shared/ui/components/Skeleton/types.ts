import type { CSSProperties } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

// CVA for Skeleton component - using BEM class names
export const skeletonVariants = cva('skeleton', {
    variants: {
        variant: {
            text: 'skeleton--text',
            circular: 'skeleton--circular',
            rectangular: 'skeleton--rectangular',
            rounded: 'skeleton--rounded',
            line: 'skeleton--line',
        },
        animation: {
            pulse: 'skeleton--pulse',
            wave: 'skeleton--wave',
            'wave-ltr': 'skeleton--wave-ltr',
            none: 'skeleton--none',
        },
        dark: {
            true: 'skeleton--dark',
        },
    },
    defaultVariants: {
        variant: 'text',
        animation: 'pulse',
    },
});

export type SkeletonVariants = VariantProps<typeof skeletonVariants>;

export type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'rounded' | 'line';
export type SkeletonAnimation = 'pulse' | 'wave' | 'wave-ltr' | 'none';

export interface SkeletonProps extends SkeletonVariants {
    variant?: SkeletonVariant;
    width?: string | number;
    height?: string | number;
    className?: string;
    animation?: SkeletonAnimation;
    dark?: boolean;
    style?: CSSProperties;
}
