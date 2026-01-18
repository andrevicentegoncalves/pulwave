
import React from 'react';
import { cn } from '@pulwave/utils';
import { scrollAreaVariants, type ScrollAreaProps } from './types';
import './styles/_index.scss';

export const ScrollArea = ({
    children,
    className,
    maxHeight,
    height,
    orientation = 'vertical',
    hideScrollbar = false,
    style,
    ...props
}: ScrollAreaProps) => (
    <div
        className={cn(scrollAreaVariants({ orientation, hideScrollbar }), className)}
        style={{ maxHeight, height, ...style }}
        {...props}
    >
        {children}
    </div>
);
ScrollArea.displayName = 'ScrollArea';
