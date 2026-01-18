/**
 * VISX Legend Primitive
 *
 * Wraps visx Legend with unified props.
 */

import React from 'react';
import { LegendOrdinal } from '@visx/legend';
import { scaleOrdinal } from '@visx/scale';

import type { LegendProps } from '../../../../primitives/types';

// Extend with visx-specific props
interface VISXLegendProps extends LegendProps {
    /** Legend items (required for visx) */
    items?: Array<{ label: string; color: string }>;
}

/**
 * Legend for VISX
 *
 * VISX legends are separate components that need data passed in.
 * This provides a unified interface.
 */
export function Legend({
    layout = 'horizontal',
    align = 'center',
    iconSize = 14,
    items = [],
    onClick,
    wrapperStyle,
}: VISXLegendProps) {
    if (items.length === 0) return null;

    // Create scale for legend
    const scale = scaleOrdinal({
        domain: items.map(item => item.label),
        range: items.map(item => item.color),
    });

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: layout === 'vertical' ? 'column' : 'row',
                justifyContent: align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center',
                gap: 'var(--spacing-4)',
                padding: 'var(--spacing-2) 0',
                ...wrapperStyle,
            }}
        >
            <LegendOrdinal
                scale={scale}
                direction={layout === 'vertical' ? 'column' : 'row'}
                labelMargin="0 var(--spacing-2) 0 0"
                shapeMargin="0 var(--spacing-1) 0 0"
                itemMargin="0 var(--spacing-3)"
                shapeWidth={iconSize}
                shapeHeight={iconSize}
                legendLabelProps={{
                    style: {
                        color: 'var(--color-text-secondary)',
                        fontSize: '12px',
                    },
                }}
            />
        </div>
    );
}

export default Legend;
