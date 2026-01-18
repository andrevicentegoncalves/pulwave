import React from 'react';
import { useChartComponents } from '../../providers/ChartProvider';

export interface LineSeriesProps {
    /** Data key for the series values. */
    dataKey: string;
    /** Series name for legend/tooltip. */
    name?: string;
    /** Line color. Uses theme tokens. */
    stroke?: string;
    /** Line width. */
    strokeWidth?: number;
    /** Line type: 'linear', 'monotone', 'step', etc. */
    type?: 'linear' | 'monotone' | 'step' | 'stepBefore' | 'stepAfter' | 'natural' | 'basis';
    /** Whether to show dots. */
    dot?: boolean | React.ReactElement | ((props: any) => React.ReactElement);
    /** Dot configuration when dot is true. */
    dotSize?: number;
    /** Whether to show dots on hover. */
    activeDot?: boolean | React.ReactElement | ((props: any) => React.ReactElement);
    /** Active dot size. */
    activeDotSize?: number;
    /** Whether the line is dashed. */
    dashed?: boolean;
    /** Animation duration. */
    animationDuration?: number;
    /** Whether this series is hidden. */
    hide?: boolean;
    /** Connect null data points. */
    connectNulls?: boolean;
}

/**
 * LineSeries
 *
 * A composable line series primitive for building line charts.
 * Uses ChartProvider for library abstraction.
 *
 * @example
 * <LineChart data={data}>
 *   <LineSeries dataKey="revenue" name="Revenue" />
 *   <LineSeries dataKey="costs" name="Costs" stroke="var(--chart-color-2)" dashed />
 * </LineChart>
 */
export function LineSeries({
    dataKey,
    name,
    stroke = 'var(--chart-color-1)',
    strokeWidth = 2,
    type = 'monotone',
    dot = false,
    dotSize = 4,
    activeDot = true,
    activeDotSize = 6,
    dashed = false,
    animationDuration = 400,
    hide = false,
    connectNulls = false,
    ...props
}: LineSeriesProps) {
    const { Line } = useChartComponents();

    // Default dot configuration
    const dotConfig = dot === true ? {
        r: dotSize,
        fill: stroke,
        strokeWidth: 2,
        stroke: 'var(--chart-background-color)',
    } : dot;

    // Default active dot configuration
    const activeDotConfig = activeDot === true ? {
        r: activeDotSize,
        fill: stroke,
        stroke: 'var(--chart-background-color)',
        strokeWidth: 2,
    } : activeDot;

    return (
        <Line
            dataKey={dataKey}
            name={name || dataKey}
            stroke={stroke}
            strokeWidth={strokeWidth}
            type={type}
            dot={dotConfig}
            activeDot={activeDotConfig}
            strokeDasharray={dashed ? '5 5' : undefined}
            animationDuration={animationDuration}
            hide={hide}
            connectNulls={connectNulls}
            {...props}
        />
    );
}

LineSeries.displayName = 'LineSeries';

export default LineSeries;
