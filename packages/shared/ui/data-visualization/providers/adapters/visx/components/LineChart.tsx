/**
 * VISX LineChart
 *
 * Line chart wrapper using visx XYChart.
 */

import React from 'react';
import { XYChart, LineSeries, Tooltip } from '@visx/xychart';
import type { VISXChartBaseProps, XYDataPoint } from '../types';

export interface VISXLineChartProps extends VISXChartBaseProps {
    data?: XYDataPoint[];
    xKey?: string;
    yKey?: string;
}

/**
 * LineChart component using visx
 */
export function VISXLineChart({
    width = 600,
    height = 400,
    data = [],
    margin = { top: 20, right: 20, bottom: 40, left: 40 },
    children,
}: VISXLineChartProps) {
    const accessors = {
        xAccessor: (d: XYDataPoint) => d.x ?? d.name ?? d.date,
        yAccessor: (d: XYDataPoint) => d.y ?? d.value,
    };

    return (
        <XYChart
            width={typeof width === 'number' ? width : 600}
            height={typeof height === 'number' ? height : 400}
            margin={margin}
            xScale={{ type: 'band' }}
            yScale={{ type: 'linear' }}
        >
            {children}
        </XYChart>
    );
}

export default VISXLineChart;
