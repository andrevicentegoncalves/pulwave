/**
 * Recharts ScatterSeries Primitive
 *
 * Wraps Recharts Scatter component with unified props.
 */

import React from 'react';
import { Scatter, Cell } from 'recharts';

import type { ScatterSeriesProps } from '../../../../primitives/types';

/**
 * ScatterSeries for Recharts
 */
export function ScatterSeries({
    dataKey,
    data,
    name,
    color,
    fill,
    shape = 'circle',
    opacity,
    animate = true,
    animationDuration = 400,
    hide,
    children,
}: ScatterSeriesProps) {
    // Use fill or color
    const fillColor = fill ?? color ?? 'var(--color-brand)';

    return (
        <Scatter
            dataKey={dataKey}
            data={data}
            name={name ?? dataKey}
            fill={fillColor}
            shape={shape as 'circle' | 'cross' | 'diamond' | 'square' | 'star' | 'triangle' | 'wye'}
            fillOpacity={opacity}
            isAnimationActive={animate}
            animationDuration={animationDuration}
            hide={hide}
        >
            {children}
        </Scatter>
    );
}

export default ScatterSeries;
