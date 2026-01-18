/**
 * Recharts ChartCanvas Primitive
 *
 * Wraps Recharts ResponsiveContainer and chart containers.
 */

import React from 'react';
import { ResponsiveContainer, ComposedChart } from 'recharts';

import type { ChartCanvasProps } from '../../../../primitives/types';

/**
 * ChartCanvas for Recharts
 *
 * Uses ComposedChart as the base container since it supports all series types.
 */
export function ChartCanvas({
    data = [],
    width = '100%',
    height = 300,
    margin = { top: 20, right: 20, bottom: 20, left: 20 },
    children,
    className,
}: ChartCanvasProps) {
    const containerWidth = typeof width === 'number' ? width : '100%';
    const containerHeight = height;

    return (
        <ResponsiveContainer width={containerWidth} height={containerHeight} className={className}>
            <ComposedChart
                data={data}
                margin={{
                    top: margin.top ?? 20,
                    right: margin.right ?? 20,
                    bottom: margin.bottom ?? 20,
                    left: margin.left ?? 20,
                }}
            >
                {children}
            </ComposedChart>
        </ResponsiveContainer>
    );
}

export default ChartCanvas;
