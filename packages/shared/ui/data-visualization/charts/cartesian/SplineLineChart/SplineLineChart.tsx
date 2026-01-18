import { useState, useCallback } from 'react';
import { cn } from '@pulwave/utils';
import { ChartShell } from '../../../primitives/ChartShell';
import { ChartAxes } from '../../../primitives/ChartAxes';
import { ChartGrid } from '../../../primitives/ChartGrid';
import { ChartTooltipLayer } from '../../../primitives/ChartTooltip';
import { ChartLegendLayer } from '../../../primitives/ChartLegend';
import { useChartContext, useChartComponents } from '../../../providers/ChartProvider';
import { getChartMargins } from '../../../utils/chartDefaults';

import { splineLineChartVariants, type SplineLineChartProps, type SeriesConfig } from './types';
import './styles/_index.scss';

/**
 * SplineLineChart Component
 * Line chart with smooth spline/curve interpolation.
 * Uses ChartProvider for library abstraction.
 */
export const SplineLineChart = ({
    data = [],
    xKey = 'name',
    series = [],
    height = 300,
    showGrid = true,
    showLegend = true,
    showDots = true,
    strokeWidth = 3,
    curveType = 'monotone',
    valueFormatter = (v) => v?.toLocaleString() ?? '',
    className,
    ...props
}: SplineLineChartProps) => {
    const { getColor } = useChartContext();
    const { LineChart, Line } = useChartComponents();
    const margins = getChartMargins();

    // Hover state for bidirectional legend-chart interaction
    const [hoveredLineIndex, setHoveredLineIndex] = useState<number | null>(null);

    const handleLegendHover = useCallback((index: number) => {
        setHoveredLineIndex(index);
    }, []);

    const handleLegendLeave = useCallback(() => {
        setHoveredLineIndex(null);
    }, []);

    const legendPayload = series.map((s: SeriesConfig, idx: number) => ({
        value: s.name || s.key,
        dataKey: s.key,
        color: s.color || getColor(idx),
    }));

    return (
        <ChartShell
            height={height}
            className={cn(splineLineChartVariants(), className)}
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

                {series.map((s: SeriesConfig, idx: number) => {
                    const isHovered = hoveredLineIndex === idx;
                    const isDimmed = hoveredLineIndex !== null && hoveredLineIndex !== idx;
                    const lineOpacity = isDimmed ? 0.2 : 1;
                    const lineStrokeWidth = isHovered ? strokeWidth + 1 : strokeWidth;
                    const dotRadius = showDots ? (isHovered ? 5 : 4) : 0;
                    const seriesColor = s.color || getColor(idx);

                    // Dot configs with hover callbacks for chart → legend interaction
                    const activeDotConfig = {
                        r: 6,
                        strokeWidth: 2,
                        stroke: 'white',
                        onMouseEnter: () => setHoveredLineIndex(idx),
                        onMouseLeave: () => setHoveredLineIndex(null),
                    };

                    const dotConfig = dotRadius > 0 ? {
                        fill: seriesColor,
                        strokeWidth: 0,
                        r: dotRadius,
                        onMouseEnter: () => setHoveredLineIndex(idx),
                        onMouseLeave: () => setHoveredLineIndex(null),
                    } : false;

                    return (
                        <Line
                            key={s.key}
                            type={curveType}
                            dataKey={s.key}
                            name={s.name || s.key}
                            stroke={seriesColor}
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

export default SplineLineChart;
