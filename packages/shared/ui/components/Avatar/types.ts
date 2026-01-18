/**
 * Avatar Types & CVA
 */
import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';

// ==========================================================================
// CVA Configuration
// ==========================================================================

export const avatarVariants = cva('avatar', {
    variants: {
        /**
         * Size of the avatar
         */
        size: {
            xs: 'avatar--xs',
            s: 'avatar--s',
            m: 'avatar--m',
            l: 'avatar--l',
            xl: 'avatar--xl',
        },
    },
    defaultVariants: {
        size: 'm',
    },
});

export const avatarImageVariants = cva('avatar__image', {
    variants: {},
    defaultVariants: {}
});

export const avatarInitialsVariants = cva('avatar__initials', {
    variants: {},
    defaultVariants: {}
});

export const avatarPlaceholderVariants = cva('avatar__placeholder', {
    variants: {},
    defaultVariants: {}
});

export type AvatarVariantProps = VariantProps<typeof avatarVariants>;

// ==========================================================================
// Type Definitions
// ==========================================================================

export type AvatarSize = 'xs' | 's' | 'm' | 'l' | 'xl';

export interface AvatarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'>, AvatarVariantProps {
    className?: string;
    /** Image source URL */
    src?: string;
    /** Image alt text (also used for generating initials) */
    alt?: string;
    /** Explicit initials to display */
    initials?: string;
    /** User name (used for alt and initials if not provided) */
    name?: string;
    /** Fallback text/icon if image fails */
    fallback?: string;
}
