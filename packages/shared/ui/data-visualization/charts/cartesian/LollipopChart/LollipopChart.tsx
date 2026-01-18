import { useMemo } from 'react';
import { cn } from '@pulwave/utils';
import { ChartShell } from '../../../primitives/ChartShell';
import { ChartAxes } from '../../../primitives/ChartAxes';
import { ChartGrid } from '../../../primitives/ChartGrid';
import { ChartTooltipLayer } from '../../../primitives/ChartTooltip';
import { useChartContext, useChartComponents } from '../../../providers/ChartProvider';
import { getChartMargins } from '../../../utils/chartDefaults';

import { lollipopChartVariants, type LollipopChartProps } from './types';
import './styles/_index.scss';

/**
 * LollipopChart Component
 * Displays values as dots on sticks - a cleaner alternative to bar charts.
 * Uses ChartProvider for library abstraction.
 */
export const LollipopChart = ({
    data = [],
    dataKey = 'value',
    categoryKey = 'name',
    layout = 'horizontal',
    height = 400,
    dotSize = 10,
    stemWidth = 3,
    showGrid = true,
    showLabels = true,
    valueFormatter = (v) => v?.toLocaleString() ?? '',
    className,
    ...props
}: LollipopChartProps) => {
    const { getColor, semanticColors } = useChartContext();
    const { ComposedChart, Bar, Scatter, Cell } = useChartComponents();
    const margins = getChartMargins({ isHorizontal: layout !== 'horizontal' });

    // Process data with colors
    const processedData = useMemo(() => {
        return data.map((item: any, idx: number) => ({
            ...item,
            color: item.color || getColor(idx),
        }));
    }, [data, getColor]);

    const isHorizontal = layout === 'horizontal';

    // Custom dot for lollipop heads
    const CustomDot = (dotProps: any) => {
        const { cx, cy, payload } = dotProps;
        if (cx === undefined || cy === undefined) return null;
        return (
            <g>
                <circle
                    cx={cx + 2}
                    cy={cy + 2}
                    r={dotSize}
                    fill="rgba(0,0,0,0.15)"
                />
                <circle
                    cx={cx}
                    cy={cy}
                    r={dotSize}
                    fill={payload.color}
                    stroke="white"
                    strokeWidth={2}
                />
            </g>
        );
    };

    return (
        <ChartShell
            height={height}
            className={cn(lollipopChartVariants({ layout }), className)}
        >
            <ComposedChart
                data={processedData}
                layout={isHorizontal ? 'vertical' : 'horizontal'}
                margin={margins}
                {...props}
            >
                {showGrid && <ChartGrid />}

                <ChartAxes
                    layout={isHorizontal ? 'vertical' : 'horizontal'}
                    xKey={isHorizontal ? dataKey : categoryKey}
                    yKey={isHorizontal ? categoryKey : dataKey}
                    showXAxis
                    showYAxis
                    xAxisFormatter={isHorizontal ? valueFormatter : undefined}
                    yAxisFormatter={isHorizontal ? undefined : valueFormatter}
                />

                <ChartTooltipLayer
                    formatter={valueFormatter}
                />

                {/* Use thin bars as stems */}
                <Bar dataKey={dataKey} barSize={stemWidth} radius={0}>
                    {processedData.map((entry: any, idx: number) => (
                        <Cell key={idx} fill={entry.color} />
                    ))}
                </Bar>

                {/* Lollipop heads */}
                <Scatter dataKey={dataKey} shape={<CustomDot />}>
                    {processedData.map((entry: any, idx: number) => (
                        <Cell key={idx} fill={entry.color} />
                    ))}
                </Scatter>
            </ComposedChart>
        </ChartShell>
    );
};

export default LollipopChart;
