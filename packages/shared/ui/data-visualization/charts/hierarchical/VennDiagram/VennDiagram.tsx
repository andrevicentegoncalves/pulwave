import React, { useMemo, useState, useCallback, useRef } from 'react';
import { cn } from '@pulwave/utils';
import { useChartContext } from '../../../providers/ChartProvider';
import ChartLegend from '../../../primitives/ChartLegend';
import { SVGTooltip } from '../../../components/SVGTooltip';
import { useSVGTooltip } from '../../../hooks/useSVGTooltip';
import { vennDiagramVariants, type VennDiagramProps, type VennDiagramSet, type VennDiagramIntersection } from './types';
import './styles/_index.scss';

/**
 * VennDiagram Component
 * 
 * Shows overlapping sets and their relationships.
 */
export function VennDiagram({
    sets = [],
    intersections = [],
    size = 400,
    showLabels = true,
    showValues = true,
    className,
}: VennDiagramProps) {
    const { getColor, semanticColors } = useChartContext();
    const [hoveredSet, setHoveredSet] = useState<string | null>(null);
    const { tooltip, getHandlers } = useSVGTooltip();
    const svgRef = useRef<SVGSVGElement>(null);

    const center = size / 2;
    const baseRadius = size / 4;

    // Calculate circle positions based on number of sets
    const circles = useMemo(() => {
        const count = sets.length;

        if (count === 2) {
            const offset = baseRadius * 0.6;
            return sets.map((set, idx) => ({
                ...set,
                cx: center + (idx === 0 ? -offset : offset),
                cy: center,
                r: baseRadius,
                color: set.color || getColor(idx),
            }));
        } else if (count === 3) {
            const offset = baseRadius * 0.5;
            const positions = [
                { cx: center, cy: center - offset * 0.8 },
                { cx: center - offset, cy: center + offset * 0.6 },
                { cx: center + offset, cy: center + offset * 0.6 },
            ];
            return sets.map((set, idx) => ({
                ...set,
                ...positions[idx],
                r: baseRadius * 0.85,
                color: set.color || getColor(idx),
            }));
        } else {
            return sets.map((set, idx) => ({
                ...set,
                cx: center,
                cy: center,
                r: baseRadius,
                color: set.color || getColor(idx),
            }));
        }
    }, [sets, center, baseRadius, getColor]);

    // Calculate intersection label position
    const getIntersectionPosition = (setIds: string[]) => {
        const relevantCircles = circles.filter(c => setIds.includes(c.id));
        if (relevantCircles.length === 0) return { x: center, y: center };

        const avgX = relevantCircles.reduce((sum, c) => sum + (c.cx as number), 0) / relevantCircles.length;
        const avgY = relevantCircles.reduce((sum, c) => sum + (c.cy as number), 0) / relevantCircles.length;

        if (setIds.length === 3 && circles.length === 3) {
            return { x: avgX, y: avgY };
        }

        if (setIds.length === 2 && circles.length === 3) {
            const otherCircle = circles.find(c => !setIds.includes(c.id));
            if (otherCircle) {
                const dx = avgX - (otherCircle.cx as number);
                const dy = avgY - (otherCircle.cy as number);
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist > 0) {
                    return {
                        x: avgX + (dx / dist) * 15,
                        y: avgY + (dy / dist) * 15,
                    };
                }
            }
        }

        return { x: avgX, y: avgY };
    };

    // Handle legend hover - highlight corresponding circle
    const handleLegendHover = useCallback((index: number) => {
        if (!svgRef.current) return;
        const circle = circles[index];
        if (!circle) return;

        setHoveredSet(circle.id);

        const circleGroup = svgRef.current.querySelector(`[data-set-index="${index}"]`);
        if (circleGroup) {
            circleGroup.classList.add('chart--venn__set-group--legend-hovered');
        }
    }, [circles]);

    const handleLegendLeave = useCallback(() => {
        if (!svgRef.current) return;
        setHoveredSet(null);

        const groups = svgRef.current.querySelectorAll('.chart--venn__set-group--legend-hovered');
        groups.forEach(g => g.classList.remove('chart--venn__set-group--legend-hovered'));
    }, []);

    return (
        <div className={cn(vennDiagramVariants(), className)}>
            <svg ref={svgRef} width={size} height={size} className="chart--venn__svg" role="img" aria-label={`Venn diagram with ${circles.length} sets`}>
                {/* Circles */}
                {circles.map((circle, idx) => {
                    const isHovered = hoveredSet === circle.id;
                    const tooltipHandlers = getHandlers(`${circle.label || circle.id}: ${circle.value}`);

                    return (
                        <g
                            key={circle.id}
                            data-set-index={idx}
                            onMouseEnter={(e) => {
                                setHoveredSet(circle.id);
                                tooltipHandlers.onMouseEnter(e);
                            }}
                            onMouseLeave={() => {
                                setHoveredSet(null);
                                tooltipHandlers.onMouseLeave();
                            }}
                            className="chart--venn__set-group"
                        >
                            <circle
                                cx={circle.cx}
                                cy={circle.cy}
                                r={circle.r}
                                fill={circle.color}
                                fillOpacity={isHovered ? 0.5 : 0.35}
                                stroke={circle.color}
                                className="chart--venn__circle"
                            />

                            {/* Label outside circle */}
                            {showLabels && (
                                <text
                                    x={(circle.cx as number) + ((circle.cx as number) < center ? -(circle.r as number) - 10 : (circle.cx as number) > center ? (circle.r as number) + 10 : 0)}
                                    y={(circle.cy as number) + ((circle.cy as number) < center ? -(circle.r as number) - 10 : (circle.cy as number) > center ? (circle.r as number) + 20 : 0)}
                                    fill={circle.color}
                                    className="chart--venn__set-label"
                                >
                                    {circle.label || circle.id}
                                </text>
                            )}

                            {/* Value inside (exclusive to this set) */}
                            {showValues && (
                                <text
                                    x={(circle.cx as number) + (sets.length > 1 ? ((circle.cx as number) < center ? -30 : (circle.cx as number) > center ? 30 : 0) : 0)}
                                    y={(circle.cy as number) + (sets.length === 3 && circle.cy !== center ? ((circle.cy as number) < center ? -20 : 20) : 0)}
                                    className="chart--venn__value-label"
                                >
                                    {circle.value}
                                </text>
                            )}

                        </g>
                    );
                })}

                {/* Intersection values */}
                {showValues && intersections.map((int: VennDiagramIntersection, idx: number) => {
                    const pos = getIntersectionPosition(int.sets);

                    return (
                        <text
                            key={idx}
                            x={pos.x}
                            y={pos.y}
                            className="chart--venn__intersection-label"
                        >
                            {int.value}
                        </text>
                    );
                })}
            </svg>

            <SVGTooltip tooltip={tooltip} />

            <ChartLegend
                payload={circles.map((circle, idx) => ({
                    id: String(idx),
                    value: `${circle.label || circle.id} (${circle.value})`,
                    color: circle.color as string,
                }))}
                activeIndex={circles.findIndex(c => c.id === hoveredSet)}
                onItemHover={handleLegendHover}
                onItemLeave={handleLegendLeave}
            />
        </div>
    );
}

export default VennDiagram;
