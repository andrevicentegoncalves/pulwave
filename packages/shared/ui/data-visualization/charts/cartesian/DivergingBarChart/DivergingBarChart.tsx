import { useMemo } from 'react';
import { cn } from '@pulwave/utils';
import { ChartShell } from '../../../primitives/ChartShell';
import { ChartGrid } from '../../../primitives/ChartGrid';
import { ChartTooltipLayer } from '../../../primitives/ChartTooltip';
import { useChartContext, useChartComponents } from '../../../providers/ChartProvider';
import { getChartMargins } from '../../../utils/chartDefaults';

import { divergingBarChartVariants, type DivergingBarChartProps } from './types';
import './styles/_index.scss';

/**
 * Custom label component for diverging bars
 * Positions label above positive bars and below negative bars
 */
const DivergingBarLabel = ({ x, y, width, height, value, formatter, fill }: any) => {
    const isPositive = value >= 0;
    const labelY = isPositive ? y - 5 : y + height + 15;
    const labelX = x + width / 2;

    return (
        <text
            x={labelX}
            y={labelY}
            fill={fill}
            textAnchor="middle"
            fontSize={10}
            fontWeight={500}
        >
            {formatter(value)}
        </text>
    );
};

/**
 * DivergingBarChart Component
 * Displays positive/negative values diverging from a center baseline.
 * Uses ChartProvider for library abstraction.
 */
export const DivergingBarChart = ({
    data = [],
    dataKey = 'value',
    categoryKey = 'category',
    positiveColor = 'var(--chart-status-success)',
    negativeColor = 'var(--chart-status-error)',
    height = 400,
    layout = 'horizontal',
    showGrid = true,
    showLabels = true,
    valueFormatter = (v) => v?.toLocaleString() ?? '',
    className,
    ...props
}: DivergingBarChartProps) => {
    const { semanticColors } = useChartContext();
    const { BarChart, Bar, XAxis, YAxis, ReferenceLine, Cell } = useChartComponents();
    const margins = getChartMargins({ isHorizontal: layout !== 'horizontal' });

    // Determine min/max for symmetrical axis
    const { minVal, maxVal } = useMemo(() => {
        const values = data.map((d: any) => d[dataKey]);
        const absMax = Math.max(...values.map(Math.abs));
        return { minVal: -absMax, maxVal: absMax };
    }, [data, dataKey]);

    const isHorizontal = layout === 'horizontal';

    return (
        <ChartShell
            height={height}
            className={cn(divergingBarChartVariants({ layout }), className)}
        >
            <BarChart
                data={data}
                layout={isHorizontal ? 'horizontal' : 'vertical'}
                margin={margins}
                {...props}
            >
                {showGrid && <ChartGrid />}

                {isHorizontal ? (
                    <>
                        <XAxis
                            type="category"
                            dataKey={categoryKey}
                            tick={{ fill: semanticColors.text, fontSize: 12 }}
                            axisLine={{ stroke: semanticColors.grid }}
                            tickLine={false}
                        />
                        <YAxis
                            type="number"
                            domain={[minVal, maxVal]}
                            tick={{ fill: semanticColors.text, fontSize: 12 }}
                            axisLine={{ stroke: semanticColors.grid }}
                            tickFormatter={valueFormatter}
                        />
                        <ReferenceLine y={0} stroke={semanticColors.text} strokeWidth={2} />
                    </>
                ) : (
                    <>
                        <XAxis
                            type="number"
                            domain={[minVal, maxVal]}
                            tick={{ fill: semanticColors.text, fontSize: 12 }}
                            axisLine={{ stroke: semanticColors.grid }}
                            tickFormatter={valueFormatter}
                        />
                        <YAxis
                            type="category"
                            dataKey={categoryKey}
                            tick={{ fill: semanticColors.text, fontSize: 12 }}
                            axisLine={{ stroke: semanticColors.grid }}
                            tickLine={false}
                        />
                        <ReferenceLine x={0} stroke={semanticColors.text} strokeWidth={2} />
                    </>
                )}

                <ChartTooltipLayer
                    formatter={valueFormatter}
                />

                <Bar
                    dataKey={dataKey}
                    radius={[4, 4, 4, 4]}
                    label={showLabels ? (props: any) => (
                        <DivergingBarLabel
                            {...props}
                            formatter={valueFormatter}
                            fill={semanticColors.text}
                        />
                    ) : false}
                >
                    {data.map((entry: any, index: number) => (
                        <Cell
                            key={index}
                            fill={entry[dataKey] >= 0 ? positiveColor : negativeColor}
                        />
                    ))}
                </Bar>
            </BarChart>
        </ChartShell>
    );
};

export default DivergingBarChart;
