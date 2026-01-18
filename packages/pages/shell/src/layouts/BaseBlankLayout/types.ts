/**
 * BaseBlankLayout Variants
 * CVA configuration for BaseBlankLayout component
 */
import { cva, type VariantProps } from 'class-variance-authority';

export const baseBlankLayoutVariants = cva('base-blank-layout', {
    variants: {
        /**
         * Whether to show mobile header
         */
        showMobileHeader: {
            true: '',
            false: 'base-blank-layout--no-header',
        },
    },
    defaultVariants: {
        showMobileHeader: true,
    },
});

export type BaseBlankLayoutVariantProps = VariantProps<typeof baseBlankLayoutVariants>;
