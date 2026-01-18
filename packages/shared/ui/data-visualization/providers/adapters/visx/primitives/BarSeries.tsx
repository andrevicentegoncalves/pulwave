/**
 * VISX BarSeries Primitive
 *
 * Wraps visx BarSeries/AnimatedBarSeries with unified props.
 */

import React from 'react';
import { BarSeries as VISXBarSeries, AnimatedBarSeries } from '@visx/xychart';

import type { BarSeriesProps } from '../../../../primitives/types';

// Extend with visx-specific props
interface VISXBarSeriesProps extends BarSeriesProps {
    /** X accessor key (required for visx) */
    xAccessor?: string;
}

/**
 * BarSeries for VISX
 *
 * Note: The `radius` prop from unified interface is accepted but VISX BarSeries
 * doesn't support custom border radius. Use CSS or custom SVG for rounded bars.
 */
export function BarSeries({
    dataKey,
    data = [],
    name,
    color,
    fill,
    // radius is accepted for API compatibility but not used by VISX
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    radius,
    animate = true,
    xAccessor = 'name',
}: VISXBarSeriesProps) {
    // Use fill or color
    const fillColor = fill ?? color ?? 'var(--color-brand)';

    // VISX requires accessor functions
    const xAccessorFn = (d: Record<string, unknown>) => d[xAccessor] as string;
    const yAccessorFn = (d: Record<string, unknown>) => d[dataKey] as number;

    const SeriesComponent = animate ? AnimatedBarSeries : VISXBarSeries;

    return (
        <SeriesComponent
            dataKey={name ?? dataKey}
            data={data}
            xAccessor={xAccessorFn}
            yAccessor={yAccessorFn}
            colorAccessor={() => fillColor}
        />
    );
}

export default BarSeries;
