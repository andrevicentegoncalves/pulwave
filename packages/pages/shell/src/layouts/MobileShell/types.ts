/**
 * MobileShell Types
 * 
 * TypeScript interfaces for MobileShell component suite.
 * 
 * @package @pulwave/pages-shell
 */
import React from 'react';

// Re-export mobile types from features-layout
export type {
    MobileHeaderConfig,
    MobileBottomNavItem,
    MobileBottomNavConfig
} from '@pulwave/features-layout';

export interface MobileShellProps {
    /** Main content to display */
    children: React.ReactNode;

    /** Header configuration */
    header?: any; // Use features-layout types in the implementation

    /** Drawer content (shown when hamburger tapped) */
    drawer?: React.ReactNode;

    /** Bottom navigation configuration */
    bottomNav?: any; // Use features-layout types in the implementation

    /** Additional class name */
    className?: string;
}

