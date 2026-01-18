/**
 * Recharts PolarGrid Primitive
 *
 * Wraps Recharts PolarGrid component with unified props.
 */

import React from 'react';
import { PolarGrid as RechartsPolarGrid } from 'recharts';

import type { PolarGridProps } from '../../../../primitives/types';

/**
 * PolarGrid for Recharts
 */
export function PolarGrid({
    gridType = 'polygon',
    radialLines = true,
    stroke,
    strokeDasharray,
}: PolarGridProps) {
    return (
        <RechartsPolarGrid
            gridType={gridType}
            radialLines={radialLines}
            stroke={stroke ?? 'var(--color-border-default)'}
            strokeDasharray={strokeDasharray}
        />
    );
}

export default PolarGrid;
