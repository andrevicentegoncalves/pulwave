/**
 * SidebarToggle Types
 * CVA configuration and TypeScript types for SidebarToggle component
 */
import { cva, type VariantProps } from 'class-variance-authority';

// ==========================================================================
// CVA Configuration
// ==========================================================================

export const sidebarToggleVariants = cva('sidebar-header', {
    variants: {
        /**
         * Visual variant
         */
        variant: {
            primary: '',
            neutral: 'sidebar-header--neutral',
            white: 'sidebar-header--white',
        },
    },
    defaultVariants: {
        variant: 'primary',
    },
});

export type SidebarToggleVariantProps = VariantProps<typeof sidebarToggleVariants>;

// ==========================================================================
// Type Definitions
// ==========================================================================

export interface SidebarToggleProps extends SidebarToggleVariantProps {
    /** Whether sidebar is expanded */
    isExpanded: boolean;
    /** Toggle handler */
    toggleSidebar: () => void;
    /** Mobile mode uses menu icon */
    isMobile?: boolean;
    /** Additional class name */
    className?: string;
}
