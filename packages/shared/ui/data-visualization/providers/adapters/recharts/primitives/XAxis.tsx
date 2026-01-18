/**
 * Recharts XAxis Primitive
 *
 * Wraps Recharts XAxis component with unified props.
 */

import React from 'react';
import { XAxis as RechartsXAxis } from 'recharts';

import type { XAxisProps } from '../../../../primitives/types';

/**
 * XAxis for Recharts
 */
export function XAxis({
    orientation = 'bottom',
    dataKey,
    type = 'category',
    domain,
    tickCount,
    ticks,
    tickFormatter,
    tickSize = 6,
    label,
    hide = false,
    stroke,
    tickStroke,
    allowDataOverflow = false,
}: XAxisProps) {
    // Convert label to Recharts format (only use string labels for simplicity)
    const labelProp = typeof label === 'string' ? label : undefined;

    return (
        <RechartsXAxis
            orientation={orientation}
            dataKey={dataKey}
            type={type}
            domain={domain}
            tickCount={tickCount}
            ticks={ticks}
            tickFormatter={tickFormatter}
            tickSize={tickSize}
            label={labelProp}
            hide={hide}
            stroke={stroke ?? 'var(--color-text-secondary)'}
            tick={{ fill: tickStroke ?? 'var(--color-text-secondary)' }}
            allowDataOverflow={allowDataOverflow}
        />
    );
}

export default XAxis;
