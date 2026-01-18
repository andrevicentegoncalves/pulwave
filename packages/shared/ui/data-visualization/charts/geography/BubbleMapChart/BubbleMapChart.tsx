import React, { useState, useMemo, useCallback, useRef } from 'react';
import { cn } from '@pulwave/utils';
import { useChartContext } from '../../../providers/ChartProvider';
import ChartLegend from '../../../primitives/ChartLegend';
import { SVGTooltip } from '../../../components/SVGTooltip';
import { useSVGTooltip } from '../../../hooks/useSVGTooltip';
import {
    projectCoordinates,
    SIMPLE_WORLD_DATA
} from '../../../utils/geo/topojson';
import { bubbleMapChartVariants, type BubbleMapChartProps } from './types';
import './styles/_index.scss';

/**
 * BubbleMapChart Component
 * 
 * World map with bubbles sized by value at geographic locations.
 * Simplified version using built-in country data.
 */
export function BubbleMapChart({
    data = [],
    countryKey = 'country',
    valueKey = 'value',
    width = 700,
    height = 400,
    minBubbleSize = 8,
    maxBubbleSize = 40,
    bubbleColor,
    showLabels = true,
    showLegend = true,
    valueFormatter = (v: number) => v?.toLocaleString() ?? '',
    className,
}: BubbleMapChartProps) {
    const { semanticColors } = useChartContext();
    const resolvedBubbleColor = bubbleColor ?? semanticColors.primary;
    const [hoveredBubble, setHoveredBubble] = useState<number | null>(null);
    const { tooltip, getHandlers } = useSVGTooltip();
    const svgRef = useRef<SVGSVGElement>(null);

    // Map country IDs to coordinates
    const countryCoords = useMemo(() => {
        const coords: Record<string, any> = {};
        SIMPLE_WORLD_DATA.countries.forEach((c: any) => {
            coords[c.id] = { coords: c.coords, name: c.name };
        });
        return coords;
    }, []);

    // Process data with coordinates
    const bubbles = useMemo(() => {
        const values = data.map((d: any) => d[valueKey as string]);
        const minVal = Math.min(...values);
        const maxVal = Math.max(...values);
        const range = (maxVal - minVal) || 1;

        return data.map((item: any) => {
            const countryInfo = countryCoords[item[countryKey as string]];
            if (!countryInfo) return null;

            const { x, y } = projectCoordinates(
                countryInfo.coords[0],
                countryInfo.coords[1],
                width as number,
                height as number
            );

            const normalizedValue = (item[valueKey as string] - minVal) / range;
            const radius = minBubbleSize + normalizedValue * (maxBubbleSize - minBubbleSize);

            return {
                ...item,
                x,
                y,
                radius,
                countryName: countryInfo.name,
            };
        }).filter(Boolean);
    }, [data, countryKey, valueKey, countryCoords, width, height, minBubbleSize, maxBubbleSize]);

    // Handle legend hover - highlight corresponding bubble
    const handleLegendHover = useCallback((index: number) => {
        if (!svgRef.current) return;
        // Legend only shows first 8 bubbles
        if (index >= 8) return;
        setHoveredBubble(index);

        const bubbleGroup = svgRef.current.querySelector(`[data-bubble-index="${index}"]`);
        if (bubbleGroup) {
            bubbleGroup.classList.add('chart--bubble-map__bubble-group--legend-hovered');
        }
    }, []);

    const handleLegendLeave = useCallback(() => {
        if (!svgRef.current) return;
        setHoveredBubble(null);

        const groups = svgRef.current.querySelectorAll('.chart--bubble-map__bubble-group--legend-hovered');
        groups.forEach(g => g.classList.remove('chart--bubble-map__bubble-group--legend-hovered'));
    }, []);

    return (
        <div className={cn(bubbleMapChartVariants(), className)}>
            <svg
                ref={svgRef}
                width={width}
                height={height}
                className="chart--bubble-map__svg"
                role="img"
                aria-label={`Bubble map chart with ${data.length} data points`}
            >
                {/* Simple continent outlines */}
                <g className="chart--bubble-map__continent">
                    <ellipse cx={(width as number) * 0.2} cy={(height as number) * 0.35} rx={100} ry={80} />
                    <ellipse cx={(width as number) * 0.25} cy={(height as number) * 0.7} rx={50} ry={70} />
                    <ellipse cx={(width as number) * 0.52} cy={(height as number) * 0.3} rx={40} ry={35} />
                    <ellipse cx={(width as number) * 0.52} cy={(height as number) * 0.6} rx={50} ry={70} />
                    <ellipse cx={(width as number) * 0.72} cy={(height as number) * 0.35} rx={100} ry={70} />
                    <ellipse cx={(width as number) * 0.85} cy={(height as number) * 0.7} rx={40} ry={30} />
                </g>

                {/* Bubbles */}
                {bubbles.map((bubble: any, idx: number) => {
                    const isHovered = hoveredBubble === idx;
                    const tooltipHandlers = getHandlers(`${bubble.countryName}: ${valueFormatter(bubble[valueKey as keyof typeof bubble])}`);

                    return (
                        <g
                            key={idx}
                            data-bubble-index={idx}
                            onMouseEnter={(e) => {
                                setHoveredBubble(idx);
                                tooltipHandlers.onMouseEnter(e);
                            }}
                            onMouseLeave={() => {
                                setHoveredBubble(null);
                                tooltipHandlers.onMouseLeave();
                            }}
                            className="chart--bubble-map__bubble-group"
                        >
                            <circle
                                cx={bubble.x + 2}
                                cy={bubble.y + 2}
                                r={bubble.radius}
                                className="chart--bubble-map__bubble-shadow"
                            />
                            <circle
                                cx={bubble.x}
                                cy={bubble.y}
                                r={isHovered ? bubble.radius * 1.1 : bubble.radius}
                                fill={bubble.color || resolvedBubbleColor}
                                fillOpacity={isHovered ? 0.9 : 0.7}
                                className="chart--bubble-map__bubble"
                            />
                            {showLabels && bubble.radius > 15 && (
                                <text
                                    x={bubble.x}
                                    y={bubble.y + 4}
                                    className="chart--bubble-map__bubble-label"
                                >
                                    {bubble[countryKey as string]}
                                </text>
                            )}
                        </g>
                    );
                })}
            </svg>

            {showLegend && bubbles.length > 0 && (
                <ChartLegend
                    payload={bubbles.slice(0, 8).map((bubble: any, idx: number) => ({
                        id: String(idx),
                        value: bubble.countryName,
                        color: bubble.color || resolvedBubbleColor,
                    }))}
                    activeIndex={hoveredBubble !== null && hoveredBubble < 8 ? hoveredBubble : null}
                    onItemHover={handleLegendHover}
                    onItemLeave={handleLegendLeave}
                />
            )}

            {hoveredBubble !== null && bubbles[hoveredBubble] && (
                <div className="chart--bubble-map__hover-info">
                    <strong>{bubbles[hoveredBubble].countryName}</strong>: {valueFormatter(bubbles[hoveredBubble][valueKey as string])}
                </div>
            )}

            <SVGTooltip tooltip={tooltip} />
        </div>
    );
}

export default BubbleMapChart;
