import React, { forwardRef, useState, useCallback } from 'react';
import { ChartShell } from '../../../primitives/ChartShell';
import { ChartAxes } from '../../../primitives/ChartAxes';
import { ChartGrid } from '../../../primitives/ChartGrid';
import { ChartTooltipLayer } from '../../../primitives/ChartTooltip';
import { ChartLegendLayer } from '../../../primitives/ChartLegend';
import { useChartComponents } from '../../../providers/ChartProvider';
import { useChartTheme } from '../../../hooks/useChartTheme';
import { useChartColors } from '../../../hooks/useChartColors';
import { useSeriesVisibility } from '../../../hooks/useSeriesVisibility';
import { useLegendPayload } from '../../../hooks/useLegendPayload';
import { useResolvedSemanticColors } from '../../../hooks/useResolvedSemanticColors';
import { getChartMargins } from '../../../utils/chartDefaults';
import { cn } from '@pulwave/utils';
import { barChartVariants, type BarChartProps } from './types';
import './styles/_index.scss';

/**
 * BarChart Component
 * Displays data as vertical or horizontal bars.
 * Uses ChartProvider for library abstraction.
 */
export const BarChart = forwardRef<HTMLDivElement, BarChartProps>(({
    data = [],
    xKey,
    yKeys = [],
    yKeyNames = {},
    width = '100%',
    height = 300,
    layout = 'vertical',
    grouping = 'grouped',
    barRadius = 4,
    barGap = 4,
    barCategoryGap = '20%',
    showGrid = true,
    showXAxis = true,
    showYAxis = true,
    showTooltip = true,
    showLegend = true,
    legendPosition = 'bottom',
    showLabels = false,
    colors,
    animate = true,
    animationDuration = 400,
    xAxisFormatter,
    yAxisFormatter,
    tooltipFormatter,
    onBarClick,
    className,
    ariaLabel,
    ...restProps
}, ref) => {
    const semanticColors = useResolvedSemanticColors();
    const { BarChart: RechartsBarChart, Bar } = useChartComponents();
    const { gridStyle } = useChartTheme();
    const { hiddenSeries, handleLegendClick } = useSeriesVisibility();
    const margins = getChartMargins({ isHorizontal: layout === 'horizontal' });

    // Hover state for bidirectional legend-chart interaction
    const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

    const handleLegendHover = useCallback((index: number) => {
        setHoveredBarIndex(index);
    }, []);

    const handleLegendLeave = useCallback(() => {
        setHoveredBarIndex(null);
    }, []);

    // Resolve colors (CSS variables → actual color values for SVG attributes)
    const chartColors = useChartColors(yKeys.length, colors);

    // Recharts legend payload
    const legendPayload = useLegendPayload({
        keys: yKeys,
        names: yKeyNames,
        colors: chartColors,
    });

    const isHorizontal = layout === 'horizontal';
    const isStacked = grouping === 'stacked';

    return (
        <ChartShell
            ref={ref}
            width={width}
            height={height}
            className={cn(barChartVariants({ layout }), className)}
            role="img"
            aria-label={ariaLabel || `Bar chart showing ${yKeys.join(', ')}`}
            {...restProps}
        >
            <RechartsBarChart
                data={data}
                layout={isHorizontal ? 'vertical' : 'horizontal'}
                margin={margins}
                barGap={barGap}
                barCategoryGap={barCategoryGap}
            >
                {showGrid && (
                    <ChartGrid
                        horizontal={!isHorizontal}
                        vertical={isHorizontal}
                    />
                )}

                <ChartAxes
                    layout={isHorizontal ? 'vertical' : 'horizontal'}
                    xKey={isHorizontal ? undefined : xKey}
                    yKey={isHorizontal ? xKey : undefined}
                    showXAxis={showXAxis}
                    showYAxis={showYAxis}
                    xAxisFormatter={xAxisFormatter}
                    yAxisFormatter={yAxisFormatter}
                />

                <ChartTooltipLayer
                    show={showTooltip}
                    formatter={tooltipFormatter}
                    cursor={{ fill: semanticColors.border, opacity: 0.1 }}
                />

                <ChartLegendLayer
                    show={showLegend && yKeys.length > 1}
                    payload={legendPayload}
                    onClick={handleLegendClick}
                    onItemHover={handleLegendHover}
                    onItemLeave={handleLegendLeave}
                    activeIndex={hoveredBarIndex}
                    inactiveKeys={hiddenSeries}
                    position={legendPosition}
                />

                {yKeys.map((key: string, index: number) => {
                    const isHidden = hiddenSeries.includes(key);
                    const isHovered = hoveredBarIndex === index;
                    const isDimmed = hoveredBarIndex !== null && hoveredBarIndex !== index;
                    const barOpacity = isDimmed ? 0.3 : 1;

                    return (
                        <Bar
                            key={key}
                            dataKey={key}
                            name={yKeyNames?.[key] || key}
                            fill={chartColors[index]}
                            fillOpacity={barOpacity}
                            radius={[barRadius, barRadius, 0, 0]}
                            stackId={isStacked ? 'stack' : undefined}
                            isAnimationActive={animate}
                            animationDuration={animationDuration}
                            hide={isHidden}
                            onClick={onBarClick}
                            onMouseEnter={() => setHoveredBarIndex(index)}
                            onMouseLeave={() => setHoveredBarIndex(null)}
                            label={showLabels ? {
                                position: isHorizontal ? 'right' : 'top',
                                fill: semanticColors.text,
                                fontSize: 10,
                            } : false}
                        />
                    );
                })}
            </RechartsBarChart>
        </ChartShell>
    );
});

BarChart.displayName = 'BarChart';

export default BarChart;
