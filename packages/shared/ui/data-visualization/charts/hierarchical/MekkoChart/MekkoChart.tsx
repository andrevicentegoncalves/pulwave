import React, { useMemo, useState, useCallback } from 'react';
import { cn } from '@pulwave/utils';
import { useChartContext } from '../../../providers/ChartProvider';
import ChartLegend from '../../../primitives/ChartLegend';
import { SVGTooltip } from '../../../components/SVGTooltip';
import { useSVGTooltip } from '../../../hooks/useSVGTooltip';
import { mekkoChartVariants, type MekkoChartProps, type MekkoData, type MekkoSegment } from './types';
import './styles/_index.scss';

/**
 * MekkoChart (Marimekko Chart) Component
 * 
 * Variable width bar chart where both width and height encode data.
 * Great for showing market share with segment breakdown.
 */
export function MekkoChart({
    data = [],
    width = 600,
    height = 400,
    showLabels = true,
    showLegend = true,
    valueFormatter = (v: number) => v?.toLocaleString() ?? '',
    className,
}: MekkoChartProps) {
    const { getColor, semanticColors } = useChartContext();
    const [hoveredCell, setHoveredCell] = useState<string | null>(null);
    const [hoveredLegendIndex, setHoveredLegendIndex] = useState<number | null>(null);
    const { tooltip, getHandlers } = useSVGTooltip();

    const padding = { top: 30, right: 30, bottom: 60, left: 50 };
    const chartWidth = (width as number) - padding.left - padding.right;
    const chartHeight = (height as number) - padding.top - padding.bottom;

    // Get all unique segment names for legend
    const segmentNames = useMemo(() => {
        const names = new Set<string>();
        data.forEach((item: MekkoData) => {
            item.segments?.forEach((seg: MekkoSegment) => names.add(seg.name));
        });
        return Array.from(names);
    }, [data]);

    // Calculate total width and positions
    const processedData = useMemo(() => {
        const totalValue = data.reduce((sum: number, d: MekkoData) => sum + d.total, 0);
        let currentX = 0;

        return data.map((item: MekkoData, idx: number) => {
            const widthRatio = item.total / (totalValue || 1);
            const barWidth = widthRatio * chartWidth;
            const x = currentX;
            currentX += barWidth;

            // Calculate segment heights
            const segmentTotal = item.segments?.reduce((sum: number, s: MekkoSegment) => sum + s.value, 0) || item.total;
            let currentY = 0;

            const segments = (item.segments || [{ name: item.name, value: item.total }]).map((seg: MekkoSegment, sidx: number) => {
                const heightRatio = seg.value / (segmentTotal || 1);
                const segHeight = heightRatio * chartHeight;
                const y = currentY;
                currentY += segHeight;

                const segNameIndex = segmentNames.indexOf(seg.name);

                return {
                    ...seg,
                    x: x + padding.left,
                    y: chartHeight - y - segHeight + padding.top,
                    width: barWidth - 2,
                    height: segHeight,
                    color: seg.color || getColor(segNameIndex >= 0 ? segNameIndex : sidx),
                    percentage: (heightRatio * 100).toFixed(1),
                };
            });

            return {
                ...item,
                x: x + padding.left,
                barWidth,
                widthPercentage: (widthRatio * 100).toFixed(1),
                segments,
            };
        });
    }, [data, chartWidth, chartHeight, getColor, segmentNames]);

    // Handle legend hover - use React state for consistent bidirectional hover
    const handleLegendHover = useCallback((index: number) => {
        setHoveredLegendIndex(index);
    }, []);

    const handleLegendLeave = useCallback(() => {
        setHoveredLegendIndex(null);
    }, []);

    return (
        <div className={cn(mekkoChartVariants(), className)}>
            <svg width={width} height={height} className="chart--mekko__svg" role="img" aria-label={`Mekko chart with ${data.length} categories`}>
                {/* Y axis */}
                <line
                    x1={padding.left}
                    y1={padding.top}
                    x2={padding.left}
                    y2={(height as number) - padding.bottom}
                    className="chart--mekko__axis"
                />

                {/* X axis */}
                <line
                    x1={padding.left}
                    y1={(height as number) - padding.bottom}
                    x2={(width as number) - padding.right}
                    y2={(height as number) - padding.bottom}
                    className="chart--mekko__axis"
                />

                {/* Y axis labels (percentages) */}
                {[0, 25, 50, 75, 100].map((pct, i) => (
                    <g key={i}>
                        <text
                            x={padding.left - 10}
                            y={padding.top + chartHeight * (1 - pct / 100) + 4}
                            textAnchor="end"
                            className="chart--mekko__axis-label"
                        >
                            {pct}%
                        </text>
                        <line
                            x1={padding.left}
                            y1={padding.top + chartHeight * (1 - pct / 100)}
                            x2={(width as number) - padding.right}
                            y2={padding.top + chartHeight * (1 - pct / 100)}
                            className="chart--mekko__grid"
                        />
                    </g>
                ))}

                {/* Bars */}
                {processedData.map((bar: any, bidx: number) => (
                    <g key={bidx}>
                        {bar.segments.map((seg: any, sidx: number) => {
                            const cellKey = `${bidx}-${sidx}`;
                            const segmentLegendIndex = segmentNames.indexOf(seg.name);
                            const isHoveredByCell = hoveredCell === cellKey;
                            const isHoveredByLegend = hoveredLegendIndex !== null && segmentLegendIndex === hoveredLegendIndex;
                            const isHovered = isHoveredByCell || isHoveredByLegend;
                            const isDimmed = (hoveredCell !== null || hoveredLegendIndex !== null) && !isHovered;
                            const tooltipHandlers = getHandlers(`${bar.name} - ${seg.name}: ${valueFormatter(seg.value)} (${seg.percentage}%)`);

                            return (
                                <rect
                                    key={sidx}
                                    x={seg.x}
                                    y={seg.y}
                                    width={seg.width}
                                    height={seg.height}
                                    fill={seg.color}
                                    fillOpacity={isDimmed ? 0.2 : 1}
                                    data-segment-name={seg.name}
                                    className={cn('chart--mekko__cell', {
                                        'chart--mekko__cell--hovered': isHovered
                                    })}
                                    onMouseEnter={(e) => {
                                        setHoveredCell(cellKey);
                                        setHoveredLegendIndex(segmentLegendIndex);
                                        tooltipHandlers.onMouseEnter(e);
                                    }}
                                    onMouseLeave={() => {
                                        setHoveredCell(null);
                                        setHoveredLegendIndex(null);
                                        tooltipHandlers.onMouseLeave();
                                    }}
                                />
                            );
                        })}

                        {/* Column label */}
                        {showLabels && (
                            <>
                                <text
                                    x={bar.x + bar.barWidth / 2}
                                    y={(height as number) - padding.bottom + 20}
                                    className="chart--mekko__column-name"
                                >
                                    {bar.name}
                                </text>
                                <text
                                    x={bar.x + bar.barWidth / 2}
                                    y={(height as number) - padding.bottom + 35}
                                    className="chart--mekko__column-percentage"
                                >
                                    ({bar.widthPercentage}%)
                                </text>
                            </>
                        )}
                    </g>
                ))}
            </svg>

            {/* Legend */}
            {showLegend && segmentNames.length > 0 && (
                <ChartLegend
                    payload={segmentNames.map((name, idx) => ({
                        id: String(idx),
                        value: String(name),
                        dataKey: String(name),
                        color: getColor(idx),
                    }))}
                    activeIndex={hoveredLegendIndex}
                    onItemHover={handleLegendHover}
                    onItemLeave={handleLegendLeave}
                />
            )}

            <SVGTooltip tooltip={tooltip} />
        </div>
    );
}

export default MekkoChart;
