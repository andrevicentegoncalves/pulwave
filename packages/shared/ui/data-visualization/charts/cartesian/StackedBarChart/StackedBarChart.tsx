import React, { useMemo, forwardRef, useState, useCallback } from 'react';
import { ChartShell } from '../../../primitives/ChartShell';
import { ChartAxes } from '../../../primitives/ChartAxes';
import { ChartGrid } from '../../../primitives/ChartGrid';
import { useChartComponents } from '../../../providers/ChartProvider';
import { useChartColors } from '../../../hooks/useChartColors';
import { useLegendPayload } from '../../../hooks/useLegendPayload';
import { useResolvedSemanticColors } from '../../../hooks/useResolvedSemanticColors';
import { getChartMargins } from '../../../utils/chartDefaults';
import { ChartTooltipLayer } from '../../../primitives/ChartTooltip';
import { ChartLegendLayer } from '../../../primitives/ChartLegend';
import { stackedBarChartVariants, type StackedBarChartProps } from './types';
import type { SeriesConfig } from '../../../types';
import './styles/_index.scss';
import { cn } from '@pulwave/utils';

/**
 * StackedBarChart Component
 * 
 * Displays multiple data series as stacked bars.
 * Useful for showing composition over categories.
 * 
 * @example
 * <StackedBarChart 
 *   data={[
 *     { name: 'Q1', sales: 1200, returns: 200, profit: 800 },
 *     { name: 'Q2', sales: 1500, returns: 150, profit: 1100 },
 *   ]}
 *   series={[
 *     { key: 'sales', name: 'Sales' },
 *     { key: 'returns', name: 'Returns' },
 *   ]}
 * />
 */
export const StackedBarChart = forwardRef<HTMLDivElement, StackedBarChartProps>(({
    data = [],
    series = [],
    categoryKey = 'name',
    height = 400,
    width = '100%',
    layout = 'vertical',
    showGrid = true,
    showLegend = true,
    valueFormatter = (v) => v?.toLocaleString() ?? '',
    barRadius = 4,
    stackId = 'stack',
    animate = true,
    animationDuration = 400,
    tooltipFormatter,
    className,
    ariaLabel,
    ...restProps
}, ref) => {
    const semanticColors = useResolvedSemanticColors();
    const { BarChart, Bar, XAxis } = useChartComponents();
    const margins = getChartMargins({ isHorizontal: layout === 'horizontal' });

    // Hover state for bidirectional legend-chart interaction
    const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

    const handleLegendHover = useCallback((index: number) => {
        setHoveredBarIndex(index);
    }, []);

    const handleLegendLeave = useCallback(() => {
        setHoveredBarIndex(null);
    }, []);

    // Extract keys for hooks
    const seriesKeys = useMemo(() => series.map((s: SeriesConfig) => s.key), [series]);
    const seriesNames = useMemo(() =>
        series.reduce((acc, s: SeriesConfig) => ({ ...acc, [s.key]: s.name || s.key }), {} as Record<string, string>),
        [series]
    );

    // Use centralized hooks
    const chartColors = useChartColors(series.length);

    // Assign colors to series (with override support)
    const coloredSeries = useMemo(() =>
        series.map((s: SeriesConfig, i: number) => ({
            ...s,
            color: s.color || chartColors[i],
        })),
        [series, chartColors]
    );

    const legendPayload = useLegendPayload({
        keys: seriesKeys,
        names: seriesNames,
        colors: coloredSeries.map((s: any) => s.color),
    });

    const isHorizontal = layout === 'horizontal';

    return (
        <ChartShell
            ref={ref}
            width={width}
            height={height}
            className={cn(stackedBarChartVariants({ layout: layout || 'vertical' }), className)}
            role="img"
            aria-label={ariaLabel || 'Stacked bar chart'}
            {...restProps}
        >
            <BarChart
                data={data}
                layout={isHorizontal ? 'vertical' : 'horizontal'}
                margin={margins}
            >
                {/* Grid */}
                {showGrid && (
                    <ChartGrid
                        horizontal={!isHorizontal}
                        vertical={isHorizontal}
                    />
                )}

                {/* Axes */}
                <ChartAxes
                    layout={isHorizontal ? 'vertical' : 'horizontal'}
                    xKey={categoryKey}
                    showXAxis
                    showYAxis
                    xAxisFormatter={isHorizontal ? valueFormatter : undefined}
                    yAxisFormatter={isHorizontal ? undefined : valueFormatter}
                />

                {/* Tooltip */}
                <ChartTooltipLayer
                    formatter={tooltipFormatter}
                    cursor={{ fill: semanticColors.border, opacity: 0.1 }}
                />

                {/* Legend */}
                <ChartLegendLayer
                    show={showLegend}
                    payload={legendPayload}
                    onItemHover={handleLegendHover}
                    onItemLeave={handleLegendLeave}
                    activeIndex={hoveredBarIndex}
                    position="bottom"
                />

                {/* Bar Series */}
                {coloredSeries.map((s: any, index: number) => {
                    const isHovered = hoveredBarIndex === index;
                    const isDimmed = hoveredBarIndex !== null && hoveredBarIndex !== index;
                    const barOpacity = isDimmed ? 0.3 : 1;

                    return (
                        <Bar
                            key={s.key}
                            dataKey={s.key}
                            name={s.name || s.key}
                            stackId={stackId}
                            fill={s.color}
                            fillOpacity={barOpacity}
                            radius={
                                index === coloredSeries.length - 1
                                    ? isHorizontal
                                        ? [0, barRadius, barRadius, 0]
                                        : [barRadius, barRadius, 0, 0]
                                    : 0
                            }
                            isAnimationActive={animate}
                            animationDuration={animationDuration}
                            onMouseEnter={() => setHoveredBarIndex(index)}
                            onMouseLeave={() => setHoveredBarIndex(null)}
                        />
                    );
                })}
            </BarChart>
        </ChartShell>
    );
});

StackedBarChart.displayName = 'StackedBarChart';

export default StackedBarChart;
