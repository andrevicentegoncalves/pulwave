import { useMemo, useState, useCallback } from 'react';
import { cn } from '@pulwave/utils';
import { useChartContext } from '../../../providers/ChartProvider';
import { ChartShell } from '../../../primitives/ChartShell';
import ChartLegend from '../../../primitives/ChartLegend';
import { SVGTooltip } from '../../../components/SVGTooltip';
import { useSVGTooltip } from '../../../hooks/useSVGTooltip';
import { nestedPieChartVariants, type NestedPieChartProps, type NestedPieRing, type NestedPieData } from './types';
import './styles/_index.scss';

/**
 * NestedPieChart Component
 *
 * Concentric pie/donut rings showing related data sets.
 */
export const NestedPieChart = ({
    rings = [],
    size = 400,
    innerRadius = 50,
    ringGap = 4,
    showLabels = true,
    showLegend = true,
    className,
}: NestedPieChartProps) => {
    const { getColor, semanticColors } = useChartContext();
    const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
    const [hoveredLegendIndex, setHoveredLegendIndex] = useState<number | null>(null);
    const { tooltip, getHandlers } = useSVGTooltip();

    const center = size / 2;
    const maxRadius = (size / 2) - 30;

    // Calculate ring dimensions
    const totalRings = rings.length;
    const availableSpace = maxRadius - innerRadius;
    const ringWidth = (availableSpace - (totalRings - 1) * ringGap) / totalRings;

    // Process all rings
    const processedRings = useMemo(() => {
        return rings.map((ring: NestedPieRing, ringIdx: number) => {
            const ringInnerR = innerRadius + ringIdx * (ringWidth + ringGap);
            const ringOuterR = ringInnerR + ringWidth;
            const total = ring.data.reduce((sum: number, d: NestedPieData) => sum + d.value, 0);

            let currentAngle = -Math.PI / 2;

            const segments = ring.data.map((item: NestedPieData, idx: number) => {
                const angle = (item.value / total) * 2 * Math.PI;
                const startAngle = currentAngle;
                const endAngle = currentAngle + angle;
                currentAngle = endAngle;

                return {
                    ...item,
                    color: item.color || getColor(idx),
                    startAngle,
                    endAngle,
                    innerR: ringInnerR,
                    outerR: ringOuterR,
                    ringIdx,
                    segmentIdx: idx,
                    percentage: ((item.value / total) * 100).toFixed(1),
                };
            });

            return {
                ...ring,
                segments,
                innerR: ringInnerR,
                outerR: ringOuterR,
            };
        });
    }, [rings, innerRadius, ringWidth, ringGap, getColor]);

    // Generate arc path
    const getArcPath = (segment: any, isHovered: boolean) => {
        const innerR = segment.innerR;
        const outerR = isHovered ? segment.outerR + 5 : segment.outerR;
        const { startAngle, endAngle } = segment;

        const startInnerX = center + innerR * Math.cos(startAngle);
        const startInnerY = center + innerR * Math.sin(startAngle);
        const endInnerX = center + innerR * Math.cos(endAngle);
        const endInnerY = center + innerR * Math.sin(endAngle);
        const startOuterX = center + outerR * Math.cos(startAngle);
        const startOuterY = center + outerR * Math.sin(startAngle);
        const endOuterX = center + outerR * Math.cos(endAngle);
        const endOuterY = center + outerR * Math.sin(endAngle);

        const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

        return `
            M ${startInnerX} ${startInnerY}
            A ${innerR} ${innerR} 0 ${largeArc} 1 ${endInnerX} ${endInnerY}
            L ${endOuterX} ${endOuterY}
            A ${outerR} ${outerR} 0 ${largeArc} 0 ${startOuterX} ${startOuterY}
            Z
        `;
    };

    // Get all unique items for legend
    const legendItems = useMemo(() => {
        const items: Record<string, string> = {};
        processedRings.forEach((ring: any) => {
            ring.segments.forEach((seg: any) => {
                if (!items[seg.name]) {
                    items[seg.name] = seg.color;
                }
            });
        });
        return Object.entries(items);
    }, [processedRings]);

    // Handle legend hover - use React state for bidirectional hover
    const handleLegendHover = useCallback((index: number) => {
        setHoveredLegendIndex(index);
    }, []);

    const handleLegendLeave = useCallback(() => {
        setHoveredLegendIndex(null);
    }, []);

    return (
        <ChartShell
            className={cn(nestedPieChartVariants(), className)}
            height={size}
            width={size}
            responsive={false}
        >
            <div className="chart--nested-pie__wrapper">
                <svg width={size} height={size} className="chart--nested-pie__svg" role="img" aria-label={`Nested pie chart with ${processedRings.length} rings`}>
                {processedRings.map((ring: any, ringIdx: number) => (
                    <g key={ringIdx}>
                        {ring.segments.map((segment: any, segIdx: number) => {
                            const segmentId = `${ringIdx}-${segIdx}`;
                            // Check if hovered by direct segment hover or by legend hover (matching name)
                            const legendItemName = hoveredLegendIndex !== null ? legendItems[hoveredLegendIndex]?.[0] : null;
                            const isHoveredBySegment = hoveredSegment === segmentId;
                            const isHoveredByLegend = legendItemName === segment.name;
                            const isHovered = isHoveredBySegment || isHoveredByLegend;
                            const isDimmed = (hoveredSegment !== null || hoveredLegendIndex !== null) && !isHovered;
                            const tooltipHandlers = getHandlers(`${ring.label || `Ring ${ringIdx + 1}`}: ${segment.name} - ${segment.percentage}%`);

                            // Calculate legend index for this segment
                            const segmentLegendIndex = legendItems.findIndex(([name]) => name === segment.name);

                            return (
                                <path
                                    key={segIdx}
                                    d={getArcPath(segment, isHovered)}
                                    fill={segment.color}
                                    fillOpacity={isDimmed ? 0.2 : isHovered ? 1 : 0.85}
                                    stroke={semanticColors.background}
                                    strokeWidth={1}
                                    data-segment-name={segment.name}
                                    onMouseEnter={(e) => {
                                        setHoveredSegment(segmentId);
                                        setHoveredLegendIndex(segmentLegendIndex);
                                        tooltipHandlers.onMouseEnter(e);
                                    }}
                                    onMouseLeave={() => {
                                        setHoveredSegment(null);
                                        setHoveredLegendIndex(null);
                                        tooltipHandlers.onMouseLeave();
                                    }}
                                    className="chart--nested-pie__segment"
                                />
                            );
                        })}

                        {/* Ring label */}
                        {showLabels && ring.label && (
                            <text
                                x={center}
                                y={center - ring.innerR - ringWidth / 2}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="chart--nested-pie__ring-label"
                                fill={semanticColors.text}
                            >
                                {ring.label}
                            </text>
                        )}
                    </g>
                ))}

                {/* Center label */}
                {innerRadius > 30 && (
                    <text
                        x={center}
                        y={center}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="chart--nested-pie__center-label"
                        fill={semanticColors.text}
                    >
                        {rings.length} Rings
                    </text>
                )}
            </svg>

            <SVGTooltip tooltip={tooltip} />

            {/* Legend */}
            {showLegend && (
                <ChartLegend
                    payload={legendItems.map(([name, color]: [string, string], idx: number) => ({
                        id: String(idx),
                        value: name,
                        color: color as string,
                    }))}
                    activeIndex={hoveredLegendIndex}
                    onItemHover={handleLegendHover}
                    onItemLeave={handleLegendLeave}
                />
                )}
            </div>
        </ChartShell>
    );
};

export default NestedPieChart;
