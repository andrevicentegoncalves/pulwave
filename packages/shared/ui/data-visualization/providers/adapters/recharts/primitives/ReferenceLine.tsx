/**
 * Recharts ReferenceLine Primitive
 *
 * Wraps Recharts ReferenceLine component with unified props.
 */

import React from 'react';
import { ReferenceLine as RechartsReferenceLine } from 'recharts';

import type { ReferenceLineProps } from '../../../../primitives/types';

/**
 * ReferenceLine for Recharts
 *
 * Note: isFront prop is accepted but not passed to Recharts as it's not supported.
 * Recharts renders reference lines in their declared order.
 */
export function ReferenceLine({
    x,
    y,
    stroke,
    strokeWidth = 1,
    strokeDasharray,
    label,
    // isFront is accepted for API compatibility but not used by Recharts
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isFront = false,
}: ReferenceLineProps) {
    // Cast label to string if it's a ReactElement (Recharts has specific types)
    const labelProp = typeof label === 'string' ? label : undefined;

    return (
        <RechartsReferenceLine
            x={x}
            y={y}
            stroke={stroke ?? 'var(--color-feedback-warning)'}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            label={labelProp}
        />
    );
}

export default ReferenceLine;
