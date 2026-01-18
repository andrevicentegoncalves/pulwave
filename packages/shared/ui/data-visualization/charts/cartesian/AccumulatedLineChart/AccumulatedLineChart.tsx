import { useMemo, useState, useCallback } from 'react';
import { cn } from '@pulwave/utils';
import { ChartShell } from '../../../primitives/ChartShell';
import { ChartAxes } from '../../../primitives/ChartAxes';
import { ChartGrid } from '../../../primitives/ChartGrid';
import { ChartTooltipLayer } from '../../../primitives/ChartTooltip';
import { ChartLegendLayer } from '../../../primitives/ChartLegend';
import { useChartContext, useChartComponents } from '../../../providers/ChartProvider';
import { getChartMargins } from '../../../utils/chartDefaults';
import { accumulatedLineChartVariants, type AccumulatedLineChartProps, type SeriesConfig } from './types';
import './styles/_index.scss';

/**
 * AccumulatedLineChart Component
 * Displays cumulative/running totals over time.
 * Uses ChartProvider for library abstraction.
 */
export const AccumulatedLineChart = ({
    data = [],
    series = [],
    xKey = 'name',
    height = 400,
    showGrid = true,
    showLegend = true,
    showMarkers = true,
    valueSuffix = '',
    valueFormatter = (v) => `${v?.toLocaleString()}${valueSuffix ? ` ${valueSuffix}` : ''}`,
    className,
    ...props
}: AccumulatedLineChartProps) => {
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

    // Calculate accumulated values
    const accumulatedData = useMemo(() => {
        const totals: Record<string, number> = {};
        series.forEach((s) => { totals[s.key] = 0; });

        return data.map((item: any) => {
            const accumulated = { ...item };
            series.forEach((s: SeriesConfig) => {
                totals[s.key] += item[s.key] || 0;
                accumulated[`${s.key}_accumulated`] = totals[s.key];
            });
            return accumulated;
        });
    }, [data, series]);

    // Assign colors to series
    const coloredSeries = useMemo(() => {
        return series.map((s, i) => ({
            ...s,
            color: s.color || getColor(i),
            accKey: `${s.key}_accumulated`,
        }));
    }, [series, getColor]);

    const legendPayload = coloredSeries.map((s: any) => ({
        value: s.name || s.key,
        dataKey: s.accKey,
        color: s.color,
    }));

    return (
        <ChartShell
            height={height}
            className={cn(accumulatedLineChartVariants(), className)}
        >
            <LineChart data={accumulatedData} margin={margins} {...props}>
                {showGrid && <ChartGrid />}

                <ChartAxes
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

                {coloredSeries.map((s: any, idx: number) => {
                    const isHovered = hoveredLineIndex === idx;
                    const isDimmed = hoveredLineIndex !== null && hoveredLineIndex !== idx;
                    const lineOpacity = isDimmed ? 0.2 : 1;
                    const lineStrokeWidth = isHovered ? 3 : 2;
                    const dotRadius = showMarkers ? (isHovered ? 5 : 4) : 0;

                    // Dot configs with hover callbacks for chart → legend interaction
                    const activeDotConfig = {
                        r: 6,
                        onMouseEnter: () => setHoveredLineIndex(idx),
                        onMouseLeave: () => setHoveredLineIndex(null),
                    };

                    const dotConfig = dotRadius > 0 ? {
                        fill: s.color,
                        r: dotRadius,
                        onMouseEnter: () => setHoveredLineIndex(idx),
                        onMouseLeave: () => setHoveredLineIndex(null),
                    } : false;

                    return (
                        <Line
                            key={s.key}
                            type="monotone"
                            dataKey={s.accKey}
                            name={s.name || s.key}
                            stroke={s.color}
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

export default AccumulatedLineChart;
