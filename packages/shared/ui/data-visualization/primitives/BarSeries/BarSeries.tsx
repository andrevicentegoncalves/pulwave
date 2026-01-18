import React from 'react';
import { useChartComponents } from '../../providers/ChartProvider';

export interface BarSeriesProps {
    /** Data key for the series values. */
    dataKey: string;
    /** Series name for legend/tooltip. */
    name?: string;
    /** Bar fill color. Uses theme tokens. */
    fill?: string;
    /** Bar stroke color. */
    stroke?: string;
    /** Bar stroke width. */
    strokeWidth?: number;
    /** Bar corner radius. */
    radius?: number | [number, number, number, number];
    /** Maximum bar width. */
    maxBarSize?: number;
    /** Bar width in pixels or percentage. */
    barSize?: number | string;
    /** Stack ID for stacked bars. */
    stackId?: string;
    /** Animation duration. */
    animationDuration?: number;
    /** Whether this series is hidden. */
    hide?: boolean;
    /** Background fill for the bar area. */
    background?: boolean | { fill?: string };
    /** Custom colors per bar (for single series with varied colors). */
    colors?: string[];
    children?: React.ReactNode;
}

/**
 * BarSeries
 *
 * A composable bar series primitive for building bar charts.
 * Uses ChartProvider for library abstraction.
 *
 * @example
 * <BarChart data={data}>
 *   <BarSeries dataKey="sales" name="Sales" />
 *   <BarSeries dataKey="profit" name="Profit" fill="var(--chart-color-2)" stackId="a" />
 * </BarChart>
 */
export function BarSeries({
    dataKey,
    name,
    fill = 'var(--chart-color-1)',
    stroke,
    strokeWidth = 0,
    radius = 4,
    maxBarSize = 60,
    barSize,
    stackId,
    animationDuration = 400,
    hide = false,
    background = false,
    colors,
    children,
    ...props
}: BarSeriesProps) {
    const { Bar, Cell } = useChartComponents();

    // Background configuration
    const backgroundConfig = background === true
        ? { fill: 'var(--chart-background-subtle-color)', radius }
        : background;

    return (
        <Bar
            dataKey={dataKey}
            name={name || dataKey}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            radius={radius}
            maxBarSize={maxBarSize}
            barSize={barSize}
            stackId={stackId}
            animationDuration={animationDuration}
            hide={hide}
            background={backgroundConfig}
            {...props}
        >
            {colors && colors.map((color, index) => (
                <Cell key={`cell-${index}`} fill={color} />
            ))}
            {children}
        </Bar>
    );
}

BarSeries.displayName = 'BarSeries';

export default BarSeries;
