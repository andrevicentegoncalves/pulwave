import React from 'react';
import { cn } from '@pulwave/utils';
import { cardGridVariants, type CardGridProps } from './types';
import './styles/_index.scss';

export const CardGrid = ({ children, className, minCardWidth = 'standard', gap = 'm', style, ...props }: CardGridProps) => (
    <div
        className={cn(cardGridVariants({ gap, minCardWidth }), className)}
        style={style}
        {...props}
    >
        {children}
    </div>
);
CardGrid.displayName = 'CardGrid';
