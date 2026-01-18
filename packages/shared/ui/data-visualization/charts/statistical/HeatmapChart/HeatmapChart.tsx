import React, { useMemo, useState } from 'react';
import { cn } from '@pulwave/utils';
import { useChartContext } from '../../../providers/ChartProvider';
import { heatmapChartVariants, type HeatmapChartProps, type HeatmapDataItem } from './types';
import './styles/_index.scss';

/**
 * HeatmapChart Component
 * 
 * Displays matrix data as colored cells.
 * Useful for showing patterns across two dimensions.
 */
export const HeatmapChart = ({
    data = [],
    xLabels = [],
    yLabels = [],
    rowKey = 'row',
    colKey = 'col',
    valueKey = 'value',
    height = 400,
    cellSize,
    cellGap = 2,
    colorScale = 'sequential',
    showValues = true,
    showLabels = true,
    showLegend = true,
    valueFormatter = (v: number | undefined) => v?.toLocaleString() ?? '',
    minValue,
    maxValue,
    onCellClick,
    className,
}: HeatmapChartProps) => {
    const { semanticColors } = useChartContext();
    const [hoveredCell, setHoveredCell] = useState<{ row: string; col: string; value: number } | null>(null);

    // Create matrix from data
    const matrix = useMemo(() => {
        const grid: Record<string, Record<string, number>> = {};
        data.forEach((item: HeatmapDataItem) => {
            const row = item[rowKey as string];
            const col = item[colKey as string];
            if (!grid[row]) grid[row] = {};
            grid[row][col] = item[valueKey as string];
        });
        return grid;
    }, [data, rowKey, colKey, valueKey]);

    // Calculate min/max values
    const [computedMin, computedMax] = useMemo(() => {
        const values = data.map((d: any) => d[valueKey as string]).filter((v: any) => typeof v === 'number');
        if (values.length === 0) return [0, 100];
        return [
            minValue ?? Math.min(...values),
            maxValue ?? Math.max(...values),
        ];
    }, [data, valueKey, minValue, maxValue]);

    // Color interpolation
    const getCellStyle = (value: number) => {
        if (typeof value !== 'number') return { backgroundColor: semanticColors.backgroundElevated, opacity: 1 };

        const ratio = computedMax === computedMin
            ? 0.5
            : (value - computedMin) / (computedMax - computedMin);

        let color = semanticColors.primary;
        let opacity = 1;

        if (colorScale === 'diverging') {
            if (ratio < 0.3) {
                color = semanticColors.error;
                opacity = 1;
            } else if (ratio < 0.45) {
                color = semanticColors.warning; // Approximation for light red/orange
                opacity = 1;
            } else if (ratio < 0.55) {
                color = semanticColors.grid; // Neutral
                opacity = 1;
            } else if (ratio < 0.7) {
                color = semanticColors.success;
                opacity = 0.5; // Light green
            } else {
                color = semanticColors.success;
                opacity = 1;
            }
        } else {
            // Sequential
            color = semanticColors.primary;
            if (ratio < 0.2) opacity = 0.1;
            else if (ratio < 0.4) opacity = 0.3;
            else if (ratio < 0.6) opacity = 0.5;
            else if (ratio < 0.8) opacity = 0.8;
            else opacity = 1;
        }

        return { backgroundColor: color, opacity };
    };

    const getTextColor = (value: number) => {
        if (typeof value !== 'number') return semanticColors.textMuted;
        const ratio = computedMax === computedMin
            ? 0.5
            : (value - computedMin) / (computedMax - computedMin);

        // For varying opacity/colors, simple threshold for contrast
        // Assuming > 0.6 opacity/intensity is dark enough for white text
        return ratio > 0.6 ? 'var(--color-white)' : semanticColors.text;
    };

    const computedCellSize = cellSize || Math.min(40, ((height as number) - 60) / (yLabels.length || 1));
    const gridHeight = (computedCellSize + cellGap) * yLabels.length;

    // Check for empty state
    const isEmpty = data.length === 0 || xLabels.length === 0 || yLabels.length === 0;

    if (isEmpty) {
        return (
            <div
                className={cn(heatmapChartVariants({ colorScale }), 'chart--heatmap--empty', className)}
                style={{ height: typeof height === 'number' ? `${height}px` : height }}
            >
                <div className="chart__empty-state">
                    <p>No data available for heatmap</p>
                </div>
            </div>
        );
    }

    return (
        <div
            className={cn(heatmapChartVariants({ colorScale }), className)}
            style={{
                minHeight: typeof height === 'number' ? `${Math.min(height, gridHeight + 120)}px` : height,
                height: 'auto'
            }}
        >
            <div className="chart--heatmap__scroll-container" style={{
                maxHeight: typeof height === 'number' ? `${height}px` : height
            }}>
                <div className="chart--heatmap__wrapper">
                    <div className="chart--heatmap__container">
                        {/* Y-axis labels */}
                        {showLabels && (
                            <div
                                className="chart--heatmap__y-labels"
                                style={{ height: gridHeight }}
                            >
                                {yLabels.map((label, i) => (
                                    <div
                                        key={i}
                                        className="chart--heatmap__label chart--heatmap__label--y"
                                        style={{ height: computedCellSize + cellGap }}
                                    >
                                        {label}
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="chart--heatmap__grid-container">
                            {/* Grid */}
                            <div
                                className="chart--heatmap__grid"
                                style={{
                                    gridTemplateColumns: `repeat(${xLabels.length}, ${computedCellSize}px)`,
                                    gap: cellGap,
                                }}
                            >
                                {yLabels.map((row) =>
                                    xLabels.map((col) => {
                                        const value = matrix[row]?.[col];
                                        const isHovered = hoveredCell?.row === row && hoveredCell?.col === col;
                                        const cellStyle = getCellStyle(value);

                                        return (
                                            <div
                                                key={`${row}-${col}`}
                                                className={cn('chart--heatmap__cell', {
                                                    'chart--heatmap__cell--hovered': isHovered
                                                })}
                                                style={{
                                                    width: computedCellSize,
                                                    height: computedCellSize,
                                                    ...cellStyle,
                                                    cursor: onCellClick ? 'pointer' : 'default',
                                                }}
                                                onClick={() => onCellClick?.({ row, col, value })}
                                                onMouseEnter={() => setHoveredCell({ row, col, value })}
                                                onMouseLeave={() => setHoveredCell(null)}
                                            >
                                                {showValues && computedCellSize >= 30 && (
                                                    <span
                                                        className="chart--heatmap__value"
                                                        style={{ color: getTextColor(value) }}
                                                    >
                                                        {valueFormatter(value)}
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* X-axis labels */}
                            {showLabels && (
                                <div
                                    className="chart--heatmap__x-labels"
                                    style={{
                                        gridTemplateColumns: `repeat(${xLabels.length}, ${computedCellSize}px)`,
                                        gap: cellGap,
                                    }}
                                >
                                    {xLabels.map((label, i) => (
                                        <div
                                            key={i}
                                            className="chart--heatmap__label chart--heatmap__label--x"
                                        >
                                            {label}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Legend */}
                            {showLegend && (
                                <div className="chart--heatmap__legend">
                                    <span className="chart--heatmap__legend-text">{valueFormatter(computedMin)}</span>
                                    <div
                                        className="chart--heatmap__legend-bar"
                                        style={{
                                            background: colorScale === 'diverging'
                                                ? `linear-gradient(to right, ${semanticColors.error}, ${semanticColors.warning}, ${semanticColors.grid}, ${semanticColors.success})`
                                                : `linear-gradient(to right, color-mix(in srgb, ${semanticColors.primary}, transparent 90%), ${semanticColors.primary})`
                                        }}
                                    />
                                    <span className="chart--heatmap__legend-text">{valueFormatter(computedMax)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tooltip placeholder */}
            {hoveredCell && (
                <div className="chart--heatmap__tooltip">
                    {/* Tooltip implementation would go here if needed as absolute overlay */}
                </div>
            )}
        </div>
    );
};

export default HeatmapChart;
