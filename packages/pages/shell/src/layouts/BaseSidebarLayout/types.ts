/**
 * BaseSidebarLayout Variants
 * CVA configuration for BaseSidebarLayout component
 */
import { cva, type VariantProps } from 'class-variance-authority';

export const baseSidebarLayoutVariants = cva('base-sidebar-layout', {
    variants: {
        /**
         * Layout variant
         * - default: Managed Sidebar + Main content
         * - structural: Pure container for custom sidebar implementations
         */
        variant: {
            default: '',
            structural: 'base-sidebar-layout--structural',
        },
        /**
         * Sidebar expanded state
         */
        expanded: {
            true: 'base-sidebar-layout--expanded',
            false: 'base-sidebar-layout--collapsed',
        },
        /**
         * Hide sidebar completely
         */
        hideSidebar: {
            true: 'base-sidebar-layout--no-sidebar',
            false: '',
        },
    },
    defaultVariants: {
        variant: 'default',
        expanded: true,
        hideSidebar: false,
    },
});

export const baseSidebarLayoutMainVariants = cva('base-sidebar-layout__main', {
    variants: {
        /**
         * Fixed main behavior (height 100vh, overflow hidden)
         */
        fixed: {
            true: 'base-sidebar-layout__main--fixed',
            false: '',
        },
    },
    defaultVariants: {
        fixed: false,
    },
});

export type BaseSidebarLayoutVariantProps = VariantProps<typeof baseSidebarLayoutVariants>;
export type BaseSidebarLayoutMainVariantProps = VariantProps<typeof baseSidebarLayoutMainVariants>;
