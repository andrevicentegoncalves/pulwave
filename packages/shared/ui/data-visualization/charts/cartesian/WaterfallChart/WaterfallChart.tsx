import { useState, useMemo } from 'react';
import { cn } from '@pulwave/utils';
import { ChartShell } from '../../../primitives/ChartShell';
import { ChartAxes } from '../../../primitives/ChartAxes';
import { ChartGrid } from '../../../primitives/ChartGrid';
import { ChartTooltipLayer } from '../../../primitives/ChartTooltip';
import { useChartContext, useChartComponents } from '../../../providers/ChartProvider';
import { useChartTheme } from '../../../hooks/useChartTheme';

import { waterfallChartVariants, type WaterfallChartProps } from './types';
import './styles/_index.scss';

/**
 * WaterfallChart Component
 * Displays running total with positive and negative changes.
 * Uses ChartProvider for library abstraction.
 */
export const WaterfallChart = ({
    data = [],
    valueKey = 'value',
    deltaKey = 'delta',
    nameKey = 'name',
    height = 300,
    showGrid = true,
    showConnectors = true,
    valueFormatter = (v) => v?.toLocaleString() ?? '',
    positiveColor = 'var(--chart-status-success)',
    negativeColor = 'var(--chart-status-error)',
    totalColor = 'var(--chart-color-1)',
    className,
    ...props
}: WaterfallChartProps) => {
    const { semanticColors, config } = useChartContext();
    const { ComposedChart, Bar, ReferenceLine, Cell } = useChartComponents();
    const { gridStyle, axisStyle } = useChartTheme();
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    // Process data for waterfall chart
    const chartData = useMemo(() => {
        let runningTotal = 0;

        return data.map((item: any, index: number) => {
            const isStart = index === 0 && item[valueKey] !== undefined;
            const isTotal = item.total;
            const delta = item[deltaKey] || 0;

            if (isStart) {
                runningTotal = item[valueKey];
                return {
                    ...item,
                    start: 0,
                    end: runningTotal,
                    value: runningTotal,
                    isPositive: true,
                    isTotal: false,
                    isStart: true,
                };
            }

            if (isTotal) {
                return {
                    ...item,
                    start: 0,
                    end: runningTotal,
                    value: runningTotal,
                    isPositive: runningTotal >= 0,
                    isTotal: true,
                    isStart: false,
                };
            }

            const start = delta >= 0 ? runningTotal : runningTotal + delta;
            runningTotal += delta;

            return {
                ...item,
                start,
                end: delta >= 0 ? runningTotal : runningTotal - delta,
                value: Math.abs(delta),
                delta,
                isPositive: delta >= 0,
                isTotal: false,
                isStart: false,
            };
        });
    }, [data, valueKey, deltaKey]);

    // Custom bar component
    const CustomBar = (barProps: any) => {
        const { x, y, width, height: h, fill, index, payload } = barProps;
        const barY = payload.isPositive || payload.isStart || payload.isTotal
            ? y
            : y + (payload.start - payload.end);

        return (
            <g>
                <rect
                    x={x}
                    y={barY}
                    width={width}
                    height={Math.abs(h)}
                    fill={fill}
                    rx={4}
                    className="chart-waterfall__bar"
                    fillOpacity={activeIndex === index ? 1 : 0.9}
                />
            </g>
        );
    };

    const getBarColor = (entry: any) => {
        if (entry.isTotal || entry.isStart) return totalColor;
        return entry.isPositive ? positiveColor : negativeColor;
    };

    return (
        <ChartShell
            height={height}
            className={cn(waterfallChartVariants(), className)}
        >
            <ComposedChart
                data={chartData}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                onMouseMove={(state: any) => {
                    if (state?.activeTooltipIndex !== undefined) {
                        setActiveIndex(state.activeTooltipIndex);
                    }
                }}
                onMouseLeave={() => setActiveIndex(null)}
                {...props}
            >
                {showGrid && <ChartGrid vertical={false} />}

                <ChartAxes
                    xKey={nameKey}
                    yAxisFormatter={valueFormatter}
                />

                <ReferenceLine y={0} stroke={gridStyle.stroke} />

                <ChartTooltipLayer
                    formatter={valueFormatter}
                />

                <Bar
                    dataKey="start"
                    stackId="stack"
                    fill="transparent"
                    isAnimationActive={false}
                />

                <Bar
                    dataKey="value"
                    stackId="stack"
                    shape={<CustomBar />}
                    isAnimationActive={config.animate}
                    animationDuration={config.animationDuration}
                >
                    {chartData.map((entry: any, index: number) => (
                        <Cell key={index} fill={getBarColor(entry)} />
                    ))}
                </Bar>
            </ComposedChart>
        </ChartShell>
    );
};

export default WaterfallChart;
