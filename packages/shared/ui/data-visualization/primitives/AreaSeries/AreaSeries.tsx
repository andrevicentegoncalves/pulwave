import React from 'react';
import { useChartComponents } from '../../providers/ChartProvider';

export interface AreaSeriesProps {
    /** Data key for the series values. */
    dataKey: string;
    /** Series name for legend/tooltip. */
    name?: string;
    /** Line stroke color. Uses theme tokens. */
    stroke?: string;
    /** Area fill color (or gradient ID). */
    fill?: string;
    /** Fill opacity. */
    fillOpacity?: number;
    /** Line width. */
    strokeWidth?: number;
    /** Line type. */
    type?: 'linear' | 'monotone' | 'step' | 'stepBefore' | 'stepAfter' | 'natural' | 'basis';
    /** Whether to show dots. */
    dot?: boolean | React.ReactElement | ((props: any) => React.ReactElement);
    /** Active dot configuration. */
    activeDot?: boolean | React.ReactElement | ((props: any) => React.ReactElement);
    /** Stack ID for stacked areas. */
    stackId?: string;
    /** Animation duration. */
    animationDuration?: number;
    /** Whether this series is hidden. */
    hide?: boolean;
    /** Connect null data points. */
    connectNulls?: boolean;
    /** Use gradient fill (auto-generates gradient ID). */
    gradient?: boolean;
    /** Gradient opacity at top. */
    gradientOpacity?: number;
}

/**
 * AreaSeries
 *
 * A composable area series primitive for building area charts.
 * Uses ChartProvider for library abstraction.
 *
 * @example
 * <AreaChart data={data}>
 *   <ChartDefs />
 *   <AreaSeries dataKey="revenue" name="Revenue" gradient />
 *   <AreaSeries dataKey="costs" name="Costs" stroke="var(--chart-color-2)" stackId="a" />
 * </AreaChart>
 */
export function AreaSeries({
    dataKey,
    name,
    stroke = 'var(--chart-color-1)',
    fill,
    fillOpacity = 0.3,
    strokeWidth = 2,
    type = 'monotone',
    dot = false,
    activeDot = true,
    stackId,
    animationDuration = 400,
    hide = false,
    connectNulls = false,
    gradient = false,
    gradientOpacity = 0.4,
    ...props
}: AreaSeriesProps) {
    const { Area } = useChartComponents();

    // Generate gradient ID based on dataKey
    const gradientId = gradient ? `area-gradient-${dataKey}` : undefined;

    // Determine fill - use gradient URL or solid color
    const resolvedFill = gradient
        ? `url(#${gradientId})`
        : (fill || stroke);

    // Active dot configuration
    const activeDotConfig = activeDot === true ? {
        r: 6,
        fill: stroke,
        stroke: 'var(--chart-background-color)',
        strokeWidth: 2,
    } : activeDot;

    return (
        <>
            {gradient && (
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={stroke} stopOpacity={gradientOpacity} />
                        <stop offset="100%" stopColor={stroke} stopOpacity={0.05} />
                    </linearGradient>
                </defs>
            )}
            <Area
                dataKey={dataKey}
                name={name || dataKey}
                stroke={stroke}
                fill={resolvedFill}
                fillOpacity={gradient ? 1 : fillOpacity}
                strokeWidth={strokeWidth}
                type={type}
                dot={dot}
                activeDot={activeDotConfig}
                stackId={stackId}
                animationDuration={animationDuration}
                hide={hide}
                connectNulls={connectNulls}
                {...props}
            />
        </>
    );
}

AreaSeries.displayName = 'AreaSeries';

export default AreaSeries;
