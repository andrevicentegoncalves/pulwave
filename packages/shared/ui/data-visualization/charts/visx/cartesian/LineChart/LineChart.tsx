import React, { forwardRef, useMemo } from 'react';
import { XYChart, LineSeries, AreaSeries, Axis, Grid, Tooltip, GlyphSeries } from '@visx/xychart';
import { LegendOrdinal } from '@visx/legend';
import { scaleOrdinal } from '@visx/scale';
import { ChartShell } from '../../../../primitives/ChartShell';
import { useChartColors } from '../../../../hooks/useChartColors';
import { useResolvedSemanticColors } from '../../../../hooks/useResolvedSemanticColors';
import { cn } from '@pulwave/utils';
import { lineChartVariants, type LineChartProps, type ChartDataItem } from './types';
import './styles/_index.scss';

/**
 * LineChart Component (visx implementation)
 * Displays data as connected lines with optional dots and area fill using visx primitives.
 */
export const LineChart = forwardRef<HTMLDivElement, LineChartProps>(({
    data = [],
    xKey,
    yKeys = [],
    yKeyNames = {},
    width = '100%',
    height = 300,
    variant = 'line',
    smooth = true,
    showDots = true,
    strokeWidth = 2,
    showGrid = true,
    showXAxis = true,
    showYAxis = true,
    showTooltip = true,
    showLegend = true,
    legendPosition = 'bottom',
    colors,
    animate = true,
    xAxisFormatter,
    yAxisFormatter,
    className,
    ariaLabel,
    ...restProps
}, ref) => {
    const semanticColors = useResolvedSemanticColors();
    const chartColors = useChartColors(yKeys.length, colors);

    const numericWidth = typeof width === 'number' ? width : 600;
    const numericHeight = typeof height === 'number' ? height : 300;

    const isArea = variant === 'area';
    const curveType = smooth ? 'monotoneX' : 'linear';

    // Create accessors for visx
    const accessors = useMemo(() => ({
        xAccessor: (d: ChartDataItem) => d[xKey],
        yAccessor: (d: ChartDataItem, key: string) => d[key],
    }), [xKey]);

    // Legend scale
    const legendScale = scaleOrdinal({
        domain: yKeys.map(key => yKeyNames[key] || key),
        range: chartColors,
    });

    return (
        <ChartShell
            ref={ref}
            width={width}
            height={height}
            className={cn(lineChartVariants({ variant }), className)}
            role="img"
            aria-label={ariaLabel || `Line chart showing ${yKeys.join(', ')}`}
            {...restProps}
        >
            <XYChart
                width={numericWidth}
                height={numericHeight}
                xScale={{ type: 'band' }}
                yScale={{ type: 'linear' }}
                margin={{ top: 20, right: 20, bottom: 40, left: 60 }}
            >
                {showGrid && (
                    <Grid
                        columns={false}
                        rows={true}
                        stroke={semanticColors.grid}
                    />
                )}

                {showXAxis && (
                    <Axis
                        orientation="bottom"
                        stroke={semanticColors.axis}
                        tickStroke={semanticColors.axis}
                        tickLabelProps={() => ({
                            fill: semanticColors.text,
                            fontSize: 11,
                            textAnchor: 'middle',
                        })}
                        tickFormat={xAxisFormatter}
                    />
                )}

                {showYAxis && (
                    <Axis
                        orientation="left"
                        stroke={semanticColors.axis}
                        tickStroke={semanticColors.axis}
                        tickLabelProps={() => ({
                            fill: semanticColors.text,
                            fontSize: 11,
                            textAnchor: 'end',
                        })}
                        tickFormat={yAxisFormatter}
                    />
                )}

                {yKeys.map((key, index) => {
                    const SeriesComponent = isArea ? AreaSeries : LineSeries;

                    return (
                        <React.Fragment key={key}>
                            <SeriesComponent
                                dataKey={key}
                                data={data}
                                xAccessor={accessors.xAccessor}
                                yAccessor={(d) => accessors.yAccessor(d, key)}
                                curve={curveType}
                                stroke={chartColors[index]}
                                strokeWidth={strokeWidth}
                                fill={isArea ? chartColors[index] : undefined}
                                fillOpacity={isArea ? 0.3 : undefined}
                            />
                            {showDots && (
                                <GlyphSeries
                                    dataKey={`${key}-dots`}
                                    data={data}
                                    xAccessor={accessors.xAccessor}
                                    yAccessor={(d) => accessors.yAccessor(d, key)}
                                    colorAccessor={() => chartColors[index]}
                                    size={4}
                                />
                            )}
                        </React.Fragment>
                    );
                })}

                {showTooltip && (
                    <Tooltip
                        snapTooltipToDatumX
                        snapTooltipToDatumY
                        showVerticalCrosshair
                        showSeriesGlyphs
                        renderTooltip={({ tooltipData }) => {
                            const datum = tooltipData?.nearestDatum?.datum as ChartDataItem | undefined;
                            if (!datum) return null;

                            return (
                                <div style={{
                                    background: semanticColors.backgroundElevated,
                                    padding: '8px 12px',
                                    borderRadius: '4px',
                                    border: `1px solid ${semanticColors.border}`,
                                    color: semanticColors.text,
                                    fontSize: '12px',
                                }}>
                                    <div>
                                        <strong>{datum[xKey]}</strong>
                                        <br />
                                        {yKeys.map((key) => (
                                            <div key={key}>
                                                {yKeyNames[key] || key}: {datum[key]}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        }}
                    />
                )}
            </XYChart>

            {showLegend && yKeys.length > 1 && (
                <div className="chart-legend" style={{
                    marginTop: legendPosition === 'bottom' ? '16px' : 0,
                    marginBottom: legendPosition === 'top' ? '16px' : 0,
                    display: 'flex',
                    justifyContent: 'center',
                }}>
                    <LegendOrdinal
                        scale={legendScale}
                        direction="row"
                        labelMargin="0 15px 0 0"
                        style={{
                            display: 'flex',
                            fontSize: '12px',
                            color: semanticColors.text,
                        }}
                    />
                </div>
            )}
        </ChartShell>
    );
});

LineChart.displayName = 'LineChart';

export default LineChart;
