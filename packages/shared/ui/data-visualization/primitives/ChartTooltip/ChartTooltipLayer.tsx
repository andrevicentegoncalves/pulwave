import React from 'react';
import { useChartComponents } from '../../providers/ChartProvider';
import { useResolvedSemanticColors } from '../../hooks/useResolvedSemanticColors';
import { ChartTooltip } from './ChartTooltip';
import type { ChartTooltipProps } from './types';

export interface ChartTooltipLayerProps extends Omit<ChartTooltipProps, 'active' | 'payload' | 'label'> {
    /** Cursor style configuration */
    cursor?: boolean | object | React.ReactElement;
    /** Whether to show the tooltip */
    show?: boolean;
}

/**
 * ChartTooltipLayer
 */
export function ChartTooltipLayer({
    show = true,
    cursor,
    ...props
}: ChartTooltipLayerProps) {
    const { Tooltip } = useChartComponents();
    // Use resolved colors for SVG cursor fill
    const semanticColors = useResolvedSemanticColors();

    if (!show) return null;

    // Default cursor style if not provided
    const defaultCursor = {
        fill: semanticColors.border,
        opacity: 0.1
    };

    return (
        <Tooltip
            content={<ChartTooltip {...props} />}
            cursor={cursor !== undefined ? cursor : defaultCursor}
        />
    );
}
