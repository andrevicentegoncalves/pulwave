import React from 'react';

export interface MobileBottomNavItem {
    /** Unique identifier */
    id: string;
    /** Icon component */
    icon: React.ElementType;
    /** Label (shown when active) */
    label: string;
}

export interface MobileBottomNavConfig {
    /** Navigation items (max 6 recommended) */
    items: MobileBottomNavItem[];
    /** Currently active item ID */
    activeId: string;
    /** Selection handler */
    onSelect: (id: string) => void;
}

export interface MobileBottomNavProps extends MobileBottomNavConfig {
    /** Additional class name */
    className?: string;
}
