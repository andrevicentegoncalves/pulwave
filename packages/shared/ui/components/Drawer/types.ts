import type { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
export const drawerVariants = cva('drawer', {
    variants: {
        position: {
            left: 'drawer--left',
            right: 'drawer--right',
            bottom: 'drawer--bottom',
        },
        size: {
            s: 'drawer--s',
            m: 'drawer--m',
            l: 'drawer--l',
            full: 'drawer--full',
        },
    },
    defaultVariants: {
        position: 'right',
        size: 'm',
    },
});

export type DrawerVariants = VariantProps<typeof drawerVariants>;

/**
 * Drawer position options
 */
export type DrawerPosition = 'left' | 'right' | 'bottom';

/**
 * Drawer size options
 */
export type DrawerSize = 's' | 'm' | 'l' | 'full';

/**
 * Drawer component props
 */
export interface DrawerProps extends DrawerVariants {
    /** Whether the drawer is open */
    isOpen: boolean;
    /** Callback when drawer should close */
    onClose?: () => void;
    /** Drawer title */
    title?: string;
    /** Drawer content */
    children: ReactNode;
    /** Footer content (usually action buttons) */
    footer?: ReactNode;
    /** Position of the drawer */
    position?: DrawerPosition;
    /** Size variant */
    size?: DrawerSize;
    /** Close when clicking backdrop */
    closeOnBackdropClick?: boolean;
    /** Close when pressing Escape key */
    closeOnEscape?: boolean;
    /** Show close button in header */
    showCloseButton?: boolean;
    /** Auto-switch to bottom sheet on mobile */
    responsive?: boolean;
    /** Additional CSS class names */
    className?: string;
    /** ID for the drawer title (accessibility) */
    'aria-labelledby'?: string;
    /** ID for the drawer description (accessibility) */
    'aria-describedby'?: string;
}
