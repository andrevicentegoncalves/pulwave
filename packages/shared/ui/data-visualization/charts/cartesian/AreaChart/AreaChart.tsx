import React, { forwardRef, useState, useCallback } from 'react';
import { ChartShell } from '../../../primitives/ChartShell';
import { ChartAxes } from '../../../primitives/ChartAxes';
import { ChartGrid } from '../../../primitives/ChartGrid';
import { ChartDefs } from '../../../primitives/ChartDefs';
import { useChartComponents } from '../../../providers/ChartProvider';
import { useChartTheme } from '../../../hooks/useChartTheme';
import { useSeriesVisibility } from '../../../hooks/useSeriesVisibility';
import { useChartColors } from '../../../hooks/useChartColors';
import { useLegendPayload } from '../../../hooks/useLegendPayload';
import { useResolvedSemanticColors } from '../../../hooks/useResolvedSemanticColors';
import { getChartMargins } from '../../../utils/chartDefaults';
import { ChartTooltipLayer } from '../../../primitives/ChartTooltip';
import { ChartLegendLayer } from '../../../primitives/ChartLegend';
import { cn } from '@pulwave/utils';
import { areaChartVariants, type AreaChartProps } from './types';
import './styles/_index.scss';

/**
 * AreaChart Component
 * Displays data as filled areas under lines.
 * Supports stacked and normalized modes.
 * 
 * @example
 * <AreaChart 
 *   data={[{ month: 'Jan', sales: 100, revenue: 80 }]}
 *   xKey="month"
 *   yKeys={['sales', 'revenue']}
 *   stacking="normal"
 * />
 */
export const AreaChart = forwardRef<HTMLDivElement, AreaChartProps>(({
    data = [],
    xKey,
    yKeys = [],
    yKeyNames = {},
    width = '100%',
    height = 300,
    stacking = 'none',
    smooth = true,
    fillOpacity = 0.3,
    strokeWidth = 2,
    showGrid = true,
    showXAxis = true,
    showYAxis = true,
    showTooltip = true,
    showLegend = true,
    legendPosition = 'bottom',
    colors,
    animate = true,
    animationDuration = 400,
    xAxisFormatter,
    yAxisFormatter,
    tooltipFormatter,
    onDataPointClick,
    className,
    ariaLabel,
    ...restProps
}, ref) => {
    const semanticColors = useResolvedSemanticColors();
    const { AreaChart: RechartsAreaChart, Area } = useChartComponents();
    const { hiddenSeries, handleLegendClick, isHidden } = useSeriesVisibility();
    const margins = getChartMargins();

    // Hover state for bidirectional legend-chart interaction
    const [hoveredAreaIndex, setHoveredAreaIndex] = useState<number | null>(null);

    const handleLegendHover = useCallback((index: number) => {
        setHoveredAreaIndex(index);
    }, []);

    const handleLegendLeave = useCallback(() => {
        setHoveredAreaIndex(null);
    }, []);

    // Use centralized hooks
    const chartColors = useChartColors(yKeys.length, colors);
    const legendPayload = useLegendPayload({
        keys: yKeys,
        names: yKeyNames,
        colors: chartColors,
        inactiveKeys: hiddenSeries,
    });

    const stackId = stacking !== 'none' ? 'stack' : undefined;
    const yFormatter = stacking === 'percent'
        ? (v: number) => `${(v * 100).toFixed(0)}%`
        : yAxisFormatter;

    return (
        <ChartShell
            ref={ref}
            width={width}
            height={height}
            className={cn(areaChartVariants({ stacking }), className)}
            role="img"
            aria-label={ariaLabel || `Area chart showing ${yKeys.join(', ')}`}
            {...restProps}
        >
            <RechartsAreaChart
                data={data}
                margin={margins}
                stackOffset={stacking === 'percent' ? 'expand' : undefined}
                {...restProps}
            >
                {/* SVG Gradient Definitions */}
                <ChartDefs areaColors={chartColors} areaOpacity={fillOpacity} />

                {/* Grid */}
                {showGrid && (
                    <ChartGrid horizontal vertical={false} />
                )}

                {/* Axes */}
                <ChartAxes
                    layout="horizontal"
                    xKey={xKey}
                    showXAxis={showXAxis}
                    showYAxis={showYAxis}
                    xAxisFormatter={xAxisFormatter}
                    yAxisFormatter={yFormatter}
                />

                {/* Tooltip */}
                <ChartTooltipLayer
                    show={showTooltip}
                    formatter={tooltipFormatter}
                    cursor={{ stroke: semanticColors.border, strokeDasharray: '4 4' }}
                />

                {/* Legend */}
                <ChartLegendLayer
                    show={showLegend}
                    payload={legendPayload}
                    onClick={handleLegendClick}
                    onItemHover={handleLegendHover}
                    onItemLeave={handleLegendLeave}
                    activeIndex={hoveredAreaIndex}
                    inactiveKeys={hiddenSeries}
                    position={legendPosition}
                    iconType="line"
                />

                {/* Area Series */}
                {yKeys.map((key: string, index: number) => {
                    const hidden = isHidden(key);
                    const isHovered = hoveredAreaIndex === index;
                    const isDimmed = hoveredAreaIndex !== null && hoveredAreaIndex !== index;
                    const areaOpacity = isDimmed ? 0.2 : 1;
                    const areaStrokeWidth = hidden ? 0 : isHovered ? strokeWidth + 1 : strokeWidth;

                    return (
                        <Area
                            key={key}
                            type={smooth ? 'monotone' : 'linear'}
                            dataKey={key}
                            name={yKeyNames[key] || key}
                            stroke={chartColors[index]}
                            strokeWidth={areaStrokeWidth}
                            strokeOpacity={areaOpacity}
                            fill={`url(#area-gradient-${index})`}
                            fillOpacity={hidden ? 0 : isDimmed ? fillOpacity * 0.3 : 1}
                            stackId={stackId}
                            isAnimationActive={animate}
                            animationDuration={animationDuration}
                            hide={hidden}
                            onClick={onDataPointClick}
                            onMouseEnter={() => setHoveredAreaIndex(index)}
                            onMouseLeave={() => setHoveredAreaIndex(null)}
                        />
                    );
                })}
            </RechartsAreaChart>
        </ChartShell>
    );
});

AreaChart.displayName = 'AreaChart';

export default AreaChart;
