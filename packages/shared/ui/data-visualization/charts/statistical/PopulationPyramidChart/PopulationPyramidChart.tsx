import React, { useMemo } from 'react';
import { cn } from '@pulwave/utils';
import { ChartShell } from '../../../primitives/ChartShell';
import { ChartTooltipLayer } from '../../../primitives/ChartTooltip';
import { useChartContext, useChartComponents } from '../../../providers/ChartProvider';
import { getChartMargins } from '../../../utils/chartDefaults';
import { populationPyramidChartVariants, type PopulationPyramidChartProps } from './types';
import './styles/_index.scss';

/**
 * PopulationPyramidChart Component
 * 
 * Displays demographic data as back-to-back horizontal bars.
 * Left side typically shows male, right side shows female.
 * Uses ChartProvider for library abstraction.
 */
export const PopulationPyramidChart = ({
    data = [],
    leftKey = 'male',
    rightKey = 'female',
    categoryKey = 'age',
    leftLabel = 'Male',
    rightLabel = 'Female',
    leftColor,
    rightColor,
    height = 400,
    showLabels = true,
    valueFormatter = (v) => Math.abs(v).toLocaleString(),
    className,
    ...props
}: PopulationPyramidChartProps) => {
    const { colors, semanticColors } = useChartContext();
    const { BarChart, Bar, XAxis, YAxis, ReferenceLine } = useChartComponents();

    const tickStyle = { fill: semanticColors.text, fontSize: 12 };
    const margins = getChartMargins({ isHorizontal: true });

    const left = leftColor || colors[0] || 'var(--chart-color-1)';
    const right = rightColor || colors[1] || 'var(--chart-color-2)';

    // Transform data to make left values negative for pyramid effect
    const chartData = useMemo(() => {
        return data.map((item: any) => ({
            ...item,
            [leftKey]: -Math.abs(item[leftKey] || 0),
            [rightKey]: Math.abs(item[rightKey] || 0),
        })).reverse();
    }, [data, leftKey, rightKey]);

    const maxValue = useMemo(() => {
        const allValues = data.flatMap((d: any) => [
            Math.abs(d[leftKey] || 0),
            Math.abs(d[rightKey] || 0),
        ]);
        return (Math.max(...allValues) || 100) * 1.1;
    }, [data, leftKey, rightKey]);

    return (
        <ChartShell
            height={height}
            className={cn(populationPyramidChartVariants(), className)}
        >
            {/* Legend */}
            {showLabels && (
                <div className="chart--population-pyramid__legend">
                    <div className="chart--population-pyramid__legend-item">
                        <span
                            className="chart--population-pyramid__legend-color"
                            style={{ backgroundColor: left }}
                        />
                        <span className="chart--population-pyramid__legend-label">{leftLabel}</span>
                    </div>
                    <div className="chart--population-pyramid__legend-item">
                        <span
                            className="chart--population-pyramid__legend-color"
                            style={{ backgroundColor: right }}
                        />
                        <span className="chart--population-pyramid__legend-label">{rightLabel}</span>
                    </div>
                </div>
            )}

            <BarChart
                data={chartData}
                layout="vertical"
                margin={margins}
                barCategoryGap="20%"
                {...props}
            >
                <XAxis
                    type="number"
                    domain={[-maxValue, maxValue]}
                    tickFormatter={(v: number) => Math.abs(v).toLocaleString()}
                    tick={tickStyle}
                    axisLine={{ stroke: semanticColors.grid }}
                    tickLine={{ stroke: semanticColors.grid }}
                />
                <YAxis
                    type="category"
                    dataKey={categoryKey}
                    tick={tickStyle}
                    axisLine={{ stroke: semanticColors.grid }}
                    tickLine={false}
                    width={50}
                />
                <ReferenceLine x={0} stroke={semanticColors.grid} strokeWidth={2} />

                <ChartTooltipLayer
                    items={[
                        { name: leftLabel, color: left, value: 0 },
                        { name: rightLabel, color: right, value: 0 }
                    ]}
                    formatter={(v) => valueFormatter(Number(v))}
                />

                <Bar
                    dataKey={leftKey}
                    fill={left}
                    radius={[4, 0, 0, 4]}
                />
                <Bar
                    dataKey={rightKey}
                    fill={right}
                    radius={[0, 4, 4, 0]}
                />
            </BarChart>
        </ChartShell>
    );
};

export default PopulationPyramidChart;
