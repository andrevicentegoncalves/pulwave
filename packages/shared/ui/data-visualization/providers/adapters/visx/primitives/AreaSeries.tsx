/**
 * VISX AreaSeries Primitive
 *
 * Wraps visx AreaSeries/AnimatedAreaSeries with unified props.
 */

import React from 'react';
import { AreaSeries as VISXAreaSeries, AnimatedAreaSeries } from '@visx/xychart';
import { curveLinear, curveMonotoneX, curveStep, curveStepBefore, curveStepAfter, curveBasis, curveNatural } from '@visx/curve';

import type { AreaSeriesProps } from '../../../../primitives/types';

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
interface VISXAreaSeriesProps extends AreaSeriesProps {
    /** X accessor key (required for visx) */
    xAccessor?: string;
}

/**
 * AreaSeries for VISX
 */
export function AreaSeries({
    dataKey,
    data = [],
    name,
    color,
    stroke,
    strokeWidth = 2,
    fill,
    fillOpacity = 0.3,
    type = 'monotone',
    animate = true,
    xAccessor = 'name',
}: VISXAreaSeriesProps) {
    // Use stroke or color
    const strokeColor = stroke ?? color ?? 'var(--color-brand)';
    const fillColor = fill ?? strokeColor;

    // VISX requires accessor functions
    const xAccessorFn = (d: Record<string, unknown>) => d[xAccessor] as string;
    const yAccessorFn = (d: Record<string, unknown>) => d[dataKey] as number;

    const curve = curveMap[type] ?? curveMonotoneX;
    const SeriesComponent = animate ? AnimatedAreaSeries : VISXAreaSeries;

    return (
        <SeriesComponent
            dataKey={name ?? dataKey}
            data={data}
            xAccessor={xAccessorFn}
            yAccessor={yAccessorFn}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill={fillColor}
            fillOpacity={fillOpacity}
            curve={curve}
        />
    );
}

export default AreaSeries;
