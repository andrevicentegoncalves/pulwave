/**
 * Recharts CartesianGrid Primitive
 *
 * Wraps Recharts CartesianGrid component with unified props.
 */

import React from 'react';
import { CartesianGrid as RechartsCartesianGrid } from 'recharts';

import type { GridProps } from '../../../../primitives/types';

/**
 * CartesianGrid for Recharts
 */
export function CartesianGrid({
    horizontal = true,
    vertical = true,
    stroke,
    strokeDasharray = '3 3',
    strokeOpacity,
}: GridProps) {
    return (
        <RechartsCartesianGrid
            horizontal={horizontal}
            vertical={vertical}
            stroke={stroke ?? 'var(--color-border-default)'}
            strokeDasharray={strokeDasharray}
            strokeOpacity={strokeOpacity}
        />
    );
}

export default CartesianGrid;
