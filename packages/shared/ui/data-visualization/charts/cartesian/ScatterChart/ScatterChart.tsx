import { useMemo } from 'react';
import { cn } from '@pulwave/utils';
import { ChartShell } from '../../../primitives/ChartShell';
import { ChartAxes } from '../../../primitives/ChartAxes';
import { ChartGrid } from '../../../primitives/ChartGrid';
import { ChartTooltipLayer } from '../../../primitives/ChartTooltip';
import { ChartLegendLayer } from '../../../primitives/ChartLegend';
import { useChartComponents } from '../../../providers/ChartProvider';
import { useChartColors } from '../../../hooks/useChartColors';
import { getChartMargins } from '../../../utils/chartDefaults';

import { scatterChartVariants, type ScatterChartProps } from './types';
import './styles/_index.scss';

/**
 * ScatterChart Component
 * Displays data points in 2D space with optional bubble sizing.
 * Uses ChartProvider for library abstraction.
 */
export const ScatterChart = ({
    data = [],
    xKey = 'x',
    yKey = 'y',
    zKey,
    groupKey,
    xAxisLabel,
    yAxisLabel,
    width = '100%',
    height = 300,
    dotSize = 60,
    minDotSize = 30,
    maxDotSize = 120,
    showGrid = true,
    showXAxis = true,
    showYAxis = true,
    showTooltip = true,
    showLegend = true,
    legendPosition = 'bottom',
    colors,
    animate = true,
    animationDuration = 400,
    xAxisFormatter,
    yAxisFormatter,
    tooltipFormatter,
    onDotClick,
    className,
    ariaLabel,
    ...restProps
}: ScatterChartProps) => {
    const {
        ScatterChart: RechartsScatterChart,
        Scatter, ZAxis
    } = useChartComponents();

    const margins = getChartMargins({ hasAxisLabels: !!(xAxisLabel || yAxisLabel) });

    // Group data by groupKey if provided
    const groupedData = useMemo(() => {
        if (!groupKey) {
            return [{ name: 'Data', data }];
        }
        const groups: Record<string, any[]> = {};
        data.forEach((item: any) => {
            const key = item[groupKey];
            if (!groups[key]) groups[key] = [];
            groups[key].push(item);
        });
        return Object.entries(groups).map(([name, data]) => ({ name, data }));
    }, [data, groupKey]);

    // Resolve colors (CSS variables → actual color values for SVG attributes)
    const chartColors = useChartColors(groupedData.length, colors);

    const legendPayload = groupedData.map((group: any, index: number) => ({
        value: group.name,
        color: chartColors[index],
    }));

    const zRange = useMemo(() => {
        if (!zKey) return [dotSize, dotSize];
        return [minDotSize, maxDotSize];
    }, [zKey, dotSize, minDotSize, maxDotSize]);

    return (
        <ChartShell
            width={width}
            height={height}
            className={cn(scatterChartVariants(), className)}
            role="img"
            aria-label={ariaLabel || 'Scatter chart'}
        >
            <RechartsScatterChart margin={margins} {...restProps}>
                {showGrid && <ChartGrid />}

                <ChartAxes
                    layout="horizontal"
                    xKey={xKey}
                    yKey={yKey}
                    showXAxis={showXAxis}
                    showYAxis={showYAxis}
                    xAxisFormatter={xAxisFormatter}
                    yAxisFormatter={yAxisFormatter}
                    xAxisType="number"
                    yAxisType="number"
                />

                {zKey && (
                    <ZAxis type="number" dataKey={zKey} range={zRange} />
                )}

                <ChartTooltipLayer
                    show={showTooltip}
                    formatter={tooltipFormatter}
                    cursor={{ strokeDasharray: '3 3' }}
                />

                <ChartLegendLayer
                    show={showLegend && !!groupKey}
                    payload={legendPayload}
                    position={legendPosition}
                />

                {groupedData.map((group: any, groupIndex: number) => (
                    <Scatter
                        key={group.name}
                        name={group.name}
                        data={group.data}
                        fill={chartColors[groupIndex]}
                        isAnimationActive={animate}
                        animationDuration={animationDuration}
                        onClick={onDotClick}
                    />
                ))}
            </RechartsScatterChart>
        </ChartShell>
    );
};

export default ScatterChart;
