import React, { useMemo, useState, useCallback, useRef } from 'react';
import { cn } from '@pulwave/utils';
import { useChartContext } from '../../../providers/ChartProvider';
import { ChartShell } from '../../../primitives/ChartShell';
import ChartLegend from '../../../primitives/ChartLegend';
import { SVGTooltip } from '../../../components/SVGTooltip';
import { useSVGTooltip } from '../../../hooks/useSVGTooltip';
import { parallelCoordinatesPlotVariants, type ParallelCoordinatesPlotProps } from './types';
import './styles/_index.scss';

/**
 * ParallelCoordinatesPlot Component
 * 
 * Multi-dimensional data visualization with parallel vertical axes.
 */
export const ParallelCoordinatesPlot = ({
    data = [],
    dimensions = [],
    width = 600,
    height = 400,
    showLabels = true,
    showTicks = true,
    lineWidth = 2,
    highlightOnHover = true,
    className,
}: ParallelCoordinatesPlotProps) => {
    const { getColor } = useChartContext();
    const { tooltip, getHandlers } = useSVGTooltip();
    const svgRef = useRef<SVGSVGElement>(null);

    const padding = { top: 40, right: 40, bottom: 30, left: 40 };
    const chartWidth = (width as number) - padding.left - padding.right;
    const chartHeight = (height as number) - padding.top - padding.bottom;

    // Calculate axis positions and scales
    const axes = useMemo(() => {
        const axisSpacing = chartWidth / (dimensions.length - 1 || 1);

        return dimensions.map((dim: string, idx: number) => {
            const values = data.map((d: any) => d[dim]).filter((v: any) => typeof v === 'number');
            const min = Math.min(...values);
            const max = Math.max(...values);
            const range = (max - min) || 1;

            return {
                key: dim,
                label: dim.charAt(0).toUpperCase() + dim.slice(1),
                x: padding.left + idx * axisSpacing,
                min,
                max,
                scale: (value: number) => {
                    return padding.top + chartHeight - ((value - min) / range) * chartHeight;
                },
            };
        });
    }, [dimensions, data, chartWidth, chartHeight]);

    // Generate line paths for each data item
    const lines = useMemo(() => {
        return data.map((item: any, idx: number) => {
            let path = '';
            axes.forEach((axis: any, ai: number) => {
                const value = item[axis.key];
                if (typeof value === 'number') {
                    const x = axis.x;
                    const y = axis.scale(value);
                    if (ai === 0) {
                        path = `M ${x} ${y}`;
                    } else {
                        path += ` L ${x} ${y}`;
                    }
                }
            });

            return {
                ...item,
                path,
                color: item.color || getColor(idx),
            };
        });
    }, [data, axes, getColor]);

    const [hoveredLine, setHoveredLine] = useState<number | null>(null);

    // Handle legend hover - highlight corresponding line
    const handleLegendHover = useCallback((index: number) => {
        if (!svgRef.current) return;
        setHoveredLine(index);

        const path = svgRef.current.querySelector(`[data-line-index="${index}"]`);
        if (path) {
            path.classList.add('chart--parallel-coordinates__data-path--legend-hovered');
        }
    }, []);

    const handleLegendLeave = useCallback(() => {
        if (!svgRef.current) return;
        setHoveredLine(null);

        const paths = svgRef.current.querySelectorAll('.chart--parallel-coordinates__data-path--legend-hovered');
        paths.forEach(p => p.classList.remove('chart--parallel-coordinates__data-path--legend-hovered'));
    }, []);

    return (
        <ChartShell
            className={cn(parallelCoordinatesPlotVariants(), className)}
            height={height}
            width={width}
        >
            <div className="chart--parallel-coordinates__scroll-container">
                <svg ref={svgRef} width={width} height={height} className="chart--parallel-coordinates__svg" role="img" aria-label={`Parallel coordinates plot with ${data.length} data series`}>
                    {/* Axes */}
                    {axes.map((axis: any, idx: number) => (
                        <g key={idx}>
                            <line
                                x1={axis.x}
                                y1={padding.top}
                                x2={axis.x}
                                y2={padding.top + chartHeight}
                                className="chart--parallel-coordinates__axis-line"
                            />

                            {showLabels && (
                                <text
                                    x={axis.x}
                                    y={padding.top - 15}
                                    className="chart--parallel-coordinates__axis-label"
                                >
                                    {axis.label}
                                </text>
                            )}

                            {showTicks && [0, 0.5, 1].map((t: number, ti: number) => {
                                const value = axis.min + (axis.max - axis.min) * t;
                                const y = axis.scale(value);
                                return (
                                    <g key={ti}>
                                        <line
                                            x1={axis.x - 5}
                                            y1={y}
                                            x2={axis.x + 5}
                                            y2={y}
                                            className="chart--parallel-coordinates__tick-line"
                                        />
                                        <text
                                            x={axis.x - 10}
                                            y={y + 4}
                                            className="chart--parallel-coordinates__tick-label"
                                        >
                                            {value.toFixed(0)}
                                        </text>
                                    </g>
                                );
                            })}
                        </g>
                    ))}

                    {/* Data lines */}
                    {lines.map((line: any, idx: number) => {
                        const isHovered = hoveredLine === idx;
                        const opacity = highlightOnHover
                            ? (hoveredLine === null ? 0.6 : (isHovered ? 1 : 0.1))
                            : 0.6;
                        const tooltipHandlers = getHandlers(line.name || `Item ${idx + 1}`);

                        return (
                            <path
                                key={idx}
                                d={line.path}
                                data-line-index={idx}
                                stroke={line.color}
                                strokeWidth={isHovered ? (lineWidth as number) + 1 : lineWidth}
                                strokeOpacity={opacity}
                                onMouseEnter={(e) => {
                                    setHoveredLine(idx);
                                    tooltipHandlers.onMouseEnter(e);
                                }}
                                onMouseLeave={() => {
                                    setHoveredLine(null);
                                    tooltipHandlers.onMouseLeave();
                                }}
                                className="chart--parallel-coordinates__data-path"
                            />
                        );
                    })}
                </svg>

                <SVGTooltip tooltip={tooltip} />

                {data.length <= 10 && (
                    <ChartLegend
                        payload={lines.map((line: any, idx: number) => ({
                            id: String(idx),
                            value: line.name || `Item ${idx + 1}`,
                            color: line.color,
                        }))}
                        iconType="line"
                        activeIndex={hoveredLine}
                        onItemHover={handleLegendHover}
                        onItemLeave={handleLegendLeave}
                    />
                )}
            </div>
        </ChartShell>
    );
};

export default ParallelCoordinatesPlot;
