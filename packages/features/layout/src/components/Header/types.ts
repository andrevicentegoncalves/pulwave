/**
 * Header Variants
 * CVA configuration for Header component
 */
import { cva, type VariantProps } from 'class-variance-authority';

export const headerVariants = cva('app-header', {
    variants: {
        /**
         * Header size
         */
        size: {
            s: 'app-header--s',
            m: 'app-header--m',
            l: 'app-header--l',
        },
        /**
         * Sticky header behavior
         */
        sticky: {
            true: 'app-header--sticky',
            false: '',
        },
        /**
         * Sidebar expanded state (affects header layout)
         */
        sidebarExpanded: {
            true: 'app-header--sidebar-expanded',
            false: '',
        },
    },
    defaultVariants: {
        size: 'm',
        sticky: false,
        sidebarExpanded: false,
    },
});

export type HeaderVariantProps = VariantProps<typeof headerVariants>;
