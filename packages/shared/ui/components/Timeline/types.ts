import type { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

// ==========================================================================
// CVA Configuration
// ==========================================================================

export const timelineVariants = cva('timeline', {
    variants: {
        orientation: {
            vertical: 'timeline--orientation-vertical',
            horizontal: 'timeline--orientation-horizontal',
        },
        align: {
            left: '',
            right: 'timeline--align-right',
            alternate: 'timeline--align-alternate',
        }
    },
    defaultVariants: {
        orientation: 'vertical',
        align: 'left',
    },
});

export type TimelineVariantProps = VariantProps<typeof timelineVariants>;

// ==========================================================================
// Type Definitions
// ==========================================================================

/**
 * Timeline item type
 */
export type TimelineItemType = 'default' | 'success' | 'warning' | 'error' | 'info';

/**
 * Individual timeline item
 */
export interface TimelineItem {
    /** Unique identifier */
    id: string;
    /** Item title */
    title: ReactNode;
    /** Item description/content */
    content?: ReactNode;
    /** Timestamp or date */
    timestamp?: ReactNode;
    /** Custom icon */
    icon?: ReactNode;
    /** Item variant (affects color) */
    variant?: TimelineItemType;
}

/**
 * Timeline orientation
 */
export type TimelineOrientation = 'vertical' | 'horizontal';

/**
 * Timeline alignment (for vertical)
 */
export type TimelineAlign = 'left' | 'right' | 'alternate';

/**
 * Timeline component props
 */
export interface TimelineProps extends TimelineVariantProps {
    /** Timeline items */
    items?: TimelineItem[];
    children?: React.ReactNode;
    /** Orientation */
    orientation?: TimelineOrientation;
    /** Alignment (vertical only) */
    align?: TimelineAlign;
    /** Show line connecting items */
    showConnector?: boolean;
    /** Additional CSS class names */
    className?: string;
}
