import React, { useMemo, forwardRef } from 'react';
import { ChartShell } from '../../../primitives/ChartShell';
import { ChartTooltipLayer } from '../../../primitives/ChartTooltip';
import { useChartContext, useChartComponents } from '../../../providers/ChartProvider';
import { useChartColors } from '../../../hooks/useChartColors';
import { cn } from '@pulwave/utils';
import { funnelChartVariants, type FunnelChartProps } from './types';
import './styles/_index.scss';

/**
 * FunnelChart Component
 * Displays data as a conversion funnel.
 * Uses ChartProvider for library abstraction.
 */
export const FunnelChart = forwardRef<HTMLDivElement, FunnelChartProps>(({
    data = [],
    nameKey = 'name',
    valueKey = 'value',
    width = '100%',
    height = 300,
    showLabels = true,
    labelPosition = 'right',
    showTooltip = true,
    colors,
    animate = true,
    animationDuration = 400,
    tooltipFormatter,
    onStageClick,
    className,
    ariaLabel,
    ...restProps
}, ref) => {
    const { semanticColors } = useChartContext();
    const { FunnelChart: RechartsFunnelChart, Funnel, LabelList, Cell } = useChartComponents();

    const chartColors = useChartColors(data.length, colors);

    // Add colors and conversion rates to data
    const processedData = useMemo(() =>
        data.map((item: Record<string, unknown>, index: number) => {
            const prevValue = index > 0 ? (data[index - 1][valueKey] as number) : (item[valueKey] as number);
            const currentValue = item[valueKey] as number;
            const conversionRate = prevValue > 0
                ? ((currentValue / prevValue) * 100).toFixed(1) + '%'
                : '100%';
            return {
                ...item,
                fill: chartColors[index],
                conversionRate,
            };
        }),
        [data, chartColors, valueKey]
    );

    return (
        <ChartShell
            ref={ref}
            width={width}
            height={height}
            className={cn(funnelChartVariants(), className)}
            role="img"
            aria-label={ariaLabel || 'Funnel chart'}
            {...restProps}
        >
            <RechartsFunnelChart>
                <ChartTooltipLayer
                    formatter={tooltipFormatter}
                    hideLabel
                />

                <Funnel
                    dataKey={valueKey}
                    data={processedData}
                    isAnimationActive={animate}
                    animationDuration={animationDuration}
                    onClick={onStageClick}
                >
                    {processedData.map((entry: any, index: number) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={entry.fill}
                            stroke={semanticColors.background}
                            strokeWidth={2}
                            className="chart--funnel__stage"
                        />
                    ))}

                    {showLabels && (
                        <LabelList
                            position={labelPosition}
                            dataKey={nameKey}
                            fill={semanticColors.text}
                            className="chart--funnel__label"
                        />
                    )}
                </Funnel>
            </RechartsFunnelChart>
        </ChartShell>
    );
});

FunnelChart.displayName = 'FunnelChart';

export default FunnelChart;
