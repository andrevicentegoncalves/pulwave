/**
 * VISX YAxis Primitive
 *
 * Wraps visx Axis with unified props for left/right axis.
 */

import React from 'react';
import { Axis, AnimatedAxis } from '@visx/xychart';

import type { YAxisProps } from '../../../../primitives/types';

// Extend with visx-specific props
interface VISXYAxisProps extends YAxisProps {
    /** Use animated axis */
    animate?: boolean;
}

/**
 * YAxis for VISX
 */
export function YAxis({
    orientation = 'left',
    tickCount,
    tickFormatter,
    tickSize,
    label,
    hide = false,
    stroke,
    animate = true,
}: VISXYAxisProps) {
    if (hide) return null;

    const AxisComponent = animate ? AnimatedAxis : Axis;

    // Convert label to visx format
    const labelText = typeof label === 'string' ? label : label?.value;

    return (
        <AxisComponent
            orientation={orientation}
            numTicks={tickCount}
            tickFormat={tickFormatter}
            tickLength={tickSize}
            label={labelText}
            stroke={stroke ?? 'var(--color-text-secondary)'}
            tickStroke={stroke ?? 'var(--color-text-secondary)'}
            tickLabelProps={{
                fill: stroke ?? 'var(--color-text-secondary)',
                fontSize: 12,
                textAnchor: orientation === 'left' ? 'end' : 'start',
                dx: orientation === 'left' ? -4 : 4,
            }}
            labelProps={{
                fill: stroke ?? 'var(--color-text-secondary)',
                fontSize: 12,
                textAnchor: 'middle',
            }}
        />
    );
}

export default YAxis;
