/**
 * SidebarBase Types
 * CVA configuration and TypeScript types for SidebarBase component
 */
import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes, ReactNode } from 'react';

// ==========================================================================
// CVA Configuration
// ==========================================================================

export const sidebarBaseVariants = cva('sidebar-base', {
    variants: {
        /**
         * Collapsed state
         */
        collapsed: {
            true: 'sidebar-base--collapsed',
            false: '',
        },
        /**
         * Position behavior
         */
        position: {
            fixed: 'sidebar-base--fixed',
            static: 'sidebar-base--static',
            sticky: 'sidebar-base--sticky',
        },
        /**
         * Visual variant
         */
        variant: {
            primary: 'sidebar-base--primary',
            neutral: 'sidebar-base--neutral',
            white: 'sidebar-base--white',
        },
    },
    defaultVariants: {
        collapsed: false,
        position: 'fixed',
        variant: 'primary',
    },
});

export type SidebarBaseVariantProps = VariantProps<typeof sidebarBaseVariants>;

// ==========================================================================
// Type Definitions
// ==========================================================================

export interface SidebarBaseProps extends Omit<HTMLAttributes<HTMLElement>, 'className'>, SidebarBaseVariantProps {
    /** Child content */
    children?: ReactNode;
    /** Additional CSS classes */
    className?: string;
}

export interface SidebarBaseHeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'className'> {
    /** Child content */
    children?: ReactNode;
    /** Additional CSS classes */
    className?: string;
}

export interface SidebarBaseContentProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
    /** Child content */
    children?: ReactNode;
    /** Additional CSS classes */
    className?: string;
}

export interface SidebarBaseFooterProps extends Omit<HTMLAttributes<HTMLElement>, 'className'> {
    /** Child content */
    children?: ReactNode;
    /** Additional CSS classes */
    className?: string;
}