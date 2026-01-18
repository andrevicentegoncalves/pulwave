/**
 * VISX XAxis Primitive
 *
 * Wraps visx Axis with unified props for bottom/top axis.
 */

import React from 'react';
import { Axis, AnimatedAxis } from '@visx/xychart';

import type { XAxisProps } from '../../../../primitives/types';

// Extend with visx-specific props
interface VISXXAxisProps extends XAxisProps {
    /** Use animated axis */
    animate?: boolean;
}

/**
 * XAxis for VISX
 */
export function XAxis({
    orientation = 'bottom',
    tickCount,
    tickFormatter,
    tickSize,
    label,
    hide = false,
    stroke,
    animate = true,
}: VISXXAxisProps) {
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
                textAnchor: 'middle',
            }}
            labelProps={{
                fill: stroke ?? 'var(--color-text-secondary)',
                fontSize: 12,
                textAnchor: 'middle',
            }}
        />
    );
}

export default XAxis;
