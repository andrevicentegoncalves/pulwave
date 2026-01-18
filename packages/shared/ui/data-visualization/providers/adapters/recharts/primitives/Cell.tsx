/**
 * Recharts Cell Primitive
 *
 * Wraps Recharts Cell component with unified props.
 */

import React from 'react';
import { Cell as RechartsCell } from 'recharts';

import type { CellProps } from '../../../../primitives/types';

/**
 * Cell for Recharts
 */
export function Cell({ fill, stroke, strokeWidth, cursor, onClick }: CellProps) {
    return (
        <RechartsCell
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            cursor={cursor}
            onClick={onClick}
        />
    );
}

export default Cell;
