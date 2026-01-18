/**
 * NestedMenu Variants
 * CVA configuration for NestedMenu component
 */
import { cva, type VariantProps } from 'class-variance-authority';

export const nestedMenuVariants = cva('nested-menu', {
    variants: {
        /**
         * Collapsed state (icon-only mode)
         */
        collapsed: {
            true: 'nested-menu--collapsed',
            false: '',
        },
    },
    defaultVariants: {
        collapsed: false,
    },
});

export type NestedMenuVariantProps = VariantProps<typeof nestedMenuVariants>;
