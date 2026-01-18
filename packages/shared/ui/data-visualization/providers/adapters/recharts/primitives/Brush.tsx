/**
 * Recharts Brush Primitive
 *
 * Wraps Recharts Brush component with unified props.
 */

import React from 'react';
import { Brush as RechartsBrush } from 'recharts';

import type { BrushProps } from '../../../../primitives/types';

/**
 * Brush for Recharts
 */
export function Brush({
    dataKey,
    height = 40,
    startIndex,
    endIndex,
    onChange,
    fill,
    stroke,
}: BrushProps) {
    return (
        <RechartsBrush
            dataKey={dataKey}
            height={height}
            startIndex={startIndex}
            endIndex={endIndex}
            onChange={onChange}
            fill={fill ?? 'var(--color-surface-secondary)'}
            stroke={stroke ?? 'var(--color-border-default)'}
        />
    );
}

export default Brush;
