import React from 'react';
import { useChartComponents } from '../../providers/ChartProvider';
import { useResolvedSemanticColors } from '../../hooks/useResolvedSemanticColors';
import { getXAxisDefaults, getYAxisDefaults } from '../../utils/chartDefaults';
import { ChartAxisTick } from '../ChartAxisTick';
import type { ChartAxesProps } from './types';
import './styles/_index.scss';

/**
 * ChartAxes
 *
 * Encapsulates the configuration for X and Y axes.
 * Uses ChartProvider for library abstraction.
 */
export function ChartAxes({
    layout = 'horizontal',
    xKey,
    yKey,
    showXAxis = true,
    showYAxis = true,
    xAxisFormatter,
    yAxisFormatter,
    xAxisType,
    yAxisType,
}: ChartAxesProps) {
    // Use resolved semantic colors for SVG attributes (fill, stroke don't support CSS vars)
    const semanticColors = useResolvedSemanticColors();
    const { XAxis, YAxis } = useChartComponents();
    const isHorizontal = layout === 'horizontal';

    const xDefaults = getXAxisDefaults(semanticColors);
    const yDefaults = getYAxisDefaults(semanticColors);

    // Determine axis types based on layout if not explicitly provided
    const effectiveXType = xAxisType || (isHorizontal ? 'category' : 'number');
    const effectiveYType = yAxisType || (isHorizontal ? 'number' : 'category');

    return (
        <>
            {showXAxis && (
                <XAxis
                    {...xDefaults}
                    dataKey={xKey}
                    type={effectiveXType}
                    tickFormatter={xAxisFormatter}
                    orientation="bottom"
                    axisLine={effectiveXType === 'number' ? { stroke: semanticColors.axis } : xDefaults.axisLine}
                    tick={(props: any) => (
                        <ChartAxisTick
                            {...props}
                            textAnchor="middle"
                            isYAxis={false}
                            maxLength={16}
                        />
                    )}
                />
            )}
            {showYAxis && (
                <YAxis
                    {...yDefaults}
                    dataKey={yKey}
                    type={effectiveYType}
                    tickFormatter={yAxisFormatter}
                    width={effectiveYType === 'category' ? 80 : 60}
                    orientation="left"
                    tick={(props: any) => (
                        <ChartAxisTick
                            {...props}
                            textAnchor="end"
                            isYAxis={true}
                            maxLength={16}
                        />
                    )}
                />
            )}
        </>
    );
}

ChartAxes.displayName = 'ChartAxes';

export default ChartAxes;
