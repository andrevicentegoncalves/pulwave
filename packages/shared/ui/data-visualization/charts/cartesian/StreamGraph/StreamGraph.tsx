import { useMemo } from 'react';
import { cn } from '@pulwave/utils';
import { ChartShell } from '../../../primitives/ChartShell';
import { ChartAxes } from '../../../primitives/ChartAxes';
import { ChartTooltipLayer } from '../../../primitives/ChartTooltip';
import { useChartContext, useChartComponents } from '../../../providers/ChartProvider';
import { getChartMargins } from '../../../utils/chartDefaults';

import { streamGraphVariants, type StreamGraphProps, type SeriesConfig } from './types';
import './styles/_index.scss';

/**
 * StreamGraph Component
 * A stacked area chart with flowing curves centered around a baseline.
 * Uses ChartProvider for library abstraction.
 */
export const StreamGraph = ({
    data = [],
    series = [],
    xKey = 'date',
    height = 400,
    showLabels = true,
    curved = true,
    valueFormatter = (v) => v?.toLocaleString() ?? '',
    className,
    ...props
}: StreamGraphProps) => {
    const { getColor, semanticColors } = useChartContext();
    const { AreaChart, Area } = useChartComponents();
    const margins = getChartMargins();

    // Assign colors to series
    const coloredSeries = useMemo(() => {
        return series.map((item: any, i: number) => {
            if (typeof item === 'string') {
                return { key: item, name: item, color: getColor(i) };
            }
            return {
                key: item.key,
                name: item.name || item.key,
                color: item.color || getColor(i),
            };
        });
    }, [series, getColor]);

    return (
        <ChartShell
            height={height}
            className={cn(streamGraphVariants(), className)}
        >
            <AreaChart
                data={data}
                stackOffset="silhouette"
                margin={margins}
                {...props}
            >
                <ChartAxes
                    layout="horizontal"
                    xKey={xKey}
                    showYAxis={false}
                />

                <ChartTooltipLayer
                    formatter={valueFormatter}
                />

                {coloredSeries.map((s: any) => (
                    <Area
                        key={s.key}
                        type={curved ? 'monotone' : 'linear'}
                        dataKey={s.key}
                        stackId="1"
                        fill={s.color}
                        stroke={s.color}
                        fillOpacity={0.8}
                    />
                ))}
            </AreaChart>
        </ChartShell>
    );
};

export default StreamGraph;
