/**
 * Recharts ReferenceArea Primitive
 *
 * Wraps Recharts ReferenceArea component with unified props.
 */

import React from 'react';
import { ReferenceArea as RechartsReferenceArea } from 'recharts';

import type { ReferenceAreaProps } from '../../../../primitives/types';

/**
 * ReferenceArea for Recharts
 */
export function ReferenceArea({
    x1,
    x2,
    y1,
    y2,
    fill,
    fillOpacity = 0.3,
    stroke,
    label,
}: ReferenceAreaProps) {
    // Cast label to string if it's a ReactElement
    const labelProp = typeof label === 'string' ? label : undefined;

    return (
        <RechartsReferenceArea
            x1={x1}
            x2={x2}
            y1={y1}
            y2={y2}
            fill={fill ?? 'var(--color-feedback-info)'}
            fillOpacity={fillOpacity}
            stroke={stroke}
            label={labelProp}
        />
    );
}

export default ReferenceArea;
