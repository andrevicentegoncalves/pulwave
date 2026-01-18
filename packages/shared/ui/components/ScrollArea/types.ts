
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

export const scrollAreaVariants = cva('scroll-area', {
    variants: {
        orientation: {
            vertical: 'scroll-area--vertical',
            horizontal: 'scroll-area--horizontal',
            both: 'scroll-area--both',
        },
        hideScrollbar: {
            true: 'scroll-area--hide-scrollbar',
            false: '',
        }
    },
    defaultVariants: {
        orientation: 'vertical',
        hideScrollbar: false,
    },
});

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof scrollAreaVariants> {
    maxHeight?: string | number;
    height?: string | number;
}
