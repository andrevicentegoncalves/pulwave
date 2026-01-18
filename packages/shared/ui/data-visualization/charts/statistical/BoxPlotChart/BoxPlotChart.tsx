import React, { useMemo, useState, useCallback, useRef } from 'react';
import { cn } from '@pulwave/utils';
import { useChartContext } from '../../../providers/ChartProvider';
import { ChartShell } from '../../../primitives/ChartShell';
import ChartLegend from '../../../primitives/ChartLegend';
import { SVGTooltip } from '../../../components/SVGTooltip';
import { useSVGTooltip } from '../../../hooks/useSVGTooltip';
import { boxPlotChartVariants, type BoxPlotChartProps, type BoxPlotDataItem } from './types';
import './styles/_index.scss';

/**
 * BoxPlotChart Component
 * 
 * Displays statistical distribution with min, Q1, median, Q3, max values.
 * Great for comparing distributions across categories.
 */
export const BoxPlotChart = ({
    data = [],
    categoryKey = 'category',
    height = 400,
    layout = 'vertical',
    boxWidth = 40,
    whiskerWidth = 20,
    showOutliers = true,
    showLegend = true,
    valueFormatter = (v: number) => v?.toLocaleString() ?? '',
    className,
}: BoxPlotChartProps) => {
    const { getColor, semanticColors } = useChartContext();
    const { tooltip, getHandlers } = useSVGTooltip();
    const svgRef = useRef<SVGSVGElement>(null);

    // Calculate scale
    const { minVal, maxVal } = useMemo(() => {
        let min = Infinity, max = -Infinity;
        data.forEach((d) => {
            const values = [d.min, d.q1, d.median, d.q3, d.max, ...(d.outliers || [])].filter(v => typeof v === 'number');
            if (values.length > 0) {
                min = Math.min(min, ...values);
                max = Math.max(max, ...values);
            }
        });

        if (min === Infinity) return { minVal: 0, maxVal: 100 };

        const padding = (max - min) * 0.1 || 10;
        return { minVal: min - padding, maxVal: max + padding };
    }, [data]);

    const isVertical = layout === 'vertical';
    const chartWidth = isVertical ? data.length * (boxWidth + 40) + 60 : '100%';
    const chartHeight = isVertical ? height : data.length * (boxWidth + 30) + 60;

    const scaleValue = (value: number) => {
        const range = isVertical ? (height as number) - 80 : 400;
        return ((value - minVal) / (maxVal - minVal)) * range;
    };

    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    // Handle legend hover - highlight corresponding box plot
    const handleLegendHover = useCallback((index: number) => {
        if (!svgRef.current) return;
        setHoveredIndex(index);

        const group = svgRef.current.querySelector(`[data-box-index="${index}"]`);
        if (group) {
            group.classList.add('chart--box-plot__group--legend-hovered');
        }
    }, []);

    const handleLegendLeave = useCallback(() => {
        if (!svgRef.current) return;
        setHoveredIndex(null);

        const groups = svgRef.current.querySelectorAll('.chart--box-plot__group--legend-hovered');
        groups.forEach(g => g.classList.remove('chart--box-plot__group--legend-hovered'));
    }, []);

    return (
        <ChartShell
            className={cn(boxPlotChartVariants({ layout }), className)}
            height={chartHeight}
            width={chartWidth}
        >
            <svg
                ref={svgRef}
                width={chartWidth}
                height={chartHeight}
                className="chart--box-plot__svg"
                role="img"
                aria-label={`Box plot chart with ${data.length} data series`}
            >
                {/* Y-axis ticks */}
                {isVertical && [0, 0.25, 0.5, 0.75, 1].map((t, i) => {
                    const value = minVal + (maxVal - minVal) * t;
                    const y = (height as number) - 40 - scaleValue(value);
                    return (
                        <g key={i}>
                            <line
                                x1={50}
                                y1={y}
                                x2={typeof chartWidth === 'number' ? chartWidth : '100%'}
                                y2={y}
                                className="chart--box-plot__grid"
                            />
                            <text
                                x={45}
                                y={y + 4}
                                textAnchor="end"
                                className="chart--box-plot__axis-label"
                            >
                                {value.toFixed(0)}
                            </text>
                        </g>
                    );
                })}

                {data.map((item, idx) => {
                    const color = getColor(idx);
                    const x = isVertical ? 60 + idx * (boxWidth + 40) : 60;
                    const y = isVertical ? 20 : 30 + idx * (boxWidth + 30);
                    const isHovered = hoveredIndex === idx;
                    const tooltipHandlers = getHandlers(`${item[categoryKey]}: Median ${valueFormatter(item.median)}`);

                    if (isVertical) {
                        const boxTop = (height as number) - 40 - scaleValue(item.q3);
                        const boxBottom = (height as number) - 40 - scaleValue(item.q1);
                        const boxHeight = boxBottom - boxTop;
                        const medianY = (height as number) - 40 - scaleValue(item.median);
                        const maxY = (height as number) - 40 - scaleValue(item.max);
                        const minY = (height as number) - 40 - scaleValue(item.min);

                        return (
                            <g
                                key={idx}
                                data-box-index={idx}
                                onMouseEnter={(e) => {
                                    setHoveredIndex(idx);
                                    tooltipHandlers.onMouseEnter(e);
                                }}
                                onMouseLeave={() => {
                                    setHoveredIndex(null);
                                    tooltipHandlers.onMouseLeave();
                                }}
                                className={cn('chart--box-plot__group', {
                                    'chart--box-plot__group--hovered': isHovered
                                })}
                            >
                                {/* Whisker line */}
                                <line
                                    x1={x + boxWidth / 2}
                                    y1={minY}
                                    x2={x + boxWidth / 2}
                                    y2={maxY}
                                    className="chart--box-plot__whisker-line"
                                />
                                {/* Max whisker */}
                                <line
                                    x1={x + (boxWidth - whiskerWidth) / 2}
                                    y1={maxY}
                                    x2={x + (boxWidth + whiskerWidth) / 2}
                                    y2={maxY}
                                    className="chart--box-plot__whisker-line"
                                />
                                {/* Min whisker */}
                                <line
                                    x1={x + (boxWidth - whiskerWidth) / 2}
                                    y1={minY}
                                    x2={x + (boxWidth + whiskerWidth) / 2}
                                    y2={minY}
                                    className="chart--box-plot__whisker-line"
                                />
                                {/* Box */}
                                <rect
                                    x={x}
                                    y={boxTop}
                                    width={boxWidth}
                                    height={boxHeight}
                                    fill={color}
                                    stroke={color}
                                    rx={2}
                                    className="chart--box-plot__box"
                                />
                                {/* Median line */}
                                <line
                                    x1={x}
                                    y1={medianY}
                                    x2={x + boxWidth}
                                    y2={medianY}
                                    className="chart--box-plot__median-line"
                                />
                                {/* Outliers */}
                                {showOutliers && item.outliers?.map((o, oi) => (
                                    <circle
                                        key={oi}
                                        cx={x + boxWidth / 2}
                                        cy={(height as number) - 40 - scaleValue(o)}
                                        r={4}
                                        fill={color}
                                        className="chart--box-plot__outlier"
                                    />
                                ))}
                            </g>
                        );
                    }

                    // Horizontal layout
                    const boxLeft = 60 + scaleValue(item.q1);
                    const boxRight = 60 + scaleValue(item.q3);
                    const boxWidthVal = boxRight - boxLeft;
                    const medianX = 60 + scaleValue(item.median);
                    const maxX = 60 + scaleValue(item.max);
                    const minX = 60 + scaleValue(item.min);

                    return (
                        <g
                            key={idx}
                            data-box-index={idx}
                            onMouseEnter={(e) => {
                                setHoveredIndex(idx);
                                tooltipHandlers.onMouseEnter(e);
                            }}
                            onMouseLeave={() => {
                                setHoveredIndex(null);
                                tooltipHandlers.onMouseLeave();
                            }}
                            className={cn('chart--box-plot__group', {
                                'chart--box-plot__group--hovered': isHovered
                            })}
                        >
                            {/* Whisker line */}
                            <line
                                x1={minX}
                                y1={y + boxWidth / 2}
                                x2={maxX}
                                y2={y + boxWidth / 2}
                                className="chart--box-plot__whisker-line"
                            />
                            {/* Box */}
                            <rect
                                x={boxLeft}
                                y={y}
                                width={boxWidthVal}
                                height={boxWidth}
                                fill={color}
                                stroke={color}
                                rx={2}
                                className="chart--box-plot__box"
                            />
                            {/* Median line */}
                            <line
                                x1={medianX}
                                y1={y}
                                x2={medianX}
                                y2={y + boxWidth}
                                className="chart--box-plot__median-line"
                            />
                        </g>
                    );
                })}
            </svg>

            {showLegend && (
                <ChartLegend
                    payload={data.map((item, idx) => ({
                        id: String(idx),
                        value: String(item[categoryKey]),
                        color: getColor(idx),
                    }))}
                    activeIndex={hoveredIndex}
                    onItemHover={handleLegendHover}
                    onItemLeave={handleLegendLeave}
                />
            )}

            <SVGTooltip tooltip={tooltip} />
        </ChartShell>
    );
};

export default BoxPlotChart;
