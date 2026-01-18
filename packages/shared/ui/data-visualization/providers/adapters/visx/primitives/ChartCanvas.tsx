/**
 * VISX ChartCanvas Primitive
 *
 * Wraps visx XYChart to provide a chart canvas.
 */

import React from 'react';
import { XYChart, lightTheme, darkTheme } from '@visx/xychart';
import { ParentSize } from '@visx/responsive';

import type { ChartCanvasProps } from '../../../../primitives/types';

// Extend ChartCanvasProps with visx-specific options
interface VISXChartCanvasProps extends ChartCanvasProps {
    /** Theme for visx charts */
    theme?: 'light' | 'dark';
}

/**
 * ChartCanvas for VISX
 *
 * Uses XYChart as the base container for all chart types.
 */
export function ChartCanvas({
    width = '100%',
    height = 300,
    margin = { top: 20, right: 20, bottom: 40, left: 50 },
    xScale,
    yScale,
    children,
    className,
    theme = 'light',
}: VISXChartCanvasProps) {
    const chartTheme = theme === 'dark' ? darkTheme : lightTheme;

    // Convert scale config to visx format with proper typing
    const xScaleConfig = xScale
        ? {
              type: (xScale.type === 'band' ? 'band' : xScale.type === 'time' ? 'time' : 'linear') as 'band' | 'time' | 'linear',
              paddingInner: xScale.paddingInner ?? 0.2,
              paddingOuter: xScale.paddingOuter ?? 0.1,
          }
        : { type: 'band' as const, paddingInner: 0.2, paddingOuter: 0.1 };

    const yScaleConfig = yScale
        ? {
              type: (yScale.type === 'log' ? 'log' : 'linear') as 'log' | 'linear',
              nice: yScale.nice ?? true,
          }
        : { type: 'linear' as const, nice: true };

    const renderChart = (chartWidth: number, chartHeight: number) => (
        <XYChart
            width={chartWidth}
            height={chartHeight}
            margin={{
                top: margin.top ?? 20,
                right: margin.right ?? 20,
                bottom: margin.bottom ?? 40,
                left: margin.left ?? 50,
            }}
            xScale={xScaleConfig}
            yScale={yScaleConfig}
            theme={chartTheme}
        >
            {children}
        </XYChart>
    );

    // Handle responsive width
    if (typeof width === 'string' && width === '100%') {
        return (
            <div className={className} style={{ width: '100%', height }}>
                <ParentSize debounceTime={100}>
                    {({ width: parentWidth }) => {
                        if (parentWidth <= 0) return null;
                        return renderChart(parentWidth, typeof height === 'number' ? height : 300);
                    }}
                </ParentSize>
            </div>
        );
    }

    // Fixed width
    return (
        <div className={className}>
            {renderChart(typeof width === 'number' ? width : 600, typeof height === 'number' ? height : 300)}
        </div>
    );
}

export default ChartCanvas;
