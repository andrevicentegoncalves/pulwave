/**
 * Recharts LabelList Primitive
 *
 * Wraps Recharts LabelList component with unified props.
 */

import React from 'react';
import { LabelList as RechartsLabelList } from 'recharts';

import type { LabelListProps } from '../../../../primitives/types';

/**
 * LabelList for Recharts
 */
export function LabelList({
    dataKey,
    position = 'top',
    formatter,
    fill,
    fontSize = 12,
}: LabelListProps) {
    return (
        <RechartsLabelList
            dataKey={dataKey}
            position={position}
            formatter={formatter}
            fill={fill ?? 'var(--color-text-primary)'}
            fontSize={fontSize}
        />
    );
}

export default LabelList;
