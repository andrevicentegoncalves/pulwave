import { useMemo, useState, useCallback } from 'react';
import { cn } from '@pulwave/utils';
import { useChartContext } from '../../../providers/ChartProvider';
import { ChartShell } from '../../../primitives/ChartShell';
import ChartLegend from '../../../primitives/ChartLegend';
import { SVGTooltip } from '../../../components/SVGTooltip';
import { useSVGTooltip } from '../../../hooks/useSVGTooltip';
import { radialBarChartVariants, type RadialBarChartProps } from './types';
import './styles/_index.scss';

/**
 * RadialBarChart Component
 *
 * Circular bar chart with bars radiating from center.
 */
export const RadialBarChart = ({
    data = [],
    size = 400,
    innerRadius = 60,
    barGap = 8,
    maxValue = null,
    showLabels = true,
    showValues = true,
    startAngle = -90,
    endAngle = 270,
    valueFormatter = (v: number) => `${v}%`,
    className,
}: RadialBarChartProps) => {
    const { getColor, semanticColors } = useChartContext();
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const { tooltip, getHandlers } = useSVGTooltip();

    // Early return for empty data
    if (!Array.isArray(data) || data.length === 0) {
        return (
            <ChartShell
                className={cn(radialBarChartVariants(), 'chart--radial-bar--empty', className)}
                height={size}
            >
                <span>No data available</span>
            </ChartShell>
        );
    }

    // Add padding for values on the right and left for centering
    const valuePadding = showValues ? 60 : 20;
    const leftPadding = valuePadding; // Same padding on left to center the chart
    const svgWidth = leftPadding + size + valuePadding;
    const svgHeight = size;

    // Center position - offset by left padding to center the chart
    const centerX = leftPadding + size / 2;
    const centerY = size / 2;
    const maxRadius = (size / 2) - 20;

    // Process data
    const bars = useMemo(() => {
        const values = data.map((d: any) => d.value).filter(v => typeof v === 'number' && !isNaN(v));
        const max = maxValue || Math.max(...values, 1); // Fallback to 1 to avoid division by zero
        const barCount = data.length || 1; // Prevent division by zero
        const availableSpace = maxRadius - innerRadius;
        const barWidth = Math.max(1, (availableSpace - (barCount - 1) * barGap) / barCount);
        const startRad = (startAngle * Math.PI) / 180;
        const endRad = (endAngle * Math.PI) / 180;
        const totalAngle = endRad - startRad;

        return data.map((item: any, idx: number) => {
            const itemValue = typeof item.value === 'number' && !isNaN(item.value) ? item.value : 0;
            const radius = innerRadius + idx * (barWidth + barGap) + barWidth / 2;
            const valueRatio = itemValue / max;
            const sweepAngle = valueRatio * totalAngle;
            const endAngleValue = startRad + sweepAngle;

            return {
                ...item,
                radius,
                barWidth,
                startAngle: startRad,
                endAngle: isNaN(endAngleValue) ? startRad : endAngleValue,
                color: item.color || getColor(idx),
                percentage: (valueRatio * 100).toFixed(0),
            };
        });
    }, [data, maxValue, innerRadius, maxRadius, barGap, startAngle, endAngle, getColor]);

    // Generate arc path
    const getArcPath = (radius: number, startAngle: number, endAngle: number, width: number) => {
        const innerR = radius - width / 2;
        const outerR = radius + width / 2;

        const startInnerX = centerX + innerR * Math.cos(startAngle);
        const startInnerY = centerY + innerR * Math.sin(startAngle);
        const endInnerX = centerX + innerR * Math.cos(endAngle);
        const endInnerY = centerY + innerR * Math.sin(endAngle);
        const startOuterX = centerX + outerR * Math.cos(startAngle);
        const startOuterY = centerY + outerR * Math.sin(startAngle);
        const endOuterX = centerX + outerR * Math.cos(endAngle);
        const endOuterY = centerY + outerR * Math.sin(endAngle);

        const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

        return `
            M ${startInnerX} ${startInnerY}
            A ${innerR} ${innerR} 0 ${largeArc} 1 ${endInnerX} ${endInnerY}
            L ${endOuterX} ${endOuterY}
            A ${outerR} ${outerR} 0 ${largeArc} 0 ${startOuterX} ${startOuterY}
            Z
        `;
    };

    // Background arc
    const getBackgroundArcPath = (radius: number, width: number) => {
        const startRad = (startAngle * Math.PI) / 180;
        const endRad = (endAngle * Math.PI) / 180;
        return getArcPath(radius, startRad, endRad, width);
    };

    // Handle legend hover - use React state for bidirectional hover
    const handleLegendHover = useCallback((index: number) => {
        setHoveredIndex(index);
    }, []);

    const handleLegendLeave = useCallback(() => {
        setHoveredIndex(null);
    }, []);

    return (
        <ChartShell
            className={cn(radialBarChartVariants(), className)}
            height={svgHeight}
            width="100%"
            responsive={false}
        >
            <div className="chart--radial-bar__container">
                <svg
                    width="100%"
                    height="100%"
                    viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                    className="chart--radial-bar__svg"
                    role="img"
                    aria-label={`Radial bar chart with ${bars.length} bars`}
                    preserveAspectRatio="xMidYMid meet"
                >
                    {bars.map((bar, idx) => {
                        const isHovered = hoveredIndex === idx;
                        const isDimmed = hoveredIndex !== null && hoveredIndex !== idx;
                        const tooltipHandlers = getHandlers(`${bar.name}: ${valueFormatter(bar.value)}`);

                        return (
                            <g
                                key={idx}
                                data-bar-index={idx}
                                onMouseEnter={(e) => {
                                    setHoveredIndex(idx);
                                    tooltipHandlers.onMouseEnter(e);
                                }}
                                onMouseLeave={() => {
                                    setHoveredIndex(null);
                                    tooltipHandlers.onMouseLeave();
                                }}
                                className="chart--radial-bar__bar-group"
                            >
                                {/* Background arc */}
                                <path
                                    d={getBackgroundArcPath(bar.radius, bar.barWidth)}
                                    fill={semanticColors.grid}
                                    fillOpacity={0.2}
                                />

                                {/* Value arc */}
                                <path
                                    d={getArcPath(bar.radius, bar.startAngle, bar.endAngle, bar.barWidth)}
                                    fill={bar.color}
                                    fillOpacity={isDimmed ? 0.2 : isHovered ? 1 : 0.85}
                                    className="chart--radial-bar__bar-arc"
                                />

                                {/* End cap - only render if position is valid */}
                                {!isNaN(centerX + bar.radius * Math.cos(bar.endAngle)) && (
                                    <circle
                                        cx={centerX + bar.radius * Math.cos(bar.endAngle)}
                                        cy={centerY + bar.radius * Math.sin(bar.endAngle)}
                                        r={bar.barWidth / 2}
                                        fill={bar.color}
                                        fillOpacity={isDimmed ? 0.2 : 1}
                                    />
                                )}
                            </g>
                        );
                    })}

                    {/* Values on the right */}
                    {showValues && bars.map((bar, idx) => {
                        const cx = centerX + bar.radius * Math.cos(bar.endAngle);
                        const cy = centerY + bar.radius * Math.sin(bar.endAngle);
                        if (isNaN(cx) || isNaN(cy)) return null;
                        return (
                            <text
                                key={idx}
                                x={cx + 10}
                                y={cy + 4}
                                textAnchor="start"
                                className="chart--radial-bar__value"
                                fill={bar.color}
                            >
                                {valueFormatter(bar.value)}
                            </text>
                        );
                    })}
                </svg>

                {/* Legend */}
                <ChartLegend
                    payload={bars.map((bar, idx) => ({
                        id: String(idx),
                        value: bar.name,
                        color: bar.color,
                    }))}
                    activeIndex={hoveredIndex}
                    onItemHover={handleLegendHover}
                    onItemLeave={handleLegendLeave}
                />

                <SVGTooltip tooltip={tooltip} />
            </div>
        </ChartShell>
    );
};

export default RadialBarChart;
