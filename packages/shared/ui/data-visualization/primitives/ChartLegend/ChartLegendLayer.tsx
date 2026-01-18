import React from 'react';
import { useChartComponents } from '../../providers/ChartProvider';
import { ChartLegend } from './ChartLegend';
import type { ChartLegendProps, ChartLegendPayloadItem } from './types';

export interface ChartLegendLayerProps extends ChartLegendProps {
    /** Whether to show the legend */
    show?: boolean;
    /** Position relative to chart */
    position?: 'top' | 'bottom';
}

/** Recharts legend content props */
interface RechartsLegendContentProps {
    payload?: ChartLegendPayloadItem[];
    [key: string]: unknown;
}

/**
 * ChartLegendLayer
 */
export function ChartLegendLayer({
    show = true,
    position = 'bottom',
    ...props
}: ChartLegendLayerProps) {
    const { Legend } = useChartComponents();

    if (!show) return null;

    return (
        <Legend
            verticalAlign={position}
            content={(rechartsProps: RechartsLegendContentProps) => {
                // Merge props, ensuring our custom handlers take precedence
                const mergedProps = {
                    ...rechartsProps,
                    ...props,
                    // Force our payload if provided
                    payload: props.payload || rechartsProps.payload,
                };

                return <ChartLegend {...mergedProps} />;
            }}
        />
    );
}
