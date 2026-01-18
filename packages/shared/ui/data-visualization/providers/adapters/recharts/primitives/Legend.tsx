/**
 * Recharts Legend Primitive
 *
 * Wraps Recharts Legend component with unified props.
 */

import React from 'react';
import { Legend as RechartsLegend } from 'recharts';

import type { LegendProps } from '../../../../primitives/types';

/**
 * Legend for Recharts
 */
export function Legend({
    layout = 'horizontal',
    align = 'center',
    verticalAlign = 'bottom',
    iconSize = 14,
    iconType = 'rect',
    content,
    onClick,
    wrapperStyle,
}: LegendProps) {
    return (
        <RechartsLegend
            layout={layout}
            align={align}
            verticalAlign={verticalAlign}
            iconSize={iconSize}
            iconType={iconType}
            content={content as React.ReactElement}
            onClick={onClick}
            wrapperStyle={{
                paddingTop: 'var(--spacing-4)',
                ...wrapperStyle,
            }}
        />
    );
}

export default Legend;
