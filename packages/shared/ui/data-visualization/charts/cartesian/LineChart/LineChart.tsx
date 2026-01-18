import React, { useState, useCallback, forwardRef } from 'react';
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
import { getChartMargins } from '../../../utils/chartDefaults';
import { cn } from '@pulwave/utils';
import { lineChartVariants, type LineChartProps } from './types';
import './styles/_index.scss';

/**
 * LineChart Component
 * Displays data as connected lines with optional area fill.
 * Uses ChartProvider for library abstraction.
 */
export const LineChart = forwardRef<HTMLDivElement, LineChartProps>(({
    data = [],
    xKey,
    yKeys = [],
    yKeyNames = {},
    width = '100%',
    height = 300,
    variant = 'line',
    smooth = true,
    showDots = true,
    dotSize = 4,
    strokeWidth = 2,
    showGrid = true,
    showXAxis = true,
    showYAxis = true,
    showTooltip = true,
    showLegend = true,
    legendPosition = 'bottom',
    stacking = 'none',
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
    const { LineChart: RechartsLineChart, Line } = useChartComponents();
    const { gridStyle } = useChartTheme();
    const { hiddenSeries, handleLegendClick, isHidden } = useSeriesVisibility();
    const margins = getChartMargins();

    // Hover state for bidirectional legend-chart interaction
    const [hoveredLineIndex, setHoveredLineIndex] = useState<number | null>(null);

    const handleLegendHover = useCallback((index: number) => {
        setHoveredLineIndex(index);
    }, []);

    const handleLegendLeave = useCallback(() => {
        setHoveredLineIndex(null);
    }, []);

    // Resolve colors (CSS variables → actual color values for SVG attributes)
    const chartColors = useChartColors(yKeys.length, colors);

    // Recharts legend payload for custom legend
    const legendPayload = useLegendPayload({
        keys: yKeys,
        names: yKeyNames,
        colors: chartColors,
    });

    const isArea = variant === 'area';

    return (
        <ChartShell
            ref={ref}
            width={width}
            height={height}
            className={cn(lineChartVariants({ variant }), className)}
            role="img"
            aria-label={ariaLabel || `Line chart showing ${yKeys.join(', ')}`}
            {...restProps}
        >
            <RechartsLineChart
                data={data}
                margin={margins}
                {...restProps}
            >
                {showGrid && <ChartGrid vertical={false} />}

                <ChartAxes
                    layout="horizontal"
                    xKey={xKey}
                    showXAxis={showXAxis}
                    showYAxis={showYAxis}
                    xAxisFormatter={xAxisFormatter}
                    yAxisFormatter={yAxisFormatter}
                />

                <ChartTooltipLayer
                    show={showTooltip}
                    formatter={tooltipFormatter}
                    cursor={false}
                />

                <ChartLegendLayer
                    show={showLegend}
                    payload={legendPayload}
                    onClick={handleLegendClick}
                    onItemHover={handleLegendHover}
                    onItemLeave={handleLegendLeave}
                    activeIndex={hoveredLineIndex}
                    inactiveKeys={hiddenSeries}
                    position={legendPosition}
                    iconType="line"
                />

                {yKeys.map((key: string, index: number) => {
                    const hidden = isHidden(key);
                    const isHovered = hoveredLineIndex === index;
                    const isDimmed = hoveredLineIndex !== null && hoveredLineIndex !== index;
                    const lineOpacity = isDimmed ? 0.2 : 1;
                    const lineStrokeWidth = hidden ? 0 : isHovered ? strokeWidth + 1 : strokeWidth;
                    const dotRadius = showDots && !hidden ? (isHovered ? dotSize + 1 : dotSize) : 0;

                    // activeDot with hover callbacks for chart → legend interaction
                    const activeDotConfig = !hidden ? {
                        r: dotSize + 2,
                        onMouseEnter: () => setHoveredLineIndex(index),
                        onMouseLeave: () => setHoveredLineIndex(null),
                    } : false;

                    // Regular dot with hover callbacks
                    const dotConfig = dotRadius > 0 ? {
                        r: dotRadius,
                        fill: chartColors[index],
                        onMouseEnter: () => setHoveredLineIndex(index),
                        onMouseLeave: () => setHoveredLineIndex(null),
                    } : false;

                    if (isArea) {
                        return (
                            <React.Fragment key={key}>
                                <defs>
                                    <linearGradient id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={chartColors[index]} stopOpacity={0.3} />
                                        <stop offset="95%" stopColor={chartColors[index]} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Line
                                    type={smooth ? 'monotone' : 'linear'}
                                    dataKey={key}
                                    name={yKeyNames[key] || key}
                                    stroke={chartColors[index]}
                                    strokeWidth={lineStrokeWidth}
                                    strokeOpacity={lineOpacity}
                                    fill={`url(#gradient-${key})`}
                                    fillOpacity={lineOpacity}
                                    dot={dotConfig}
                                    activeDot={activeDotConfig}
                                    isAnimationActive={animate}
                                    animationDuration={animationDuration}
                                    hide={hidden}
                                    onClick={onDataPointClick}
                                />
                            </React.Fragment>
                        );
                    }

                    return (
                        <Line
                            key={key}
                            type={smooth ? 'monotone' : 'linear'}
                            dataKey={key}
                            name={yKeyNames[key] || key}
                            stroke={chartColors[index]}
                            strokeWidth={lineStrokeWidth}
                            strokeOpacity={lineOpacity}
                            dot={dotConfig}
                            activeDot={activeDotConfig}
                            isAnimationActive={animate}
                            animationDuration={animationDuration}
                            hide={hidden}
                            onClick={onDataPointClick}
                        />
                    );
                })}
            </RechartsLineChart>
        </ChartShell>
    );
});

LineChart.displayName = 'LineChart';

export default LineChart;
