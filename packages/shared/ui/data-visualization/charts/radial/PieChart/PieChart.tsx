import React, { useMemo, useState, useCallback, forwardRef } from 'react';
import { ChartShell } from '../../../primitives/ChartShell';
import { ChartTooltipLayer } from '../../../primitives/ChartTooltip';
import { ChartLegendLayer } from '../../../primitives/ChartLegend';
import { useChartComponents } from '../../../providers/ChartProvider';
import { useChartColors } from '../../../hooks/useChartColors';
import { useResolvedSemanticColors } from '../../../hooks/useResolvedSemanticColors';
import { cn } from '@pulwave/utils';
import type { LegendPayloadItem } from '../../../types';
import { pieChartVariants, type PieChartProps } from './types';
import './styles/_index.scss';

/**
 * PieChart Component
 * Displays data as proportional slices of a circle.
 * Uses ChartProvider for library abstraction.
 */
export const PieChart = forwardRef<HTMLDivElement, PieChartProps>(({
    data = [],
    nameKey = 'name',
    valueKey = 'value',
    width = '100%',
    height = 300,
    innerRadius = 0,
    outerRadius = '80%',
    paddingAngle = 2,
    showLabels = false,
    labelPosition = 'outside',
    showTooltip = true,
    showLegend = true,
    legendPosition = 'bottom',
    legendLayout = 'horizontal',
    colors,
    animate = true,
    animationDuration = 400,
    activeShape = true,
    tooltipFormatter,
    onSliceClick,
    className,
    ariaLabel,
    size,
    ...restProps
}, ref) => {
    const semanticColors = useResolvedSemanticColors();
    const { PieChart: RechartsPieChart, Pie, Sector, Cell } = useChartComponents();
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const chartColors = useChartColors(data.length, colors);

    // Legend hover handlers for bidirectional interaction
    const handleLegendHover = useCallback((index: number) => {
        setActiveIndex(index);
    }, []);

    const handleLegendLeave = useCallback(() => {
        setActiveIndex(null);
    }, []);

    const legendPayload: LegendPayloadItem[] = useMemo(() =>
        data.map((entry: Record<string, unknown>, index: number) => ({
            value: String(entry[nameKey] || ''),
            dataKey: String(entry[nameKey] || `item-${index}`),
            color: chartColors[index],
            type: 'rect',
        })),
        [data, nameKey, chartColors]
    );

    // Custom sector renderer that expands active slices
    const renderCustomSector = (props: any) => {
        const { cx, cy, innerRadius: ir, outerRadius: or, startAngle, endAngle, fill, payload, index: sliceIndex } = props;

        const isActive = activeShape && activeIndex === sliceIndex;
        const expandedOr = isActive ? Number(or) + 8 : Number(or);

        return (
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={ir}
                outerRadius={expandedOr}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
                stroke={semanticColors.background}
                strokeWidth={2}
            />
        );
    };

    // Label renderer
    const renderLabel = (labelProps: {
        cx: number;
        cy: number;
        midAngle: number;
        innerRadius: number;
        outerRadius: number;
        percent: number;
        name: string;
        index: number;
    }) => {
        if (!showLabels) return null;

        const { cx, cy, midAngle, innerRadius: ir, outerRadius: or, percent, name, index } = labelProps;
        const RADIAN = Math.PI / 180;
        const isActive = activeIndex === index;
        const radius = labelPosition === 'inside'
            ? Number(ir) + (Number(or) - Number(ir)) * 0.5
            : Number(or) * (isActive ? 1.3 : 1.2);
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                className={cn('chart--pie__label', { 'chart--pie__label--active': isActive })}
                textAnchor={x > cx ? 'start' : 'end'}
                style={{
                    fill: labelPosition === 'inside'
                        ? '#fff'
                        : isActive ? chartColors[index] : semanticColors.text,
                }}
            >
                {`${name} (${(percent * 100).toFixed(0)}%)`}
            </text>
        );
    };

    return (
        <ChartShell
            ref={ref}
            width={width}
            height={height}
            className={cn(pieChartVariants({ size }), className)}
            role="img"
            aria-label={ariaLabel || 'Pie chart'}
            {...restProps}
        >
            <RechartsPieChart>
                <Pie
                    data={data}
                    dataKey={valueKey!}
                    nameKey={nameKey}
                    cx="50%"
                    cy="50%"
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    paddingAngle={paddingAngle}
                    label={showLabels ? renderLabel : false}
                    labelLine={showLabels && labelPosition === 'outside'}
                    isAnimationActive={animate}
                    animationDuration={animationDuration}
                    shape={activeShape ? renderCustomSector : undefined}
                    onMouseEnter={(_: any, index: number) => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                    onClick={onSliceClick}
                >
                    {data.map((_: any, index: number) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={chartColors[index]}
                        />
                    ))}
                </Pie>

                <ChartTooltipLayer
                    show={showTooltip}
                    formatter={tooltipFormatter}
                    hideLabel
                    cursor={{ fill: semanticColors.border, opacity: 0.1 }}
                />

                <ChartLegendLayer
                    show={showLegend}
                    payload={legendPayload}
                    layout={legendLayout}
                    onItemHover={handleLegendHover}
                    onItemLeave={handleLegendLeave}
                    activeIndex={activeIndex}
                    position={legendPosition}
                />
            </RechartsPieChart>
        </ChartShell>
    );
});

PieChart.displayName = 'PieChart';

export default PieChart;
