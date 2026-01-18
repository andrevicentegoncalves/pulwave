import { cva, type VariantProps } from 'class-variance-authority';
import type React from 'react';

// ==========================================================================
// CVA Configuration - Returns BEM class names
// ==========================================================================

export const badgeVariants = cva('badge', {
    variants: {
        variant: {
            heavy: 'badge--heavy',
            medium: 'badge--medium',
            light: 'badge--light',
        },
        status: {
            neutral: 'badge--neutral',
            primary: 'badge--primary',
            secondary: 'badge--secondary',
            tertiary: 'badge--tertiary',
            info: 'badge--info',
            success: 'badge--success',
            warning: 'badge--warning',
            error: 'badge--error',
            danger: 'badge--danger',
            critical: 'badge--critical',
            promotion: 'badge--promotion',
            premium: 'badge--premium',
            discovery: 'badge--discovery',
            maintenance: 'badge--maintenance',
            growth: 'badge--growth',
            urgent: 'badge--urgent',
        },
        size: {
            xs: 'badge--xs',
            s: 'badge--s',
            m: 'badge--m',
            l: 'badge--l',
            xl: 'badge--xl',
        },
        clickable: {
            true: 'badge--clickable',
        },
    },
    defaultVariants: {
        variant: 'medium',
        status: 'neutral',
        size: 'm',
        clickable: false,
    },
});

export const badgeIconVariants = cva('badge__icon', {
    variants: {},
    defaultVariants: {}
});

export const badgeTextVariants = cva('badge__text', {
    variants: {},
    defaultVariants: {}
});

export const badgeCloseVariants = cva('badge__close', {
    variants: {},
    defaultVariants: {}
});

export type BadgeVariants = VariantProps<typeof badgeVariants>;

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, BadgeVariants {
    children?: React.ReactNode;
    /** Icon to display before the text */
    icon?: React.ReactNode;
    /** Whether the badge is removable */
    removable?: boolean;
    /** Callback when remove button is clicked */
    onRemove?: () => void;
    /** Forces the badge to be circular (equal width/height) - useful for icon-only badges */
    circle?: boolean;
    /** Alias for status for compatibility */
    type?: BadgeVariants['status'];
}

export type BadgeType = BadgeProps['status'];
export type BadgeVariant = BadgeProps['variant'];
export type BadgeSize = BadgeProps['size'];
