import { useMemo } from 'react';
import { cn } from '@pulwave/utils';
import { ChartShell } from '../../../primitives/ChartShell';
import { ChartAxes } from '../../../primitives/ChartAxes';
import { ChartGrid } from '../../../primitives/ChartGrid';
import { ChartTooltipLayer } from '../../../primitives/ChartTooltip';
import { useChartContext, useChartComponents } from '../../../providers/ChartProvider';
import { getChartMargins } from '../../../utils/chartDefaults';

import { thresholdAreaChartVariants, type ThresholdAreaChartProps } from './types';
import './styles/_index.scss';

/**
 * ThresholdAreaChart Component
 * Area chart showing values above/below a threshold in different colors.
 * Uses ChartProvider for library abstraction.
 */
export const ThresholdAreaChart = ({
    data = [],
    dataKey = 'value',
    xKey = 'name',
    threshold = 0,
    thresholdLabel,
    aboveColor = 'var(--chart-status-success)',
    belowColor = 'var(--chart-status-error)',
    height = 400,
    showGrid = true,
    valueFormatter = (v) => v?.toLocaleString() ?? '',
    className,
    ...props
}: ThresholdAreaChartProps) => {
    const { semanticColors } = useChartContext();
    const { AreaChart, Area, ReferenceLine } = useChartComponents();
    const margins = getChartMargins();

    // Split data into above and below threshold
    const processedData = useMemo(() => {
        return data.map((item: any) => ({
            ...item,
            above: item[dataKey] >= threshold ? item[dataKey] : threshold,
            below: item[dataKey] < threshold ? item[dataKey] : threshold,
        }));
    }, [data, dataKey, threshold]);

    return (
        <ChartShell
            height={height}
            className={cn(thresholdAreaChartVariants(), className)}
        >
            {thresholdLabel && (
                <div className="chart--threshold-area__threshold-label">
                    {thresholdLabel}
                </div>
            )}
            <AreaChart
                data={processedData}
                margin={margins}
                {...props}
            >
                {showGrid && <ChartGrid />}

                <ChartAxes
                    layout="horizontal"
                    xKey={xKey}
                    yAxisFormatter={valueFormatter}
                />

                <ReferenceLine
                    y={threshold}
                    stroke={semanticColors.text}
                    strokeDasharray="5 5"
                    strokeOpacity={0.5}
                />

                <ChartTooltipLayer
                    formatter={valueFormatter}
                />

                <defs>
                    <linearGradient id="aboveGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={aboveColor} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={aboveColor} stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="belowGradient" x1="0" y1="1" x2="0" y2="0">
                        <stop offset="5%" stopColor={belowColor} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={belowColor} stopOpacity={0.1} />
                    </linearGradient>
                </defs>

                <Area
                    type="monotone"
                    dataKey="above"
                    stroke={aboveColor}
                    fill="url(#aboveGradient)"
                    strokeWidth={2}
                    baseLine={threshold}
                />
                <Area
                    type="monotone"
                    dataKey="below"
                    stroke={belowColor}
                    fill="url(#belowGradient)"
                    strokeWidth={2}
                    baseLine={threshold}
                />
            </AreaChart>
        </ChartShell>
    );
};

export default ThresholdAreaChart;
