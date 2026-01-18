import type { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

// ==========================================================================
// CVA Configuration - Returns BEM class names
// ==========================================================================

export const tagVariants = cva('tag', {
    variants: {
        size: {
            xs: 'tag--xs',
            s: 'tag--s',
            m: 'tag--m',
            l: 'tag--l',
            xl: 'tag--xl',
        },
        color: {
            neutral: 'tag--neutral',
            primary: 'tag--primary',
            success: 'tag--success',
            warning: 'tag--warning',
            error: 'tag--error',
            info: 'tag--info',
        },
        variant: {
            solid: 'tag--solid',
            outline: 'tag--outline',
            subtle: 'tag--subtle',
        },
    },
    defaultVariants: {
        size: 'm',
        color: 'neutral',
        variant: 'solid',
    },
});

export type TagVariants = VariantProps<typeof tagVariants>;

/**
 * Tag color variants
 */
export type TagColor = 'neutral' | 'primary' | 'success' | 'warning' | 'error' | 'info';

/**
 * Tag visual variant
 */
export type TagVariant = 'solid' | 'outline' | 'subtle';

/**
 * Tag size options
 */
export type TagSize = 'xs' | 's' | 'm' | 'l' | 'xl';

/**
 * Tag component props
 */
export interface TagProps extends TagVariants {
    /** Tag content */
    children: ReactNode;
    /** Color variant */
    color?: TagColor;
    /** Visual variant */
    variant?: TagVariant;
    /** Size */
    size?: TagSize;
    /** Optional leading icon */
    icon?: ReactNode;
    /** Whether tag can be removed */
    removable?: boolean;
    /** Callback when remove button is clicked */
    onRemove?: () => void;
    /** Click handler (makes tag interactive) */
    onClick?: () => void;
    /** Additional CSS class names */
    className?: string;
    /** Disabled state */
    disabled?: boolean;
}
