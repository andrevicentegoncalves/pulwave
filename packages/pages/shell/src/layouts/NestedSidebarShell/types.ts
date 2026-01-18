/**
 * NestedSidebarShell Types
 * @package @pulwave/pages-shell
 */
import { cva, type VariantProps } from 'class-variance-authority';

export const nestedSidebarShellVariants = cva('nested-sidebar-shell', {
    variants: {
        variant: {
            white: 'nested-sidebar-shell--white',
            neutral: 'nested-sidebar-shell--neutral',
            primary: 'nested-sidebar-shell--primary',
        },
        collapsed: {
            true: 'nested-sidebar-shell--collapsed',
            false: '',
        },
    },
    defaultVariants: {
        variant: 'white',
        collapsed: false,
    },
});

export type NestedSidebarShellVariantProps = VariantProps<typeof nestedSidebarShellVariants>;
