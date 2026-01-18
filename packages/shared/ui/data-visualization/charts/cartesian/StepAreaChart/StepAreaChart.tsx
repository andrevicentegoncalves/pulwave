import { cn } from '@pulwave/utils';
import { ChartShell } from '../../../primitives/ChartShell';
import { ChartAxes } from '../../../primitives/ChartAxes';
import { ChartGrid } from '../../../primitives/ChartGrid';
import { ChartTooltipLayer } from '../../../primitives/ChartTooltip';
import { ChartLegendLayer } from '../../../primitives/ChartLegend';
import { useChartContext, useChartComponents } from '../../../providers/ChartProvider';
import { getChartMargins } from '../../../utils/chartDefaults';

import { stepAreaChartVariants, type StepAreaChartProps, type SeriesConfig } from './types';
import './styles/_index.scss';

/**
 * StepAreaChart Component
 * Area chart using step interpolation (staircase pattern).
 * Uses ChartProvider for library abstraction.
 */
export const StepAreaChart = ({
    data = [],
    xKey = 'name',
    dataKey = 'value',
    dataKeys = null,
    stepType = 'stepAfter',
    height = 300,
    showGrid = true,
    showLegend = false,
    fillOpacity = 0.4,
    strokeWidth = 2,
    color,
    valueFormatter = (v) => v?.toLocaleString() ?? '',
    className,
    ...props
}: StepAreaChartProps) => {
    const { getColor, semanticColors } = useChartContext();
    const { AreaChart, Area } = useChartComponents();
    const margins = getChartMargins();
    const primaryColor = color || getColor(0);

    // Handle single or multi-series
    const series = dataKeys || [{ key: dataKey as string, name: dataKey, color: primaryColor }];

    const legendPayload = series.map((s: any, idx: number) => ({
        value: s.name || s.key,
        dataKey: s.key,
        color: s.color || getColor(idx),
    }));

    return (
        <ChartShell
            height={height}
            className={cn(stepAreaChartVariants(), className)}
        >
            <AreaChart data={data} margin={margins} {...props}>
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
                    iconType="line"
                />

                {series.map((s: any, idx: number) => (
                    <Area
                        key={s.key}
                        type={stepType}
                        dataKey={s.key}
                        name={s.name || s.key}
                        stroke={s.color || getColor(idx)}
                        fill={s.color || getColor(idx)}
                        fillOpacity={fillOpacity}
                        strokeWidth={strokeWidth}
                    />
                ))}
            </AreaChart>
        </ChartShell>
    );
};

export default StepAreaChart;
