/**
 * Recharts LineSeries Primitive
 *
 * Wraps Recharts Line component with unified props.
 */

import React from 'react';
import { Line } from 'recharts';

import type { LineSeriesProps } from '../../../../primitives/types';

/**
 * LineSeries for Recharts
 */
export function LineSeries({
    dataKey,
    name,
    color,
    stroke,
    strokeWidth = 2,
    type = 'monotone',
    dot = false,
    activeDot = true,
    connectNulls = false,
    opacity,
    animate = true,
    animationDuration = 400,
    hide,
}: LineSeriesProps) {
    // Use stroke or color, defaulting to a brand color
    const strokeColor = stroke ?? color ?? 'var(--color-brand)';

    // Cast dot/activeDot to any since our unified types are more permissive than Recharts
    const dotProp = typeof dot === 'boolean' ? dot : (dot as unknown);
    const activeDotProp = typeof activeDot === 'boolean' ? activeDot : (activeDot as unknown);

    return (
        <Line
            dataKey={dataKey}
            name={name ?? dataKey}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            type={type}
            dot={dotProp as boolean}
            activeDot={activeDotProp as boolean}
            connectNulls={connectNulls}
            strokeOpacity={opacity}
            isAnimationActive={animate}
            animationDuration={animationDuration}
            hide={hide}
        />
    );
}

export default LineSeries;
