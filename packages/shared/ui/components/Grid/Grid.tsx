/**
 * Grid Component
 * 
 * A layout primitive for CSS Grid layouts.
 * Migrated to CVA + Modular BEM.
 */
import React, { createElement, forwardRef } from 'react';
import { cn } from '@pulwave/utils';
import { gridVariants, type GridProps, type GridVariants } from './types';
import './styles/_index.scss';

export const Grid = forwardRef<HTMLElement, GridProps>(
    (
        {
            as = 'div',
            children,
            className,
            // Grid features
            columns,
            rows,
            minColumnWidth,
            // Variants
            flow = 'row',
            align,
            justify,
            alignContent,
            justifyContent,
            gap,
            columnGap,
            rowGap,
            // Overrides
            padding,
            width,
            style,
            testId,
            ...rest
        },
        ref
    ) => {
        // Build grid-template-columns value
        let gridColumns: string | undefined;
        if (minColumnWidth) {
            const minWidth = typeof minColumnWidth === 'number'
                ? `${minColumnWidth}px`
                : minColumnWidth;
            gridColumns = `repeat(auto-fit, minmax(${minWidth}, 1fr))`;
        } else if (typeof columns === 'number') {
            gridColumns = `repeat(${columns}, 1fr)`;
        } else if (columns) {
            gridColumns = columns;
        }

        // Build grid-template-rows value
        let gridRows: string | undefined;
        if (typeof rows === 'number') {
            gridRows = `repeat(${rows}, 1fr)`;
        } else if (rows) {
            gridRows = rows;
        }

        // Gap variants vs explicit style
        // We only use variants if the value is a known key in CVA
        // Otherwise we pass it to style
        const explicitGap = typeof gap === 'number' && ![0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32].includes(gap)
            ? `var(--scale-${gap})` : (typeof gap === 'string' ? gap : undefined);

        // Check for known gap variants
        const variantGap = typeof gap === 'number' && [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32].includes(gap) ? gap : undefined;

        const computedStyle: React.CSSProperties = {
            gridTemplateColumns: gridColumns,
            gridTemplateRows: gridRows,
            gap: explicitGap,
            padding: padding ? `var(--scale-${padding})` : undefined,
            width: typeof width === 'number' ? `${width}px` : width,
            ...style,
        };

        return createElement(
            as,
            {
                ref,
                className: cn(
                    gridVariants({
                        flow: flow as GridVariants['flow'],
                        align,
                        justify,
                        alignContent,
                        justifyContent,
                        gap: variantGap as GridVariants['gap'],
                        // columnGap and rowGap handling can be added similarly if needed frequently
                    }),
                    className
                ),
                style: Object.keys(computedStyle).length > 0 ? computedStyle : undefined,
                'data-testid': testId,
                ...rest,
            },
            children
        );
    }
);

Grid.displayName = 'Grid';
