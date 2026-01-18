/**
 * VISX LineSeries Primitive
 *
 * Wraps visx LineSeries/AnimatedLineSeries with unified props.
 */

import React from 'react';
import { LineSeries as VISXLineSeries, AnimatedLineSeries, GlyphSeries } from '@visx/xychart';
import { curveLinear, curveMonotoneX, curveStep, curveStepBefore, curveStepAfter, curveBasis, curveNatural } from '@visx/curve';

import type { LineSeriesProps } from '../../../../primitives/types';

// Curve type mapping
const curveMap = {
    linear: curveLinear,
    monotone: curveMonotoneX,
    step: curveStep,
    stepBefore: curveStepBefore,
    stepAfter: curveStepAfter,
    basis: curveBasis,
    natural: curveNatural,
};

// Extend with visx-specific props
interface VISXLineSeriesProps extends LineSeriesProps {
    /** X accessor key (required for visx) */
    xAccessor?: string;
}

/**
 * LineSeries for VISX
 */
export function LineSeries({
    dataKey,
    data = [],
    name,
    color,
    stroke,
    strokeWidth = 2,
    type = 'monotone',
    dot = false,
    animate = true,
    xAccessor = 'name',
}: VISXLineSeriesProps) {
    // Use stroke or color
    const strokeColor = stroke ?? color ?? 'var(--color-brand)';

    // VISX requires accessor functions
    const xAccessorFn = (d: Record<string, unknown>) => d[xAccessor] as string;
    const yAccessorFn = (d: Record<string, unknown>) => d[dataKey] as number;

    const curve = curveMap[type] ?? curveMonotoneX;
    const SeriesComponent = animate ? AnimatedLineSeries : VISXLineSeries;

    return (
        <>
            <SeriesComponent
                dataKey={name ?? dataKey}
                data={data}
                xAccessor={xAccessorFn}
                yAccessor={yAccessorFn}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                curve={curve}
            />
            {dot && (
                <GlyphSeries
                    dataKey={`${name ?? dataKey}-dots`}
                    data={data}
                    xAccessor={xAccessorFn}
                    yAccessor={yAccessorFn}
                    colorAccessor={() => strokeColor}
                />
            )}
        </>
    );
}

export default LineSeries;
