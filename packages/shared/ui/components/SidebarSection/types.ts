import type { ComponentType } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

export const sidebarSectionVariants = cva('sidebar-section', {
    variants: {},
    defaultVariants: {},
});

export const sidebarSectionCardVariants = cva('sidebar-section__card', {
    variants: {
        collapsed: {
            true: 'sidebar-section__card--collapsed',
        }
    },
    defaultVariants: {
        collapsed: false,
    }
});

export const sidebarSectionHeaderVariants = cva('sidebar-section__header', {
    variants: {},
    defaultVariants: {}
});

export const sidebarSectionToggleVariants = cva('sidebar-section__toggle', {
    variants: {},
    defaultVariants: {}
});

export const sidebarSectionNavVariants = cva('sidebar-section__nav', {
    variants: {},
    defaultVariants: {}
});

export const sidebarSectionItemVariants = cva('sidebar-section__item', {
    variants: {
        active: {
            true: 'sidebar-section__item--active',
        },
        collapsed: {
            true: 'sidebar-section__item--collapsed',
        }
    },
    defaultVariants: {
        active: false,
        collapsed: false,
    }
});

export const sidebarSectionLabelVariants = cva('sidebar-section__label', {
    variants: {},
    defaultVariants: {}
});


export interface SidebarItem { key: string; label: string; icon?: ComponentType<{ size?: number }>; }

export interface SidebarSectionProps {
    title: string;
    items: SidebarItem[];
    activeKey?: string;
    onSelect: (item: SidebarItem) => void;
    isExpanded?: boolean;
    toggleSidebar?: () => void;
}
