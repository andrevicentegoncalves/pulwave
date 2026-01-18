/**
 * Recharts YAxis Primitive
 *
 * Wraps Recharts YAxis component with unified props.
 */

import React from 'react';
import { YAxis as RechartsYAxis } from 'recharts';

import type { YAxisProps } from '../../../../primitives/types';

/**
 * YAxis for Recharts
 */
export function YAxis({
    orientation = 'left',
    dataKey,
    type = 'number',
    domain,
    tickCount,
    ticks,
    tickFormatter,
    tickSize = 6,
    label,
    hide = false,
    stroke,
    tickStroke,
    yAxisId,
    allowDataOverflow = false,
}: YAxisProps) {
    // Convert label to Recharts format (only use string labels for simplicity)
    const labelProp = typeof label === 'string' ? label : undefined;

    return (
        <RechartsYAxis
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
            yAxisId={yAxisId}
            allowDataOverflow={allowDataOverflow}
        />
    );
}

export default YAxis;
