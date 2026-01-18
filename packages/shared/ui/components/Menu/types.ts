
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

export const menuVariants = cva('menu', {
    variants: {
        collapsed: {
            true: 'menu--collapsed',
            false: '',
        }
    },
    defaultVariants: {
        collapsed: false,
    },
});

export interface MenuItem {
    id?: string;
    label: string;
    icon?: React.ComponentType<{ size?: number; className?: string }> | React.ReactNode;
    path?: string;
    items?: MenuItem[];
}

export interface MenuProps extends VariantProps<typeof menuVariants> {
    items: MenuItem[];
    activeItem?: string;
    onItemClick: (path: string) => void;
    className?: string;
    isCollapsed?: boolean;
}
