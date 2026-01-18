import React from 'react';
import { useChartComponents } from '../../providers/ChartProvider';

export interface ScatterSeriesProps {
    /** Data array for the scatter points. */
    data?: any[];
    /** Data key for X values. */
    xDataKey?: string;
    /** Data key for Y values. */
    yDataKey?: string;
    /** Data key for Z values (bubble size). */
    zDataKey?: string;
    /** Series name for legend/tooltip. */
    name?: string;
    /** Fill color for points. */
    fill?: string;
    /** Stroke color for points. */
    stroke?: string;
    /** Point shape: 'circle', 'cross', 'diamond', 'square', 'star', 'triangle', 'wye'. */
    shape?: 'circle' | 'cross' | 'diamond' | 'square' | 'star' | 'triangle' | 'wye';
    /** Base size of points (or min size for bubbles). */
    size?: number;
    /** Maximum size for bubbles when using zDataKey. */
    maxSize?: number;
    /** Animation duration. */
    animationDuration?: number;
    /** Whether this series is hidden. */
    hide?: boolean;
    /** Custom colors per point. */
    colors?: string[];
    /** Line connecting points. */
    line?: boolean | { stroke?: string; strokeWidth?: number };
    children?: React.ReactNode;
}

/**
 * ScatterSeries
 *
 * A composable scatter/bubble series primitive.
 * Uses ChartProvider for library abstraction.
 */
export function ScatterSeries({
    data,
    xDataKey = 'x',
    yDataKey = 'y',
    zDataKey,
    name,
    fill = 'var(--chart-color-1)',
    stroke,
    shape = 'circle',
    size = 60,
    maxSize = 400,
    animationDuration = 400,
    hide = false,
    colors,
    line = false,
    children,
    ...props
}: ScatterSeriesProps) {
    const { Scatter, ZAxis, Cell } = useChartComponents();

    // Line configuration
    const lineConfig = line === true
        ? { stroke: fill, strokeWidth: 1 }
        : line;

    return (
        <>
            {zDataKey && (
                <ZAxis
                    dataKey={zDataKey}
                    range={[size, maxSize]}
                    name={zDataKey}
                />
            )}
            <Scatter
                data={data}
                name={name}
                fill={fill}
                stroke={stroke}
                shape={shape}
                animationDuration={animationDuration}
                hide={hide}
                line={lineConfig}
                {...props}
            >
                {colors && colors.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                ))}
                {children}
            </Scatter>
        </>
    );
}

ScatterSeries.displayName = 'ScatterSeries';

export default ScatterSeries;
