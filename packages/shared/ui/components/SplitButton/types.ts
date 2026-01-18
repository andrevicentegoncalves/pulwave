/**
 * SplitButton Variants
 * CVA configuration for SplitButton component
 */
import { cva, type VariantProps } from 'class-variance-authority';

export const splitButtonVariants = cva('split-button', {
    variants: {
        /**
         * Alignment of dropdown menu
         */
        align: {
            left: 'split-button--align-left',
            right: 'split-button--align-right',
            center: 'split-button--align-center',
        },
    },
    defaultVariants: {
        align: 'right',
    },
});

export type SplitButtonVariantProps = VariantProps<typeof splitButtonVariants>;
