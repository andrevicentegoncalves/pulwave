import React from 'react';
import { useChartComponents } from '../../providers/ChartProvider';
import { useResolvedSemanticColors } from '../../hooks/useResolvedSemanticColors';
import { resolveCssColor } from '../../hooks/useChartColors';
import type { ChartGridProps } from './types';
import './styles/_index.scss';

/**
 * ChartGrid
 *
 * A themed CartesianGrid wrapper.
 * Uses ChartProvider for library abstraction.
 *
 * @example
 * <LineChart data={data}>
 *   <ChartGrid />
 *   <Line dataKey="value" />
 * </LineChart>
 */
export function ChartGrid({
    stroke,
    strokeOpacity = 0.5,
    strokeDasharray = '3 3',
    horizontal = true,
    vertical = true,
}: ChartGridProps) {
    const { CartesianGrid } = useChartComponents();
    const semanticColors = useResolvedSemanticColors();

    // Resolve stroke color - use provided value or default to grid color
    const resolvedStroke = stroke ? resolveCssColor(stroke) : semanticColors.grid;

    return (
        <CartesianGrid
            stroke={resolvedStroke}
            strokeOpacity={strokeOpacity}
            strokeDasharray={strokeDasharray}
            horizontal={horizontal}
            vertical={vertical}
        />
    );
}

ChartGrid.displayName = 'ChartGrid';

export default ChartGrid;
