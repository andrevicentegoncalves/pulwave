import { useState, useCallback } from 'react';
import { cn } from '@pulwave/utils';
import { ChartShell } from '../../../primitives/ChartShell';
import { ChartAxes } from '../../../primitives/ChartAxes';
import { ChartGrid } from '../../../primitives/ChartGrid';
import { ChartTooltipLayer } from '../../../primitives/ChartTooltip';
import { ChartLegendLayer } from '../../../primitives/ChartLegend';
import { useChartContext, useChartComponents } from '../../../providers/ChartProvider';
import { getChartMargins } from '../../../utils/chartDefaults';

import { stepLineChartVariants, type StepLineChartProps, type SeriesConfig } from './types';
import './styles/_index.scss';

/**
 * StepLineChart Component
 * Line chart with step/staircase interpolation.
 * Uses ChartProvider for library abstraction.
 */
export const StepLineChart = ({
    data = [],
    xKey = 'name',
    dataKey = 'value',
    series = null,
    stepType = 'stepAfter',
    height = 300,
    showGrid = true,
    showLegend = false,
    showDots = true,
    strokeWidth = 2,
    color,
    valueFormatter = (v) => v?.toLocaleString() ?? '',
    className,
    ...props
}: StepLineChartProps) => {
    const { getColor } = useChartContext();
    const { LineChart, Line } = useChartComponents();
    const margins = getChartMargins();
    const primaryColor = color || getColor(0);

    // Hover state for bidirectional legend-chart interaction
    const [hoveredLineIndex, setHoveredLineIndex] = useState<number | null>(null);

    const handleLegendHover = useCallback((index: number) => {
        setHoveredLineIndex(index);
    }, []);

    const handleLegendLeave = useCallback(() => {
        setHoveredLineIndex(null);
    }, []);

    // Handle single or multi-series
    const lines = series || [{ key: dataKey as string, name: dataKey, color: primaryColor }];

    const legendPayload = lines.map((l: any, idx: number) => ({
        value: l.name || l.key,
        dataKey: l.key,
        color: l.color || getColor(idx),
    }));

    return (
        <ChartShell
            height={height}
            className={cn(stepLineChartVariants(), className)}
        >
            <LineChart data={data} margin={margins} {...props}>
                {showGrid && <ChartGrid />}

                <ChartAxes
                    layout="horizontal"
                    xKey={xKey}
                    yAxisFormatter={valueFormatter}
                />

                <ChartTooltipLayer
                    formatter={valueFormatter}
                />

                <ChartLegendLayer
                    show={showLegend}
                    payload={legendPayload}
                    onItemHover={handleLegendHover}
                    onItemLeave={handleLegendLeave}
                    activeIndex={hoveredLineIndex}
                    iconType="line"
                />

                {lines.map((line: any, idx: number) => {
                    const isHovered = hoveredLineIndex === idx;
                    const isDimmed = hoveredLineIndex !== null && hoveredLineIndex !== idx;
                    const lineOpacity = isDimmed ? 0.2 : 1;
                    const lineStrokeWidth = isHovered ? strokeWidth + 1 : strokeWidth;
                    const dotRadius = showDots ? (isHovered ? 5 : 4) : 0;
                    const lineColor = line.color || getColor(idx);

                    // Dot configs with hover callbacks for chart → legend interaction
                    const activeDotConfig = {
                        r: 6,
                        strokeWidth: 2,
                        stroke: 'white',
                        onMouseEnter: () => setHoveredLineIndex(idx),
                        onMouseLeave: () => setHoveredLineIndex(null),
                    };

                    const dotConfig = dotRadius > 0 ? {
                        fill: 'white',
                        stroke: lineColor,
                        strokeWidth: 2,
                        r: dotRadius,
                        onMouseEnter: () => setHoveredLineIndex(idx),
                        onMouseLeave: () => setHoveredLineIndex(null),
                    } : false;

                    return (
                        <Line
                            key={line.key}
                            type={stepType}
                            dataKey={line.key}
                            name={line.name || line.key}
                            stroke={lineColor}
                            strokeWidth={lineStrokeWidth}
                            strokeOpacity={lineOpacity}
                            dot={dotConfig}
                            activeDot={activeDotConfig}
                        />
                    );
                })}
            </LineChart>
        </ChartShell>
    );
};

export default StepLineChart;
