/**
 * SidebarShell Variants
 * CVA configuration for SidebarShell component
 */
import { cva, type VariantProps } from 'class-variance-authority';

export const sidebarShellVariants = cva('sidebar-shell', {
    variants: {
        /**
         * Collapsed state
         */
        collapsed: {
            true: 'sidebar-shell--collapsed',
            false: '',
        },
    },
    defaultVariants: {
        collapsed: false,
    },
});

export type SidebarShellVariantProps = VariantProps<typeof sidebarShellVariants>;
