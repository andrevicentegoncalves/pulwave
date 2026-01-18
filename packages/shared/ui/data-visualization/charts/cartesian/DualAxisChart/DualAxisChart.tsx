import { useState, useCallback } from 'react';
import { cn } from '@pulwave/utils';
import { ChartShell } from '../../../primitives/ChartShell';
import { ChartGrid } from '../../../primitives/ChartGrid';
import { ChartTooltipLayer } from '../../../primitives/ChartTooltip';
import { ChartLegendLayer } from '../../../primitives/ChartLegend';
import { useChartContext, useChartComponents } from '../../../providers/ChartProvider';
import { getChartMargins } from '../../../utils/chartDefaults';

import { dualAxisChartVariants, type DualAxisChartProps } from './types';
import './styles/_index.scss';

/**
 * DualAxisChart Component
 * Displays two data series with different scales on left and right Y-axes.
 * Uses ChartProvider for library abstraction.
 */
export const DualAxisChart = ({
    data = [],
    barKey = 'value1',
    lineKey = 'value2',
    xKey = 'name',
    barName = 'Series 1',
    lineName = 'Series 2',
    barColor,
    lineColor,
    height = 400,
    showGrid = true,
    showLegend = true,
    barValueFormatter = (v) => v?.toLocaleString() ?? '',
    lineValueFormatter = (v) => v?.toLocaleString() ?? '',
    className,
    ...props
}: DualAxisChartProps) => {
    const { getColor, semanticColors } = useChartContext();
    const { ComposedChart, Bar, Line, XAxis, YAxis } = useChartComponents();
    const margins = getChartMargins({ hasDualAxis: true });

    // Hover state for bidirectional legend-chart interaction
    const [hoveredSeriesIndex, setHoveredSeriesIndex] = useState<number | null>(null);

    const handleLegendHover = useCallback((index: number) => {
        setHoveredSeriesIndex(index);
    }, []);

    const handleLegendLeave = useCallback(() => {
        setHoveredSeriesIndex(null);
    }, []);

    const bar = barColor || getColor(0);
    const line = lineColor || getColor(1);

    const legendPayload = [
        { value: barName, dataKey: barKey, color: bar },
        { value: lineName, dataKey: lineKey, color: line },
    ];

    // Hover states for bar (index 0) and line (index 1)
    const isBarHovered = hoveredSeriesIndex === 0;
    const isLineHovered = hoveredSeriesIndex === 1;
    const isBarDimmed = hoveredSeriesIndex !== null && hoveredSeriesIndex !== 0;
    const isLineDimmed = hoveredSeriesIndex !== null && hoveredSeriesIndex !== 1;

    // Dot configs for line with hover callbacks
    const dotConfig = {
        fill: line,
        strokeWidth: 2,
        r: isLineHovered ? 5 : 4,
        onMouseEnter: () => setHoveredSeriesIndex(1),
        onMouseLeave: () => setHoveredSeriesIndex(null),
    };

    const activeDotConfig = {
        r: 6,
        onMouseEnter: () => setHoveredSeriesIndex(1),
        onMouseLeave: () => setHoveredSeriesIndex(null),
    };

    return (
        <ChartShell
            height={height}
            className={cn(dualAxisChartVariants(), className)}
        >
            <ComposedChart data={data} margin={margins} {...props}>
                {showGrid && <ChartGrid />}

                <XAxis
                    dataKey={xKey}
                    tick={{ fill: semanticColors.text, fontSize: 12 }}
                    axisLine={{ stroke: semanticColors.grid }}
                    tickLine={false}
                />
                <YAxis
                    yAxisId="left"
                    tick={{ fill: semanticColors.text, fontSize: 12 }}
                    axisLine={{ stroke: semanticColors.grid }}
                    tickFormatter={barValueFormatter}
                />
                <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fill: semanticColors.text, fontSize: 12 }}
                    axisLine={{ stroke: semanticColors.grid }}
                    tickFormatter={lineValueFormatter}
                />

                <ChartTooltipLayer
                    formatter={(value, name) =>
                        name === barKey ? barValueFormatter(value) : lineValueFormatter(value)
                    }
                />

                <ChartLegendLayer
                    show={showLegend}
                    payload={legendPayload}
                    onItemHover={handleLegendHover}
                    onItemLeave={handleLegendLeave}
                    activeIndex={hoveredSeriesIndex}
                    iconType="line"
                />

                <Bar
                    yAxisId="left"
                    dataKey={barKey}
                    name={barName}
                    fill={bar}
                    fillOpacity={isBarDimmed ? 0.2 : 1}
                    radius={[4, 4, 0, 0]}
                    onMouseEnter={() => setHoveredSeriesIndex(0)}
                    onMouseLeave={() => setHoveredSeriesIndex(null)}
                />
                <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey={lineKey}
                    name={lineName}
                    stroke={line}
                    strokeWidth={isLineHovered ? 3 : 2}
                    strokeOpacity={isLineDimmed ? 0.2 : 1}
                    dot={dotConfig}
                    activeDot={activeDotConfig}
                />
            </ComposedChart>
        </ChartShell>
    );
};

export default DualAxisChart;
