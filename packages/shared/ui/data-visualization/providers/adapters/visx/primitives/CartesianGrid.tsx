/**
 * VISX CartesianGrid Primitive
 *
 * Wraps visx Grid with unified props.
 */

import React from 'react';
import { Grid, AnimatedGrid } from '@visx/xychart';

import type { GridProps } from '../../../../primitives/types';

// Extend with visx-specific props
interface VISXCartesianGridProps extends GridProps {
    /** Use animated grid */
    animate?: boolean;
    /** Number of grid rows */
    rows?: number;
    /** Number of grid columns */
    columns?: number;
}

/**
 * CartesianGrid for VISX
 */
export function CartesianGrid({
    horizontal = true,
    vertical = true,
    stroke,
    strokeDasharray = '3,3',
    strokeOpacity = 0.3,
    animate = true,
    rows,
    columns,
}: VISXCartesianGridProps) {
    const GridComponent = animate ? AnimatedGrid : Grid;

    return (
        <GridComponent
            rows={horizontal}
            columns={vertical}
            numTicks={rows ?? columns ?? 5}
            stroke={stroke ?? 'var(--color-border-default)'}
            strokeDasharray={strokeDasharray}
            lineStyle={{
                stroke: stroke ?? 'var(--color-border-default)',
                strokeDasharray,
                opacity: strokeOpacity,
            }}
        />
    );
}

export default CartesianGrid;
