/**
 * Recharts AreaSeries Primitive
 *
 * Wraps Recharts Area component with unified props.
 */

import React from 'react';
import { Area } from 'recharts';

import type { AreaSeriesProps } from '../../../../primitives/types';

/**
 * AreaSeries for Recharts
 */
export function AreaSeries({
    dataKey,
    name,
    color,
    stroke,
    strokeWidth = 2,
    fill,
    fillOpacity = 0.3,
    type = 'monotone',
    dot = false,
    activeDot = true,
    connectNulls = false,
    stackId,
    baseValue,
    opacity,
    animate = true,
    animationDuration = 400,
    hide,
}: AreaSeriesProps) {
    // Use stroke or color for line, fill for area
    const strokeColor = stroke ?? color ?? 'var(--color-brand)';
    const fillColor = fill ?? strokeColor;

    // Convert baseValue to Recharts format
    const baselineValue =
        baseValue === 'auto' ? undefined : baseValue === 'dataMin' ? 'dataMin' : baseValue;

    // Cast dot/activeDot to any since our unified types are more permissive than Recharts
    const dotProp = typeof dot === 'boolean' ? dot : (dot as unknown);
    const activeDotProp = typeof activeDot === 'boolean' ? activeDot : (activeDot as unknown);

    return (
        <Area
            dataKey={dataKey}
            name={name ?? dataKey}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill={fillColor}
            fillOpacity={fillOpacity}
            type={type}
            dot={dotProp as boolean}
            activeDot={activeDotProp as boolean}
            connectNulls={connectNulls}
            stackId={stackId}
            baseValue={baselineValue}
            strokeOpacity={opacity}
            isAnimationActive={animate}
            animationDuration={animationDuration}
            hide={hide}
        />
    );
}

export default AreaSeries;
