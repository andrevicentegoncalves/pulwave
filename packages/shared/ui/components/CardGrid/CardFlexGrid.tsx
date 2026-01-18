
import React from 'react';
import { cn } from '@pulwave/utils';
import './styles/_index.scss';

export interface CardFlexGridProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    gap?: string;
    alignItems?: 'start' | 'center' | 'end' | 'stretch';
    justifyContent?: 'start' | 'center' | 'end' | 'space-between' | 'space-around';
}

export const CardFlexGrid = ({
    children,
    className,
    gap = 'm',
    alignItems = 'stretch',
    justifyContent = 'start',
    style,
    ...props
}: CardFlexGridProps) => {
    // We can use inline styles for gap if it's a variable or specific value not covered by classes,
    // or we can add a class. For now, assuming it behaves like CardGrid but with flex.
    // However, the demo passed gap="var(--space-4)".

    const gapValue = gap === 'm' ? 'var(--scale-3)' : gap;

    return (
        <div
            className={cn('card-flex-grid', className)}
            style={{
                '--cfg-gap': gapValue,
                '--cfg-align': alignItems,
                '--cfg-justify': justifyContent,
                ...style
            } as React.CSSProperties}
            {...props}
        >
            {children}
        </div>
    );
};

CardFlexGrid.displayName = 'CardFlexGrid';
