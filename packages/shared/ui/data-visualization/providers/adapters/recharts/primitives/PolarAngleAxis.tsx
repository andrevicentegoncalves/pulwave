/**
 * Recharts PolarAngleAxis Primitive
 *
 * Wraps Recharts PolarAngleAxis component with unified props.
 */

import React from 'react';
import { PolarAngleAxis as RechartsPolarAngleAxis } from 'recharts';

import type { PolarAngleAxisProps } from '../../../../primitives/types';

/**
 * PolarAngleAxis for Recharts
 */
export function PolarAngleAxis({
    dataKey,
    type = 'category',
    domain,
    tickLine = true,
    axisLine = true,
    tickFormatter,
    stroke,
}: PolarAngleAxisProps) {
    return (
        <RechartsPolarAngleAxis
            dataKey={dataKey}
            type={type}
            domain={domain}
            tickLine={tickLine}
            axisLine={axisLine}
            tickFormatter={tickFormatter}
            stroke={stroke ?? 'var(--color-text-secondary)'}
            tick={{ fill: stroke ?? 'var(--color-text-secondary)' }}
        />
    );
}

export default PolarAngleAxis;
