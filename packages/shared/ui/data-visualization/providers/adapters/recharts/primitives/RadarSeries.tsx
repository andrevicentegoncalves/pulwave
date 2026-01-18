/**
 * Recharts RadarSeries Primitive
 *
 * Wraps Recharts Radar component with unified props.
 */

import React from 'react';
import { Radar } from 'recharts';

import type { RadarSeriesProps } from '../../../../primitives/types';

/**
 * RadarSeries for Recharts
 */
export function RadarSeries({
    dataKey,
    name,
    color,
    fill,
    fillOpacity = 0.6,
    stroke,
    strokeWidth = 2,
    dot = false,
    opacity,
    animate = true,
    animationDuration = 400,
    hide,
}: RadarSeriesProps) {
    // Use stroke or color for line
    const strokeColor = stroke ?? color ?? 'var(--color-brand)';
    const fillColor = fill ?? strokeColor;

    // Cast dot to boolean since our unified types are more permissive
    const dotProp = typeof dot === 'boolean' ? dot : Boolean(dot);

    return (
        <Radar
            dataKey={dataKey}
            name={name ?? dataKey}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill={fillColor}
            fillOpacity={fillOpacity}
            dot={dotProp}
            strokeOpacity={opacity}
            isAnimationActive={animate}
            animationDuration={animationDuration}
            hide={hide}
        />
    );
}

export default RadarSeries;
