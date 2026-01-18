/**
 * Sidebar Variants
 * CVA configuration for Sidebar component
 */
import { cva, type VariantProps } from 'class-variance-authority';

export const sidebarContainerVariants = cva('sidebar-container', {
    variants: {
        /**
         * Sidebar expanded/collapsed state
         */
        expanded: {
            true: 'expanded',
            false: 'collapsed',
        },
        /**
         * Position behavior
         */
        position: {
            fixed: '',
            static: 'sidebar-container--static',
        },
    },
    defaultVariants: {
        expanded: true,
        position: 'fixed',
    },
});

export const sidebarVariants = cva('sidebar', {
    variants: {
        /**
         * Color variant
         */
        variant: {
            primary: '',
            neutral: 'sidebar--neutral',
            white: 'sidebar--white',
        },
        /**
         * Compact mode
         */
        compact: {
            true: 'sidebar--compact',
            false: '',
        },
        /**
         * Collapsed state
         */
        collapsed: {
            true: 'sidebar--collapsed',
            false: '',
        },
    },
    defaultVariants: {
        variant: 'primary',
        compact: false,
        collapsed: false,
    },
});

export type SidebarContainerVariantProps = VariantProps<typeof sidebarContainerVariants>;
export type SidebarVariantProps = VariantProps<typeof sidebarVariants>;
