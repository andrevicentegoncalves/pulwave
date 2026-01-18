import React from 'react';
import { cn } from '@pulwave/utils';
import { ChartShell } from '../../../primitives/ChartShell';
import { useChartContext, useChartComponents } from '../../../providers/ChartProvider';
import { sparklineChartVariants, type SparklineChartProps, type SparklineDataPoint } from './types';
import './styles/_index.scss';

/**
 * SparklineChart Component
 * Compact inline chart for displaying trends in tables or cards.
 */
export const SparklineChart = ({
    data = [],
    dataKey = 'value',
    width = 100,
    height = 32,
    color = 'primary',
    variant = 'line',
    showReferenceLine = false,
    referenceValue,
    smooth = true,
    strokeWidth = 2,
    fillOpacity = 0.2,
    animate = true,
    className,
    ariaLabel,
}: SparklineChartProps) => {
    const { semanticColors, getColor } = useChartContext();
    const { LineChart, Line, YAxis, ReferenceLine } = useChartComponents();

    const normalizedData: SparklineDataPoint[] = Array.isArray(data) && (data.length === 0 || typeof data[0] !== 'object')
        ? data.map((value, index) => ({ [dataKey]: value as number, index }))
        : data as SparklineDataPoint[];

    const chartColor = color.startsWith('var(') || color.startsWith('#')
        ? color
        : (semanticColors as unknown as Record<string, string>)[color] || getColor(0);

    const refValue = referenceValue ?? (
        normalizedData.length > 0
            ? normalizedData.reduce((sum: number, d: SparklineDataPoint) => sum + ((d[dataKey] as number) || 0), 0) / normalizedData.length
            : 0
    );

    const isArea = variant === 'area';

    return (
        <ChartShell
            width={width}
            height={height}
            className={cn(sparklineChartVariants({ variant }), className)}
            role="img"
            aria-label={ariaLabel || 'Sparkline chart showing trend'}
        >
            <LineChart data={normalizedData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
                <YAxis domain={['dataMin', 'dataMax']} hide />

                {showReferenceLine && (
                    <ReferenceLine
                        y={refValue}
                        stroke={semanticColors.border}
                        strokeDasharray="2 2"
                    />
                )}

                <defs>
                    <linearGradient id={`sparkline-gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartColor} stopOpacity={fillOpacity} />
                        <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                    </linearGradient>
                </defs>

                <Line
                    type={smooth ? 'monotone' : 'linear'}
                    dataKey={dataKey}
                    stroke={chartColor}
                    strokeWidth={strokeWidth}
                    dot={false}
                    fill={isArea ? `url(#sparkline-gradient-${color})` : 'none'}
                    isAnimationActive={animate}
                    animationDuration={300}
                />
            </LineChart>
        </ChartShell>
    );
};

export default SparklineChart;
