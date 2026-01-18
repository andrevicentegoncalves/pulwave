import { cva, type VariantProps } from 'class-variance-authority';
import type { AnchorHTMLAttributes } from 'react';

export const skipLinkVariants = cva('skip-link', {
    variants: {},
    defaultVariants: {},
});

export type SkipLinkVariants = VariantProps<typeof skipLinkVariants>;

export interface SkipLinkProps extends SkipLinkVariants, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
    /** Target element ID to skip to */
    targetId?: string;
}
