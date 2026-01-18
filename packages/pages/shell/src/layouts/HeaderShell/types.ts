/**
 * HeaderShell Variants
 * CVA configuration for HeaderShell component
 */
import { cva, type VariantProps } from 'class-variance-authority';

export const headerShellVariants = cva('header-shell', {
    variants: {
        /**
         * Size variant for header padding/spacing
         */
        size: {
            s: 'header-shell--s',
            m: 'header-shell--m',
            l: 'header-shell--l',
        },
        /**
         * Sticky header behavior
         */
        sticky: {
            true: 'header-shell--sticky',
            false: '',
        },
    },
    defaultVariants: {
        size: 'm',
        sticky: false,
    },
});

export const headerShellWrapperVariants = cva('header-shell-wrapper', {
    variants: {},
    defaultVariants: {},
});

export type HeaderShellVariantProps = VariantProps<typeof headerShellVariants>;
