/**
 * VISX Line Chart Example
 *
 * Demonstrates how to build a production-ready chart with visx primitives
 * that integrates with the Pulwave design system.
 */

import React from 'react';
import { ParentSize } from '@visx/responsive';
import { XYChart, LineSeries, Axis, Grid, Tooltip, AnimatedLineSeries } from '@visx/xychart';
import { curveNatural } from '@visx/curve';
import { useChartContext } from '../../../ChartProvider';

export interface VISXLineChartExampleProps {
    data: Array<{
        date: string;
        value: number;
    }>;
    width?: number;
    height?: number;
    animated?: boolean;
    showGrid?: boolean;
    showTooltip?: boolean;
    curve?: 'natural' | 'linear' | 'step';
}

/**
 * Production-ready line chart using visx
 *
 * Features:
 * - Responsive sizing with ParentSize
 * - Design system integration
 * - Smooth animations
 * - Interactive tooltip
 * - Accessible
 */
export function VISXLineChartExample({
    data,
    width,
    height = 400,
    animated = true,
    showGrid = true,
    showTooltip = true,
    curve = 'natural',
}: VISXLineChartExampleProps) {
    const {
        semanticColors,
        getColor,
        typography,
        config,
    } = useChartContext();

    // Data accessors
    type DataPoint = { date: string; value: number };
    const accessors = {
        xAccessor: (d: DataPoint) => new Date(d.date),
        yAccessor: (d: DataPoint) => d.value,
    };

    // Select curve type
    const getCurve = () => {
        switch (curve) {
            case 'natural': return curveNatural;
            case 'step': return undefined; // Use step interpolation
            default: return undefined; // Linear
        }
    };

    // Choose series component based on animation preference
    const SeriesComponent = animated ? AnimatedLineSeries : LineSeries;

    // Chart content
    const renderChart = (chartWidth: number, chartHeight: number) => (
        <XYChart
            width={chartWidth}
            height={chartHeight}
            margin={{ top: 20, right: 20, bottom: 40, left: 50 }}
            xScale={{ type: 'time' }}
            yScale={{ type: 'linear' }}
        >
            {/* Grid */}
            {showGrid && (
                <Grid
                    rows
                    columns
                    stroke={semanticColors.grid}
                    strokeDasharray="3,3"
                />
            )}

            {/* Axes */}
            <Axis
                orientation="bottom"
                stroke={semanticColors.axis}
                tickStroke={semanticColors.axis}
                tickLabelProps={() => ({
                    fill: semanticColors.text,
                    fontSize: typography.fontSize.tick,
                    fontFamily: typography.fontFamily,
                    textAnchor: 'middle',
                })}
                label="Date"
                labelProps={{
                    fill: semanticColors.text,
                    fontSize: typography.fontSize.label,
                    fontFamily: typography.fontFamily,
                }}
            />
            <Axis
                orientation="left"
                stroke={semanticColors.axis}
                tickStroke={semanticColors.axis}
                tickLabelProps={() => ({
                    fill: semanticColors.text,
                    fontSize: typography.fontSize.tick,
                    fontFamily: typography.fontFamily,
                    textAnchor: 'end',
                    dy: '0.25em',
                })}
                label="Value"
                labelProps={{
                    fill: semanticColors.text,
                    fontSize: typography.fontSize.label,
                    fontFamily: typography.fontFamily,
                }}
            />

            {/* Line Series */}
            <SeriesComponent
                dataKey="line"
                data={data}
                xAccessor={accessors.xAccessor}
                yAccessor={accessors.yAccessor}
                stroke={getColor(0)}
                strokeWidth={2}
                curve={getCurve()}
            />

            {/* Tooltip */}
            {showTooltip && (
                <Tooltip
                    renderTooltip={({ tooltipData }) => {
                        const datum = tooltipData?.nearestDatum?.datum as { date: string; value: number } | undefined;
                        if (!datum) return null;

                        return (
                            <div
                                style={{
                                    background: semanticColors.backgroundElevated,
                                    color: semanticColors.text,
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                    border: `1px solid ${semanticColors.border}`,
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                    fontSize: typography.fontSize.label,
                                    fontFamily: typography.fontFamily,
                                }}
                            >
                                <div style={{
                                    fontSize: typography.fontSize.tick,
                                    color: semanticColors.textMuted,
                                    marginBottom: '4px',
                                }}>
                                    {new Date(datum.date).toLocaleDateString()}
                                </div>
                                <div style={{
                                    fontSize: typography.fontSize.label,
                                    fontWeight: typography.fontWeight.medium,
                                    color: getColor(0),
                                }}>
                                    {datum.value.toLocaleString()}
                                </div>
                            </div>
                        );
                    }}
                />
            )}
        </XYChart>
    );

    // If explicit width provided, render directly
    if (width) {
        return renderChart(width, height);
    }

    // Otherwise, use responsive container
    return (
        <ParentSize debounceTime={config.animate ? 300 : 0}>
            {({ width: parentWidth, height: parentHeight }) =>
                renderChart(parentWidth, parentHeight)
            }
        </ParentSize>
    );
}

export default VISXLineChartExample;
