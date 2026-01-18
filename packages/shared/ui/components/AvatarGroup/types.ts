/**
 * AvatarGroup Types & CVA
 */
import { cva, type VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';
import type { AvatarSize } from '../Avatar/types';

// ==========================================================================
// CVA Configuration
// ==========================================================================

export const avatarGroupVariants = cva('avatar-group', {
    variants: {
        // We could add variants for spacing or alignment if needed
    },
});

export const avatarGroupExcessVariants = cva('avatar-group__excess', {
    variants: {
        size: {
            xs: 'avatar--xs',
            s: 'avatar--s',
            m: 'avatar--m',
            l: 'avatar--l',
            xl: 'avatar--xl',
        }
    },
    defaultVariants: {
        size: 'm'
    }
});

export type AvatarGroupVariantProps = VariantProps<typeof avatarGroupVariants>;

// ==========================================================================
// Type Definitions
// ==========================================================================

export interface AvatarGroupProps extends AvatarGroupVariantProps {
    /**
     * The Avatar components to render
     */
    children: ReactNode;

    /**
     * Maximum number of avatars to show.
     * The rest will be truncated and the count shown in the last avatar.
     */
    limit?: number;

    /**
     * Size of all avatars in the group.
     * @default 'm'
     */
    size?: AvatarSize;

    /**
     * Additional class name for the wrapper
     */
    className?: string;
}
