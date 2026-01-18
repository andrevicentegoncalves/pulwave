/**
 * Recharts Label Primitive
 *
 * Wraps Recharts Label component with unified props.
 */

import React from 'react';
import { Label as RechartsLabel } from 'recharts';

import type { LabelProps } from '../../../../primitives/types';

/**
 * Label for Recharts
 */
export function Label({
    value,
    position = 'top',
    offset = 5,
    fill,
    fontSize = 12,
    fontWeight = 'normal',
}: LabelProps) {
    return (
        <RechartsLabel
            value={value}
            position={position}
            offset={offset}
            fill={fill ?? 'var(--color-text-primary)'}
            fontSize={fontSize}
            fontWeight={fontWeight}
        />
    );
}

export default Label;
