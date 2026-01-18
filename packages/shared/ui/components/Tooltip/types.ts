import type { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

// CVA for Tooltip component - using BEM class names
export const tooltipVariants = cva('tooltip', {
    variants: {
        size: {
            s: 'tooltip--s',
            m: 'tooltip--m',
        },
    },
    defaultVariants: {
        size: 'm',
    },
});

export type TooltipVariants = VariantProps<typeof tooltipVariants>;

/**
 * Tooltip direction options
 */
export type TooltipDirection =
    | 'top'
    | 'top-left'
    | 'top-right'
    | 'bottom'
    | 'bottom-left'
    | 'bottom-right'
    | 'left'
    | 'right';

/**
 * Tooltip size options
 */
export type TooltipSize = 's' | 'm';

/**
 * Tooltip component props
 */
export interface TooltipProps extends TooltipVariants {
    /** Trigger element */
    children: ReactNode;
    /** Tooltip content */
    content: string;
    /** Preferred direction (will flip if not enough space) */
    direction?: TooltipDirection;
    /** Custom class name for the wrapper element */
    wrapperClassName?: string;
    /** Size variant */
    size?: TooltipSize;
}
