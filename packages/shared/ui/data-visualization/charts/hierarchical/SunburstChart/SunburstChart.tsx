import React, { useMemo, useState, useCallback } from 'react';
import { cn } from '@pulwave/utils';
import { useChartContext } from '../../../providers/ChartProvider';
import ChartLegend from '../../../primitives/ChartLegend';
import { SVGTooltip } from '../../../components/SVGTooltip';
import { useSVGTooltip } from '../../../hooks/useSVGTooltip';
import { sunburstChartVariants, type SunburstChartProps, type HierarchicalData } from './types';
import './styles/_index.scss';

/**
 * SunburstChart Component
 * 
 * Multi-ring hierarchical pie chart showing parent-child relationships.
 * Inner rings = parent categories, outer rings = children.
 * Hover to see details, click to zoom (if enabled).
 */
export function SunburstChart({
    data = {} as HierarchicalData,
    size = 400,
    innerRadius = 60,
    showLabels = true,
    showCenter = true,
    showLegend = true,
    centerText,
    className,
}: SunburstChartProps) {
    const { getColor, semanticColors } = useChartContext();
    const [hoveredSegment, setHoveredSegment] = useState<any | null>(null);
    const [hoveredLegendIndex, setHoveredLegendIndex] = useState<number | null>(null);
    const { tooltip, getHandlers } = useSVGTooltip();

    const center = size / 2;
    const maxRadius = (size / 2) - 20;

    // Flatten hierarchy and calculate angles
    const { segments, topLevelItems } = useMemo(() => {
        const result: any[] = [];
        const topLevel: any[] = [];
        let colorIndex = 0;

        const processNode = (node: HierarchicalData, startAngle: number, endAngle: number, depth: number, parentColor: string | null = null, parentPath = '') => {
            const angle = endAngle - startAngle;
            const color = node.color || (depth === 0 ? parentColor : null) || getColor(colorIndex);

            if (depth === 0 && node.children) {
                colorIndex++;
            }

            if (node.children && node.children.length > 0) {
                // Calculate total value of children
                const childTotal = node.children.reduce((sum: number, c: HierarchicalData) => {
                    const childVal = c.value || (c.children ? c.children.reduce((s: number, gc: HierarchicalData) => s + (gc.value || 0), 0) : 0);
                    return sum + childVal;
                }, 0);

                let currentAngle = startAngle;

                node.children.forEach((child: HierarchicalData) => {
                    const childValue = child.value || (child.children ? child.children.reduce((s: number, gc: HierarchicalData) => s + (gc.value || 0), 0) : 0);
                    const childAngle = (childValue / childTotal) * angle;
                    const childEnd = currentAngle + childAngle;
                    const childColor = child.color || color;
                    const path = parentPath ? `${parentPath} → ${child.name}` : child.name;

                    // Store top level for legend
                    if (depth === 0) {
                        topLevel.push({
                            name: child.name,
                            value: childValue,
                            color: childColor,
                        });
                    }

                    result.push({
                        name: child.name,
                        value: childValue,
                        color: childColor,
                        startAngle: currentAngle,
                        endAngle: childEnd,
                        depth: depth + 1,
                        path,
                        parentName: node.name,
                    });

                    if (child.children && child.children.length > 0) {
                        processNode(child, currentAngle, childEnd, depth + 1, childColor, path);
                    }

                    currentAngle = childEnd;
                });
            }
        };

        processNode(data, 0, 2 * Math.PI, 0);
        return { segments: result, topLevelItems: topLevel };
    }, [data, getColor]);

    // Get max depth
    const maxDepth = useMemo(() => {
        return Math.max(...segments.map((s: any) => s.depth), 0);
    }, [segments]);

    // Calculate ring thickness
    const ringThickness = (maxRadius - innerRadius) / (maxDepth || 1);

    // Calculate arc path
    const getArcPath = (startAngle: number, endAngle: number, innerR: number, outerR: number) => {
        const startInnerX = center + innerR * Math.cos(startAngle - Math.PI / 2);
        const startInnerY = center + innerR * Math.sin(startAngle - Math.PI / 2);
        const endInnerX = center + innerR * Math.cos(endAngle - Math.PI / 2);
        const endInnerY = center + innerR * Math.sin(endAngle - Math.PI / 2);
        const startOuterX = center + outerR * Math.cos(startAngle - Math.PI / 2);
        const startOuterY = center + outerR * Math.sin(startAngle - Math.PI / 2);
        const endOuterX = center + outerR * Math.cos(endAngle - Math.PI / 2);
        const endOuterY = center + outerR * Math.sin(endAngle - Math.PI / 2);

        const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

        return `
            M ${startInnerX} ${startInnerY}
            A ${innerR} ${innerR} 0 ${largeArc} 1 ${endInnerX} ${endInnerY}
            L ${endOuterX} ${endOuterY}
            A ${outerR} ${outerR} 0 ${largeArc} 0 ${startOuterX} ${startOuterY}
            Z
        `;
    };

    // Calculate total
    const total = topLevelItems.reduce((sum: number, item: any) => sum + item.value, 0) || 1;

    // Handle legend hover - use React state for bidirectional hover
    const handleLegendHover = useCallback((index: number) => {
        setHoveredLegendIndex(index);
    }, []);

    const handleLegendLeave = useCallback(() => {
        setHoveredLegendIndex(null);
    }, []);

    // Calculate active legend index from hovered segment
    const activeLegendIndex = useMemo(() => {
        if (hoveredSegment) {
            // Find which top-level item this segment belongs to
            const topLevelName = segments.find((s: any) =>
                s.name === hoveredSegment.name && s.depth === hoveredSegment.depth
            )?.parentName || hoveredSegment.name;
            return topLevelItems.findIndex((item: any) => item.name === topLevelName || item.name === hoveredSegment.name);
        }
        return hoveredLegendIndex;
    }, [hoveredSegment, hoveredLegendIndex, segments, topLevelItems]);

    return (
        <div className={cn(sunburstChartVariants(), className)}>
            <div className="chart--sunburst__container">
                <div className="chart--sunburst__layout">
                    <svg width={size} height={size} className="chart--sunburst__svg" role="img" aria-label={`Sunburst chart showing ${data.name || 'hierarchical data'} with ${topLevelItems.length} categories`}>
                        {segments.map((segment, idx) => {
                            const segInnerR = innerRadius + (segment.depth - 1) * ringThickness;
                            const segOuterR = segInnerR + ringThickness - 2;
                            const isHoveredBySegment = hoveredSegment?.path === segment.path;
                            const midAngle = (segment.startAngle + segment.endAngle) / 2 - Math.PI / 2;
                            const tooltipHandlers = getHandlers(`${segment.path}: ${segment.value.toLocaleString()}`);

                            // Determine top-level category for this segment
                            const topLevelName = segment.depth === 1 ? segment.name : segment.parentName;

                            // Check if this segment belongs to the hovered legend item
                            const hoveredTopLevelName = hoveredLegendIndex !== null ? topLevelItems[hoveredLegendIndex]?.name : null;
                            const isHoveredByLegend = hoveredTopLevelName !== null && topLevelName === hoveredTopLevelName;
                            const isHovered = isHoveredBySegment || isHoveredByLegend;
                            const isDimmed = (hoveredSegment !== null || hoveredLegendIndex !== null) && !isHovered;

                            // Find the legend index for this segment's top-level category
                            const segmentLegendIndex = topLevelItems.findIndex((item: any) => item.name === topLevelName);

                            return (
                                <g key={idx}>
                                    <path
                                        d={getArcPath(segment.startAngle, segment.endAngle, segInnerR, segOuterR)}
                                        fill={segment.color}
                                        fillOpacity={isDimmed ? 0.2 : isHovered ? 1 : 0.85}
                                        data-top-level={topLevelName}
                                        onMouseEnter={(e) => {
                                            setHoveredSegment(segment);
                                            setHoveredLegendIndex(segmentLegendIndex);
                                            tooltipHandlers.onMouseEnter(e);
                                        }}
                                        onMouseLeave={() => {
                                            setHoveredSegment(null);
                                            setHoveredLegendIndex(null);
                                            tooltipHandlers.onMouseLeave();
                                        }}
                                        className={cn('chart--sunburst__segment', {
                                            'chart--sunburst__segment--hovered': isHovered
                                        })}
                                    />

                                    {/* Labels for larger segments on depth 1 */}
                                    {showLabels && segment.depth === 1 && (segment.endAngle - segment.startAngle) > 0.4 && (
                                        <text
                                            x={center + (segInnerR + ringThickness / 2) * Math.cos(midAngle)}
                                            y={center + (segInnerR + ringThickness / 2) * Math.sin(midAngle)}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            className="chart--sunburst__label"
                                        >
                                            {segment.name.length > 8 ? segment.name.substring(0, 7) + '…' : segment.name}
                                        </text>
                                    )}
                                </g>
                            );
                        })}

                        {/* Center circle */}
                        {showCenter && (
                            <>
                                <circle
                                    cx={center}
                                    cy={center}
                                    r={innerRadius - 5}
                                    className="chart--sunburst__center-circle"
                                />
                                <text
                                    x={center}
                                    y={center - 8}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    className="chart--sunburst__center-label-top"
                                >
                                    {centerText || 'Total'}
                                </text>
                                <text
                                    x={center}
                                    y={center + 10}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    className="chart--sunburst__center-label-bottom"
                                >
                                    {total.toLocaleString()}
                                </text>
                            </>
                        )}
                    </svg>

                    {/* Legend */}
                    {showLegend && (
                        <ChartLegend
                            payload={topLevelItems.map((item: any, idx: number) => ({
                                id: String(idx),
                                value: `${item.name} ${((item.value / total) * 100).toFixed(0)}%`,
                                color: item.color,
                            }))}
                            activeIndex={activeLegendIndex}
                            onItemHover={handleLegendHover}
                            onItemLeave={handleLegendLeave}
                        />
                    )}
                </div>

                {/* Hovered info */}
                {hoveredSegment && (
                    <div className="chart--sunburst__hover-info">
                        <strong>{hoveredSegment.path}</strong>: {hoveredSegment.value.toLocaleString()} ({((hoveredSegment.value / total) * 100).toFixed(1)}%)
                    </div>
                )}

                <SVGTooltip tooltip={tooltip} />
            </div>
        </div>
    );
}

export default SunburstChart;
