/**
 * AppShell Variants
 * CVA configuration for AppShell component
 */
import { cva, type VariantProps } from 'class-variance-authority';

export const appShellVariants = cva('app-shell', {
    variants: {
        /**
         * Loading state - centers content for loading spinners
         */
        loading: {
            true: 'app-shell--loading',
            false: '',
        },
    },
    defaultVariants: {
        loading: false,
    },
});

export type AppShellVariantProps = VariantProps<typeof appShellVariants>;
