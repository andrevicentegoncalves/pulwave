/**
 * Recharts PolarRadiusAxis Primitive
 *
 * Wraps Recharts PolarRadiusAxis component with unified props.
 */

import React from 'react';
import { PolarRadiusAxis as RechartsPolarRadiusAxis } from 'recharts';

import type { PolarRadiusAxisProps } from '../../../../primitives/types';

/**
 * PolarRadiusAxis for Recharts
 */
export function PolarRadiusAxis({
    angle = 90,
    domain,
    tickCount = 5,
    tickFormatter,
    axisLine = true,
    tickLine = true,
    stroke,
}: PolarRadiusAxisProps) {
    return (
        <RechartsPolarRadiusAxis
            angle={angle}
            domain={domain}
            tickCount={tickCount}
            tickFormatter={tickFormatter}
            axisLine={axisLine}
            tick={tickLine ? { fill: stroke ?? 'var(--color-text-secondary)' } : false}
            stroke={stroke ?? 'var(--color-text-secondary)'}
        />
    );
}

export default PolarRadiusAxis;
