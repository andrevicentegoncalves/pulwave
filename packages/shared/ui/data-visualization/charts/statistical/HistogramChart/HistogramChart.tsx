import React, { useMemo, useState } from 'react';
import { cn } from '@pulwave/utils';
import { ChartShell } from '../../../primitives/ChartShell';
import { ChartGrid } from '../../../primitives/ChartGrid';
import { ChartTooltipLayer } from '../../../primitives/ChartTooltip';
import { useChartContext, useChartComponents } from '../../../providers/ChartProvider';
import { getChartMargins } from '../../../utils/chartDefaults';
import { histogramChartVariants, type HistogramChartProps } from './types';
import './styles/_index.scss';

/**
 * HistogramChart Component
 * 
 * Displays frequency distribution of continuous data in bins.
 * Uses ChartProvider for library abstraction.
 */
export const HistogramChart = ({
    data = [],
    bins = 10,
    height = 400,
    color,
    showGrid = true,
    showMean = true,
    showMedian = false,
    valueFormatter = (v) => v?.toLocaleString() ?? '',
    className,
    ...props
}: HistogramChartProps) => {
    const { getColor, semanticColors } = useChartContext();
    const { BarChart, Bar, XAxis, YAxis, Cell } = useChartComponents();
    const margins = getChartMargins({ hasAxisLabels: true });

    const barColor = color || getColor(0);
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);

    // Calculate histogram bins
    const histogramData = useMemo(() => {
        if (!data.length) return [];

        const min = Math.min(...data);
        const max = Math.max(...data);
        const binWidth = ((max - min) / (bins as number)) || 1;

        const binData = Array.from({ length: bins as number }, (_, i) => ({
            binStart: min + i * binWidth,
            binEnd: min + (i + 1) * binWidth,
            label: `${(min + i * binWidth).toFixed(1)}-${(min + (i + 1) * binWidth).toFixed(1)}`,
            count: 0,
        }));

        data.forEach((value: number) => {
            const binIndex = Math.min(
                Math.floor((value - min) / binWidth),
                (bins as number) - 1
            );
            if (binIndex >= 0 && binIndex < (bins as number)) {
                binData[binIndex].count++;
            }
        });

        return binData;
    }, [data, bins]);

    const stats = useMemo(() => {
        if (!data.length) return { mean: 0, median: 0 };
        const sorted = [...data].sort((a, b) => a - b);
        const n = sorted.length;
        const mean = data.reduce((sum: number, v: number) => sum + v, 0) / n;
        const median = n % 2 === 0
            ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
            : sorted[Math.floor(n / 2)];
        return { mean, median };
    }, [data]);

    return (
        <ChartShell
            height={height}
            className={cn(histogramChartVariants(), className)}
        >
            <BarChart
                data={histogramData}
                margin={margins}
                barGap={0}
                barCategoryGap="0%"
                {...props}
            >
                {showGrid && <ChartGrid />}

                <XAxis
                    dataKey="label"
                    tick={{ fill: semanticColors.text, fontSize: 12 }}
                    axisLine={{ stroke: semanticColors.grid }}
                    tickLine={false}
                    angle={-45}
                    textAnchor="end"
                    interval={0}
                />
                <YAxis
                    tick={{ fill: semanticColors.text, fontSize: 12 }}
                    axisLine={{ stroke: semanticColors.grid }}
                    tickFormatter={valueFormatter}
                    label={{
                        value: 'Frequency',
                        angle: -90,
                        position: 'insideLeft',
                        fill: semanticColors.text,
                        fontSize: 12,
                    }}
                />
                <ChartTooltipLayer
                    formatter={(v: any) => valueFormatter(v)}
                />
                <Bar
                    dataKey="count"
                    fill={barColor}
                    radius={0}
                    maxBarSize={999}
                    onMouseEnter={(_: any, index: number) => setHoverIndex(index)}
                    onMouseLeave={() => setHoverIndex(null)}
                >
                    {histogramData.map((_item: any, index: number) => (
                        <Cell
                            key={index}
                            fill={barColor}
                            className={cn('chart--histogram__bar-cell', {
                                'chart--histogram__bar-cell--hovered': hoverIndex === index
                            })}
                        />
                    ))}
                </Bar>
            </BarChart>

            {(showMean || showMedian) && (
                <div className="chart--histogram__stats">
                    {showMean && (
                        <span>
                            <strong>Mean:</strong> {stats.mean.toFixed(2)}
                        </span>
                    )}
                    {showMedian && (
                        <span>
                            <strong>Median:</strong> {stats.median.toFixed(2)}
                        </span>
                    )}
                </div>
            )}
        </ChartShell>
    );
};

export default HistogramChart;
