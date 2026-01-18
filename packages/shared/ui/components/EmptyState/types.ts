
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

export const emptyStateVariants = cva('empty-state', {
    variants: {
        variant: {
            default: 'empty-state--default',
            card: 'empty-state--card',
        },
        size: {
            s: 'empty-state--s',
            m: 'empty-state--m',
            l: 'empty-state--l',
        }
    },
    defaultVariants: {
        variant: 'default',
        size: 'm',
    },
});

export type EmptyStateProps = VariantProps<typeof emptyStateVariants> & {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
};
