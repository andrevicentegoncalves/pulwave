
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

export const dropdownVariants = cva('dropdown', {
    variants: {},
    defaultVariants: {},
});

export const dropdownMenuVariants = cva('dropdown__menu', {
    variants: {
        align: {
            left: 'dropdown__menu--align-left',
            right: 'dropdown__menu--align-right',
            center: 'dropdown__menu--align-center',
        }
    },
    defaultVariants: {
        align: 'left',
    }
});

export interface DropdownProps extends VariantProps<typeof dropdownVariants> {
    trigger: React.ReactNode;
    children: React.ReactNode;
    disabled?: boolean;
    align?: 'left' | 'right' | 'center';
    className?: string;
}

export interface DropdownItemProps {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    danger?: boolean;
    icon?: React.ReactNode;
    className?: string;
}
